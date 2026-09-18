'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../../../store/cartSlice';
import { toggleWishlist } from '../../../store/wishlistSlice';
import { toggleCompare } from '../../../store/comparisonSlice';
import { addToast } from '../../../store/toastSlice';
import { api } from '../../../services/api';
import Navbar from '../../../components/common/Navbar';
import Footer from '../../../components/common/Footer';
import MobileNav from '../../../components/common/MobileNav';
import RatingStars from '../../../components/common/RatingStars';
import ProductCard from '../../../components/customer/ProductCard';
import {
  ShoppingCart,
  Heart,
  Scale,
  MapPin,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  Phone,
  Store,
  ChevronRight,
  Check,
  Zap,
  Star
} from 'lucide-react';

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch();

  const { lat, lng } = useSelector((state) => state.location);
  const wishlistItems = useSelector((state) => state.wishlist.items);
  const comparisonItems = useSelector((state) => state.comparison.items);
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const [product, setProduct] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  // Review Form state
  const [userRating, setUserRating] = useState(5);
  const [userComment, setUserComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  const prodId = params.id;
  const isWishlisted = product && wishlistItems.some(i => (i.id || i._id) === (product.id || product._id));
  const isCompared = product && comparisonItems.some(i => (i.id || i._id) === (product.id || product._id));

  useEffect(() => {
    async function loadProductData() {
      try {
        setLoading(true);
        const [prodRes, recRes] = await Promise.all([
          api.getProductById(prodId, { lat, lng }),
          api.getRecommendations({ productId: prodId, limit: 4 })
        ]);

        if (prodRes.success) {
          setProduct(prodRes.product);
        }
        if (recRes.success) {
          setRecommendations(recRes.personalized || []);
        }
      } catch (err) {
        console.error('Error loading product details:', err);
      } finally {
        setLoading(false);
      }
    }

    if (prodId) {
      loadProductData();
    }
  }, [prodId, lat, lng]);

  const handleAddToCart = () => {
    if (!product) return;
    dispatch(addToCart({ ...product, quantity }));
    dispatch(addToast({
      type: 'success',
      title: 'Added to Cart 🛒',
      message: `${quantity}x ${product.name} from ${product.shopName}`
    }));
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push('/checkout');
  };

  const handleToggleWishlist = () => {
    if (!product) return;
    dispatch(toggleWishlist(product));
    dispatch(addToast({
      type: 'info',
      title: isWishlisted ? 'Removed from Wishlist' : 'Saved to Wishlist ❤️',
      message: product.name
    }));
  };

  const handleToggleCompare = () => {
    if (!product) return;
    dispatch(toggleCompare(product));
    dispatch(addToast({
      type: 'info',
      title: isCompared ? 'Removed from Comparison' : 'Added to Comparison ⚖️',
      message: product.name
    }));
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      dispatch(addToast({ type: 'error', message: 'Please login to submit a review' }));
      router.push('/login');
      return;
    }

    if (!userComment.trim()) return;

    try {
      setSubmittingReview(true);
      const res = await api.addReview({
        productId: prodId,
        rating: userRating,
        comment: userComment
      });

      if (res.success) {
        dispatch(addToast({ type: 'success', message: 'Review submitted successfully!' }));
        setUserComment('');
        // Refresh product reviews
        const updated = await api.getProductById(prodId, { lat, lng });
        if (updated.success) setProduct(updated.product);
      }
    } catch (err) {
      dispatch(addToast({ type: 'error', message: err.message || 'Failed to submit review' }));
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-16 text-center flex-1 flex items-center justify-center">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-sport-orange/20 text-sport-orange flex items-center justify-center animate-spin mx-auto">
              <Zap className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-slate-700">Loading Sports Equipment Details...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-16 text-center flex-1">
          <h2 className="text-xl font-bold text-slate-900 mb-2">Product Not Found</h2>
          <p className="text-xs text-slate-500 mb-6">The requested sports item is not available in Tiptur catalog.</p>
          <Link href="/shop" className="px-6 py-2.5 bg-navy-900 text-white rounded-xl text-xs font-bold">
            Back to Shop
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const images = product.images && product.images.length > 0 ? product.images : ["https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800"];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Breadcrumb navigation */}
        <div className="flex items-center gap-2 text-xs text-slate-400 mb-6">
          <Link href="/" className="hover:text-slate-700">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href={`/shop?category=${product.category}`} className="hover:text-slate-700">{product.category}</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-900 font-bold truncate">{product.name}</span>
        </div>

        {/* Product Main Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm mb-12">
          {/* Left: Image Gallery */}
          <div className="lg:col-span-6 space-y-4">
            <div className="aspect-square rounded-3xl bg-slate-100 overflow-hidden border border-slate-200 relative group">
              <img
                src={images[selectedImage] || images[0]}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              {product.discount > 0 && (
                <div className="absolute top-4 left-4 px-3 py-1 rounded-xl bg-gradient-to-r from-sport-orange to-amber-500 text-white font-black text-xs shadow-md">
                  {product.discount}% OFF
                </div>
              )}
            </div>

            {/* Thumbnail selector */}
            {images.length > 1 && (
              <div className="flex items-center gap-3">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all ${
                      selectedImage === idx
                        ? 'border-sport-orange ring-2 ring-sport-orange/20'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <img src={img} alt="thumb" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Details & Actions */}
          <div className="lg:col-span-6 flex flex-col justify-between">
            <div className="space-y-4">
              {/* Brand & Category */}
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-xl bg-orange-50 text-sport-orange font-extrabold text-xs uppercase tracking-wider border border-orange-200/60">
                  {product.brand} • {product.category}
                </span>
                <span className="text-xs text-slate-400 font-mono">SKU: {product.sku || 'SK-001'}</span>
              </div>

              {/* Product Title */}
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-heading leading-tight">
                {product.name}
              </h1>

              {/* Rating & Reviews */}
              <div className="flex items-center gap-4">
                <RatingStars rating={product.rating || 4.5} count={product.reviewCount || 12} size="w-5 h-5" />
                <span className="text-slate-300">|</span>
                <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  100% Genuine Authorized Gear
                </span>
              </div>

              {/* Fulfilling Shop Info Card */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-navy-900 text-white flex items-center justify-center font-bold text-sm">
                    🏬
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 leading-tight flex items-center gap-1">
                      {product.shopName || 'Chamundeshwari Sports Center'}
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                    </h4>
                    <p className="text-[11px] text-slate-500">{product.shopAddress || 'B.H. Road, Tiptur'}</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-100/80 px-2.5 py-1 rounded-xl border border-emerald-300 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {product.distanceText || '1.2 km away'}
                </span>
              </div>

              {/* Price Block */}
              <div className="pt-2">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl sm:text-4xl font-black text-slate-900 font-heading">
                    ₹{product.price?.toLocaleString('en-IN')}
                  </span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="text-base text-slate-400 line-through">
                      ₹{product.originalPrice?.toLocaleString('en-IN')}
                    </span>
                  )}
                  {product.discount > 0 && (
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg">
                      Save ₹{(product.originalPrice - product.price)?.toLocaleString('en-IN')}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">Inclusive of all local taxes • Free pickup / Fast delivery</p>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pt-2">
                {product.description || 'High-performance tournament grade sports equipment crafted for optimal balance, speed, and durability.'}
              </p>
            </div>

            {/* Actions & Quantity Selector */}
            <div className="space-y-4 pt-6 border-t border-slate-100 mt-6">
              {/* Quantity */}
              <div className="flex items-center gap-4">
                <span className="text-xs font-bold text-slate-700">Quantity:</span>
                <div className="flex items-center border border-slate-300 rounded-xl bg-white overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 font-bold text-sm"
                  >
                    -
                  </button>
                  <span className="px-4 py-1.5 text-xs font-black text-slate-900">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock || 99, quantity + 1))}
                    className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 font-bold text-sm"
                  >
                    +
                  </button>
                </div>
                <span className="text-xs text-slate-500">
                  {product.stock > 0 ? `(${product.stock} units available in Tiptur)` : '(Out of Stock)'}
                </span>
              </div>

              {/* CTA Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0}
                  className="py-3.5 px-6 rounded-2xl bg-navy-900 hover:bg-navy-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Add to Cart</span>
                </button>

                <button
                  onClick={handleBuyNow}
                  disabled={product.stock <= 0}
                  className="py-3.5 px-6 rounded-2xl bg-gradient-to-r from-sport-orange to-amber-500 hover:from-sport-orangeHover hover:to-amber-600 text-white font-black text-xs flex items-center justify-center gap-2 transition-all shadow-glow-orange active:scale-95"
                >
                  <Zap className="w-4 h-4 fill-white stroke-none" />
                  <span>Buy Now (30-Min Delivery)</span>
                </button>
              </div>

              {/* Wishlist and Compare Secondary Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={handleToggleWishlist}
                  className={`flex-1 py-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                    isWishlisted
                      ? 'border-rose-300 bg-rose-50 text-rose-600'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500 stroke-none' : ''}`} />
                  <span>{isWishlisted ? 'Wishlisted' : 'Save to Wishlist'}</span>
                </button>

                <button
                  onClick={handleToggleCompare}
                  className={`flex-1 py-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                    isCompared
                      ? 'border-cyan-300 bg-cyan-50 text-cyan-800'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <Scale className="w-4 h-4 text-sport-cyan" />
                  <span>{isCompared ? 'In Comparison' : 'Compare Product'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* AVAILABLE AT OTHER NEARBY SHOPS COMPARISON */}
        {product.otherShopsSelling && product.otherShopsSelling.length > 0 && (
          <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm mb-12">
            <div className="flex items-center gap-2 mb-4">
              <Store className="w-5 h-5 text-sport-orange" />
              <h3 className="text-lg font-bold text-slate-900">Available at Other Nearby Sports Shops</h3>
            </div>
            <p className="text-xs text-slate-500 mb-6">
              Compare prices and stock of matching {product.brand} gear across Tiptur stores before deciding.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {product.otherShopsSelling.map((s) => (
                <div key={s.productId} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-bold text-xs text-slate-900 truncate">{s.shopName}</h4>
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                        {s.distanceText}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 line-clamp-1 mb-2">{s.productName}</p>
                    <div className="flex items-center gap-2 text-xs mb-3">
                      <RatingStars rating={s.shopRating || 4.5} showNumber={false} size="w-3.5 h-3.5" />
                      <span className="text-[11px] text-slate-400">({s.stock} in stock)</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                    <span className="text-sm font-black text-slate-900 font-heading">₹{s.price?.toLocaleString('en-IN')}</span>
                    <Link
                      href={`/product/${s.productId}`}
                      className="px-3 py-1.5 bg-navy-900 hover:bg-sport-orange text-white rounded-xl text-xs font-bold transition-colors"
                    >
                      View & Buy
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* SPECIFICATIONS TABLE */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm mb-12">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Technical Specifications</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 text-xs">
            {Object.entries(product.specifications || {}).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500 font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                <span className="font-bold text-slate-900 text-right">{value || 'Standard'}</span>
              </div>
            ))}
          </div>
        </section>

        {/* CUSTOMER REVIEWS */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Local Player Reviews</h3>
              <p className="text-xs text-slate-500">Verified purchases from Tiptur sports stores</p>
            </div>
            <RatingStars rating={product.rating || 4.5} count={product.reviews?.length || 2} size="w-5 h-5" />
          </div>

          {/* Review Submission Form */}
          <form onSubmit={handleReviewSubmit} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 mb-8 space-y-3">
            <h4 className="text-xs font-bold text-slate-800">Write a Review for this Gear</h4>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">Your Rating:</span>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setUserRating(star)}
                    className="p-1 hover:scale-125 transition-transform"
                  >
                    <Star className={`w-5 h-5 ${star <= userRating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} />
                  </button>
                ))}
              </div>
            </div>
            <textarea
              rows="2"
              value={userComment}
              onChange={(e) => setUserComment(e.target.value)}
              placeholder="Share how this equipment performs on pitch or court..."
              required
              className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:border-sport-orange focus:ring-2 focus:ring-sport-orange/20"
            ></textarea>
            <button
              type="submit"
              disabled={submittingReview}
              className="px-5 py-2 bg-navy-900 hover:bg-sport-orange text-white text-xs font-bold rounded-xl transition-all shadow-sm"
            >
              {submittingReview ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>

          {/* Reviews list */}
          <div className="space-y-4">
            {product.reviews && product.reviews.length > 0 ? (
              product.reviews.map((rev) => (
                <div key={rev.id || rev._id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-sport-orange/20 text-sport-orange font-bold text-xs flex items-center justify-center">
                        {rev.userName ? rev.userName[0] : 'U'}
                      </div>
                      <span className="text-xs font-bold text-slate-900">{rev.userName || 'Local Athlete'}</span>
                    </div>
                    <RatingStars rating={rev.rating || 5} size="w-3.5 h-3.5" showNumber={false} />
                  </div>
                  <p className="text-xs text-slate-600">{rev.comment}</p>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    {new Date(rev.createdAt || Date.now()).toLocaleDateString()}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 italic">No reviews yet. Be the first to review this gear!</p>
            )}
          </div>
        </section>

        {/* AI RECOMMENDED COMPANION PRODUCTS */}
        {recommendations.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="w-5 h-5 text-sport-orange" />
              <h3 className="text-xl font-bold text-slate-900 font-heading">Recommended Matching Equipment</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {recommendations.map((rec) => (
                <ProductCard key={rec.id || rec._id} product={rec} />
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
}
