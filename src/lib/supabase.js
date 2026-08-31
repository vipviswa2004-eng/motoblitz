import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = supabaseUrl
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// ─── FALLBACK LOCAL STORE (used when Supabase is not yet configured) ───────────
let localOrders = [];
let localOrderCounter = 1000;

function generateOrderCode() {
  return `MB-${(++localOrderCounter).toString().padStart(5, '0')}`;
}

// ─── Product helpers ─────────────────────────────────────────────────────────
export async function getProducts(filters = {}) {
  if (supabase) {
    let query = supabase.from('products').select('*, category:categories(name,slug)').eq('is_active', true);
    if (filters.category) query = query.eq('category_id', filters.category);
    if (filters.isFeatured) query = query.eq('is_featured', true);
    if (filters.isFlashDeal) query = query.eq('is_flash_deal', true);
    if (filters.search) query = query.ilike('name', `%${filters.search}%`);
    if (filters.bike && filters.bike !== 'Universal') {
      query = query.contains('compatible_bikes', [filters.bike]);
    }
    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  }
  return getSampleProducts(filters);
}

export async function getProductBySlug(slug) {
  if (supabase) {
    const { data, error } = await supabase
      .from('products')
      .select('*, category:categories(name,slug)')
      .eq('slug', slug)
      .single();
    if (error) throw error;
    return data;
  }
  return getSampleProducts().find(p => p.slug === slug) || null;
}

export async function getCategories() {
  if (supabase) {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('display_order', { ascending: true });
    if (error) throw error;
    return data;
  }
  return getSampleCategories();
}

export async function getFeaturedBanners() {
  if (supabase) {
    const { data, error } = await supabase
      .from('banners')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });
    if (error) throw error;
    return data;
  }
  return getSampleBanners();
}

// ─── Order helpers ───────────────────────────────────────────────────────────
export async function createOrder(orderData, orderItems) {
  const orderCode = generateOrderCode();
  if (supabase) {
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([{ ...orderData, order_code: orderCode, status: 'pending', created_at: new Date().toISOString() }])
      .select()
      .single();
    if (orderError) throw orderError;

    const itemsWithOrderId = orderItems.map(item => ({ ...item, order_id: order.id }));
    const { error: itemsError } = await supabase.from('order_items').insert(itemsWithOrderId);
    if (itemsError) throw itemsError;
    return { ...order, order_code: orderCode };
  }

  // Local fallback
  const order = {
    id: Date.now(),
    order_code: orderCode,
    ...orderData,
    status: 'pending',
    items: orderItems,
    created_at: new Date().toISOString(),
  };
  localOrders.unshift(order);
  return order;
}

export async function getOrders() {
  if (supabase) {
    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  }
  return localOrders;
}

export async function updateOrderStatus(orderId, status, trackingData = {}) {
  if (supabase) {
    const { data, error } = await supabase
      .from('orders')
      .update({ status, ...trackingData, updated_at: new Date().toISOString() })
      .eq('id', orderId)
      .select()
      .single();
    if (error) throw error;
    return data;
  }
  const idx = localOrders.findIndex(o => o.id === orderId);
  if (idx !== -1) localOrders[idx] = { ...localOrders[idx], status, ...trackingData };
  return localOrders[idx];
}

// ─── Admin product helpers ───────────────────────────────────────────────────
export async function createProduct(productData) {
  if (supabase) {
    const { data, error } = await supabase.from('products').insert([productData]).select().single();
    if (error) throw error;
    return data;
  }
  throw new Error('Configure Supabase to create products');
}

export async function updateProduct(id, productData) {
  if (supabase) {
    const { data, error } = await supabase.from('products').update(productData).eq('id', id).select().single();
    if (error) throw error;
    return data;
  }
  throw new Error('Configure Supabase to update products');
}

export async function deleteProduct(id) {
  if (supabase) {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) throw error;
  }
}

