import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, X, Save, Tag, Flame, Wind, Shield, Zap, Shirt, Palette, Package } from 'lucide-react';

import { useProducts } from '../../context/ProductContext';

const ICON_OPTIONS = [
  { label: 'Flame', icon: Flame },
  { label: 'Wind', icon: Wind },
  { label: 'Shield', icon: Shield },
  { label: 'Zap', icon: Zap },
  { label: 'Shirt', icon: Shirt },
  { label: 'Palette', icon: Palette },
  { label: 'Package', icon: Package },
  { label: 'Tag', icon: Tag },
];

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function getIconComponent(name) {
  const found = ICON_OPTIONS.find(i => i.label === name);
  return found ? found.icon : Tag;
}

export default function AdminCategories() {
  const { categories, addCategory, updateCategory, deleteCategory } = useProducts();
  const [showModal, setShowModal] = useState(false);
  const [editingCat, setEditingCat] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [form, setForm] = useState({ name: '', slug: '', icon_name: 'Tag', display_order: '' });
  const [saving, setSaving] = useState(false);

  function openAdd() {
    setEditingCat(null);
    setForm({ name: '', slug: '', icon_name: 'Tag', display_order: String(categories.length + 1) });
    setShowModal(true);
  }

  function openEdit(cat) {
    setEditingCat(cat);
    setForm({ name: cat.name, slug: cat.slug, icon_name: cat.icon_name || 'Tag', display_order: String(cat.display_order || 1) });
    setShowModal(true);
  }

  function handleNameChange(val) {
    setForm(f => ({ ...f, name: val, slug: slugify(val) }));
  }

  async function handleSave() {
    if (!form.name.trim()) return;
    setSaving(true);
    if (editingCat) {
      updateCategory(editingCat.id, {
        name: form.name.trim(),
        slug: form.slug.trim(),
        icon_name: form.icon_name,
        display_order: Number(form.display_order) || 1,
      });
    } else {
      addCategory({
        name: form.name.trim(),
        slug: form.slug.trim() || slugify(form.name),
        icon_name: form.icon_name,
        display_order: Number(form.display_order) || categories.length + 1,
        image_url: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=400&q=80',
      });
    }
    setSaving(false);
    setShowModal(false);
  }

  function handleDelete(id) {
    deleteCategory(id);
    setDeleteConfirm(null);
  }

  const sortedCats = [...categories].sort((a, b) => a.display_order - b.display_order);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-racing text-2xl font-bold text-white">Categories</h2>
          <p className="text-xs text-slate-400 mt-0.5">{categories.length} categories</p>
        </div>
        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2.5 bg-brand-red hover:bg-brand-red-hover text-white font-bold rounded-xl text-sm shadow-lg transition-all cursor-pointer">
          <Plus size={16} /> Add Category
        </motion.button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {sortedCats.map(cat => {
          const IconComp = getIconComponent(cat.icon_name);
          return (
            <motion.div key={cat.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="bg-dark-card border border-dark-border rounded-2xl p-5 flex items-center gap-4 hover:border-brand-red/30 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-brand-red/10 border border-brand-red/20 flex items-center justify-center text-brand-red shrink-0 group-hover:bg-brand-red group-hover:text-white transition-all">
                <IconComp size={22} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-white text-sm truncate">{cat.name}</p>
                <p className="text-[10px] text-slate-500 truncate font-mono">/{cat.slug}</p>
                <p className="text-[10px] text-brand-orange font-bold mt-0.5">{cat.product_count} products · order #{cat.display_order}</p>
              </div>
              <div className="flex flex-col gap-1.5 shrink-0">
                <button onClick={() => openEdit(cat)} className="w-8 h-8 flex items-center justify-center rounded-lg bg-dark-surface border border-dark-border text-slate-400 hover:text-brand-orange hover:border-brand-orange/40 transition-all cursor-pointer">
                  <Edit2 size={13} />
                </button>
                <button onClick={() => setDeleteConfirm(cat.id)} className="w-8 h-8 flex items-center justify-center rounded-lg bg-dark-surface border border-dark-border text-slate-400 hover:text-red-400 hover:border-red-400/40 transition-all cursor-pointer">
                  <Trash2 size={13} />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowModal(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.94, y: 12 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.94, y: 12 }}
              className="relative w-full max-w-md bg-dark-card border border-dark-border rounded-3xl p-6 shadow-2xl z-10" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-racing text-xl font-bold text-white">{editingCat ? 'Edit Category' : 'New Category'}</h3>
                <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-full bg-dark-surface text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"><X size={16} /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 mb-1.5 block uppercase tracking-wider">Category Name *</label>
                  <input value={form.name} onChange={e => handleNameChange(e.target.value)} placeholder="e.g. Exhausts & Slipons"
                    className="w-full bg-dark-surface border border-dark-border rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-red/60" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 mb-1.5 block uppercase tracking-wider">URL Slug</label>
                  <input value={form.slug} onChange={e => setForm(f => ({ ...f, slug: slugify(e.target.value) }))} placeholder="exhausts-slipons"
                    className="w-full bg-dark-surface border border-dark-border rounded-xl px-4 py-3 text-sm text-slate-400 placeholder-slate-500 focus:outline-none focus:border-brand-red/60 font-mono" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 mb-1.5 block uppercase tracking-wider">Icon</label>
                  <div className="grid grid-cols-4 gap-2">
                    {ICON_OPTIONS.map(({ label, icon: IconComp }) => (
                      <button key={label} onClick={() => setForm(f => ({ ...f, icon_name: label }))}
                        className={`flex flex-col items-center gap-1 p-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${form.icon_name === label ? 'border-brand-red bg-brand-red/10 text-brand-red' : 'border-dark-border bg-dark-surface text-slate-400 hover:border-brand-orange/40'}`}>
                        <IconComp size={18} /><span>{label}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 mb-1.5 block uppercase tracking-wider">Display Order</label>
                  <input type="number" value={form.display_order} onChange={e => setForm(f => ({ ...f, display_order: e.target.value }))} placeholder="1" min="1"
                    className="w-full bg-dark-surface border border-dark-border rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-red/60" />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowModal(false)} className="flex-1 py-3 rounded-xl bg-dark-surface border border-dark-border text-white text-sm font-bold hover:bg-dark-border transition-colors cursor-pointer">Cancel</button>
                <motion.button whileTap={{ scale: 0.97 }} onClick={handleSave} disabled={saving || !form.name.trim()}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-brand-red hover:bg-brand-red-hover text-white text-sm font-bold shadow-lg transition-all disabled:opacity-60 cursor-pointer">
                  {saving ? <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : <Save size={15} />}
                  {saving ? 'Saving...' : 'Save Category'}
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
              <h3 className="font-racing text-xl font-bold text-white mb-2">Delete Category?</h3>
              <p className="text-xs text-slate-400 mb-5">Products in this category may become uncategorized.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2.5 rounded-xl bg-dark-surface border border-dark-border text-white text-sm font-bold cursor-pointer hover:bg-dark-border">Cancel</button>
                <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-bold cursor-pointer">Delete</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
