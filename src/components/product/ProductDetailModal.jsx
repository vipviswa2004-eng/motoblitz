import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, ShoppingCart, Heart, CheckCircle, Star, Bike, Package, Zap } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useGarage } from '../../context/GarageContext';

export default function ProductDetailModal({ product, onClose, onOrderClick }) {
  const { addItem, toggleWishlist, isWishlisted } = useCart();
  const { selectedBike } = useGarage();
  const [currentImage, setCurrentImage] = useState(0);
  const [addedAnim, setAddedAnim] = useState(false);

  if (!product) return null;

  const wishlisted = isWishlisted(product.id);
  const effectivePrice = product.sale_price || product.price;
  const discountPct = product.sale_price
    ? Math.round(((product.price - product.sale_price) / product.price) * 100)
    : 0;
  const isBikeCompatible =
    selectedBike === 'Universal' ||
    product.compatible_bikes?.includes(selectedBike) ||
    product.compatible_bikes?.includes('Universal');

  function handleAdd() {
    addItem(product);
    setAddedAnim(true);
    setTimeout(() => setAddedAnim(false), 1800);
  }

  const images = product.images?.length ? product.images : [
    'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800&q=80'
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-sm p-0 sm:p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 60, opacity: 0 }}
          transition={{ type: 'spring', damping: 26, stiffness: 280 }}
          className="w-full sm:max-w-2xl bg-dark-card sm:rounded-2xl rounded-t-3xl border border-dark-border max-h-[92vh] overflow-y-auto"
          onClick={e => e.stopPropagation()}
        >
          {/* Image Gallery */}
          <div className="relative aspect-[4/3] sm:aspect-[16/9] overflow-hidden rounded-t-3xl sm:rounded-t-2xl bg-dark-surface">
            <img
              src={images[currentImage]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 w-9 h-9 flex items-center justify-center rounded-full bg-black/50 backdrop-blur-sm text-white hover:bg-brand-red/70 transition-colors"
            >
              <X size={16} />
            </button>

            {/* Wishlist */}
            <button
              onClick={() => toggleWishlist(product)}
              className={`absolute top-3 left-3 w-9 h-9 flex items-center justify-center rounded-full transition-all ${
                wishlisted ? 'bg-brand-orange text-white' : 'bg-black/50 backdrop-blur-sm text-white'
              }`}
            >
              <Heart size={15} fill={wishlisted ? 'currentColor' : 'none'} />
            </button>

            {/* Badges */}
            {discountPct > 0 && (
              <div className="absolute bottom-3 left-3 bg-brand-red text-white text-xs font-bold px-2.5 py-1 rounded-full">
                -{discountPct}% OFF
              </div>
            )}

            {/* Image nav */}
            {images.length > 1 && (
              <>
                <button onClick={() => setCurrentImage(i => (i - 1 + images.length) % images.length)}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-black/40 text-white">
                  <ChevronLeft size={16} />
                </button>
                <button onClick={() => setCurrentImage(i => (i + 1) % images.length)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-black/40 text-white">
                  <ChevronRight size={16} />
                </button>
              </>
            )}
          </div>

          {/* Content */}
          <div className="p-5 sm:p-6">
            <p className="text-xs text-brand-orange font-bold uppercase tracking-wider mb-1">{product.category?.name}</p>
            <h1 className="font-racing text-2xl sm:text-3xl font-bold text-white leading-tight mb-3">{product.name}</h1>

            {/* Rating */}
            {product.rating && (
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} className={i < Math.floor(product.rating) ? 'text-brand-orange fill-brand-orange' : 'text-dark-border'} />
                  ))}
                </div>
                <span className="text-sm font-bold text-white">{product.rating}</span>
                <span className="text-xs text-slate-500">({product.review_count} reviews)</span>
              </div>
            )}

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-5">
              <span className="text-3xl font-bold text-white">₹{effectivePrice.toLocaleString('en-IN')}</span>
              {product.sale_price && (
                <span className="text-lg text-slate-500 line-through">₹{product.price.toLocaleString('en-IN')}</span>
              )}
              {discountPct > 0 && (
                <span className="text-sm font-bold text-brand-orange">You save ₹{(product.price - product.sale_price).toLocaleString('en-IN')}</span>
              )}
            </div>

            {/* Description */}
            <p className="text-sm text-slate-400 leading-relaxed mb-5">{product.description}</p>

            {/* Bike Compatibility */}
            <div className="mb-5 p-3 rounded-xl bg-dark-surface border border-dark-border">
              <div className="flex items-center gap-2 mb-2">
                <Bike size={14} className="text-brand-red" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">Bike Compatibility</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {product.compatible_bikes?.map(bike => (
                  <span key={bike} className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                    bike === selectedBike
                      ? 'bg-green-500/20 text-green-400 border border-green-500/40'
                      : bike === 'Universal'
                      ? 'bg-brand-red/10 text-brand-red border border-brand-red/30'
                      : 'bg-dark-card text-slate-400 border border-dark-border'
                  }`}>
                    {bike === selectedBike && '✓ '}{bike}
                  </span>
                ))}
              </div>
            </div>

            {/* Stock status */}
            <div className="flex items-center gap-2 mb-5">
              {product.stock_quantity === 0 ? (
                <span className="text-xs text-slate-500 font-bold">⚠ Out of Stock</span>
              ) : product.stock_quantity <= 5 ? (
                <span className="text-xs text-yellow-400 font-bold">⚡ Only {product.stock_quantity} left — Order now!</span>
              ) : (
                <span className="text-xs text-green-400 font-bold flex items-center gap-1">
                  <CheckCircle size={12} /> In Stock · Ships within 24 hours
                </span>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <AnimatePresence mode="wait">
                {addedAnim ? (
                  <motion.div
                    key="added"
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0.9 }}
                    className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl bg-green-500 text-white font-bold text-sm"
                  >
                    <CheckCircle size={16} /> Added to Cart!
                  </motion.div>
                ) : (
                  <motion.button
                    key="add"
                    whileTap={{ scale: 0.97 }}
                    onClick={handleAdd}
                    disabled={product.stock_quantity === 0}
                    className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm transition-all ${
                      product.stock_quantity === 0
                        ? 'bg-dark-border text-slate-500 cursor-not-allowed'
                        : 'bg-dark-border hover:bg-dark-border-light text-white'
                    }`}
                  >
                    <ShoppingCart size={16} />
                    Add to Cart
                  </motion.button>
                )}
              </AnimatePresence>

              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => { addItem(product); onOrderClick(); }}
                disabled={product.stock_quantity === 0}
                className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm transition-all ${
                  product.stock_quantity === 0
                    ? 'bg-dark-border text-slate-500 cursor-not-allowed'
                    : 'bg-brand-red hover:bg-brand-red-hover text-white glow-red'
                }`}
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current text-green-400">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Order on WhatsApp
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
