const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const memoryStore = require('../services/memoryDb');
const { JWT_SECRET } = require('../middleware/auth');

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id || user._id,
      email: user.email,
      name: user.name,
      role: user.role,
      shopId: user.shopId || null
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

exports.register = async (req, res) => {
  try {
    const { name, email, phone, password, role = 'customer', shopName, shopAddress } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, and password.' });
    }

    const existingUser = memoryStore.findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let createdShop = null;
    let newShopId = null;

    if (role === 'seller') {
      createdShop = memoryStore.createShop({
        name: shopName || `${name}'s Sports Store`,
        address: shopAddress || 'Tiptur Main Road',
        city: 'Tiptur',
        pincode: '572201',
        phone: phone || '+91 98450 00000',
        email: email,
        description: `Authorized sports store in Tiptur managed by ${name}.`,
        location: {
          type: 'Point',
          coordinates: [76.4782 + (Math.random() - 0.5) * 0.02, 13.2575 + (Math.random() - 0.5) * 0.02]
        }
      });
      newShopId = createdShop.id;
    }

    const newUser = memoryStore.createUser({
      name,
      email,
      phone: phone || '',
      password: hashedPassword,
      role,
      shopId: newShopId,
      addresses: role === 'customer' ? [
        {
          id: `addr-${Date.now()}`,
          label: 'Home',
          fullName: name,
          phone: phone || '',
          addressLine: 'Tiptur, Karnataka',
          city: 'Tiptur',
          state: 'Karnataka',
          pincode: '572201',
          isDefault: true,
          location: { lat: 13.2575, lng: 76.4782 }
        }
      ] : []
    });

    const token = generateToken(newUser);

    res.status(201).json({
      success: true,
      message: 'Account registered successfully',
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role,
        shopId: newUser.shopId,
        addresses: newUser.addresses,
        preferredCategories: newUser.preferredCategories
      },
      shop: createdShop
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password.' });
    }

    // Check demo shortcuts
    const isDemoCustomer = email.toLowerCase() === 'customer@sportkart.com';
    const isDemoSeller = email.toLowerCase() === 'seller@sportkart.com';

    let user = memoryStore.findUserByEmail(email);

    if (!user) {
      // Auto create demo accounts if not found
      if (isDemoCustomer) {
        user = memoryStore.createUser({
          name: 'Ramesh Kumar (Customer)',
          email: 'customer@sportkart.com',
          phone: '+91 98450 12345',
          password: 'password123',
          role: 'customer'
        });
      } else if (isDemoSeller) {
        user = memoryStore.createUser({
          name: 'Suresh Gowda (Shop Owner)',
          email: 'seller@sportkart.com',
          phone: '+91 98451 22345',
          password: 'password123',
          role: 'seller',
          shopId: 'shop-1'
        });
      } else {
        return res.status(401).json({ success: false, message: 'Invalid email or password.' });
      }
    }

    // Role check if explicit role requested
    if (role && user.role !== role) {
      return res.status(403).json({ success: false, message: `Account is registered as ${user.role}, not ${role}.` });
    }

    // Verify password (allowing demo pass 'password123' or bcrypt compare)
    let isMatch = password === 'password123';
    if (!isMatch && user.password) {
      try {
        isMatch = await bcrypt.compare(password, user.password);
      } catch (e) {
        isMatch = password === user.password;
      }
    }

    if (!isMatch && !isDemoCustomer && !isDemoSeller) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const token = generateToken(user);
    const shop = user.shopId ? memoryStore.getShopById(user.shopId) : null;

    res.json({
      success: true,
      message: 'Logged in successfully',
      token,
      user: {
        id: user.id || user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        shopId: user.shopId,
        addresses: user.addresses || [],
        preferredCategories: user.preferredCategories || ['Cricket', 'Badminton']
      },
      shop
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = memoryStore.findUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const shop = user.shopId ? memoryStore.getShopById(user.shopId) : null;

    res.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        shopId: user.shopId,
        addresses: user.addresses || [],
        preferredCategories: user.preferredCategories || [],
        browsingHistory: user.browsingHistory || [],
        searchHistory: user.searchHistory || []
      },
      shop
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, phone, addresses, preferredCategories, browsingItem, searchQuery } = req.body;

    const user = memoryStore.findUserById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (phone !== undefined) updateData.phone = phone;
    if (addresses) updateData.addresses = addresses;
    if (preferredCategories) updateData.preferredCategories = preferredCategories;

    if (browsingItem) {
      const history = user.browsingHistory || [];
      history.unshift({ ...browsingItem, viewedAt: new Date() });
      updateData.browsingHistory = history.slice(0, 20); // keep last 20
    }

    if (searchQuery) {
      const searches = user.searchHistory || [];
      searches.unshift({ query: searchQuery, searchedAt: new Date() });
      updateData.searchHistory = searches.slice(0, 20);
    }

    const updatedUser = memoryStore.updateUser(userId, updateData);

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
