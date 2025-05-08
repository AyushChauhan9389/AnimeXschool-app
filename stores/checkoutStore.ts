import { createWithEqualityFn as create } from 'zustand/traditional';

import { Order, RazorpayOrder } from '@/types/order';

type CheckoutStore = {
  order: Order | null;
  setOrder: (order: Order | null) => void;
  razorpayOrder: RazorpayOrder | null;
  setRazorpayOrder: (order: RazorpayOrder | null) => void;
  clear: () => void;
};

export const useCheckoutStore = create<CheckoutStore>((set, get) => ({
  order: null,
  setOrder: order => set({ order }),
  razorpayOrder: null,
  setRazorpayOrder: order => set({ razorpayOrder: order }),
  clear: () => set({ order: null, razorpayOrder: null }),
}));
