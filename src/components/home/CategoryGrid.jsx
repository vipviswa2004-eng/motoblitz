import React from 'react';
import { motion } from 'framer-motion';
import { Flame, Wind, Shield, Zap, Shirt, Palette, Tag } from 'lucide-react';
import { useProducts } from '../../context/ProductContext';

const iconMap = {
  Flame, Wind, Shield, Zap, Shirt, Palette, Tag
};

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

export default function CategoryGrid({ setView }) {
  const { categories } = useProducts();

  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Heading */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-racing text-2xl sm:text-3xl font-bold text-white tracking-wide">
              SHOP BY <span className="text-brand-red">CATEGORY</span>
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <div className="h-0.5 w-10 bg-brand-red rounded-full" />
              <div className="h-0.5 w-4 bg-brand-orange rounded-full" />
            </div>
          </div>
          <button
            onClick={() => setView('products')}
            className="text-xs font-bold text-brand-orange hover:text-brand-red transition-colors"
          >
            View All →
          </button>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4"
        >
          {categories.map((cat) => {
            const Icon = iconMap[cat.icon_name] || Flame;
            return (
              <motion.button
                key={cat.id}
                variants={item}
                whileHover={{ y: -5, scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setView('products')}
                className="group relative flex flex-col items-center gap-3 p-4 rounded-2xl bg-dark-card border border-dark-border hover:border-brand-red/50 transition-all duration-300 overflow-hidden"
              >
                {/* BG image */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300">
                  <img src={cat.image_url} alt={cat.name} className="w-full h-full object-cover" />
                </div>

                {/* Icon */}
                <div className="relative w-12 h-12 flex items-center justify-center rounded-xl bg-brand-red/10 border border-brand-red/20 group-hover:bg-brand-red/20 group-hover:border-brand-red/50 group-hover:glow-red-sm transition-all duration-300">
                  <Icon size={22} className="text-brand-red group-hover:text-brand-orange transition-colors duration-300" />
                </div>

                <span className="relative text-xs font-bold text-slate-300 group-hover:text-white transition-colors text-center leading-tight">
                  {cat.name}
                </span>

                {/* Bottom line */}
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-red scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center" />
              </motion.button>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
