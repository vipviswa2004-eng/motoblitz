import React from 'react';
import { motion } from 'framer-motion';
import { Truck, Shield, RefreshCw, Headphones, Zap } from 'lucide-react';
import HeroSlider from '../components/home/HeroSlider';
import CategoryGrid from '../components/home/CategoryGrid';
import FlashDeals from '../components/home/FlashDeals';
import ProductCard from '../components/home/ProductCard';
import { useProducts } from '../context/ProductContext';
import { DEFAULT_WHATSAPP_NUMBER } from '../lib/whatsapp';

const trustBadges = [
  { icon: Truck, title: 'Free Shipping', desc: 'On orders above ₹999', color: 'text-brand-red' },
  { icon: Shield, title: 'Genuine Parts', desc: '100% quality checked', color: 'text-brand-orange' },
  { icon: RefreshCw, title: '7-Day Returns', desc: 'Hassle-free guarantee', color: 'text-brand-red' },
  { icon: Headphones, title: 'WhatsApp Support', desc: 'Direct personal help', color: 'text-brand-orange' },
];

export default function HomePage({ setView, onProductClick }) {
  const { getFeatured } = useProducts();
  const featuredProducts = getFeatured();
  const whatsappLink = `https://wa.me/${DEFAULT_WHATSAPP_NUMBER}?text=${encodeURIComponent('Hi MotoBlitz! I want to know more about your products.')}`;

  return (
    <div>
      {/* Hero Slider */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-3 sm:pt-4">
        <HeroSlider setView={setView} />
      </div>

      {/* Trust Badges */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {trustBadges.map((badge, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08 }}
              className="flex items-center gap-3 p-3.5 sm:p-4 rounded-xl bg-dark-card border border-dark-border hover:border-brand-red/30 transition-all"
            >
              <div className={`w-10 h-10 rounded-xl bg-dark-surface flex items-center justify-center shrink-0 ${badge.color}`}>
                <badge.icon size={18} />
              </div>
              <div>
                <p className="text-sm font-bold text-white leading-tight">{badge.title}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">{badge.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Categories */}
      <CategoryGrid setView={setView} />

      {/* Flash Deals */}
      <FlashDeals setView={setView} onProductClick={onProductClick} />

      {/* Featured Products */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="font-racing text-2xl sm:text-3xl font-bold text-white tracking-wide">
                FEATURED <span className="text-brand-red">PRODUCTS</span>
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

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {featuredProducts.map(product => (
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

      {/* WhatsApp CTA Section */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-2xl p-8 sm:p-12 text-center"
          style={{ background: 'linear-gradient(135deg, #E51E2B 0%, #B8131D 40%, #0A0B0E 100%)' }}
        >
          {/* Background Bike Silhouette */}
          <div className="absolute right-0 top-0 bottom-0 opacity-5 text-[200px] font-bold text-white flex items-center overflow-hidden select-none">
            🏍️
          </div>

          <div className="relative">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-bold uppercase tracking-wider mb-4">
              <Zap size={10} fill="currentColor" /> Instant Response
            </span>
            <h2 className="font-racing text-3xl sm:text-4xl font-bold text-white mb-3 tracking-wide">
              NEED HELP CHOOSING THE RIGHT PART?
            </h2>
            <p className="text-white/70 text-sm sm:text-base max-w-md mx-auto mb-8">
              Chat directly with our team on WhatsApp. We'll help you find the perfect fit for your bike — instantly!
            </p>
            <motion.a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-3 px-8 py-4 bg-white text-brand-red font-bold rounded-xl text-sm shadow-2xl hover:shadow-white/20 transition-all"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current text-green-500">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Chat on WhatsApp Now
            </motion.a>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
