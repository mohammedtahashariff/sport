'use client';

import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { api } from '../../../services/api';
import { addToast } from '../../../store/toastSlice';
import SellerHeader from '../../../components/seller/SellerHeader';
import ProductModal from '../../../components/seller/ProductModal';
import RatingStars from '../../../components/common/RatingStars';
import {
  Plus,
  Edit2,
  Trash2,
  Package,
  Search,
  ExternalLink,
  ShieldCheck,
  Zap
} from 'lucide-react';

export default function SellerProductsPage() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const res = await api.getProducts({ shopId: user?.shopId || 'shop-1' });
      if (res.success) {
        setProducts(res.products || []);
      }
    } catch (err) {
      console.error('Failed to load seller products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [user]);

  const handleSaveProduct = async (productData) => {
    try {
      if (editingProduct) {
        const id = editingProduct.id || editingProduct._id;
        const res = await api.updateProduct(id, productData);
        if (res.success) {
          dispatch(addToast({ type: 'success', title: 'Product Updated', message: productData.name }));
        }
      } else {
        const res = await api.createProduct(productData);
        if (res.success) {
          dispatch(addToast({ type: 'success', title: 'Product Added 🏆', message: productData.name }));
        }
      }
      setIsModalOpen(false);
      setEditingProduct(null);
      loadProducts();
    } catch (err) {
      dispatch(addToast({ type: 'error', message: err.message || 'Operation failed' }));
    }
  };

  const handleDeleteProduct = async (product) => {
    const id = product.id || product._id;
    if (!confirm(`Are you sure you want to delete "${product.name}" from your store catalog?`)) return;

    try {
      const res = await api.deleteProduct(id);
      if (res.success) {
        dispatch(addToast({ type: 'info', message: `Deleted ${product.name}` }));
        loadProducts();
      }
    } catch (err) {
      dispatch(addToast({ type: 'error', message: err.message || 'Failed to delete product' }));
    }
  };

  const categories = ['All', ...new Set(products.map(p => p.category))];

  const filtered = products.filter(p => {
    const matchCat = selectedCategory === 'All' || p.category === selectedCategory;
    const matchSearch = !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.brand.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div>
      <SellerHeader
        title="Product Catalog Management"
        subtitle="Add, modify, and manage pricing for your local sports equipment"
        onAddProduct={() => {
          setEditingProduct(null);
          setIsModalOpen(true);
        }}
      />

      <main className="p-8 max-w-7xl space-y-6">
        {/* Filter and Search Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCategory(c)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCategory === c
                    ? 'bg-navy-900 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="relative min-w-[260px]">
            <input
              type="text"
              placeholder="Search gear, brand, or SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:border-sport-orange focus:outline-none"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="p-4">Product Details</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Brand</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Stock</th>
                  <th className="p-4">Rating</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {loading ? (
                  <tr>
                    <td colSpan="7" className="p-8 text-center text-slate-400">Loading catalog...</td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="p-12 text-center text-slate-400">
                      <Package className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                      <p className="font-bold text-slate-700">No sports products found</p>
                    </td>
                  </tr>
                ) : (
                  filtered.map((prod) => (
                    <tr key={prod.id || prod._id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={(prod.images && prod.images[0]) || prod.image || "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=100"}
                            alt={prod.name}
                            className="w-12 h-12 rounded-xl object-cover bg-slate-100 border border-slate-200 shrink-0"
                          />
                          <div>
                            <h4 className="font-bold text-slate-900 line-clamp-1">{prod.name}</h4>
                            <span className="text-[10px] text-slate-400 font-mono">SKU: {prod.sku || 'SK-01'}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-bold text-[10px]">
                          {prod.category}
                        </span>
                      </td>
                      <td className="p-4 font-bold text-slate-800">{prod.brand}</td>
                      <td className="p-4 font-black text-slate-900 font-heading">
                        ₹{prod.price?.toLocaleString('en-IN')}
                        {prod.discount > 0 && <span className="text-[10px] text-sport-orange ml-1 font-bold">({prod.discount}% off)</span>}
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                          prod.stock <= (prod.lowStockThreshold || 3)
                            ? 'bg-rose-50 text-rose-600 border border-rose-200'
                            : 'bg-emerald-50 text-emerald-700'
                        }`}>
                          {prod.stock} units
                        </span>
                      </td>
                      <td className="p-4">
                        <RatingStars rating={prod.rating || 4.5} size="w-3.5 h-3.5" />
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              setEditingProduct(prod);
                              setIsModalOpen(true);
                            }}
                            className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                            title="Edit Product"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(prod)}
                            className="p-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors"
                            title="Delete Product"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <ProductModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingProduct(null);
        }}
        onSave={handleSaveProduct}
        product={editingProduct}
      />
    </div>
  );
}
