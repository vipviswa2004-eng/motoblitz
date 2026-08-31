import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const GarageContext = createContext(null);

const STORAGE_KEY = 'motoblitz_selected_bike';
const STORAGE_BIKES_KEY = 'motoblitz_bike_models_v2';

export const INITIAL_BIKE_MODELS = [
  { id: 1, label: 'All Bikes (Universal)', value: 'Universal', brand: 'Universal', icon: '🏍️', cc: null },
  { id: 2, label: 'Yamaha R15 V4', value: 'Yamaha R15 V4', brand: 'Yamaha', icon: '🔵', cc: 155 },
  { id: 3, label: 'Yamaha MT-15', value: 'Yamaha MT-15', brand: 'Yamaha', icon: '🔵', cc: 155 },
  { id: 4, label: 'Yamaha FZ-S V3', value: 'Yamaha FZ-S V3', brand: 'Yamaha', icon: '🔵', cc: 149 },
  { id: 5, label: 'KTM Duke 390', value: 'KTM Duke 390', brand: 'KTM', icon: '🟠', cc: 373 },
  { id: 6, label: 'KTM RC 390', value: 'KTM RC 390', brand: 'KTM', icon: '🟠', cc: 373 },
  { id: 7, label: 'KTM Duke 250', value: 'KTM Duke 250', brand: 'KTM', icon: '🟠', cc: 248 },
  { id: 8, label: 'Royal Enfield Hunter 350', value: 'Royal Enfield Hunter 350', brand: 'Royal Enfield', icon: '🟤', cc: 349 },
  { id: 9, label: 'Royal Enfield Meteor 350', value: 'Royal Enfield Meteor 350', brand: 'Royal Enfield', icon: '🟤', cc: 349 },
  { id: 10, label: 'Royal Enfield Classic 350', value: 'Royal Enfield Classic 350', brand: 'Royal Enfield', icon: '🟤', cc: 349 },
  { id: 11, label: 'Royal Enfield GT 650', value: 'Royal Enfield GT 650', brand: 'Royal Enfield', icon: '🟤', cc: 648 },
  { id: 12, label: 'Kawasaki Ninja 400', value: 'Kawasaki Ninja 400', brand: 'Kawasaki', icon: '🟢', cc: 399 },
  { id: 13, label: 'Kawasaki Z400', value: 'Kawasaki Z400', brand: 'Kawasaki', icon: '🟢', cc: 399 },
  { id: 14, label: 'Honda CB300R', value: 'Honda CB300R', brand: 'Honda', icon: '🔴', cc: 293 },
  { id: 15, label: 'Bajaj Dominar 400', value: 'Bajaj Dominar 400', brand: 'Bajaj', icon: '⚫', cc: 373 },
  { id: 16, label: 'TVS Apache RR 310', value: 'TVS Apache RR 310', brand: 'TVS', icon: '⚫', cc: 312 },
];

export const BIKE_MODELS = INITIAL_BIKE_MODELS;

export function GarageProvider({ children }) {
  const [bikes, setBikes] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_BIKES_KEY);
      if (stored) return JSON.parse(stored);
    } catch {}
    return INITIAL_BIKE_MODELS;
  });

  const [selectedBike, setSelectedBike] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) || 'Universal';
    } catch {
      return 'Universal';
    }
  });
  const [isGarageOpen, setIsGarageOpen] = useState(false);

  // Fetch remote bikes on mount
  useEffect(() => {
    if (!supabase) return;
    supabase
      .from('bike_models')
      .select('*')
      .order('brand', { ascending: true })
      .then(({ data, error }) => {
        if (!error && data && data.length > 0) {
          setBikes(data);
        }
      });
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, selectedBike);
    } catch {}
  }, [selectedBike]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_BIKES_KEY, JSON.stringify(bikes));
    } catch {}
  }, [bikes]);

  const selectBike = (bikeValue) => {
    setSelectedBike(bikeValue);
    setIsGarageOpen(false);
  };

  const addBike = async (bikeData) => {
    const newBike = {
      ...bikeData,
      id: Date.now(),
      value: bikeData.label,
    };
    setBikes(prev => [...prev, newBike]);

    if (supabase) {
      try {
        await supabase.from('bike_models').insert([{
          label: bikeData.label,
          value: bikeData.label,
          brand: bikeData.brand,
          icon: bikeData.icon,
          cc: bikeData.cc,
        }]);
      } catch (err) {
        console.warn('Supabase bike insert failed:', err);
      }
    }
    return newBike;
  };

  const updateBike = async (id, updatedData) => {
    setBikes(prev => prev.map(b => b.id === id ? { ...b, ...updatedData, value: updatedData.label || b.value } : b));

    if (supabase) {
      try {
        await supabase.from('bike_models').update(updatedData).eq('id', id);
      } catch (err) {
        console.warn('Supabase bike update failed:', err);
      }
    }
  };

  const deleteBike = async (id) => {
    setBikes(prev => prev.filter(b => b.id !== id));

    if (supabase) {
      try {
        await supabase.from('bike_models').delete().eq('id', id);
      } catch (err) {
        console.warn('Supabase bike delete failed:', err);
      }
    }
  };

  const currentBike = bikes.find(b => b.value === selectedBike) || bikes[0] || INITIAL_BIKE_MODELS[0];

  return (
    <GarageContext.Provider
      value={{
        bikes,
        selectedBike,
        currentBike,
        selectBike,
        isGarageOpen,
        setIsGarageOpen,
        addBike,
        updateBike,
        deleteBike,
      }}
    >
      {children}
    </GarageContext.Provider>
  );
}

export function useGarage() {
  const ctx = useContext(GarageContext);
  if (!ctx) throw new Error('useGarage must be used within GarageProvider');
  return ctx;
}
