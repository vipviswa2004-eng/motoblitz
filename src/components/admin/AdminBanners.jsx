import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, Eye, EyeOff } from 'lucide-react';
import { getSampleBanners } from '../../lib/supabase';

export default function AdminBanners() {
  const [banners, setBanners] = useState(getSampleBanners());
  const [ticker, setTicker] = useState('⚡ FREE Shipping all over India on orders above ₹999 | Use code BLITZ10 for 10% off your first order ⚡');

  function toggleActive(id) {
    setBanners(bs => bs.map(b => b.id === id ? { ...b, is_active: !b.is_active } : b));
  }

  function deleteBanner(id) {
    if (window.confirm('Delete this banner?')) setBanners(bs => bs.filter(b => b.id !== id));
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-racing text-xl font-bold text-white">BANNERS & ANNOUNCEMENTS</h2>
        <p className="text-xs text-slate-500 mt-0.5">Manage hero banners and the announcement ticker</p>
      </div>

      {/* Ticker Editor */}
      <div className="bg-dark-card border border-dark-border rounded-xl p-5">
        <h3 className="font-bold text-white text-sm mb-3 flex items-center gap-2">
          📢 Announcement Bar Ticker
        </h3>
        <textarea
          value={ticker}
          onChange={e => setTicker(e.target.value)}
          rows={3}
          className="w-full bg-dark-base border border-dark-border rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-brand-red/50 resize-none"
          placeholder="e.g. ⚡ FREE Shipping on orders above ₹999"
        />
        <div className="mt-3 p-3 bg-dark-surface rounded-lg text-xs text-slate-400 border border-dark-border">
          <p className="font-bold text-slate-300 mb-1">Preview:</p>
          <div className="overflow-hidden">
            <motion.p
              animate={{ x: [0, -500] }}
              transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
              className="whitespace-nowrap text-slate-300"
            >
              {ticker}
            </motion.p>
          </div>
        </div>
        <button className="mt-3 px-4 py-2 bg-brand-red text-white font-bold text-xs rounded-xl hover:bg-brand-red-hover transition-colors">
          Save Ticker
        </button>
      </div>

      {/* Hero Banners */}
      <div className="bg-dark-card border border-dark-border rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-white text-sm">Hero Banners</h3>
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-red text-white font-bold text-xs rounded-xl hover:bg-brand-red-hover transition-colors">
            <Plus size={12} /> Add Banner
          </button>
        </div>

        <div className="space-y-3">
          {banners.map(banner => (
            <motion.div
              key={banner.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-4 p-3 bg-dark-surface rounded-xl border border-dark-border items-center"
            >
              <div className="relative w-24 h-14 rounded-lg overflow-hidden bg-dark-card shrink-0">
                <img src={banner.image_url} alt={banner.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <p className="text-white text-[8px] font-bold text-center px-1">{banner.title}</p>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-white text-sm truncate">{banner.title}</p>
                <p className="text-xs text-slate-500 truncate">{banner.subtitle}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => toggleActive(banner.id)}
                  className={`p-1.5 rounded-lg transition-colors ${banner.is_active ? 'text-green-400 hover:text-slate-400' : 'text-slate-600 hover:text-green-400'}`}
                >
                  {banner.is_active ? <Eye size={15} /> : <EyeOff size={15} />}
                </button>
                <button
                  onClick={() => deleteBanner(banner.id)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 transition-colors"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
