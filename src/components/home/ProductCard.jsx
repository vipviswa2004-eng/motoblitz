import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingCart, Star, CheckCircle, Eye } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useGarage } from '../../context/GarageContext';

export default function ProductCard({ product, setView, onProductClick }) {
  const { addItem, toggleWishlist, isWishlisted } = useCart();
  const { selectedBike } = useGarage();
  const [addedAnim, setAddedAnim] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const wishlisted = isWishlisted(product.id);
  const effectivePrice = product.sale_price || product.price;
  const discountPct = product.sale_price
    ? Math.round(((product.price - product.sale_price) / product.price) * 100)
    : 0;

  const isBikeCompatible =
    selectedBike === 'Universal' ||
    product.compatible_bikes?.includes(selectedBike) ||
    product.compatible_bikes?.includes('Universal');

  const isOutOfStock = product.stock_quantity === 0;
  const isLowStock = product.stock_quantity > 0 && product.stock_quantity <= 5;

  function handleAddToCart(e) {
    e.stopPropagation();
    if (isOutOfStock) return;
    addItem(product);
    setAddedAnim(true);
    setTimeout(() => setAddedAnim(false), 1800);
  }

  function handleWishlist(e) {
    e.stopPropagation();
    toggleWishlist(product);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -4 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={() => onProductClick?.(product)}
      className="relative bg-dark-card border border-dark-border rounded-2xl overflow-hidden cursor-pointer group transition-all duration-300 hover:border-brand-red/40 hover:shadow-2xl hover:glow-red-sm"
    >
      {/* Image Container */}
      <div className="relative overflow-hidden aspect-[4/3] bg-dark-surface">
        <img
          src={product.images?.[0] || 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=600&q=80'}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Overlay on hover */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end justify-center pb-3 gap-2"
            >
              <motion.button
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.05 }}
                onClick={(e) => { e.stopPropagation(); onProductClick?.(product); }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white text-xs font-semibold hover:bg-white/20 transition-colors"
              >
                <Eye size={12} /> Quick View
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5">
          {product.is_flash_deal && (
            <span className="bg-brand-orange text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
              ⚡ Flash Deal
            </span>
          )}
          {discountPct > 0 && (
            <span className="bg-brand-red text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
              -{discountPct}% OFF
            </span>
          )}
          {isLowStock && (
            <span className="bg-yellow-500/90 text-black text-[9px] font-bold px-2 py-0.5 rounded-full">
              Only {product.stock_quantity} Left!
            </span>
          )}
          {isOutOfStock && (
            <span className="bg-dark-border text-slate-400 text-[9px] font-bold px-2 py-0.5 rounded-full">
              Out of Stock
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={handleWishlist}
          className={`absolute top-2.5 right-2.5 w-8 h-8 flex items-center justify-center rounded-full transition-all ${
            wishlisted
              ? 'bg-brand-orange text-white'
              : 'bg-black/50 backdrop-blur-sm text-white hover:bg-brand-orange/80'
          }`}
        >
          <Heart size={13} fill={wishlisted ? 'currentColor' : 'none'} />
        </motion.button>

        {/* Bike Compatibility Badge */}
        {selectedBike !== 'Universal' && (
          <div className={`absolute bottom-2.5 left-2.5 flex items-center gap-1 px-2 py-1 rounded-full text-[9px] font-bold ${
            isBikeCompatible
              ? 'bg-green-500/90 text-white'
              : 'bg-slate-700/90 text-slate-400'
          }`}>
            <CheckCircle size={9} />
            {isBikeCompatible ? `✓ Fits ${selectedBike}` : 'Check Fitment'}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3.5">
        {/* Category */}
        <p className="text-[10px] text-brand-orange font-semibold uppercase tracking-wider mb-1">
          {product.category?.name}
        </p>

        {/* Name */}
        <h3 className="text-sm font-bold text-white leading-snug line-clamp-2 mb-2 group-hover:text-brand-red transition-colors">
          {product.name}
        </h3>

        {/* Rating */}
        {product.rating && (
          <div className="flex items-center gap-1.5 mb-3">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={10}
                  className={i < Math.floor(product.rating) ? 'text-brand-orange fill-brand-orange' : 'text-dark-border'}
                />
              ))}
            </div>
            <span className="text-[10px] text-slate-500">({product.review_count || 0})</span>
          </div>
        )}

        {/* Price + Cart */}
        <div className="flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-bold text-white">
                ₹{effectivePrice.toLocaleString('en-IN')}
              </span>
              {product.sale_price && (
                <span className="text-xs text-slate-500 line-through">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
              )}
            </div>
          </div>

          <AnimatePresence mode="wait">
            {addedAnim ? (
              <motion.div
                key="added"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="flex items-center gap-1 px-3 py-2 rounded-xl bg-green-500 text-white text-xs font-bold"
              >
                <CheckCircle size={13} /> Added!
              </motion.div>
            ) : (
              <motion.button
                key="cart"
                whileTap={{ scale: 0.9 }}
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                  isOutOfStock
                    ? 'bg-dark-border text-slate-500 cursor-not-allowed'
                    : 'bg-brand-red text-white hover:bg-brand-red-hover glow-red-sm'
                }`}
              >
                <ShoppingCart size={13} />
                {isOutOfStock ? 'Sold Out' : 'Add'}
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-brand-red to-brand-orange opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </motion.div>
  );
}
