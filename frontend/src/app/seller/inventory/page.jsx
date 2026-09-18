'use client';

import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { api } from '../../../services/api';
import { addToast } from '../../../store/toastSlice';
import SellerHeader from '../../../components/seller/SellerHeader';
import {
  Boxes,
  AlertTriangle,
  Search,
  Check,
  Plus,
  Minus,
  Save,
  Package
} from 'lucide-react';

export default function SellerInventoryPage() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lowStockFilter, setLowStockFilter] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Local stock adjustment tracking
  const [editingStocks, setEditingStocks] = useState({});

  const loadInventory = async () => {
    try {
      setLoading(true);
      const res = await api.getSellerInventory({
        lowStockOnly: lowStockFilter ? 'true' : '',
        search: searchQuery
      });
      if (res.success) {
        setInventory(res.inventory || []);
        const stockMap = {};
        (res.inventory || []).forEach(p => {
          stockMap[p.id || p._id] = p.stock;
        });
        setEditingStocks(stockMap);
      }
    } catch (err) {
      console.error('Failed to load inventory:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInventory();
  }, [lowStockFilter, searchQuery]);

  const handleStockChange = (productId, delta) => {
    setEditingStocks(prev => ({
      ...prev,
      [productId]: Math.max(0, (prev[productId] || 0) + delta)
    }));
  };

  const handleSaveStock = async (productId, name) => {
    const newStock = editingStocks[productId];
    try {
      const res = await api.updateQuickStock(productId, { stock: newStock });
      if (res.success) {
        dispatch(addToast({
          type: 'success',
          title: 'Stock Updated 📦',
          message: `${name}: ${newStock} units available`
        }));
        loadInventory();
      }
    } catch (err) {
      dispatch(addToast({ type: 'error', message: err.message || 'Stock update failed' }));
    }
  };

  const lowStockCount = inventory.filter(p => p.stock <= (p.lowStockThreshold || 5)).length;

  return (
    <div>
      <SellerHeader
        title="Live Inventory & Low-Stock Alerts"
        subtitle="Real-time stock controls with automatic customer out-of-stock prevention"
      />

      <main className="p-8 max-w-7xl space-y-6">
        {/* Alerts & Search Filter Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setLowStockFilter(false)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
                !lowStockFilter ? 'bg-navy-900 text-white shadow-md' : 'bg-white text-slate-700 border border-slate-200'
              }`}
            >
              All Items ({inventory.length})
            </button>

            <button
              onClick={() => setLowStockFilter(true)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                lowStockFilter
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Low Stock Alerts ({lowStockCount})</span>
            </button>
          </div>

          <div className="relative min-w-[260px]">
            <input
              type="text"
              placeholder="Search product inventory..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:border-sport-orange focus:outline-none shadow-sm"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* Inventory Table */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="p-4">Sports Gear Item</th>
                  <th className="p-4">SKU</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Quantity Control</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {loading ? (
                  <tr>
                    <td colSpan="7" className="p-8 text-center text-slate-400">Loading inventory...</td>
                  </tr>
                ) : inventory.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="p-12 text-center text-slate-400">
                      <Boxes className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                      <p className="font-bold text-slate-700">No inventory matches found</p>
                    </td>
                  </tr>
                ) : (
                  inventory.map((prod) => {
                    const id = prod.id || prod._id;
                    const currentStock = editingStocks[id] !== undefined ? editingStocks[id] : prod.stock;
                    const isLow = currentStock <= (prod.lowStockThreshold || 5);
                    const isOut = currentStock <= 0;
                    const hasChanged = currentStock !== prod.stock;

                    return (
                      <tr key={id} className={`hover:bg-slate-50/80 transition-colors ${isOut ? 'bg-rose-50/30' : ''}`}>
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={(prod.images && prod.images[0]) || prod.image || "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=100"}
                              alt={prod.name}
                              className="w-10 h-10 rounded-xl object-cover bg-slate-100 border border-slate-200 shrink-0"
                            />
                            <div>
                              <h4 className="font-bold text-slate-900 line-clamp-1">{prod.name}</h4>
                              <span className="text-[10px] text-slate-400 font-medium">{prod.brand}</span>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 font-mono text-[11px] text-slate-500">{prod.sku || 'SK-001'}</td>
                        <td className="p-4">{prod.category}</td>
                        <td className="p-4 font-black text-slate-900 font-heading">₹{prod.price?.toLocaleString('en-IN')}</td>
                        <td className="p-4">
                          {isOut ? (
                            <span className="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase bg-rose-100 text-rose-800">
                              Out of Stock
                            </span>
                          ) : isLow ? (
                            <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-amber-100 text-amber-900 flex items-center gap-1 w-fit">
                              <AlertTriangle className="w-3 h-3 text-amber-700" />
                              Low ({currentStock} left)
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-emerald-100 text-emerald-800">
                              In Stock
                            </span>
                          )}
                        </td>
                        <td className="p-4">
                          {/* Inline Quantity Modifier */}
                          <div className="flex items-center border border-slate-300 rounded-xl bg-slate-50 w-fit overflow-hidden">
                            <button
                              onClick={() => handleStockChange(id, -1)}
                              className="p-1.5 text-slate-600 hover:bg-slate-200 transition-colors"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <input
                              type="number"
                              min="0"
                              value={currentStock}
                              onChange={(e) => setEditingStocks({ ...editingStocks, [id]: parseInt(e.target.value, 10) || 0 })}
                              className="w-12 text-center text-xs font-black bg-transparent focus:outline-none"
                            />
                            <button
                              onClick={() => handleStockChange(id, 1)}
                              className="p-1.5 text-slate-600 hover:bg-slate-200 transition-colors"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => handleSaveStock(id, prod.name)}
                            disabled={!hasChanged}
                            className={`px-3.5 py-1.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1 ml-auto ${
                              hasChanged
                                ? 'bg-sport-orange hover:bg-sport-orangeHover text-white shadow-glow-orange'
                                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                            }`}
                          >
                            <Save className="w-3.5 h-3.5" />
                            <span>Save</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
