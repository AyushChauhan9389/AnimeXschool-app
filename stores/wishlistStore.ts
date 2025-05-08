import { createWithEqualityFn as create } from 'zustand/traditional';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Product } from '@/types/product';

interface WishlistState {
  items: Product[];
  addToWishlist: (item: Product) => void;
  removeFromWishlist: (itemId: number) => void;
  clearWishlist: () => void;
  isInWishlist: (itemId: number) => boolean;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],

      addToWishlist: item => {
        if (!get().isInWishlist(item.id)) {
          set(state => ({ items: [...state.items, item] }));
        }
      },

      removeFromWishlist: itemId => {
        set(state => ({
          items: state.items.filter(item => item.id !== itemId),
        }));
      },

      clearWishlist: () => set({ items: [] }),

      isInWishlist: itemId => {
        return get().items.some(item => item.id === itemId);
      },
    }),
    {
      name: 'wishlist-storage', // Unique name for storage
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
