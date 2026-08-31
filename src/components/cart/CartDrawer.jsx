import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, ShoppingCart, Plus, Minus, Trash2, Heart, ArrowRight, Package
} from 'lucide-react';
import { useCart } from '../../context/CartContext';

export default function CartDrawer({ isOpen, onClose, onCheckout }) {
  const { items, removeItem, updateQuantity, cartTotal, cartCount } = useCart();
  const freeShippingAt = 999;
  const remaining = Math.max(0, freeShippingAt - cartTotal);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="fixed right-0 top-0 bottom-0 z-[80] w-full max-w-sm sm:max-w-md bg-dark-card border-l border-dark-border flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-dark-border">
              <div className="flex items-center gap-2">
                <ShoppingCart size={18} className="text-brand-red" />
                <h2 className="font-racing text-lg font-bold text-white tracking-wide">
                  CART <span className="text-brand-red">({cartCount})</span>
                </h2>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-dark-surface text-slate-400 hover:text-white hover:bg-dark-border transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Free Shipping Bar */}
            {items.length > 0 && (
              <div className="px-4 sm:px-5 py-3 bg-dark-surface border-b border-dark-border">
                {remaining > 0 ? (
                  <>
                    <p className="text-xs text-slate-400 mb-2">
                      Add <span className="text-brand-orange font-bold">₹{remaining.toLocaleString('en-IN')}</span> more for FREE shipping ⚡
                    </p>
                    <div className="h-1.5 bg-dark-border rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-brand-red to-brand-orange"
                        animate={{ width: `${Math.min(100, (cartTotal / freeShippingAt) * 100)}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  </>
                ) : (
                  <p className="text-xs text-green-400 font-bold flex items-center gap-1.5">
                    ✅ You've unlocked FREE Shipping! 🎉
                  </p>
                )}
              </div>
            )}

            {/* Items */}
            <div className="flex-1 overflow-y-auto py-3 px-4 sm:px-5 space-y-3">
              <AnimatePresence>
                {items.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center h-full gap-4 py-20"
                  >
                    <div className="w-20 h-20 rounded-full bg-dark-surface border border-dark-border flex items-center justify-center">
                      <Package size={32} className="text-slate-600" />
                    </div>
                    <div className="text-center">
                      <p className="font-bold text-white text-lg">Your cart is empty</p>
                      <p className="text-sm text-slate-500 mt-1">Add some high-performance gear! 🏍️</p>
                    </div>
                    <button
                      onClick={onClose}
                      className="px-6 py-2.5 bg-brand-red text-white rounded-xl font-bold text-sm hover:bg-brand-red-hover transition-colors"
                    >
                      Browse Products
                    </button>
                  </motion.div>
                ) : (
                  items.map(item => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="flex gap-3 p-3 rounded-xl bg-dark-surface border border-dark-border"
                    >
                      {/* Image */}
                      <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-lg overflow-hidden bg-dark-card flex-shrink-0">
                        <img
                          src={item.images?.[0] || 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=200&q=80'}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-brand-orange font-semibold">{item.category?.name}</p>
                        <h4 className="text-sm font-bold text-white line-clamp-2 leading-tight mt-0.5">{item.name}</h4>
                        <p className="text-brand-red font-bold text-sm mt-1">
                          ₹{((item.sale_price || item.price) * item.quantity).toLocaleString('en-IN')}
                        </p>

                        {/* Qty Controls */}
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-6 h-6 flex items-center justify-center rounded-md bg-dark-card border border-dark-border text-slate-400 hover:text-white hover:border-brand-red/50 transition-all"
                          >
                            <Minus size={10} />
                          </button>
                          <span className="text-sm font-bold text-white w-5 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-6 h-6 flex items-center justify-center rounded-md bg-dark-card border border-dark-border text-slate-400 hover:text-white hover:border-brand-red/50 transition-all"
                          >
                            <Plus size={10} />
                          </button>

                          <button
                            onClick={() => removeItem(item.id)}
                            className="ml-auto text-slate-600 hover:text-red-400 transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-4 sm:p-5 border-t border-dark-border space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Subtotal</span>
                  <span className="font-bold text-white">₹{cartTotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Shipping</span>
                  <span className={`font-bold text-sm ${remaining === 0 ? 'text-green-400' : 'text-slate-300'}`}>
                    {remaining === 0 ? '🎉 FREE' : `₹${(60).toLocaleString('en-IN')}`}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-dark-border">
                  <span className="font-bold text-white">Total</span>
                  <span className="font-bold text-xl text-white">
                    ₹{(cartTotal + (remaining > 0 ? 60 : 0)).toLocaleString('en-IN')}
                  </span>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={onCheckout}
                  className="w-full flex items-center justify-center gap-2 py-3.5 bg-brand-red hover:bg-brand-red-hover text-white font-bold rounded-xl text-sm glow-red transition-all"
                >
                  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current text-green-400">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  Order via WhatsApp
                  <ArrowRight size={15} />
                </motion.button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
