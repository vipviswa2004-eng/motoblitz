import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingCart, Heart, Search, Menu, X, ChevronDown,
  Zap, Flame, User, LogOut, ShieldAlert
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useGarage, BIKE_MODELS } from '../../context/GarageContext';
import { useAuth } from '../../context/AuthContext';
import logoImg from '../../assets/logo.png';

export default function Navbar({ onCartOpen, onWishlistOpen, currentView, setView }) {
  const { cartCount, wishlist } = useCart();
  const { bikes, currentBike, selectedBike, selectBike, isGarageOpen, setIsGarageOpen } = useGarage();
  const { user, isAdmin, setIsLoginModalOpen, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  const navLinks = [
    { label: 'Home', view: 'home' },
    { label: 'Products', view: 'products' },
    { label: 'Flash Deals', view: 'flash-deals', highlight: true },
  ];

  return (
    <>
      {/* Sticky Navbar */}
      <motion.nav
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={`fixed top-9 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-dark-surface/95 backdrop-blur-lg border-b border-dark-border shadow-2xl'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-18 sm:h-20">
            {/* Prominent Brand Logo */}
            <button
              onClick={() => setView('home')}
              className="flex items-center gap-2.5 sm:gap-3 group shrink-0 py-1"
            >
              <div className="relative">
                <img
                  src={logoImg}
                  alt="MotoBlitz"
                  className="h-11 sm:h-13 md:h-14 w-auto max-w-[56px] sm:max-w-[65px] rounded-full object-contain border border-brand-red/40 group-hover:border-brand-red group-hover:scale-105 transition-all duration-300 shadow-[0_0_15px_rgba(229,30,43,0.4)]"
                />
                <div className="absolute inset-0 rounded-full bg-brand-red/10 blur-sm -z-10 group-hover:bg-brand-red/25 transition-colors" />
              </div>
              <div className="text-left">
                <span className="font-racing text-2xl sm:text-3xl font-extrabold tracking-wider text-white leading-none block">
                  MOTO<span className="text-brand-red">BLITZ</span>
                </span>
                <span className="text-[9px] font-bold text-brand-orange uppercase tracking-widest hidden xs:block -mt-0.5">
                  Superbike Performance
                </span>
              </div>
            </button>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map(link => (
                <button
                  key={link.view}
                  onClick={() => setView(link.view)}
                  className={`relative px-4 py-2 text-sm font-semibold tracking-wide transition-colors duration-200 rounded-md ${
                    currentView === link.view
                      ? 'text-brand-red'
                      : link.highlight
                      ? 'text-brand-orange hover:text-brand-orange/80'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {link.highlight && <Flame size={13} className="inline mr-1 -mt-0.5" />}
                  {link.label}
                  {currentView === link.view && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-red rounded-full"
                    />
                  )}
                </button>
              ))}
              {isAdmin && (
                <button
                  onClick={() => setView('admin')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold tracking-wide transition-colors duration-200 rounded-lg bg-brand-red/10 border border-brand-red/30 ${
                    currentView === 'admin' ? 'bg-brand-red text-white' : 'text-brand-red hover:bg-brand-red/20'
                  }`}
                >
                  <Zap size={12} /> Admin Cockpit
                </button>
              )}
            </div>

            {/* Right Controls */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Garage Selector */}
              <button
                onClick={() => setIsGarageOpen(true)}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-dark-card border border-dark-border hover:border-brand-orange/50 transition-all duration-200 text-xs font-semibold text-slate-300 hover:text-brand-orange group"
              >
                <span className="text-sm">{currentBike.icon}</span>
                <span className="max-w-[100px] truncate">{selectedBike === 'Universal' ? 'My Garage' : currentBike.label}</span>
                <ChevronDown size={12} className="group-hover:rotate-180 transition-transform duration-200" />
              </button>

              {/* Search */}
              <button
                onClick={() => setSearchOpen(true)}
                className="w-9 h-9 flex items-center justify-center rounded-full bg-dark-card hover:bg-dark-border transition-colors duration-200 text-slate-400 hover:text-white"
                title="Search Products"
              >
                <Search size={16} />
              </button>

              {/* Wishlist */}
              <button
                onClick={onWishlistOpen}
                className="relative flex w-9 h-9 items-center justify-center rounded-full bg-dark-card hover:bg-dark-border transition-colors duration-200 text-slate-400 hover:text-brand-orange cursor-pointer"
                title="Saved Wishlist"
              >
                <Heart size={16} className={wishlist?.length > 0 ? "text-brand-orange fill-brand-orange/40" : ""} />
                {wishlist?.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 flex items-center justify-center text-[9px] font-bold bg-brand-orange text-white rounded-full leading-none shadow-md">
                    {wishlist.length > 9 ? '9+' : wishlist.length}
                  </span>
                )}
              </button>

              {/* User Account / Google Sign-In */}
              <div className="relative">
                {user ? (
                  <button
                    onClick={() => setUserDropdownOpen(o => !o)}
                    className="flex items-center gap-1.5 p-1 pr-2 rounded-full bg-dark-card border border-dark-border hover:border-brand-red/50 transition-all text-xs font-semibold text-white cursor-pointer"
                  >
                    <img
                      src={user.avatar || '/logo.png'}
                      alt={user.name}
                      className="w-7 h-7 rounded-full object-cover border border-brand-red/40"
                    />
                    <span className="hidden lg:inline max-w-[80px] truncate">{user.name.split(' ')[0]}</span>
                    <ChevronDown size={11} className="text-slate-400" />
                  </button>
                ) : (
                  <button
                    onClick={() => setIsLoginModalOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-dark-card border border-dark-border hover:border-brand-red/50 transition-all text-xs font-bold text-slate-300 hover:text-white cursor-pointer"
                  >
                    <User size={13} className="text-brand-red" />
                    <span className="hidden sm:inline">Sign In</span>
                  </button>
                )}

                {/* User Dropdown Menu */}
                <AnimatePresence>
                  {userDropdownOpen && user && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 top-full mt-2 w-56 bg-dark-card border border-dark-border rounded-2xl p-2 shadow-2xl z-50"
                      onClick={() => setUserDropdownOpen(false)}
                    >
                      <div className="p-3 border-b border-dark-border mb-1">
                        <p className="text-xs font-bold text-white truncate">{user.name}</p>
                        <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
                        {isAdmin && (
                          <span className="inline-block mt-1 text-[9px] font-bold text-brand-red">
                            ⚡ Administrator
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => setIsGarageOpen(true)}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white hover:bg-dark-surface rounded-xl transition-colors cursor-pointer"
                      >
                        <span>🏍️</span> My Garage ({selectedBike})
                      </button>

                      <button
                        onClick={onWishlistOpen}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white hover:bg-dark-surface rounded-xl transition-colors cursor-pointer"
                      >
                        <Heart size={14} className="text-brand-orange" /> Saved Wishlist ({wishlist?.length || 0})
                      </button>

                      {isAdmin && (
                        <button
                          onClick={() => setView('admin')}
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-brand-red hover:bg-brand-red/10 rounded-xl transition-colors"
                        >
                          <Zap size={14} /> Admin Cockpit
                        </button>
                      )}

                      <button
                        onClick={() => { signOut(); }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-red-400 hover:bg-red-500/10 rounded-xl transition-colors mt-1"
                      >
                        <LogOut size={13} /> Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Cart Button */}
              <button
                onClick={onCartOpen}
                className="relative w-9 h-9 flex items-center justify-center rounded-full bg-brand-red hover:bg-brand-red-hover transition-all duration-200 text-white glow-red-sm hover:glow-red"
                title="View Cart"
              >
                <ShoppingCart size={16} />
                <AnimatePresence>
                  {cartCount > 0 && (
                    <motion.span
                      key={cartCount}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-1.5 -right-1.5 w-4.5 h-4.5 min-w-[18px] flex items-center justify-center text-[10px] font-bold bg-brand-orange text-white rounded-full leading-none px-1"
                    >
                      {cartCount > 9 ? '9+' : cartCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>

              {/* Mobile Menu */}
              <button
                className="md:hidden w-9 h-9 flex items-center justify-center rounded-full bg-dark-card text-slate-400 hover:text-white transition-colors"
                onClick={() => setMobileMenuOpen(v => !v)}
              >
                {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="md:hidden overflow-hidden bg-dark-surface border-t border-dark-border"
            >
              <div className="px-4 py-3 space-y-1">
                {navLinks.map(link => (
                  <button
                    key={link.view}
                    onClick={() => { setView(link.view); setMobileMenuOpen(false); }}
                    className={`flex items-center gap-2 w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                      currentView === link.view
                        ? 'bg-brand-red/10 text-brand-red'
                        : link.highlight
                        ? 'text-brand-orange'
                        : 'text-slate-300 hover:bg-dark-card'
                    }`}
                  >
                    {link.highlight && <Flame size={14} />}
                    {link.label}
                  </button>
                ))}
                {/* Mobile Garage Selector */}
                <button
                  onClick={() => { setIsGarageOpen(true); setMobileMenuOpen(false); }}
                  className="flex items-center gap-2 w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-300 hover:bg-dark-card transition-colors cursor-pointer"
                >
                  <span>🏍️</span> My Garage — {selectedBike === 'Universal' ? 'Select Bike' : currentBike.label}
                </button>

                {/* Mobile Wishlist */}
                <button
                  onClick={() => { onWishlistOpen(); setMobileMenuOpen(false); }}
                  className="flex items-center gap-2 w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-300 hover:bg-dark-card transition-colors cursor-pointer"
                >
                  <Heart size={15} className="text-brand-orange" /> Saved Wishlist ({wishlist?.length || 0})
                </button>

                {/* Mobile User Auth Button */}
                {user ? (
                  <div className="pt-2 border-t border-dark-border">
                    <div className="flex items-center gap-2 px-3 py-2">
                      <img src={user.avatar || '/logo.png'} alt={user.name} className="w-6 h-6 rounded-full" />
                      <span className="text-xs font-bold text-white truncate">{user.name}</span>
                    </div>
                    {isAdmin && (
                      <button
                        onClick={() => { setView('admin'); setMobileMenuOpen(false); }}
                        className="flex items-center gap-2 w-full text-left px-3 py-2 rounded-lg text-xs font-bold text-brand-red hover:bg-brand-red/10 transition-colors"
                      >
                        <Zap size={14} /> Admin Cockpit
                      </button>
                    )}
                    <button
                      onClick={() => { signOut(); setMobileMenuOpen(false); }}
                      className="flex items-center gap-2 w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      <LogOut size={13} /> Sign Out
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => { setIsLoginModalOpen(true); setMobileMenuOpen(false); }}
                    className="flex items-center gap-2 w-full text-left px-3 py-2.5 rounded-lg text-sm font-bold text-white bg-brand-red/10 border border-brand-red/30 transition-colors"
                  >
                    <User size={15} className="text-brand-red" /> Sign In with Google
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Garage Selector Modal */}
      <AnimatePresence>
        {isGarageOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm p-4"
            onClick={() => setIsGarageOpen(false)}
          >
            <motion.div
              initial={{ y: 80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 80, opacity: 0 }}
              transition={{ type: 'spring', damping: 26, stiffness: 300 }}
              className="w-full max-w-md bg-dark-card rounded-2xl border border-dark-border p-5 max-h-[80vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="font-racing text-xl font-bold text-white">🏍️ My Garage</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Select your bike to see 100% compatible parts</p>
                </div>
                <button onClick={() => setIsGarageOpen(false)} className="text-slate-400 hover:text-white">
                  <X size={20} />
                </button>
              </div>
              <div className="grid grid-cols-1 gap-2">
                {bikes.map(bike => (
                  <button
                    key={bike.value}
                    onClick={() => selectBike(bike.value)}
                    className={`flex items-center gap-3 p-3 rounded-xl border text-sm font-semibold text-left transition-all duration-200 ${
                      selectedBike === bike.value
                        ? 'border-brand-red bg-brand-red/10 text-white'
                        : 'border-dark-border bg-dark-surface hover:border-brand-orange/40 text-slate-300'
                    }`}
                  >
                    <span className="text-lg">{bike.icon}</span>
                    <span>{bike.label}</span>
                    {selectedBike === bike.value && (
                      <span className="ml-auto text-brand-red text-xs font-bold">ACTIVE</span>
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-start justify-center pt-24 bg-black/70 backdrop-blur-sm p-4"
            onClick={() => setSearchOpen(false)}
          >
            <motion.div
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -30, opacity: 0 }}
              transition={{ type: 'spring', damping: 22, stiffness: 280 }}
              className="w-full max-w-xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="relative">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  ref={searchRef}
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && searchQuery.trim()) {
                      setView('products');
                      setSearchOpen(false);
                    }
                    if (e.key === 'Escape') setSearchOpen(false);
                  }}
                  placeholder="Search exhausts, winglets, crash guards..."
                  className="w-full bg-dark-card border border-dark-border rounded-2xl pl-11 pr-12 py-4 text-white placeholder-slate-500 focus:outline-none focus:border-brand-red/60 text-sm font-medium"
                />
                <button
                  onClick={() => setSearchOpen(false)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
