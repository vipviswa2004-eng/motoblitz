import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowRight, Zap } from 'lucide-react';

// Hero banners with 100% motorcycle / superbike imagery
const HERO_BANNERS = [
  {
    id: 1,
    title: 'RIDE BEYOND LIMITS',
    subtitle: 'Exhausts, crash guards & aerodynamics built for serious riders. Free shipping above ₹999.',
    cta_text: 'Shop Now',
    cta_link: '/products',
    image_url: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=1400&q=80',
  },
  {
    id: 2,
    title: 'FLASH SALE — UP TO 40% OFF',
    subtitle: 'Limited-time deals on LED headlights, custom decals & winglet mirrors. Grab yours now!',
    cta_text: 'View Flash Deals',
    cta_link: '/flash-deals',
    image_url: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=1400&q=80',
  },
  {
    id: 3,
    title: 'DOMINATE THE STREETS',
    subtitle: 'Carbon fibre parts, racing levers & protection kits — engineered for high performance.',
    cta_text: 'Explore Parts',
    cta_link: '/products',
    image_url: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=1400&q=80',
  },
];

export default function HeroSlider({ setView }) {
  const [banners] = useState(HERO_BANNERS);
  const [current, setCurrent] = useState(0);
  const [autoplay, setAutoplay] = useState(true);

  const next = useCallback(() => setCurrent(c => (c + 1) % banners.length), [banners.length]);
  const prev = useCallback(() => setCurrent(c => (c - 1 + banners.length) % banners.length), [banners.length]);

  useEffect(() => {
    if (!autoplay) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [autoplay, next]);

  const banner = banners[current];

  return (
    <div
      className="relative overflow-hidden rounded-2xl min-h-[300px] sm:min-h-[320px] md:min-h-[350px] shadow-2xl border border-dark-border flex items-center"
      onMouseEnter={() => setAutoplay(false)}
      onMouseLeave={() => setAutoplay(true)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          <img
            src={banner.image_url}
            alt={banner.title}
            className="w-full h-full object-cover object-center"
          />
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/70 to-black/40 sm:to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 sm:to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="relative w-full px-5 sm:px-10 md:px-14 py-6 z-10">
        <div className="max-w-sm sm:max-w-md md:max-w-lg">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ duration: 0.45, delay: 0.05 }}
            >
              {/* Badge */}
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-brand-red/20 border border-brand-red/40 text-brand-red text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-2">
                <Zap size={10} fill="currentColor" /> MotoBlitz Exclusive
              </div>

              <h1
                className="font-racing text-2xl sm:text-3xl md:text-4xl font-extrabold text-white leading-tight mb-2"
                style={{ textShadow: '0 2px 14px rgba(0,0,0,0.9)' }}
              >
                {banner.title}
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4 max-w-xs sm:max-w-md line-clamp-2">
                {banner.subtitle}
              </p>

              <div className="flex flex-row items-center gap-2.5 sm:gap-3">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setView(banner.cta_link?.replace('/', '') || 'products')}
                  className="flex items-center gap-1.5 px-4 py-2 sm:px-5 sm:py-2.5 bg-brand-red hover:bg-brand-red-hover text-white font-bold rounded-xl text-xs sm:text-sm shadow-lg glow-red transition-all cursor-pointer shrink-0"
                >
                  <span>{banner.cta_text || 'Shop Now'}</span>
                  <ArrowRight size={13} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setView('products')}
                  className="flex items-center gap-1.5 px-3.5 py-2 sm:px-4 sm:py-2.5 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-bold rounded-xl text-xs sm:text-sm hover:bg-white/20 transition-all cursor-pointer shrink-0"
                >
                  Browse All
                </motion.button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Arrows (desktop only so mobile content has full width) */}
      {banners.length > 1 && (
        <>
          <button
            onClick={prev}
            className="hidden sm:flex absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-9 h-9 items-center justify-center rounded-full bg-black/50 backdrop-blur-sm border border-white/10 text-white hover:bg-brand-red transition-all cursor-pointer z-10"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={next}
            className="hidden sm:flex absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 w-9 h-9 items-center justify-center rounded-full bg-black/50 backdrop-blur-sm border border-white/10 text-white hover:bg-brand-red transition-all cursor-pointer z-10"
          >
            <ChevronRight size={16} />
          </button>
        </>
      )}

      {/* Dots */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
        {banners.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`transition-all duration-300 rounded-full cursor-pointer ${
              idx === current
                ? 'w-5 h-1.5 bg-brand-red'
                : 'w-1.5 h-1.5 bg-white/40 hover:bg-white/70'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