// ─── Sample / Seed Data ───────────────────────────────────────────────────────
export function getSampleCategories() {
  return [
    { id: 1, name: 'Exhausts & Slipons', slug: 'exhausts', icon_name: 'Flame', image_url: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=400&q=80', display_order: 1 },
    { id: 2, name: 'Aerodynamics & Visors', slug: 'aerodynamics', icon_name: 'Wind', image_url: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=400&q=80', display_order: 2 },
    { id: 3, name: 'Crash Protection', slug: 'crash-protection', icon_name: 'Shield', image_url: 'https://images.unsplash.com/photo-1558981285-6f0c8c35d1c0?w=400&q=80', display_order: 3 },
    { id: 4, name: 'LED Lighting', slug: 'led-lighting', icon_name: 'Zap', image_url: 'https://images.unsplash.com/photo-1558981033-0f0309284409?w=400&q=80', display_order: 4 },
    { id: 5, name: 'Riding Gear', slug: 'riding-gear', icon_name: 'Shirt', image_url: 'https://images.unsplash.com/photo-1558981408-db752f897d43?w=400&q=80', display_order: 5 },
    { id: 6, name: 'Custom Decals', slug: 'decals', icon_name: 'Palette', image_url: 'https://images.unsplash.com/photo-1558981353-fce17ef8e12f?w=400&q=80', display_order: 6 },
  ];
}

export function getSampleProducts(filters = {}) {
  const products = [
    {
      id: 1, name: 'Carbon Fibre Exhaust Wraparound Shield', slug: 'carbon-fibre-exhaust-shield',
      description: 'Premium heat-resistant carbon fibre exhaust shield with titanium bolts. Reduces pipe heat signature, looks aggressive on the machine.',
      price: 2299, sale_price: 1799, stock_quantity: 18, is_featured: true, is_flash_deal: true, is_active: true,
      images: ['https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800&q=80'],
      compatible_bikes: ['Universal', 'Yamaha R15 V4', 'KTM RC 390', 'Kawasaki Ninja 400'],
      category: { name: 'Exhausts & Slipons', slug: 'exhausts' }, category_id: 1, rating: 4.8, review_count: 112
    },
    {
      id: 2, name: 'Aerodynamic Winglet Mirror Set', slug: 'aerodynamic-winglet-mirrors',
      description: 'CNC machined aerodynamic winglet styled bar-end mirrors with 360-degree adjustment. Anti-vibration design for clear rear-view at all speeds.',
      price: 1499, sale_price: null, stock_quantity: 34, is_featured: true, is_flash_deal: false, is_active: true,
      images: ['https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=800&q=80'],
      compatible_bikes: ['Universal', 'Yamaha MT-15', 'KTM Duke 390', 'Royal Enfield Hunter 350'],
      category: { name: 'Aerodynamics & Visors', slug: 'aerodynamics' }, category_id: 2, rating: 4.6, review_count: 87
    },
    {
      id: 3, name: 'R15 V4 Frame Slider Crash Guard Kit', slug: 'r15-v4-frame-slider-crash-guard',
      description: 'Heavy-duty aluminium & UHMW PE tip crash guard sliders. Prevents catastrophic frame damage during low-speed drops.',
      price: 1899, sale_price: 1599, stock_quantity: 22, is_featured: true, is_flash_deal: false, is_active: true,
      images: ['https://images.unsplash.com/photo-1558981285-6f0c8c35d1c0?w=800&q=80'],
      compatible_bikes: ['Yamaha R15 V4', 'Yamaha R15 V3'],
      category: { name: 'Crash Protection', slug: 'crash-protection' }, category_id: 3, rating: 4.9, review_count: 203
    },
    {
      id: 4, name: 'LED DRL Halo Headlight Projector', slug: 'led-drl-halo-headlight',
      description: 'Ultra-bright 6500K LED projector headlight with daytime running ring halo. Plug-and-play installation, IP67 waterproof rated.',
      price: 3499, sale_price: 2799, stock_quantity: 9, is_featured: false, is_flash_deal: true, is_active: true,
      images: ['https://images.unsplash.com/photo-1558981033-0f0309284409?w=800&q=80'],
      compatible_bikes: ['Yamaha R15 V4', 'KTM Duke 390', 'Kawasaki Z400'],
      category: { name: 'LED Lighting', slug: 'led-lighting' }, category_id: 4, rating: 4.5, review_count: 58
    },
    {
      id: 5, name: 'MotoBlitz Racing Gloves - Pro Touch', slug: 'motoblitz-racing-gloves',
      description: 'CE Level 2 certified full-gauntlet racing gloves with premium kangaroo leather palm, carbon fibre knuckle protectors, and touch-screen compatible fingers.',
      price: 2999, sale_price: null, stock_quantity: 41, is_featured: false, is_flash_deal: false, is_active: true,
      images: ['https://images.unsplash.com/photo-1558981408-db752f897d43?w=800&q=80'],
      compatible_bikes: ['Universal'],
      category: { name: 'Riding Gear', slug: 'riding-gear' }, category_id: 5, rating: 4.7, review_count: 75
    },
    {
      id: 6, name: 'KTM Duke 390 Tribal Wrap Decal Set', slug: 'ktm-duke-390-tribal-decal',
      description: 'Professionally designed matte black and red tribal decal wrap set for the Duke 390. Premium 3M vinyl, heat and UV resistant for 5+ years.',
      price: 899, sale_price: 699, stock_quantity: 55, is_featured: false, is_flash_deal: false, is_active: true,
      images: ['https://images.unsplash.com/photo-1558981353-fce17ef8e12f?w=800&q=80'],
      compatible_bikes: ['KTM Duke 390', 'KTM RC 390'],
      category: { name: 'Custom Decals', slug: 'decals' }, category_id: 6, rating: 4.4, review_count: 42
    },
    {
      id: 7, name: 'Universal Adjustable Short Levers (Red)', slug: 'adjustable-short-levers-red',
      description: 'CNC machined adjustable short brake and clutch lever set in racing red anodised finish. 6-position reach adjustment for perfect cockpit ergonomics.',
      price: 1199, sale_price: 999, stock_quantity: 0, is_featured: false, is_flash_deal: false, is_active: true,
      images: ['https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=800&q=80'],
      compatible_bikes: ['Universal'],
      category: { name: 'Aerodynamics & Visors', slug: 'aerodynamics' }, category_id: 2, rating: 4.6, review_count: 93
    },
    {
      id: 8, name: 'Royal Enfield Hunter 350 Crash Bars', slug: 'hunter-350-crash-bars',
      description: 'Tubular steel powder-coated engine crash guard for Royal Enfield Hunter 350. Protects engine casing and fuel tank on drops.',
      price: 2499, sale_price: null, stock_quantity: 15, is_featured: true, is_flash_deal: false, is_active: true,
      images: ['https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=800&q=80'],
      compatible_bikes: ['Royal Enfield Hunter 350', 'Royal Enfield Meteor 350'],
      category: { name: 'Crash Protection', slug: 'crash-protection' }, category_id: 3, rating: 4.8, review_count: 64
    },
  ];

  let filtered = [...products];
  if (filters.isFeatured) filtered = filtered.filter(p => p.is_featured);
  if (filters.isFlashDeal) filtered = filtered.filter(p => p.is_flash_deal);
  if (filters.category) filtered = filtered.filter(p => p.category_id === Number(filters.category));
  if (filters.bike && filters.bike !== 'Universal') {
    filtered = filtered.filter(p => p.compatible_bikes.includes(filters.bike) || p.compatible_bikes.includes('Universal'));
  }
  if (filters.search) {
    const q = filters.search.toLowerCase();
    filtered = filtered.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
  }
  return filtered;
}

export function getSampleBanners() {
  return [
    {
      id: 1, title: 'RIDE BEYOND LIMITS', subtitle: 'Premium exhausts, crash guards & aerodynamics for serious riders. Free shipping on orders above ₹999.',
      cta_text: 'Shop Now', cta_link: '/products', is_active: true, display_order: 1,
      image_url: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=1400&q=80',
    },
    {
      id: 2, title: 'FLASH SALE — UP TO 40% OFF', subtitle: 'Limited-time deals on LED headlights, custom decals, and winglet mirrors. Grab before they\'re gone!',
      cta_text: 'View Flash Deals', cta_link: '/flash-deals', is_active: true, display_order: 2,
      image_url: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=1400&q=80',
    },
  ];
}
