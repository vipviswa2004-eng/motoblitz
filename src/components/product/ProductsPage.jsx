import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useProducts } from '../../context/ProductContext';
import { useGarage } from '../../context/GarageContext';
import ProductCard from '../home/ProductCard';

const SORT_OPTIONS = [
  { label: 'Latest', value: 'latest' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Rating', value: 'rating' },
];

export default function ProductsPage({ onProductClick }) {
  const { products: allProducts } = useProducts();
  const { bikes } = useGarage();
  const [search, setSearch] = useState('');
  const [selectedBikeFilter, setSelectedBikeFilter] = useState('All');
  const [sort, setSort] = useState('latest');

  const bikeFilterOptions = ['All', ...bikes.map(b => b.value)];

  let products = allProducts.filter(p => p.is_active);

  if (search.trim()) {
    const q = search.toLowerCase();
    products = products.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.description?.toLowerCase().includes(q) ||
      p.category?.name?.toLowerCase().includes(q)
    );
  }

  if (selectedBikeFilter !== 'All') {
    products = products.filter(p =>
      p.compatible_bikes?.includes(selectedBikeFilter) || p.compatible_bikes?.includes('Universal')
    );
  }

  if (sort === 'price_asc') products = [...products].sort((a, b) => (a.sale_price || a.price) - (b.sale_price || b.price));
  if (sort === 'price_desc') products = [...products].sort((a, b) => (b.sale_price || b.price) - (a.sale_price || a.price));
  if (sort === 'rating') products = [...products].sort((a, b) => (b.rating || 0) - (a.rating || 0));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-6">
        <h1 className="font-racing text-3xl font-bold text-white tracking-wide mb-1">
          ALL <span className="text-brand-red">PRODUCTS</span>
        </h1>
        <p className="text-sm text-slate-400">{products.length} products found</p>
      </div>

      {/* Filters Row */}
      <div className="flex flex-wrap gap-3 mb-6">
        {/* Search */}
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 min-w-[200px] bg-dark-card border border-dark-border rounded-xl px-4 py-2.5 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-brand-red/50"
        />

        {/* Sort */}
        <select
          value={sort}
          onChange={e => setSort(e.target.value)}
          className="bg-dark-card border border-dark-border rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-brand-red/50 cursor-pointer"
        >
          {SORT_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {/* Bike filter pills */}
      <div className="flex flex-wrap gap-2 mb-8">
        {bikeFilterOptions.slice(0, 8).map(bike => (
          <motion.button
            key={bike}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedBikeFilter(bike)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold border transition-all ${
              selectedBikeFilter === bike
                ? 'bg-brand-red border-brand-red text-white'
                : 'border-dark-border text-slate-400 hover:border-brand-orange/50 hover:text-white'
            }`}
          >
            {bike}
          </motion.button>
        ))}
      </div>

      {/* Grid */}
      {products.length === 0 ? (
        <div className="py-24 text-center">
          <p className="text-4xl mb-4">🔍</p>
          <p className="text-lg font-bold text-white">No products found</p>
          <p className="text-sm text-slate-400 mt-1">Try adjusting your search or filter</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {products.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onProductClick={onProductClick}
            />
          ))}
        </div>
      )}
    </div>
  );
}
