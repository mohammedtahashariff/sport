const memoryStore = require('../services/memoryDb');

exports.createOrder = async (req, res) => {
  try {
    const {
      items,
      deliveryAddress,
      paymentMethod = 'COD',
      notes
    } = req.body;

    const userId = req.user.id;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart items are required to create an order.' });
    }

    if (!deliveryAddress || !deliveryAddress.fullName || !deliveryAddress.addressLine) {
      return res.status(400).json({ success: false, message: 'Complete delivery address is required.' });
    }

    // Group items by shopId to create orders per shop
    const itemsByShop = {};
    items.forEach(item => {
      const prod = memoryStore.getProductById(item.productId);
      const sId = (prod && prod.shopId) || item.shopId || "shop-1";
      if (!itemsByShop[sId]) {
        itemsByShop[sId] = [];
      }
      itemsByShop[sId].push({
        productId: item.productId,
        shopId: sId,
        name: (prod && prod.name) || item.name,
        image: (prod && prod.images && prod.images[0]) || item.image,
        price: (prod && prod.price) || item.price,
        quantity: item.quantity || 1,
        subtotal: ((prod && prod.price) || item.price) * (item.quantity || 1)
      });
    });

    const createdOrders = [];
    const io = req.app.get('io');

    for (const shopId of Object.keys(itemsByShop)) {
      const shopItems = itemsByShop[shopId];
      const totalAmount = shopItems.reduce((acc, curr) => acc + curr.subtotal, 0);
      const deliveryFee = totalAmount > 999 ? 0 : 40;
      const discountAmount = totalAmount > 2000 ? 150 : 0;
      const grandTotal = totalAmount + deliveryFee - discountAmount;

      const shop = memoryStore.getShopById(shopId);

      const newOrder = memoryStore.createOrder({
        userId,
        shopId,
        shopName: shop ? shop.name : "Local Sports Store",
        items: shopItems,
        totalAmount,
        deliveryFee,
        discountAmount,
        grandTotal,
        deliveryAddress,
        paymentMethod,
        paymentStatus: paymentMethod === 'COD' ? 'Pending' : 'Completed',
        notes
      });

      createdOrders.push(newOrder);

      // Create notification for seller
      const sellerNotif = memoryStore.addNotification({
        userId: shop ? shop.ownerEmail : null,
        type: 'NEW_ORDER',
        title: `New Order #${newOrder.orderNumber} (₹${grandTotal})`,
        message: `${shopItems.length} sports gear item(s) ordered by ${deliveryAddress.fullName}`,
        data: { orderId: newOrder.id, shopId }
      });

      // Create notification for customer
      const custNotif = memoryStore.addNotification({
        userId,
        type: 'ORDER_STATUS',
        title: `Order Placed Successfully! 🛒`,
        message: `Order #${newOrder.orderNumber} placed with ${shop ? shop.name : 'Store'}. Estimated delivery 25-40 mins.`,
        data: { orderId: newOrder.id }
      });

      // Emit Socket.io real-time event to seller room and customer
      if (io) {
        io.to(`shop_${shopId}`).emit('order:new', {
          order: newOrder,
          notification: sellerNotif
        });
        io.to(`user_${userId}`).emit('notification:new', custNotif);
      }
    }

    res.status(201).json({
      success: true,
      message: 'Order(s) placed successfully!',
      orders: createdOrders
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const { status } = req.query;

    const orders = memoryStore.getOrders({ userId, status });

    // Augment with shop names
    const enriched = orders.map(o => {
      const shop = memoryStore.getShopById(o.shopId);
      return {
        ...o,
        shopName: shop ? shop.name : "Local Sports Store",
        shopAddress: shop ? shop.address : "Tiptur",
        shopPhone: shop ? shop.phone : "+91 98451 22345"
      };
    });

    res.json({
      success: true,
      count: enriched.length,
      orders: enriched
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = memoryStore.getOrderById(id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const shop = memoryStore.getShopById(order.shopId);
    const user = memoryStore.findUserById(order.userId);

    res.json({
      success: true,
      order: {
        ...order,
        shopName: shop ? shop.name : "Local Sports Store",
        shopAddress: shop ? shop.address : "Tiptur",
        shopPhone: shop ? shop.phone : "+91 98451 22345",
        shopLocation: shop ? shop.location : { coordinates: [76.4782, 13.2575] },
        customerName: user ? user.name : order.deliveryAddress?.fullName
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, note } = req.body;

    if (!status) {
      return res.status(400).json({ success: false, message: 'Status is required' });
    }

    const order = memoryStore.getOrderById(id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Role check: seller can only update orders for their shop
    if (req.user.role === 'seller' && req.user.shopId && req.user.shopId !== order.shopId) {
      return res.status(403).json({ success: false, message: 'Unauthorized to update order for another store.' });
    }

    const updatedOrder = memoryStore.updateOrderStatus(id, status, note);

    // Create customer notification
    const custNotif = memoryStore.addNotification({
      userId: order.userId,
      type: 'ORDER_STATUS',
      title: `Order Update: ${status} 📦`,
      message: `Your order #${order.orderNumber} is now: ${status}. ${note || ''}`,
      data: { orderId: order.id, status }
    });

    // Emit live WebSocket event
    const io = req.app.get('io');
    if (io) {
      // Broadcast to specific order room
      io.to(`order_${order.id}`).emit('order:statusUpdated', {
        orderId: order.id,
        status: status,
        order: updatedOrder,
        notification: custNotif
      });

      // Broadcast to user notification room
      io.to(`user_${order.userId}`).emit('notification:new', custNotif);
    }

    res.json({
      success: true,
      message: `Order status updated to ${status}`,
      order: updatedOrder
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
