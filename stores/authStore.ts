import { createWithEqualityFn as create } from 'zustand/traditional';

import { getAuthToken, removeAuthToken } from '@/api/tokensApi';
import { getUser } from '@/api/authApi';
import { User } from '@/types/user';

type AuthStore = {
  isAuthenticated: boolean;
  /**
   * A boolean represent where `initializeAuth()` fn is pending
   */
  isAuthenticating: boolean;
  user: User | null;
  /**
   * Initialize the auth store
   * - check if the user is authenticated
   * - if authenticated, set the user
   */
  initializeAuth: () => Promise<void>;
  setUser: (user: User | null) => void;
  logout: () => Promise<void>;
};

export const useAuthStore = create<AuthStore>((set, get) => ({
  isAuthenticated: false,
  isAuthenticating: false,
  user: null,

  initializeAuth: async () => {
    try {
      set({
        isAuthenticating: true,
      });
      const token = await getAuthToken();

      if (token) {
        const user = await getUser();
        set({ user, isAuthenticated: true });
      } else {
        set({ user: null, isAuthenticated: false });
      }
    } catch (error) {
      set({ user: null, isAuthenticated: false });
      // remove the token if the error is 401
      if ((error as any)?.status === 401) {
        await removeAuthToken();
      }
    } finally {
      set({
        isAuthenticating: false,
      });
    }
  },

  setUser: user => {
    set({ user, isAuthenticated: !!user });
  },

  logout: async () => {
    set({ isAuthenticating: true });

    await removeAuthToken();

    set({ user: null, isAuthenticating: false, isAuthenticated: false });
  },
}));
