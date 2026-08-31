import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, ShoppingCart, Trash2, ArrowRight, Sparkles } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export default function WishlistDrawer({ isOpen, onClose, onProductClick }) {
  const { wishlist, toggleWishlist, addItem } = useCart();

  const handleMoveToCart = (product) => {
    addItem(product);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[75] overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/75 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Drawer Panel */}
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="w-screen max-w-md bg-dark-card border-l border-dark-border shadow-2xl flex flex-col"
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div className="p-5 sm:p-6 border-b border-dark-border flex items-center justify-between bg-dark-surface/80">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-red/10 border border-brand-red/30 flex items-center justify-center text-brand-red">
                    <Heart size={20} fill="currentColor" />
                  </div>
                  <div>
                    <h2 className="font-racing text-xl font-bold text-white tracking-wide">
                      SAVED <span className="text-brand-red">WISHLIST</span>
                    </h2>
                    <p className="text-xs text-slate-400">
                      {wishlist.length} item{wishlist.length !== 1 ? 's' : ''} saved for later
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="w-9 h-9 rounded-full bg-dark-base border border-dark-border text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Items List */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
                {wishlist.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-8">
                    <div className="w-20 h-20 rounded-full bg-dark-surface border border-dark-border flex items-center justify-center text-slate-600 mb-4">
                      <Heart size={36} />
                    </div>
                    <h3 className="font-racing text-xl font-bold text-white mb-1">
                      YOUR WISHLIST IS EMPTY
                    </h3>
                    <p className="text-xs text-slate-400 max-w-xs mb-6">
                      Explore our motorcycle accessories and tap the heart icon to save your favorite parts.
                    </p>
                    <button
                      onClick={onClose}
                      className="px-6 py-3 rounded-xl bg-brand-red hover:bg-brand-red-hover text-white text-xs font-bold transition-all shadow-lg glow-red-sm cursor-pointer"
                    >
                      Browse Accessories
                    </button>
                  </div>
                ) : (
                  wishlist.map(product => {
                    const effectivePrice = product.sale_price || product.price;
                    return (
                      <motion.div
                        key={product.id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="p-3.5 rounded-2xl bg-dark-surface border border-dark-border hover:border-brand-red/30 transition-all flex gap-3 group"
                      >
                        {/* Thumbnail */}
                        <div
                          className="w-20 h-20 rounded-xl overflow-hidden bg-dark-base border border-dark-border shrink-0 cursor-pointer"
                          onClick={() => {
                            onProductClick?.(product);
                            onClose();
                          }}
                        >
                          <img
                            src={product.images?.[0] || 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=400&q=80'}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                          <div>
                            <div className="flex items-start justify-between gap-1">
                              <p
                                onClick={() => {
                                  onProductClick?.(product);
                                  onClose();
                                }}
                                className="text-xs font-bold text-white line-clamp-2 cursor-pointer hover:text-brand-orange transition-colors"
                              >
                                {product.name}
                              </p>
                              <button
                                onClick={() => toggleWishlist(product)}
                                className="text-slate-500 hover:text-red-400 p-1 shrink-0 transition-colors cursor-pointer"
                                title="Remove from wishlist"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                            <span className="text-[10px] text-slate-400 block mt-0.5">
                              {product.category?.name || 'Accessories'}
                            </span>
                          </div>

                          <div className="flex items-center justify-between pt-2">
                            <div className="flex items-baseline gap-1.5">
                              <span className="font-racing font-bold text-base text-white">
                                ₹{effectivePrice.toLocaleString('en-IN')}
                              </span>
                              {product.sale_price && (
                                <span className="text-[11px] text-slate-500 line-through">
                                  ₹{product.price.toLocaleString('en-IN')}
                                </span>
                              )}
                            </div>

                            <motion.button
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleMoveToCart(product)}
                              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-brand-red hover:bg-brand-red-hover text-white text-[11px] font-bold shadow-md transition-all cursor-pointer"
                            >
                              <ShoppingCart size={12} />
                              <span>Add to Cart</span>
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </div>

              {/* Footer */}
              {wishlist.length > 0 && (
                <div className="p-4 sm:p-5 border-t border-dark-border bg-dark-surface/80 space-y-2">
                  <p className="text-[11px] text-slate-400 text-center flex items-center justify-center gap-1">
                    <Sparkles size={12} className="text-brand-orange" />
                    <span>Items saved here stay synced with your browser</span>
                  </p>
                  <button
                    onClick={onClose}
                    className="w-full py-3 rounded-xl bg-dark-base border border-dark-border text-white text-xs font-bold hover:bg-dark-border transition-colors cursor-pointer"
                  >
                    Continue Shopping
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
