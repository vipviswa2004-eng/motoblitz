import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Phone, MapPin, Bike, MessageSquare, Loader2, CheckCircle, ChevronDown } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useGarage, BIKE_MODELS } from '../../context/GarageContext';
import { useAuth } from '../../context/AuthContext';
import { createOrder } from '../../lib/supabase';
import { getWhatsAppOrderUrl } from '../../lib/whatsapp';

export default function WhatsAppCheckoutModal({ isOpen, onClose }) {
  const { items, cartTotal, clearCart } = useCart();
  const { bikes, selectedBike } = useGarage();
  const { user } = useAuth();
  const [step, setStep] = useState('form'); // 'form' | 'loading' | 'success'

  const [form, setForm] = useState({
    name: user?.name || '',
    phone: '',
    bikeModel: selectedBike !== 'Universal' ? selectedBike : '',
    address: '',
    pincode: '',
    paymentPreference: 'GPay / PhonePe / UPI',
    notes: '',
  });

  React.useEffect(() => {
    if (user?.name && !form.name) {
      setForm(f => ({ ...f, name: user.name }));
    }
  }, [user]);
  const [errors, setErrors] = useState({});

  const paymentOptions = [
    'GPay / PhonePe / UPI',
    'Bank Transfer (NEFT/IMPS)',
    'Cash on Delivery (COD)',
    'Pay on Pickup',
  ];

  const [generatedUrl, setGeneratedUrl] = useState('');

  function validate() {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!form.phone.trim() || !/^[6-9]\d{9}$/.test(form.phone.trim())) {
      newErrors.phone = 'Enter a valid 10-digit mobile number';
    }
    if (!form.address.trim()) newErrors.address = 'Delivery address is required';
    if (!form.pincode.trim() || !/^\d{6}$/.test(form.pincode.trim())) {
      newErrors.pincode = 'Enter a valid 6-digit pincode';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    setStep('loading');

    const generatedCode = `MB-${Math.floor(10000 + Math.random() * 90000)}`;

    const whatsappUrl = getWhatsAppOrderUrl({
      orderCode: generatedCode,
      customerName: form.name.trim(),
      customerPhone: form.phone.trim(),
      bikeModel: form.bikeModel || 'Universal / Not Specified',
      address: form.address.trim(),
      pincode: form.pincode.trim(),
      items: items.map(i => ({
        name: i.name,
        quantity: i.quantity,
        price: i.sale_price || i.price,
      })),
      totalAmount: cartTotal,
      notes: form.notes,
      paymentPreference: form.paymentPreference,
    });

    setGeneratedUrl(whatsappUrl);

    // Save order in background
    try {
      const orderItems = items.map(item => ({
        product_id: item.id,
        product_name: item.name,
        product_image: item.images?.[0] || '',
        quantity: item.quantity,
        unit_price: item.sale_price || item.price,
        total_price: (item.sale_price || item.price) * item.quantity,
      }));

      createOrder({
        order_code: generatedCode,
        customer_name: form.name,
        customer_phone: form.phone,
        bike_model: form.bikeModel || 'Universal',
        shipping_address: form.address,
        pincode: form.pincode,
        total_amount: cartTotal,
        payment_method: form.paymentPreference,
        notes: form.notes,
      }, orderItems).catch(err => console.warn('Local background order save:', err));
    } catch (e) {
      console.warn('Order background process:', e);
    }

    setStep('success');

    // Try automatic redirect/open
    try {
      window.open(whatsappUrl, '_blank');
    } catch {}
  }

  function handleFinishOrder() {
    clearCart();
    onClose();
    setStep('form');
    setForm({ name: '', phone: '', bikeModel: '', address: '', pincode: '', paymentPreference: 'GPay / PhonePe / UPI', notes: '' });
  }

  function setField(key, value) {
    setForm(f => ({ ...f, [key]: value }));
    if (errors[key]) setErrors(e => ({ ...e, [key]: undefined }));
  }

  const inputClass = (field) =>
    `w-full bg-dark-base border rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 outline-none transition-all focus:border-brand-red/60 ${
      errors[field] ? 'border-red-500/60' : 'border-dark-border focus:ring-1 focus:ring-brand-red/30'
    }`;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 26, stiffness: 280 }}
            className="fixed bottom-0 left-0 right-0 sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:bottom-auto z-[100] w-full sm:max-w-lg bg-dark-card sm:rounded-2xl rounded-t-3xl border border-dark-border max-h-[95vh] sm:max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            {/* Success State */}
            <AnimatePresence mode="wait">
              {step === 'success' && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-10 px-6 sm:px-8 gap-5 text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', damping: 14 }}
                    className="w-16 h-16 rounded-full bg-green-500/20 border border-green-500/40 flex items-center justify-center text-green-400"
                  >
                    <CheckCircle size={36} />
                  </motion.div>

                  <div>
                    <h3 className="font-racing text-2xl font-bold text-white mb-1">
                      Order Details Ready! 🏍️⚡
                    </h3>
                    <p className="text-slate-400 text-xs max-w-sm mx-auto">
                      Tap below to send your pre-formatted order directly to our MotoBlitz WhatsApp team for instant confirmation.
                    </p>
                  </div>

                  {/* Big Primary WhatsApp Button */}
                  <a
                    href={generatedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handleFinishOrder}
                    className="w-full flex items-center justify-center gap-3 py-4 bg-green-600 hover:bg-green-500 text-white font-bold rounded-2xl text-sm shadow-xl shadow-green-600/30 transition-all cursor-pointer group"
                  >
                    <MessageSquare size={18} className="group-hover:scale-110 transition-transform" />
                    <span>Send Order on WhatsApp Now →</span>
                  </a>

                  <button
                    onClick={handleFinishOrder}
                    className="text-xs text-slate-400 hover:text-white transition-colors cursor-pointer py-1"
                  >
                    Done & Close
                  </button>
                </motion.div>
              )}

              {step === 'loading' && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-20 gap-4"
                >
                  <Loader2 size={32} className="animate-spin text-brand-red" />
                  <p className="text-slate-400 text-sm font-medium">Processing your order...</p>
                </motion.div>
              )}

              {step === 'form' && (
                <motion.div key="form">
                  {/* Header */}
                  <div className="flex items-center justify-between p-5 border-b border-dark-border">
                    <div>
                      <h2 className="font-racing text-xl font-bold text-white">PLACE YOUR ORDER</h2>
                      <p className="text-xs text-slate-400 mt-0.5">We'll confirm via WhatsApp ⚡</p>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-white">
                      <X size={20} />
                    </button>
                  </div>

                  {/* Cart Summary */}
                  <div className="px-5 py-3 bg-dark-surface border-b border-dark-border">
                    <p className="text-xs text-slate-400 mb-2">
                      {items.length} item{items.length !== 1 ? 's' : ''} · Total:{' '}
                      <span className="text-white font-bold text-sm">₹{cartTotal.toLocaleString('en-IN')}</span>
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {items.slice(0, 3).map(item => (
                        <div key={item.id} className="flex items-center gap-1.5 bg-dark-card border border-dark-border rounded-lg px-2 py-1">
                          <img
                            src={item.images?.[0]}
                            alt={item.name}
                            className="w-5 h-5 rounded object-cover"
                          />
                          <span className="text-xs text-white line-clamp-1 max-w-[120px]">{item.name}</span>
                          <span className="text-xs text-brand-orange font-bold">×{item.quantity}</span>
                        </div>
                      ))}
                      {items.length > 3 && (
                        <span className="text-xs text-slate-500 self-center">+{items.length - 3} more</span>
                      )}
                    </div>
                  </div>

                  {/* Form */}
                  <form onSubmit={handleSubmit} className="p-5 space-y-4">
                    {/* Name */}
                    <div>
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">
                        <User size={10} className="inline mr-1" /> Full Name *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Viswa Kumar"
                        value={form.name}
                        onChange={e => setField('name', e.target.value)}
                        className={inputClass('name')}
                      />
                      {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">
                        <Phone size={10} className="inline mr-1" /> Mobile Number *
                      </label>
                      <div className="flex gap-2">
                        <div className="flex items-center px-3 rounded-xl bg-dark-base border border-dark-border text-slate-400 text-sm font-bold shrink-0">
                          +91
                        </div>
                        <input
                          type="tel"
                          placeholder="10-digit mobile number"
                          value={form.phone}
                          onChange={e => setField('phone', e.target.value.replace(/\D/g, '').slice(0, 10))}
                          className={`flex-1 ${inputClass('phone')}`}
                        />
                      </div>
                      {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
                    </div>

                    {/* Bike Model */}
                    <div>
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">
                        <Bike size={10} className="inline mr-1" /> Bike Model & Year
                      </label>
                      <select
                        value={form.bikeModel}
                        onChange={e => setField('bikeModel', e.target.value)}
                        className={`${inputClass('bikeModel')} appearance-none cursor-pointer`}
                      >
                        <option value="">Universal / Not Sure</option>
                        {bikes.filter(b => b.value !== 'Universal').map(bike => (
                          <option key={bike.value} value={bike.value}>{bike.label}</option>
                        ))}
                      </select>
                    </div>

                    {/* Address */}
                    <div>
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">
                        <MapPin size={10} className="inline mr-1" /> Delivery Address *
                      </label>
                      <textarea
                        placeholder="Full address with house no., street, city..."
                        value={form.address}
                        onChange={e => setField('address', e.target.value)}
                        rows={2}
                        className={`${inputClass('address')} resize-none`}
                      />
                      {errors.address && <p className="text-red-400 text-xs mt-1">{errors.address}</p>}
                    </div>

                    {/* Pincode */}
                    <div>
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">
                        Pincode *
                      </label>
                      <input
                        type="text"
                        placeholder="6-digit pincode"
                        value={form.pincode}
                        onChange={e => setField('pincode', e.target.value.replace(/\D/g, '').slice(0, 6))}
                        className={inputClass('pincode')}
                      />
                      {errors.pincode && <p className="text-red-400 text-xs mt-1">{errors.pincode}</p>}
                    </div>

                    {/* Payment Preference */}
                    <div>
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">
                        Payment Preference
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {paymentOptions.map(opt => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => setField('paymentPreference', opt)}
                            className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all text-left ${
                              form.paymentPreference === opt
                                ? 'border-brand-red bg-brand-red/10 text-white'
                                : 'border-dark-border text-slate-400 hover:border-brand-orange/40'
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Notes */}
                    <div>
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">
                        <MessageSquare size={10} className="inline mr-1" /> Special Notes (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Need matte black finish, urgent delivery..."
                        value={form.notes}
                        onChange={e => setField('notes', e.target.value)}
                        className={inputClass('notes')}
                      />
                    </div>

                    {/* Submit */}
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      className="w-full flex items-center justify-center gap-3 py-4 bg-brand-red hover:bg-brand-red-hover text-white font-bold rounded-xl glow-red transition-all"
                    >
                      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current text-green-400">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                      Confirm & Send on WhatsApp
                    </motion.button>

                    <p className="text-center text-xs text-slate-500">
                      Your order details will be sent to <span className="text-brand-orange font-bold">+91 93423 10194</span>
                    </p>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
