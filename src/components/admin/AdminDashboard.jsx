import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Package, TrendingUp, AlertTriangle, Zap, ArrowUpRight, Plus, ExternalLink } from 'lucide-react';
import { getSampleProducts } from '../../lib/supabase';
import { DEFAULT_WHATSAPP_NUMBER } from '../../lib/whatsapp';

const statCards = [
  { label: 'Total Orders', value: '24', delta: '+8 this week', icon: ShoppingCart, color: 'text-brand-red', bgColor: 'bg-brand-red/10' },
  { label: 'Products Listed', value: '8', delta: '2 low stock', icon: Package, color: 'text-brand-orange', bgColor: 'bg-brand-orange/10' },
  { label: 'Est. Revenue', value: '₹42,380', delta: 'Pending confirmed', icon: TrendingUp, color: 'text-brand-red', bgColor: 'bg-brand-red/10' },
  { label: 'Pending Orders', value: '6', delta: 'Need confirmation', icon: AlertTriangle, color: 'text-brand-orange', bgColor: 'bg-brand-orange/10' },
];

const recentActivity = [
  { type: 'order', text: 'New order #MB-84920 — Aravind Kumar (₹3,798)', time: '2 mins ago', icon: '🛒' },
  { type: 'low_stock', text: 'Low stock alert: LED DRL Halo Headlight (9 units left)', time: '1 hr ago', icon: '⚠️' },
  { type: 'order', text: 'New order #MB-84919 — Kavya Raj (₹1,499)', time: '3 hrs ago', icon: '🛒' },
  { type: 'dispatch', text: 'Order #MB-84915 marked Dispatched', time: '5 hrs ago', icon: '🚀' },
  { type: 'order', text: 'New order #MB-84914 — Priya S (₹2,299)', time: 'Yesterday', icon: '🛒' },
];

export default function AdminDashboard({ onAddProduct, onNavigate }) {
  const products = getSampleProducts();
  const lowStockProducts = products.filter(p => p.stock_quantity > 0 && p.stock_quantity <= 10);

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {statCards.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.07 }}
            className="bg-dark-card border border-dark-border rounded-xl p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-9 h-9 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                <stat.icon size={17} className={stat.color} />
              </div>
              <ArrowUpRight size={14} className="text-slate-600" />
            </div>
            <p className="text-2xl font-bold text-white font-racing">{stat.value}</p>
            <p className="text-xs text-slate-400 mt-0.5">{stat.label}</p>
            <p className="text-[10px] text-slate-500 mt-1">{stat.delta}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Recent Activity */}
        <div className="bg-dark-card border border-dark-border rounded-xl p-5">
          <h2 className="font-racing font-bold text-white mb-4 flex items-center gap-2">
            <Zap size={15} className="text-brand-red" /> RECENT ACTIVITY
          </h2>
          <div className="space-y-3">
            {recentActivity.map((activity, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + idx * 0.06 }}
                className="flex items-start gap-3 p-3 rounded-lg bg-dark-surface hover:bg-dark-border transition-colors"
              >
                <span className="text-lg shrink-0">{activity.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-300 line-clamp-2">{activity.text}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">{activity.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Low Stock Alert */}
        <div className="bg-dark-card border border-dark-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-racing font-bold text-white flex items-center gap-2">
              <AlertTriangle size={15} className="text-brand-orange" /> STOCK ALERTS
            </h2>
            <button
              onClick={() => onNavigate?.('products')}
              className="text-xs font-bold text-brand-orange hover:underline"
            >
              Manage →
            </button>
          </div>
          {lowStockProducts.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-8">All products are well-stocked! ✅</p>
          ) : (
            <div className="space-y-2.5">
              {lowStockProducts.map((product, idx) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + idx * 0.06 }}
                  className="flex items-center gap-3 p-3 rounded-lg bg-dark-surface cursor-pointer hover:bg-dark-border transition-colors"
                  onClick={() => onNavigate?.('products')}
                >
                  <img
                    src={product.images?.[0]}
                    alt={product.name}
                    className="w-10 h-10 rounded-lg object-cover bg-dark-card"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-white line-clamp-1">{product.name}</p>
                    <p className={`text-[10px] font-bold mt-0.5 ${product.stock_quantity <= 5 ? 'text-red-400' : 'text-yellow-400'}`}>
                      {product.stock_quantity === 0 ? '⚠ OUT OF STOCK' : `⚡ Only ${product.stock_quantity} left`}
                    </p>
                  </div>
                  <span className="text-xs font-bold text-white">₹{(product.sale_price || product.price).toLocaleString('en-IN')}</span>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-dark-card border border-dark-border rounded-xl p-5">
        <h2 className="font-racing font-bold text-white mb-4 flex items-center gap-2">
          <Zap size={15} className="text-brand-red" /> QUICK ACTIONS
        </h2>
        <div className="flex flex-wrap gap-3">
          {/* Add Product Button */}
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={() => onAddProduct?.()}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-brand-red text-white hover:bg-brand-red-hover glow-red-sm transition-all cursor-pointer shadow-lg"
          >
            <Plus size={15} /> + Add New Product
          </motion.button>

          {/* View Orders Button */}
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={() => onNavigate?.('orders')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-dark-surface border border-dark-border text-white hover:bg-dark-border transition-all cursor-pointer"
          >
            <ShoppingCart size={14} className="text-brand-red" /> 📦 View All Orders
          </motion.button>

          {/* Products & Flash Deals */}
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={() => onNavigate?.('products')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-brand-orange/10 border border-brand-orange/30 text-brand-orange hover:bg-brand-orange/20 transition-all cursor-pointer"
          >
            <Zap size={14} /> ⚡ Manage Products & Flash Deals
          </motion.button>

          {/* WhatsApp Direct Chat */}
          <motion.a
            whileTap={{ scale: 0.96 }}
            href={`https://wa.me/${DEFAULT_WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-green-500/10 border border-green-500/30 text-green-400 hover:bg-green-500/20 transition-all cursor-pointer"
          >
            <ExternalLink size={14} /> 💬 Open WhatsApp Chat
          </motion.a>
        </div>
      </div>
    </div>
  );
}
