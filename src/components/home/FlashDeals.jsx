import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Zap, ArrowRight, Clock } from 'lucide-react';
import { useProducts } from '../../context/ProductContext';
import ProductCard from './ProductCard';

function useCountdown(targetHours = 6) {
  const [timeLeft, setTimeLeft] = useState({ h: targetHours, m: 0, s: 0 });

  useEffect(() => {
    const end = Date.now() + targetHours * 3600 * 1000;
    const tick = () => {
      const diff = Math.max(0, end - Date.now());
      setTimeLeft({
        h: Math.floor(diff / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  return timeLeft;
}

function TimeBlock({ value, label }) {
  return (
    <div className="flex flex-col items-center">
      <div className="w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center bg-dark-base rounded-lg border border-brand-red/40 font-racing font-bold text-xl sm:text-2xl text-white glow-red-sm">
        {String(value).padStart(2, '0')}
      </div>
      <span className="text-[9px] text-slate-500 mt-1 uppercase tracking-wider font-medium">{label}</span>
    </div>
  );
}

export default function FlashDeals({ setView, onProductClick }) {
  const { getFlashDeals } = useProducts();
  const flashProducts = getFlashDeals();
  const { h, m, s } = useCountdown(6);

  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-brand-red text-white text-[10px] font-bold uppercase tracking-wider">
                  <Zap size={10} fill="currentColor" /> Flash Sale Live
                </span>
              </div>
              <h2 className="font-racing text-2xl sm:text-3xl font-bold text-white tracking-wide">
                FLASH <span className="text-brand-orange">DEALS</span>
              </h2>
            </div>

            {/* Countdown */}
            <div className="flex items-center gap-2">
              <Clock size={14} className="text-slate-400 hidden sm:block" />
              <div className="flex items-center gap-1.5">
                <TimeBlock value={h} label="Hrs" />
                <span className="text-brand-red font-bold text-lg mb-3.5">:</span>
                <TimeBlock value={m} label="Min" />
                <span className="text-brand-red font-bold text-lg mb-3.5">:</span>
                <TimeBlock value={s} label="Sec" />
              </div>
            </div>
          </div>

          <button
            onClick={() => setView('flash-deals')}
            className="flex items-center gap-1.5 text-sm font-bold text-brand-orange hover:text-brand-red transition-colors"
          >
            View All <ArrowRight size={15} />
          </button>
        </div>

        {/* Products */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {flashProducts.slice(0, 4).map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              setView={setView}
              onProductClick={onProductClick}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
