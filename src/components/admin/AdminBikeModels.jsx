import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, X, Save, Bike } from 'lucide-react';
import { useGarage } from '../../context/GarageContext';

const BRAND_COLORS = {
  Yamaha: { bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-400', dot: '🔵' },
  KTM: { bg: 'bg-orange-500/10', border: 'border-orange-500/30', text: 'text-orange-400', dot: '🟠' },
  'Royal Enfield': { bg: 'bg-amber-700/10', border: 'border-amber-700/30', text: 'text-amber-600', dot: '🟤' },
  Kawasaki: { bg: 'bg-green-500/10', border: 'border-green-500/30', text: 'text-green-400', dot: '🟢' },
  Honda: { bg: 'bg-red-500/10', border: 'border-red-500/30', text: 'text-red-400', dot: '🔴' },
  Bajaj: { bg: 'bg-slate-500/10', border: 'border-slate-500/30', text: 'text-slate-400', dot: '⚫' },
  TVS: { bg: 'bg-slate-500/10', border: 'border-slate-500/30', text: 'text-slate-400', dot: '⚫' },
  Universal: { bg: 'bg-brand-red/10', border: 'border-brand-red/30', text: 'text-brand-red', dot: '🏍️' },
};

const BRANDS = ['Universal', 'Yamaha', 'KTM', 'Royal Enfield', 'Kawasaki', 'Honda', 'Bajaj', 'TVS', 'Suzuki', 'BMW', 'Triumph', 'Ducati'];

function getBrandStyle(brand) {
  return BRAND_COLORS[brand] || BRAND_COLORS.Universal;
}

export default function AdminBikeModels() {
  const { bikes, addBike, updateBike, deleteBike } = useGarage();
  const [showModal, setShowModal] = useState(false);
  const [editingBike, setEditingBike] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [form, setForm] = useState({ label: '', brand: 'Yamaha', cc: '' });
  const [saving, setSaving] = useState(false);
  const [filterBrand, setFilterBrand] = useState('All');

  function openAdd() {
    setEditingBike(null);
    setForm({ label: '', brand: 'Yamaha', cc: '' });
    setShowModal(true);
  }

  function openEdit(bike) {
    setEditingBike(bike);
    setForm({ label: bike.label, brand: bike.brand || 'Yamaha', cc: String(bike.cc || '') });
    setShowModal(true);
  }

  async function handleSave() {
    if (!form.label.trim()) return;
    setSaving(true);
    const value = form.label.trim();
    if (editingBike) {
      updateBike(editingBike.id, {
        label: value,
        brand: form.brand,
        cc: form.cc ? Number(form.cc) : null,
      });
    } else {
      addBike({
        label: value,
        brand: form.brand,
        icon: BRAND_COLORS[form.brand]?.dot || '🏍️',
        cc: form.cc ? Number(form.cc) : null,
      });
    }
    setSaving(false);
    setShowModal(false);
  }

  function handleDelete(id) {
    deleteBike(id);
    setDeleteConfirm(null);
  }

  const brands = ['All', ...new Set(bikes.map(b => b.brand))];
  const filtered = filterBrand === 'All' ? bikes : bikes.filter(b => b.brand === filterBrand);
  const grouped = filtered.reduce((acc, b) => {
    const br = b.brand;
    if (!acc[br]) acc[br] = [];
    acc[br].push(b);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="font-racing text-2xl font-bold text-white">Compatible Bike Models</h2>
          <p className="text-xs text-slate-400 mt-0.5">{bikes.length} models across {new Set(bikes.map(b => b.brand)).size} brands</p>
        </div>
        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2.5 bg-brand-red hover:bg-brand-red-hover text-white font-bold rounded-xl text-sm shadow-lg transition-all cursor-pointer">
          <Plus size={16} /> Add Bike Model
        </motion.button>
      </div>

      {/* Brand Filter */}
      <div className="flex gap-2 flex-wrap">
        {brands.map(br => (
          <button key={br} onClick={() => setFilterBrand(br)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${filterBrand === br ? 'bg-brand-red text-white' : 'bg-dark-card border border-dark-border text-slate-400 hover:border-brand-orange/40 hover:text-white'}`}>
            {br}
          </button>
        ))}
      </div>

      {/* Grouped List */}
      <div className="space-y-5">
        {Object.entries(grouped).map(([brand, brandBikes]) => {
          const style = getBrandStyle(brand);
          return (
            <div key={brand}>
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold mb-3 ${style.bg} ${style.border} border ${style.text}`}>
                <span>{style.dot}</span> {brand} ({brandBikes.length} models)
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                {brandBikes.map(bike => (
                  <motion.div key={bike.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="bg-dark-card border border-dark-border rounded-xl p-4 flex items-center gap-3 hover:border-brand-orange/30 transition-all group">
                    <div className={`w-10 h-10 rounded-lg ${style.bg} border ${style.border} flex items-center justify-center text-lg shrink-0`}>
                      {style.dot}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-white truncate">{bike.label}</p>
                      <p className="text-[10px] text-slate-500">{bike.cc ? `${bike.cc}cc` : 'Universal fit'}</p>
                    </div>
                    <div className="flex gap-1.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openEdit(bike)} className="w-7 h-7 flex items-center justify-center rounded-lg bg-dark-surface border border-dark-border text-slate-400 hover:text-brand-orange cursor-pointer transition-colors">
                        <Edit2 size={11} />
                      </button>
                      {bike.value !== 'Universal' && (
                        <button onClick={() => setDeleteConfirm(bike.id)} className="w-7 h-7 flex items-center justify-center rounded-lg bg-dark-surface border border-dark-border text-slate-400 hover:text-red-400 cursor-pointer transition-colors">
                          <Trash2 size={11} />
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowModal(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.94, y: 12 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.94 }}
              className="relative w-full max-w-md bg-dark-card border border-dark-border rounded-3xl p-6 shadow-2xl z-10" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-racing text-xl font-bold text-white">{editingBike ? 'Edit Bike Model' : 'Add Bike Model'}</h3>
                <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-full bg-dark-surface text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"><X size={16} /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 mb-1.5 block uppercase tracking-wider">Bike Name *</label>
                  <input value={form.label} onChange={e => setForm(f => ({ ...f, label: e.target.value }))} placeholder="e.g. Yamaha R15 V4"
                    className="w-full bg-dark-surface border border-dark-border rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-red/60" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 mb-1.5 block uppercase tracking-wider">Brand *</label>
                  <select value={form.brand} onChange={e => setForm(f => ({ ...f, brand: e.target.value }))}
                    className="w-full bg-dark-surface border border-dark-border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-red/60 cursor-pointer">
                    {BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 mb-1.5 block uppercase tracking-wider">Engine CC (optional)</label>
                  <input type="number" value={form.cc} onChange={e => setForm(f => ({ ...f, cc: e.target.value }))} placeholder="e.g. 155"
                    className="w-full bg-dark-surface border border-dark-border rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-red/60" />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowModal(false)} className="flex-1 py-3 rounded-xl bg-dark-surface border border-dark-border text-white text-sm font-bold hover:bg-dark-border cursor-pointer">Cancel</button>
                <motion.button whileTap={{ scale: 0.97 }} onClick={handleSave} disabled={saving || !form.label.trim()}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-brand-red hover:bg-brand-red-hover text-white text-sm font-bold shadow-lg disabled:opacity-60 cursor-pointer">
                  {saving ? <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : <Save size={15} />}
                  {saving ? 'Saving...' : 'Save Model'}
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {deleteConfirm && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setDeleteConfirm(null)} />
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
              className="relative w-full max-w-sm bg-dark-card border border-red-500/30 rounded-3xl p-6 shadow-2xl z-10 text-center">
              <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto mb-4"><Trash2 size={24} className="text-red-400" /></div>
              <h3 className="font-racing text-xl font-bold text-white mb-2">Remove Bike Model?</h3>
              <p className="text-xs text-slate-400 mb-5">This bike will be removed from all product compatibility lists.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2.5 rounded-xl bg-dark-surface border border-dark-border text-white text-sm font-bold cursor-pointer hover:bg-dark-border">Cancel</button>
                <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-bold cursor-pointer">Remove</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
