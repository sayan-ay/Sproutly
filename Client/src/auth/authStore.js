import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      setUser: (user) => set({ user, isAuthenticated: true }),
      clearUser: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: "user-storage", // key in localStorage
      version: 1,   
      migrate: (persistedState, version) => {
        return persistedState; 
      },
      partialize: (state) => ({
       
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
