import React, { createContext, useContext, useEffect, useReducer, useCallback } from 'react';

const CartContext = createContext(null);

const STORAGE_KEY = 'motoblitz_cart';
const WISHLIST_KEY = 'motoblitz_wishlist';

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find(i => i.id === action.product.id);
      if (existing) {
        return {
          ...state,
          items: state.items.map(i =>
            i.id === action.product.id ? { ...i, quantity: i.quantity + 1 } : i
          ),
        };
      }
      return { ...state, items: [...state.items, { ...action.product, quantity: 1 }] };
    }
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter(i => i.id !== action.id) };
    case 'UPDATE_QUANTITY':
      if (action.quantity <= 0) {
        return { ...state, items: state.items.filter(i => i.id !== action.id) };
      }
      return {
        ...state,
        items: state.items.map(i =>
          i.id === action.id ? { ...i, quantity: action.quantity } : i
        ),
      };
    case 'CLEAR_CART':
      return { ...state, items: [] };
    case 'TOGGLE_WISHLIST': {
      const isWishlisted = state.wishlist.some(i => i.id === action.product.id);
      return {
        ...state,
        wishlist: isWishlisted
          ? state.wishlist.filter(i => i.id !== action.product.id)
          : [...state.wishlist, action.product],
      };
    }
    case 'LOAD_STORED':
      return action.state;
    default:
      return state;
  }
}

const initialState = { items: [], wishlist: [] };

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState, () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const wishlist = JSON.parse(localStorage.getItem(WISHLIST_KEY) || '[]');
      return stored ? { items: JSON.parse(stored), wishlist } : initialState;
    } catch {
      return initialState;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
      localStorage.setItem(WISHLIST_KEY, JSON.stringify(state.wishlist));
    } catch {}
  }, [state]);

  const addItem = useCallback((product) => dispatch({ type: 'ADD_ITEM', product }), []);
  const removeItem = useCallback((id) => dispatch({ type: 'REMOVE_ITEM', id }), []);
  const updateQuantity = useCallback((id, quantity) => dispatch({ type: 'UPDATE_QUANTITY', id, quantity }), []);
  const clearCart = useCallback(() => dispatch({ type: 'CLEAR_CART' }), []);
  const toggleWishlist = useCallback((product) => dispatch({ type: 'TOGGLE_WISHLIST', product }), []);
  const isWishlisted = useCallback((id) => state.wishlist.some(i => i.id === id), [state.wishlist]);

  const cartTotal = state.items.reduce(
    (sum, item) => sum + (item.sale_price || item.price) * item.quantity,
    0
  );
  const cartCount = state.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        wishlist: state.wishlist,
        cartTotal,
        cartCount,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        toggleWishlist,
        isWishlisted,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
