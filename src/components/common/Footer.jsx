import React from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Zap, ArrowRight } from 'lucide-react';
import { DEFAULT_WHATSAPP_NUMBER } from '../../lib/whatsapp';
import logoImg from '../../assets/logo.png';

const footerLinks = {
  shop: [
    { label: 'All Products', view: 'products' },
    { label: 'Flash Deals', view: 'flash-deals' },
    { label: 'Exhausts & Slipons', view: 'products' },
    { label: 'Crash Protection', view: 'products' },
    { label: 'LED Lighting', view: 'products' },
    { label: 'Riding Gear', view: 'products' },
  ],
  help: [
    { label: 'Track My Order', view: 'home' },
    { label: 'Shipping Policy', view: 'home' },
    { label: 'Return & Refund', view: 'home' },
    { label: 'Contact Us', view: 'home' },
  ],
};

export default function Footer({ setView }) {
  const whatsappLink = `https://wa.me/${DEFAULT_WHATSAPP_NUMBER.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('Hi MotoBlitz! I need help with...')}`;

  return (
    <footer className="bg-dark-surface border-t border-dark-border mt-24">
      {/* Top CTA Banner */}
      <div className="bg-gradient-to-r from-brand-red via-brand-red to-brand-orange/80 py-10 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="font-racing text-2xl md:text-3xl font-bold text-white tracking-wide">
              HAVE A QUESTION? CHAT DIRECTLY ON WHATSAPP
            </h2>
            <p className="text-white/80 text-sm mt-1">
              Get instant help on fitment, ordering, or anything — we reply fast! ⚡
            </p>
          </div>
          <motion.a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="shrink-0 flex items-center gap-3 px-7 py-3.5 bg-white text-brand-red rounded-xl font-bold text-sm shadow-lg hover:shadow-xl transition-all"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current text-green-500">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            WhatsApp Us Now
            <ArrowRight size={15} />
          </motion.a>
        </div>
      </div>

      {/* Main Footer Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Brand */}
        <div className="col-span-1 sm:col-span-2 lg:col-span-1">
          <div className="flex items-center gap-3.5 mb-4">
            <div className="relative">
              <img
                src={logoImg}
                alt="MotoBlitz"
                className="h-13 sm:h-15 w-auto max-w-[65px] rounded-full object-contain border border-brand-red/40 shadow-[0_0_15px_rgba(229,30,43,0.35)]"
              />
            </div>
            <div>
              <span className="font-racing text-2xl sm:text-3xl font-extrabold tracking-widest text-white block">
                MOTO<span className="text-brand-red">BLITZ</span>
              </span>
              <span className="text-[10px] text-brand-orange font-bold uppercase tracking-widest block -mt-0.5">
                Performance Store
              </span>
            </div>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed mb-5">
            India's go-to destination for premium motorcycle accessories. Genuine fitment, fast dispatch, rider-tested quality.
          </p>
          <div className="flex gap-3">
            <motion.a
              href="https://www.instagram.com/moto_blitz_97"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1, y: -2 }}
              className="w-9 h-9 flex items-center justify-center rounded-lg bg-dark-card border border-dark-border hover:border-brand-red/50 text-slate-400 hover:text-brand-red transition-all"
              title="Instagram"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </motion.a>
            <motion.a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1, y: -2 }}
              className="w-9 h-9 flex items-center justify-center rounded-lg bg-dark-card border border-dark-border hover:border-brand-red/50 text-slate-400 hover:text-brand-red transition-all"
              title="YouTube"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </motion.a>
          </div>
        </div>

        {/* Shop Links */}
        <div>
          <h3 className="font-racing font-bold text-white tracking-wide mb-4 flex items-center gap-2">
            <Zap size={14} className="text-brand-red" /> SHOP
          </h3>
          <ul className="space-y-2.5">
            {footerLinks.shop.map(link => (
              <li key={link.label}>
                <button
                  onClick={() => setView(link.view)}
                  className="text-sm text-slate-400 hover:text-brand-orange transition-colors"
                >
                  {link.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Help Links */}
        <div>
          <h3 className="font-racing font-bold text-white tracking-wide mb-4 flex items-center gap-2">
            <Zap size={14} className="text-brand-red" /> HELP
          </h3>
          <ul className="space-y-2.5">
            {footerLinks.help.map(link => (
              <li key={link.label}>
                <button
                  onClick={() => setView(link.view)}
                  className="text-sm text-slate-400 hover:text-brand-orange transition-colors"
                >
                  {link.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-racing font-bold text-white tracking-wide mb-4 flex items-center gap-2">
            <Zap size={14} className="text-brand-red" /> CONTACT
          </h3>
          <ul className="space-y-3">
            <li>
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-sm text-slate-400 hover:text-brand-orange transition-colors group">
                <Phone size={14} className="text-brand-red group-hover:text-brand-orange shrink-0" />
                +91 93423 10194
              </a>
            </li>
            <li>
              <a href="mailto:viswakumar2004@gmail.com"
                className="flex items-center gap-2.5 text-sm text-slate-400 hover:text-brand-orange transition-colors group">
                <Mail size={14} className="text-brand-red group-hover:text-brand-orange shrink-0" />
                motoblitz@gmail.com
              </a>
            </li>
            <li>
              <span className="flex items-start gap-2.5 text-sm text-slate-400">
                <MapPin size={14} className="text-brand-red mt-0.5 shrink-0" />
                Tamil Nadu, India
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* Chequered divider */}
      <div className="chequered-pattern h-3 opacity-30" />

      {/* Bottom bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-xs text-slate-600 text-center">
          © {new Date().getFullYear()} MotoBlitz. All rights reserved. Built for riders, by riders. 🏍️
        </p>
        <p className="text-xs text-slate-700">
          Made with ❤️ in Tamil Nadu
        </p>
      </div>
    </footer>
  );
}
