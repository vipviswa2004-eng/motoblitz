import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldCheck, Zap, Bike, Loader2, LogOut, ArrowRight, UserCheck } from 'lucide-react';
import { useAuth, ADMIN_EMAIL } from '../../context/AuthContext';
import { useGarage } from '../../context/GarageContext';
import logoImg from '../../assets/logo.png';

export default function LoginModal({ setView }) {
  const {
    isLoginModalOpen,
    setIsLoginModalOpen,
    signInWithGoogle,
    user,
    isAdmin,
    signOut
  } = useAuth();
  const { selectedBike, setIsGarageOpen } = useGarage();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isLoginModalOpen) return null;

  async function handleGoogleLogin() {
    setLoading(true);
    setError(null);
    try {
      await signInWithGoogle();
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to sign in with Google');
    } finally {
      setLoading(false);
    }
  }

  function handleAdminEnter() {
    setIsLoginModalOpen(false);
    setView?.('admin');
  }

  function handleRiderGarage() {
    setIsLoginModalOpen(false);
    setIsGarageOpen(true);
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
          onClick={() => setIsLoginModalOpen(false)}
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-md bg-dark-card border border-dark-border rounded-3xl overflow-hidden shadow-2xl z-10"
          onClick={e => e.stopPropagation()}
        >
          {/* Top Racing Header Banner */}
          <div className="relative bg-gradient-to-r from-brand-red via-brand-red-dark to-brand-orange px-6 py-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={logoImg}
                alt="MotoBlitz"
                className="w-11 h-11 max-w-[44px] max-h-[44px] rounded-full border-2 border-white/40 shadow-lg object-cover shrink-0"
              />
              <div>
                <span className="font-racing text-2xl font-extrabold tracking-wider text-white block leading-none">
                  MOTO<span className="text-white/95">BLITZ</span>
                </span>
                <p className="text-[10px] text-white/85 uppercase font-bold tracking-widest mt-0.5">
                  {user ? (isAdmin ? 'Admin Console' : 'Rider Account') : 'Authentication'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsLoginModalOpen(false)}
              className="w-8 h-8 rounded-full bg-black/30 text-white hover:bg-black/50 flex items-center justify-center transition-colors shrink-0 cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>

          <div className="p-6 sm:p-7">
            {user ? (
              /* ─── AFTER GOOGLE LOGIN: ROLE-BASED ACCESS SCREEN ─── */
              <div className="space-y-5">
                {/* User Profile Card */}
                <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-dark-surface border border-dark-border">
                  <img
                    src={user.avatar || logoImg}
                    alt={user.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-brand-red shrink-0 shadow-md"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-racing text-lg font-bold text-white truncate leading-tight">
                      {user.name}
                    </p>
                    <p className="text-xs text-slate-400 truncate">{user.email}</p>
                    {isAdmin ? (
                      <span className="inline-flex items-center gap-1 mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-brand-red/20 text-brand-red border border-brand-red/40">
                        <Zap size={10} fill="currentColor" /> Verified Administrator
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-brand-orange/20 text-brand-orange border border-brand-orange/40">
                        <Bike size={10} /> Verified Customer / Rider
                      </span>
                    )}
                  </div>
                </div>

                {/* ─── SCENARIO 1: ADMIN ROLE (viswakumar2004@gmail.com) ─── */}
                {isAdmin ? (
                  <div className="space-y-3">
                    <div className="p-3.5 rounded-2xl bg-brand-red/10 border border-brand-red/30">
                      <p className="text-xs font-bold text-brand-red uppercase tracking-wider mb-1 flex items-center gap-1.5">
                        <Zap size={12} /> Logged in as Admin ({user.name})
                      </p>
                      <p className="text-xs text-slate-300">
                        You have full access to manage products, orders, banners, and analytics.
                      </p>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={handleAdminEnter}
                      className="w-full flex items-center justify-between px-5 py-3.5 bg-brand-red hover:bg-brand-red-hover text-white font-bold rounded-xl text-sm glow-red shadow-xl transition-all cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <Zap size={16} /> Access Admin Cockpit
                      </span>
                      <ArrowRight size={16} />
                    </motion.button>
                  </div>
                ) : (
                  /* ─── SCENARIO 2: CUSTOMER / RIDER ROLE (ALL OTHER EMAILS) ─── */
                  <div className="space-y-3">
                    <div className="p-3.5 rounded-2xl bg-dark-surface border border-brand-orange/30">
                      <p className="text-xs font-bold text-brand-orange uppercase tracking-wider mb-1 flex items-center gap-1.5">
                        <Bike size={12} /> Logged in as Customer / Rider ({user.name})
                      </p>
                      <p className="text-xs text-slate-300">
                        Your garage and preferences are synced with <span className="text-white font-semibold">{user.email}</span>.
                      </p>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={handleRiderGarage}
                      className="w-full flex items-center justify-between px-5 py-3.5 bg-dark-surface hover:bg-dark-border border border-brand-orange/40 text-brand-orange hover:text-white font-bold rounded-xl text-sm transition-all cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <span>🏍️</span> Select / Manage My Garage ({selectedBike})
                      </span>
                      <ArrowRight size={15} />
                    </motion.button>
                  </div>
                )}

                {/* Bottom Actions */}
                <div className="pt-2 flex gap-3">
                  <button
                    onClick={() => setIsLoginModalOpen(false)}
                    className="flex-1 py-3 rounded-xl bg-dark-surface border border-dark-border text-white text-xs font-bold hover:bg-dark-border transition-colors cursor-pointer"
                  >
                    Continue Shopping
                  </button>
                  <button
                    onClick={() => { signOut(); }}
                    className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold hover:bg-red-500/20 transition-colors cursor-pointer"
                  >
                    <LogOut size={13} /> Sign Out
                  </button>
                </div>
              </div>
            ) : (
              /* ─── BEFORE LOGIN: CLEAN GOOGLE OAUTH ONLY ─── */
              <div className="space-y-5">
                <div className="text-center mb-6">
                  <h3 className="font-racing text-2xl font-bold text-white tracking-wide">
                    SIGN IN TO MOTOBLITZ ⚡
                  </h3>
                  <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                    Sign in with Google to access your garage, track orders, and unlock fast WhatsApp checkout.
                  </p>
                </div>

                {error && (
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium text-center">
                    {error}
                  </div>
                )}

                {/* Primary Google OAuth Sign-In Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleGoogleLogin}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-3 py-4 px-5 rounded-2xl bg-white hover:bg-slate-100 text-gray-900 font-bold text-sm shadow-xl transition-all disabled:opacity-60 cursor-pointer"
                >
                  {loading ? (
                    <Loader2 size={18} className="animate-spin text-gray-700" />
                  ) : (
                    <svg viewBox="0 0 24 24" className="w-5 h-5 shrink-0">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                  )}
                  <span>Continue with Google</span>
                </motion.button>

                {/* Security and role notice */}
                <div className="pt-3 text-center space-y-1.5">
                  <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
                    <ShieldCheck size={13} className="text-green-400 shrink-0" />
                    <span>Secure 256-bit OAuth authentication via Supabase</span>
                  </div>
                  <p className="text-[10px] text-slate-500">
                    Your account is protected with secure OAuth login
                  </p>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
