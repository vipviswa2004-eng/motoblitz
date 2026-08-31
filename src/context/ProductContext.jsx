import React, { createContext, useContext, useState, useEffect } from 'react';
import { getSampleProducts, getSampleCategories, supabase } from '../lib/supabase';

const ProductContext = createContext(null);

const STORAGE_PRODUCTS_KEY = 'motoblitz_products_data_v2';
const STORAGE_CATEGORIES_KEY = 'motoblitz_categories_data_v2';

export function ProductProvider({ children }) {
  const [products, setProducts] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_PRODUCTS_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return getSampleProducts();
  });

  const [categories, setCategories] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_CATEGORIES_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return getSampleCategories();
  });

  // Fetch remote data from Supabase on mount
  useEffect(() => {
    if (!supabase) return;

    supabase
      .from('products')
      .select('*, category:categories(name,slug)')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (!error && data && data.length > 0) {
          setProducts(data);
        }
      });

    supabase
      .from('categories')
      .select('*')
      .order('display_order', { ascending: true })
      .then(({ data, error }) => {
        if (!error && data && data.length > 0) {
          setCategories(data);
        }
      });
  }, []);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_PRODUCTS_KEY, JSON.stringify(products));
    } catch (e) {}
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_CATEGORIES_KEY, JSON.stringify(categories));
    } catch (e) {}
  }, [categories]);

  // Product CRUD
  const addProduct = async (productData) => {
    const newProduct = {
      ...productData,
      id: Date.now(),
      created_at: new Date().toISOString(),
    };
    setProducts(prev => [newProduct, ...prev]);

    if (supabase) {
      try {
        await supabase.from('products').insert([productData]);
      } catch (err) {
        console.warn('Supabase product insert failed, saved locally:', err);
      }
    }
    return newProduct;
  };

  const updateProduct = async (id, updatedData) => {
    setProducts(prev => prev.map(p => {
      if (p.id === id) {
        return { ...p, ...updatedData, updated_at: new Date().toISOString() };
      }
      return p;
    }));

    if (supabase) {
      try {
        await supabase.from('products').update(updatedData).eq('id', id);
      } catch (err) {
        console.warn('Supabase product update failed, saved locally:', err);
      }
    }
  };

  const deleteProduct = async (id) => {
    setProducts(prev => prev.filter(p => p.id !== id));

    if (supabase) {
      try {
        await supabase.from('products').delete().eq('id', id);
      } catch (err) {
        console.warn('Supabase product delete failed, saved locally:', err);
      }
    }
  };

  // Category CRUD
  const addCategory = async (categoryData) => {
    const newCat = {
      ...categoryData,
      id: Date.now(),
      product_count: 0,
    };
    setCategories(prev => [...prev, newCat]);

    if (supabase) {
      try {
        await supabase.from('categories').insert([{
          name: categoryData.name,
          slug: categoryData.slug,
          icon_name: categoryData.icon_name,
          image_url: categoryData.image_url,
          display_order: categoryData.display_order,
        }]);
      } catch (err) {
        console.warn('Supabase category insert failed:', err);
      }
    }
    return newCat;
  };

  const updateCategory = async (id, updatedData) => {
    setCategories(prev => prev.map(c => c.id === id ? { ...c, ...updatedData } : c));

    if (supabase) {
      try {
        await supabase.from('categories').update(updatedData).eq('id', id);
      } catch (err) {
        console.warn('Supabase category update failed:', err);
      }
    }
  };

  const deleteCategory = async (id) => {
    setCategories(prev => prev.filter(c => c.id !== id));

    if (supabase) {
      try {
        await supabase.from('categories').delete().eq('id', id);
      } catch (err) {
        console.warn('Supabase category delete failed:', err);
      }
    }
  };

  const getFeatured = () => products.filter(p => p.is_featured && p.is_active);
  const getFlashDeals = () => products.filter(p => p.is_flash_deal && p.is_active);

  return (
    <ProductContext.Provider
      value={{
        products,
        categories,
        addProduct,
        updateProduct,
        deleteProduct,
        addCategory,
        updateCategory,
        deleteCategory,
        getFeatured,
        getFlashDeals,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const ctx = useContext(ProductContext);
  if (!ctx) throw new Error('useProducts must be used within ProductProvider');
  return ctx;
}
