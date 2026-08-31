import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, X, Upload, CheckCircle, Star, Image, Link } from 'lucide-react';
import { useProducts } from '../../context/ProductContext';
import { useGarage } from '../../context/GarageContext';
import { uploadMultipleProductImages } from '../../lib/storage';

export default function AdminProducts({ autoOpenAdd = false, onAddClosed }) {
  const { products, categories, addProduct, updateProduct, deleteProduct } = useProducts();
  const { bikes } = useGarage();
  const [showForm, setShowForm] = useState(autoOpenAdd);
  const [editingProduct, setEditingProduct] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [customImageUrl, setCustomImageUrl] = useState('');

  const blankForm = {
    name: '', slug: '', description: '', price: '', sale_price: '',
    stock_quantity: '15', category_id: '1', compatible_bikes: ['Universal'],
    images: [], is_featured: false, is_flash_deal: false, is_active: true,
  };
  const [form, setForm] = useState(blankForm);

  useEffect(() => {
    if (autoOpenAdd) {
      openAdd();
    }
  }, [autoOpenAdd]);

  function openEdit(product) {
    setEditingProduct(product);
    setForm({
      ...product,
      price: String(product.price),
      sale_price: String(product.sale_price || ''),
      stock_quantity: String(product.stock_quantity),
      category_id: String(product.category_id || product.category?.id || '1'),
    });
    setShowForm(true);
  }

  function openAdd() {
    setEditingProduct(null);
    setForm(blankForm);
    setShowForm(true);
  }

  function handleCloseModal() {
    setShowForm(false);
    onAddClosed?.();
  }

  function toggleBike(bikeValue) {
    setForm(f => ({
      ...f,
      compatible_bikes: f.compatible_bikes.includes(bikeValue)
        ? f.compatible_bikes.filter(b => b !== bikeValue)
        : [...f.compatible_bikes, bikeValue],
    }));
  }

  async function handleImageUpload(e) {
    const files = e.target.files;
    if (!files?.length) return;
    setUploading(true);
    try {
      const urls = await uploadMultipleProductImages(files, setUploadProgress);
      setForm(f => ({ ...f, images: [...f.images, ...urls] }));
    } catch (err) {
      console.warn('Storage upload error:', err);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  }

  function handleAddImageUrl() {
    if (!customImageUrl.trim()) return;
    setForm(f => ({ ...f, images: [...f.images, customImageUrl.trim()] }));
    setCustomImageUrl('');
  }

  function handleSave(e) {
    e?.preventDefault();
    if (!form.name.trim() || !form.price) {
      alert('Please fill in Product Name and Price');
      return;
    }

    const finalImages = form.images.length > 0
      ? form.images
      : ['https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800&q=80'];

    const product = {
      ...form,
      id: editingProduct?.id || Date.now(),
      name: form.name.trim(),
      price: Number(form.price),
      sale_price: form.sale_price ? Number(form.sale_price) : null,
      stock_quantity: Number(form.stock_quantity) || 10,
      slug: form.slug || form.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      category: categories.find(c => c.id === Number(form.category_id)) || categories[0],
      category_id: Number(form.category_id) || 1,
      images: finalImages,
      compatible_bikes: form.compatible_bikes.length > 0 ? form.compatible_bikes : ['Universal'],
      rating: editingProduct?.rating || 4.8,
      review_count: editingProduct?.review_count || 1,
    };

    if (editingProduct) {
      updateProduct(editingProduct.id, product);
    } else {
      addProduct(product);
    }
    handleCloseModal();
  }

  function handleDelete(id) {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteProduct(id);
    }
  }

  const inputCls = "w-full bg-dark-base border border-dark-border rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-brand-red/60 focus:ring-1 focus:ring-brand-red/30 transition-all";

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="font-racing text-2xl font-bold text-white">PRODUCT INVENTORY</h2>
          <p className="text-xs text-slate-400 mt-0.5">{products.length} products listed</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={openAdd}
          className="flex items-center gap-2 px-5 py-3 bg-brand-red hover:bg-brand-red-hover text-white font-bold rounded-xl text-sm glow-red shadow-lg transition-all cursor-pointer"
        >
          <Plus size={18} /> Add New Product
        </motion.button>
      </div>

      {/* Products Table */}
      <div className="bg-dark-card border border-dark-border rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-dark-border bg-dark-surface">
                <th className="text-left text-xs text-slate-400 font-bold uppercase tracking-wider px-5 py-3.5">Product</th>
                <th className="text-left text-xs text-slate-400 font-bold uppercase tracking-wider px-5 py-3.5 hidden sm:table-cell">Price</th>
                <th className="text-left text-xs text-slate-400 font-bold uppercase tracking-wider px-5 py-3.5 hidden md:table-cell">Stock</th>
                <th className="text-left text-xs text-slate-400 font-bold uppercase tracking-wider px-5 py-3.5 hidden lg:table-cell">Status</th>
                <th className="text-left text-xs text-slate-400 font-bold uppercase tracking-wider px-5 py-3.5">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-border">
              {products.map(product => (
                <tr key={product.id} className="hover:bg-dark-surface/60 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3.5">
                      <img
                        src={product.images?.[0] || 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=100&q=60'}
                        alt={product.name}
                        className="w-12 h-12 rounded-xl object-cover bg-dark-surface border border-dark-border shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="font-bold text-white line-clamp-1">{product.name}</p>
                        <p className="text-[10px] text-brand-orange font-semibold">{product.category?.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 hidden sm:table-cell">
                    <p className="font-bold text-white">₹{(product.sale_price || product.price).toLocaleString('en-IN')}</p>
                    {product.sale_price && <p className="text-xs text-slate-500 line-through">₹{product.price.toLocaleString('en-IN')}</p>}
                  </td>
                  <td className="px-5 py-3.5 hidden md:table-cell">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                      product.stock_quantity === 0
                        ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                        : product.stock_quantity <= 5
                        ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                        : 'bg-green-500/20 text-green-400 border border-green-500/30'
                    }`}>
                      {product.stock_quantity === 0 ? 'Out of Stock' : `${product.stock_quantity} units`}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 hidden lg:table-cell">
                    <div className="flex flex-col gap-1">
                      {product.is_featured && <span className="text-[9px] text-brand-orange font-bold">⭐ Featured</span>}
                      {product.is_flash_deal && <span className="text-[9px] text-brand-red font-bold">⚡ Flash Deal</span>}
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEdit(product)}
                        className="p-2 rounded-xl text-slate-400 hover:text-brand-orange hover:bg-brand-orange/10 transition-all cursor-pointer"
                        title="Edit Product"
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="p-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all cursor-pointer"
                        title="Delete Product"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Form Modal (Add / Edit) */}
      <AnimatePresence>
        {showForm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-md"
              onClick={handleCloseModal}
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 280 }}
              className="relative z-10 w-full max-w-2xl bg-dark-card border border-dark-border rounded-3xl overflow-hidden shadow-2xl max-h-[92vh] flex flex-col"
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-dark-border bg-dark-surface/90">
                <div>
                  <h2 className="font-racing text-2xl font-bold text-white">
                    {editingProduct ? 'EDIT PRODUCT' : 'ADD NEW PRODUCT'}
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">Configure details, images & compatibility</p>
                </div>
                <button
                  onClick={handleCloseModal}
                  className="w-9 h-9 rounded-full bg-dark-card border border-dark-border text-slate-400 hover:text-white flex items-center justify-center transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Form Content */}
              <form onSubmit={handleSave} className="p-6 space-y-5 overflow-y-auto flex-1">
                {/* Images Section */}
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">
                    Product Images (Cloudinary / Direct URL)
                  </label>
                  <div className="flex flex-wrap gap-2.5 mb-3">
                    {form.images.map((url, idx) => (
                      <div key={idx} className="relative w-20 h-20 rounded-2xl overflow-hidden bg-dark-surface border border-dark-border group">
                        <img src={url} alt={`product-${idx}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setForm(f => ({ ...f, images: f.images.filter((_, i) => i !== idx) }))}
                          className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white flex items-center justify-center rounded-full text-xs shadow-md opacity-90 hover:opacity-100"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    {/* Upload button */}
                    <label className="w-20 h-20 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-dark-border hover:border-brand-red/60 bg-dark-surface/50 cursor-pointer transition-all">
                      <Upload size={18} className="text-brand-red" />
                      <span className="text-[10px] text-slate-400 font-semibold mt-1">Upload</span>
                      <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} />
                    </label>
                  </div>

                  {/* Direct URL Input fallback */}
                  <div className="flex gap-2">
                    <input
                      type="url"
                      placeholder="Or paste direct image URL (https://...)"
                      value={customImageUrl}
                      onChange={e => setCustomImageUrl(e.target.value)}
                      className="flex-1 bg-dark-base border border-dark-border rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-red/50"
                    />
                    <button
                      type="button"
                      onClick={handleAddImageUrl}
                      className="px-3 py-2 bg-dark-surface border border-dark-border hover:border-brand-orange/50 text-slate-300 text-xs font-bold rounded-xl transition-colors"
                    >
                      + Add URL
                    </button>
                  </div>

                  {uploading && (
                    <div className="mt-2 h-1.5 bg-dark-border rounded-full overflow-hidden">
                      <div className="h-full bg-brand-red rounded-full transition-all" style={{ width: `${uploadProgress}%` }} />
                    </div>
                  )}
                </div>

                {/* Name & Category */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Akrapovič Carbon Exhaust Guard"
                      value={form.name}
                      onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      className={inputCls}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">
                      Category
                    </label>
                    <select
                      value={form.category_id}
                      onChange={e => setForm(f => ({ ...f, category_id: e.target.value }))}
                      className={`${inputCls} cursor-pointer`}
                    >
                      {categories.map(c => (
                        <option key={c.id} value={String(c.id)}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Price, Sale Price, Stock */}
                <div className="grid grid-cols-3 gap-3 sm:gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">
                      Price (₹) *
                    </label>
                    <input
                      type="number"
                      placeholder="1999"
                      value={form.price}
                      onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                      className={inputCls}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">
                      Sale Price (₹)
                    </label>
                    <input
                      type="number"
                      placeholder="1499"
                      value={form.sale_price}
                      onChange={e => setForm(f => ({ ...f, sale_price: e.target.value }))}
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">
                      Stock Qty *
                    </label>
                    <input
                      type="number"
                      placeholder="15"
                      value={form.stock_quantity}
                      onChange={e => setForm(f => ({ ...f, stock_quantity: e.target.value }))}
                      className={inputCls}
                      required
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">
                    Product Description
                  </label>
                  <textarea
                    rows={3}
                    placeholder="High performance motorcycle part made from premium alloy..."
                    value={form.description}
                    onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                    className={`${inputCls} resize-none`}
                  />
                </div>

                {/* Compatible Bike Models */}
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">
                    Compatible Bike Models
                  </label>
                  <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-2 bg-dark-base rounded-2xl border border-dark-border">
                    {bikes.map(bike => (
                      <button
                        key={bike.value}
                        type="button"
                        onClick={() => toggleBike(bike.value)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                          form.compatible_bikes?.includes(bike.value)
                            ? 'bg-brand-red/20 border-brand-red text-white'
                            : 'border-dark-border text-slate-400 hover:border-brand-orange/40'
                        }`}
                      >
                        <span className="mr-1">{bike.icon}</span> {bike.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Toggles */}
                <div className="flex flex-wrap gap-4 pt-1">
                  {[
                    { key: 'is_featured', label: '⭐ Featured Product' },
                    { key: 'is_flash_deal', label: '⚡ Flash Drop' },
                    { key: 'is_active', label: '✅ Active on Store' },
                  ].map(flag => (
                    <label key={flag.key} className="flex items-center gap-2 cursor-pointer">
                      <div
                        onClick={() => setForm(f => ({ ...f, [flag.key]: !f[flag.key] }))}
                        className={`w-10 h-5 rounded-full transition-all flex items-center px-0.5 ${
                          form[flag.key] ? 'bg-brand-red' : 'bg-dark-border'
                        }`}
                      >
                        <motion.div
                          animate={{ x: form[flag.key] ? 20 : 0 }}
                          className="w-4 h-4 bg-white rounded-full shadow-sm"
                        />
                      </div>
                      <span className="text-xs font-bold text-slate-300">{flag.label}</span>
                    </label>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-3">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="flex-1 py-3.5 rounded-xl border border-dark-border text-slate-400 font-bold text-sm hover:bg-dark-surface transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-brand-red hover:bg-brand-red-hover text-white font-bold rounded-xl text-sm glow-red shadow-xl transition-all cursor-pointer"
                  >
                    <CheckCircle size={17} /> {editingProduct ? 'Save Changes' : 'Publish Product'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
