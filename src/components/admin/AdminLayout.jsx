import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Package, ShoppingCart, Image,
  LogOut, Menu, X, Zap, ChevronRight, Tag, Bike
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import AdminDashboard from './AdminDashboard';
import AdminProducts from './AdminProducts';
import AdminOrders from './AdminOrders';
import AdminBanners from './AdminBanners';
import AdminCategories from './AdminCategories';
import AdminBikeModels from './AdminBikeModels';
import logoImg from '../../assets/logo.png';

const sidebarLinks = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'products', label: 'Products', icon: Package },
  { id: 'categories', label: 'Categories', icon: Tag },
  { id: 'bike-models', label: 'Bike Models', icon: Bike },
  { id: 'orders', label: 'Orders', icon: ShoppingCart },
  { id: 'banners', label: 'Banners', icon: Image },
];

export default function AdminLayout({ onBackToStore }) {
  const { user, signOut, isAdmin, ADMIN_EMAIL, signInWithGoogle } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [autoOpenAddProduct, setAutoOpenAddProduct] = useState(false);

  // Admin guard: if logged in but not admin
  if (user && !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-base px-4">
        <div className="text-center max-w-sm bg-dark-card border border-dark-border rounded-3xl p-8">
          <div className="w-16 h-16 rounded-full bg-brand-red/20 border border-brand-red/40 flex items-center justify-center mx-auto mb-4">
            <Zap size={28} className="text-brand-red" />
          </div>
          <h2 className="font-racing text-2xl font-bold text-white mb-2">ACCESS RESTRICTED</h2>
          <p className="text-slate-400 text-xs mb-6">
            Admin access is restricted to <span className="text-brand-orange font-bold">{ADMIN_EMAIL}</span>
          </p>
          <div className="flex gap-2">
            <button
              onClick={onBackToStore}
              className="flex-1 py-2.5 bg-dark-surface border border-dark-border text-white rounded-xl font-bold text-xs hover:bg-dark-border transition-colors"
            >
              Back to Store
            </button>
            <button
              onClick={() => { signOut(); }}
              className="flex-1 py-2.5 bg-brand-red text-white rounded-xl font-bold text-xs hover:bg-brand-red-hover transition-colors"
            >
              Switch Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  // If not logged in at all, show admin login screen
  if (!user) {
    return <AdminLogin onBackToStore={onBackToStore} />;
  }

  function handleTriggerAddProduct() {
    setActiveTab('products');
    setAutoOpenAddProduct(true);
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <AdminDashboard
            onAddProduct={handleTriggerAddProduct}
            onNavigate={(tab) => setActiveTab(tab)}
          />
        );
      case 'products':
        return (
          <AdminProducts
            autoOpenAdd={autoOpenAddProduct}
            onAddClosed={() => setAutoOpenAddProduct(false)}
          />
        );
      case 'categories':
        return <AdminCategories />;
      case 'bike-models':
        return <AdminBikeModels />;
      case 'orders':
        return <AdminOrders />;
      case 'banners':
        return <AdminBanners />;
      default:
        return (
          <AdminDashboard
            onAddProduct={handleTriggerAddProduct}
            onNavigate={(tab) => setActiveTab(tab)}
          />
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-dark-base flex overflow-hidden">
      {/* Sidebar Backdrop (mobile) */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-72 bg-dark-surface border-r border-dark-border flex flex-col shrink-0 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 lg:z-auto ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-5 border-b border-dark-border">
          <div className="flex items-center gap-3">
            <img src={logoImg} alt="MotoBlitz" className="w-11 h-11 rounded-full border border-brand-red/50 shadow-[0_0_12px_rgba(229,30,43,0.35)] object-cover" />
            <div>
              <span className="font-racing text-xl font-extrabold text-white tracking-wider">
                MOTO<span className="text-brand-red">BLITZ</span>
              </span>
              <p className="text-[9px] text-brand-orange font-bold uppercase tracking-widest -mt-0.5">Admin Cockpit</p>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="text-slate-400 hover:text-white lg:hidden">
            <X size={18} />
          </button>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
          {sidebarLinks.map(link => (
            <button
              key={link.id}
              onClick={() => { setActiveTab(link.id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                activeTab === link.id
                  ? 'bg-brand-red/10 border border-brand-red/30 text-brand-red glow-red-sm'
                  : 'text-slate-400 hover:bg-dark-card hover:text-white'
              }`}
            >
              <link.icon size={17} />
              {link.label}
              {activeTab === link.id && <ChevronRight size={13} className="ml-auto" />}
            </button>
          ))}
        </nav>

        {/* User Info & Actions */}
        <div className="p-4 border-t border-dark-border space-y-2">
          <div className="p-3 rounded-xl bg-dark-card border border-dark-border flex items-center gap-2.5">
            <img
              src={user.avatar || '/logo.png'}
              alt={user.name}
              className="w-8 h-8 rounded-full object-cover border border-brand-red/40"
            />
            <div className="min-w-0">
              <p className="text-xs font-bold text-white truncate">{user.name}</p>
              <p className="text-[9px] text-brand-orange font-bold">Administrator</p>
            </div>
          </div>
          <button
            onClick={() => onBackToStore()}
            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-300 hover:bg-dark-card hover:text-white transition-colors cursor-pointer"
          >
            <Zap size={14} className="text-brand-orange" /> Back to Store
          </button>
          <button
            onClick={() => { signOut(); onBackToStore(); }}
            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
          >
            <LogOut size={14} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-dark-surface/90 backdrop-blur-lg border-b border-dark-border px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl bg-dark-card text-slate-400 hover:text-white border border-dark-border"
            >
              <Menu size={18} />
            </button>
            <div>
              <h1 className="font-racing font-bold text-white text-lg tracking-wide capitalize">
                {activeTab === 'dashboard' ? '⚡ Dashboard & Analytics' :
                 activeTab === 'products' ? '📦 Products & Inventory' :
                 activeTab === 'categories' ? '🗂️ Category Management' :
                 activeTab === 'bike-models' ? '🏍️ Compatible Bike Models' :
                 activeTab === 'orders' ? '🛒 WhatsApp Orders' : '🖼 Banners & Offers'}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToStore}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-dark-card border border-dark-border text-xs font-bold text-slate-300 hover:text-white hover:border-brand-orange/40 transition-colors"
            >
              Store Preview ↗
            </button>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/10 border border-green-500/30 text-green-400 text-xs font-bold">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span>Live Mode</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

function AdminLogin({ onBackToStore }) {
  const { signInWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);

  async function handleGoogleSignIn() {
    setLoading(true);
    try {
      await signInWithGoogle();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-base px-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <div className="bg-dark-card border border-dark-border rounded-3xl p-8 text-center shadow-2xl">
          <img src={logoImg} alt="MotoBlitz" className="w-16 h-16 rounded-full mx-auto mb-4 border-2 border-brand-red/50 shadow-lg object-cover" />
          <h1 className="font-racing text-2xl font-bold text-white mb-1">ADMIN COCKPIT</h1>
          <p className="text-xs text-slate-400 mb-6">Sign in with your Google account</p>

          <div className="p-3.5 rounded-2xl bg-dark-surface border border-brand-orange/30 text-xs text-brand-orange font-bold mb-6">
            Authorized Admins: <span className="text-white block mt-1 font-mono text-[11px]">viswakumar2004@gmail.com<br />maxthvel@gmail.com</span>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-3.5 bg-white text-gray-900 font-bold rounded-xl text-sm hover:bg-gray-100 shadow-xl transition-all disabled:opacity-60 cursor-pointer"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-gray-400 border-t-gray-900 rounded-full animate-spin" />
            ) : (
              <svg viewBox="0 0 24 24" className="w-5 h-5">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            )}
            <span>Sign in with Google</span>
          </motion.button>

          <button onClick={onBackToStore} className="mt-5 text-xs text-slate-500 hover:text-slate-300 transition-colors">
            ← Back to Store
          </button>
        </div>
      </motion.div>
    </div>
  );
}
