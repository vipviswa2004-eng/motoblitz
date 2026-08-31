import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronDown, MessageSquare, Truck, CheckCircle } from 'lucide-react';

const STATUS_FLOW = ['pending', 'confirmed', 'dispatched', 'delivered', 'cancelled'];
const STATUS_LABELS = {
  pending: { label: 'Pending Confirmation', color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30' },
  confirmed: { label: 'Confirmed', color: 'text-blue-400 bg-blue-500/10 border-blue-500/30' },
  dispatched: { label: 'Dispatched', color: 'text-brand-orange bg-brand-orange/10 border-brand-orange/30' },
  delivered: { label: 'Delivered', color: 'text-green-400 bg-green-500/10 border-green-500/30' },
  cancelled: { label: 'Cancelled', color: 'text-red-400 bg-red-500/10 border-red-500/30' },
};

// Sample orders for demo
const DEMO_ORDERS = [
  {
    id: 1, order_code: 'MB-84920', customer_name: 'Aravind Kumar', customer_phone: '+91 98765 43210',
    bike_model: 'Yamaha R15 V4', shipping_address: '12, Race Course Rd, Coimbatore', pincode: '641018',
    total_amount: 3798, status: 'pending', payment_method: 'GPay / PhonePe / UPI',
    notes: 'Need matte black finish', created_at: '2026-08-30T10:30:00Z',
    items: [
      { product_name: 'Winglet Aerodynamic Mirrors', quantity: 1, unit_price: 1499 },
      { product_name: 'Carbon Fibre Exhaust Shield', quantity: 1, unit_price: 2299 },
    ]
  },
  {
    id: 2, order_code: 'MB-84919', customer_name: 'Kavya Raj', customer_phone: '+91 87654 32109',
    bike_model: 'KTM Duke 390', shipping_address: '45, Anna Nagar, Chennai', pincode: '600040',
    total_amount: 1499, status: 'confirmed', payment_method: 'Bank Transfer (NEFT/IMPS)',
    notes: '', created_at: '2026-08-30T07:20:00Z',
    items: [{ product_name: 'Winglet Aerodynamic Mirrors', quantity: 1, unit_price: 1499 }]
  },
  {
    id: 3, order_code: 'MB-84914', customer_name: 'Priya S', customer_phone: '+91 76543 21098',
    bike_model: 'Royal Enfield Hunter 350', shipping_address: '7, Gandhi St, Madurai', pincode: '625001',
    total_amount: 2299, status: 'dispatched', payment_method: 'GPay / PhonePe / UPI',
    notes: '', tracking_id: 'DTDC183920194', courier_name: 'DTDC', created_at: '2026-08-29T15:00:00Z',
    items: [{ product_name: 'Carbon Fibre Exhaust Shield', quantity: 1, unit_price: 2299 }]
  },
];

import { generateCustomerStatusUpdateMessage } from '../../lib/whatsapp';

export default function AdminOrders() {
  const [orders, setOrders] = useState(DEMO_ORDERS);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [trackingInput, setTrackingInput] = useState({ id: '', courier: '' });

  function updateStatus(orderId, newStatus) {
    setOrders(os => os.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    if (selectedOrder?.id === orderId) setSelectedOrder(o => ({ ...o, status: newStatus }));
  }

  function sendWhatsAppUpdate(order) {
    const msg = generateCustomerStatusUpdateMessage({
      orderCode: order.order_code,
      customerName: order.customer_name,
      status: order.status,
      trackingId: order.tracking_id,
      courierName: order.courier_name,
    });
    const phone = order.customer_phone.replace(/[^0-9]/g, '');
    window.open(`https://wa.me/91${phone.slice(-10)}?text=${msg}`, '_blank');
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-racing text-xl font-bold text-white">ORDER MANAGEMENT</h2>
        <p className="text-xs text-slate-500 mt-0.5">{orders.length} total orders</p>
      </div>

      {/* Orders List */}
      <div className="space-y-3">
        {orders.map(order => {
          const statusInfo = STATUS_LABELS[order.status] || STATUS_LABELS.pending;
          return (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-dark-card border border-dark-border rounded-xl p-4 hover:border-brand-red/30 transition-all"
            >
              <div className="flex flex-wrap gap-3 justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-racing font-bold text-white">#{order.order_code}</span>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${statusInfo.color}`}>
                      {statusInfo.label}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-slate-300">{order.customer_name}</p>
                  <p className="text-xs text-slate-500">{order.customer_phone} · {order.bike_model}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{order.shipping_address}, {order.pincode}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-white">₹{order.total_amount.toLocaleString('en-IN')}</p>
                  <p className="text-[10px] text-slate-500">{new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</p>
                </div>
              </div>

              {/* Items */}
              <div className="mt-3 p-3 bg-dark-surface rounded-lg border border-dark-border text-xs">
                {order.items.map((item, idx) => (
                  <p key={idx} className="text-slate-400">
                    <span className="text-white font-semibold">{item.product_name}</span> × {item.quantity} — ₹{item.unit_price.toLocaleString('en-IN')}
                  </p>
                ))}
                {order.notes && <p className="text-brand-orange mt-1">📝 Note: {order.notes}</p>}
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-2 mt-3">
                {/* Status changer */}
                <select
                  value={order.status}
                  onChange={e => updateStatus(order.id, e.target.value)}
                  className="bg-dark-surface border border-dark-border rounded-lg px-3 py-1.5 text-xs font-bold text-white focus:outline-none focus:border-brand-red/50 cursor-pointer"
                >
                  {STATUS_FLOW.map(s => (
                    <option key={s} value={s}>{STATUS_LABELS[s].label}</option>
                  ))}
                </select>

                {/* WhatsApp customer update */}
                <button
                  onClick={() => sendWhatsAppUpdate(order)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 text-xs font-bold hover:bg-green-500/20 transition-colors"
                >
                  <MessageSquare size={12} /> WhatsApp Update
                </button>

                {/* View detail */}
                <button
                  onClick={() => setSelectedOrder(order)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-dark-surface border border-dark-border text-slate-400 text-xs font-bold hover:text-white transition-colors"
                >
                  View Details
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Order Detail Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedOrder(null)} />
            <motion.div
              initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }}
              className="fixed bottom-0 left-0 right-0 sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:bottom-auto z-[60] w-full sm:max-w-lg bg-dark-card border border-dark-border sm:rounded-2xl rounded-t-2xl p-6 max-h-[80vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-racing text-lg font-bold text-white">Order #{selectedOrder.order_code}</h3>
                <button onClick={() => setSelectedOrder(null)} className="text-slate-400 hover:text-white"><X size={18} /></button>
              </div>

              <div className="space-y-3 text-sm">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-dark-surface rounded-lg">
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Customer</p>
                    <p className="font-bold text-white">{selectedOrder.customer_name}</p>
                    <p className="text-slate-400 text-xs">{selectedOrder.customer_phone}</p>
                  </div>
                  <div className="p-3 bg-dark-surface rounded-lg">
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Bike Model</p>
                    <p className="font-bold text-white">{selectedOrder.bike_model}</p>
                    <p className="text-slate-400 text-xs">{selectedOrder.payment_method}</p>
                  </div>
                </div>

                <div className="p-3 bg-dark-surface rounded-lg">
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Delivery Address</p>
                  <p className="text-white">{selectedOrder.shipping_address}</p>
                  <p className="text-slate-400 text-xs">PIN: {selectedOrder.pincode}</p>
                </div>

                {/* Tracking */}
                <div className="p-3 bg-dark-surface rounded-lg space-y-2">
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider">Add Tracking</p>
                  <div className="flex gap-2">
                    <input
                      type="text" placeholder="Tracking ID"
                      value={trackingInput.id}
                      onChange={e => setTrackingInput(t => ({ ...t, id: e.target.value }))}
                      className="flex-1 bg-dark-base border border-dark-border rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-brand-red/50"
                    />
                    <input
                      type="text" placeholder="Courier (e.g. DTDC)"
                      value={trackingInput.courier}
                      onChange={e => setTrackingInput(t => ({ ...t, courier: e.target.value }))}
                      className="flex-1 bg-dark-base border border-dark-border rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-brand-red/50"
                    />
                  </div>
                  <button
                    onClick={() => {
                      setOrders(os => os.map(o => o.id === selectedOrder.id
                        ? { ...o, tracking_id: trackingInput.id, courier_name: trackingInput.courier }
                        : o));
                      setSelectedOrder(o => ({ ...o, tracking_id: trackingInput.id, courier_name: trackingInput.courier }));
                    }}
                    className="w-full flex items-center justify-center gap-2 py-2 bg-brand-orange/10 border border-brand-orange/30 text-brand-orange text-xs font-bold rounded-lg hover:bg-brand-orange/20 transition-colors"
                  >
                    <Truck size={12} /> Save Tracking Info
                  </button>
                </div>

                <button
                  onClick={() => sendWhatsAppUpdate(selectedOrder)}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-green-500/10 border border-green-500/30 text-green-400 font-bold rounded-xl text-sm hover:bg-green-500/20 transition-colors"
                >
                  <MessageSquare size={15} /> Send WhatsApp Update to Customer
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
