import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Truck, Shield, RotateCcw } from 'lucide-react';

const announcements = [
  { icon: Truck, text: '⚡ FREE SHIPPING on all accessories above ₹999' },
  { icon: Shield, text: '🏍️ 100% Genuine Bike Accessories — Quality Checked' },
  { icon: Zap, text: '⚡ FLASH DEALS — Up to 40% OFF on select accessories' },
  { icon: RotateCcw, text: '🔄 Easy 7-Day Returns on all accessories — Hassle-Free' },
  { icon: Truck, text: '🚀 Fast Dispatch — Ships within 24 hours of order confirmation' },
  { icon: Shield, text: '🔩 Exhausts • Crash Guards • LED Lights • Riding Gear • Decals' },
];

export default function AnnouncementBar() {
  const items = [...announcements, ...announcements]; // double for seamless loop

  return (
    <div className="fixed top-0 left-0 right-0 z-[70] bg-dark-surface border-b border-dark-border h-9 overflow-hidden flex items-center">
      {/* Left gradient fade */}
      <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-dark-surface to-transparent z-10 pointer-events-none" />
      {/* Right gradient fade */}
      <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-dark-surface to-transparent z-10 pointer-events-none" />

      <motion.div
        animate={{ x: ['0%', '-50%'] }}
        transition={{
          duration: 30,
          ease: 'linear',
          repeat: Infinity,
        }}
        className="flex items-center gap-8 whitespace-nowrap pl-4"
      >
        {items.map((item, idx) => (
          <div key={idx} className="flex items-center gap-2 text-xs font-semibold text-slate-400 tracking-wide">
            <div className="w-1 h-1 bg-brand-red rounded-full" />
            <span>{item.text}</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
