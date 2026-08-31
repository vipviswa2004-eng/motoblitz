import React, { useState, useEffect, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';

import { CartProvider } from './context/CartContext';
import { GarageProvider } from './context/GarageContext';
import { AuthProvider } from './context/AuthContext';
import { ProductProvider } from './context/ProductContext';

import Preloader from './components/common/Preloader';
import Navbar from './components/common/Navbar';
import AnnouncementBar from './components/common/AnnouncementBar';
import Footer from './components/common/Footer';
import CartDrawer from './components/cart/CartDrawer';
import WishlistDrawer from './components/cart/WishlistDrawer';
import WhatsAppCheckoutModal from './components/cart/WhatsAppCheckoutModal';
import ProductDetailModal from './components/product/ProductDetailModal';
import AdminLayout from './components/admin/AdminLayout';
import LoginModal from './components/common/LoginModal';
import HomePage from './pages/HomePage';
import ProductsPage from './components/product/ProductsPage';

// Scroll progress tachometer indicator
function ScrollProgressBar() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const handleScroll = () => {
      const el = document.documentElement;
      const scrollTop = el.scrollTop || document.body.scrollTop;
      const scrollHeight = el.scrollHeight - el.clientHeight;
      setProgress(scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed top-9 left-0 right-0 z-[55] h-0.5 bg-transparent pointer-events-none">
      <div
        className="h-full transition-all duration-100"
        style={{
          width: `${progress}%`,
          background: 'linear-gradient(90deg, #E51E2B, #FF6E1A)',
        }}
      />
    </div>
  );
}

// Floating WhatsApp button
function FloatingWhatsApp() {
  const link = `https://wa.me/919342310194?text=${encodeURIComponent('Hi MotoBlitz! I need help with a product.')}`;
  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-20 right-4 sm:bottom-6 z-40 w-13 h-13 flex items-center justify-center rounded-full shadow-2xl transition-all hover:scale-110"
      style={{ background: '#25D366', width: 52, height: 52 }}
      title="Chat on WhatsApp"
    >
      <svg viewBox="0 0 24 24" className="w-7 h-7 fill-white">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    </a>
  );
}

// Mobile bottom nav bar for quick navigation
function MobileBottomNav({ currentView, setView, onCartOpen, cartCount }) {
  const tabs = [
    { id: 'home', icon: '🏠', label: 'Home' },
    { id: 'products', icon: '🏍️', label: 'Shop' },
    { id: 'flash-deals', icon: '⚡', label: 'Deals' },
    { id: 'cart', icon: '🛒', label: 'Cart', badge: cartCount },
  ];

  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-dark-surface/95 backdrop-blur-lg border-t border-dark-border">
      <div className="flex items-center justify-around h-14">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => tab.id === 'cart' ? onCartOpen() : setView(tab.id)}
            className={`relative flex flex-col items-center gap-0.5 px-3 py-2 transition-all ${
              currentView === tab.id ? 'text-brand-red' : 'text-slate-500'
            }`}
          >
            <span className="text-lg leading-none">{tab.icon}</span>
            <span className="text-[9px] font-bold tracking-wide">{tab.label}</span>
            {tab.badge > 0 && (
              <span className="absolute top-1 right-1.5 w-4 h-4 flex items-center justify-center bg-brand-red text-white text-[9px] font-bold rounded-full">
                {tab.badge > 9 ? '9+' : tab.badge}
              </span>
            )}
            {currentView === tab.id && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-brand-red rounded-full" />
            )}
          </button>
        ))}
      </div>
    </nav>
  );
}

export default function App() {
  const [showPreloader, setShowPreloader] = useState(() => !sessionStorage.getItem('mb_loaded'));
  const [currentView, setCurrentView] = useState('home');
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handlePreloaderComplete = useCallback(() => {
    sessionStorage.setItem('mb_loaded', '1');
    setShowPreloader(false);
  }, []);

  const handleCheckout = useCallback(() => {
    setCartOpen(false);
    setTimeout(() => setCheckoutOpen(true), 200);
  }, []);

  if (showPreloader) {
    return <Preloader onComplete={handlePreloaderComplete} />;
  }

  return (
    <AuthProvider>
      <ProductProvider>
        <GarageProvider>
          <CartProvider>
            {currentView === 'admin' ? (
              <AdminLayout onBackToStore={() => setCurrentView('home')} />
            ) : (
              <div className="min-h-screen bg-dark-base">
                <ScrollProgressBar />
                <AnnouncementBar />
                <Navbar
                  onCartOpen={() => setCartOpen(true)}
                  onWishlistOpen={() => setWishlistOpen(true)}
                  currentView={currentView}
                  setView={setCurrentView}
                />

                <main className="pt-[116px] pb-20 sm:pb-0">
                  <AnimatePresence mode="wait">
                    {currentView === 'home' && (
                      <HomePage
                        key="home"
                        setView={setCurrentView}
                        onProductClick={setSelectedProduct}
                      />
                    )}
                    {(currentView === 'products' || currentView === 'flash-deals') && (
                      <ProductsPage
                        key="products"
                        onProductClick={setSelectedProduct}
                      />
                    )}
                  </AnimatePresence>
                </main>

                <Footer setView={setCurrentView} />

                <MobileBottomNav
                  currentView={currentView}
                  setView={setCurrentView}
                  onCartOpen={() => setCartOpen(true)}
                  cartCount={0}
                />

                <FloatingWhatsApp />

                <CartDrawer
                  isOpen={cartOpen}
                  onClose={() => setCartOpen(false)}
                  onCheckout={handleCheckout}
                />

                <WishlistDrawer
                  isOpen={wishlistOpen}
                  onClose={() => setWishlistOpen(false)}
                  onProductClick={setSelectedProduct}
                />

                <WhatsAppCheckoutModal
                  isOpen={checkoutOpen}
                  onClose={() => setCheckoutOpen(false)}
                />

                <LoginModal setView={setCurrentView} />

                {selectedProduct && (
                  <ProductDetailModal
                    product={selectedProduct}
                    onClose={() => setSelectedProduct(null)}
                    onOrderClick={() => {
                      setSelectedProduct(null);
                      setTimeout(() => setCheckoutOpen(true), 200);
                    }}
                  />
                )}
              </div>
            )}
          </CartProvider>
        </GarageProvider>
      </ProductProvider>
    </AuthProvider>
  );
}
