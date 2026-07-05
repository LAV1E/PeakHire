import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// NOTE: The backend uses HTTP-only cookies for auth tokens.
// HTTP-only cookies are NOT accessible from JavaScript, so we do NOT store
// or read tokens here. We only store the user profile and authentication status.
// The browser handles sending the accessToken cookie automatically on every request.

export const useAuthStore = create()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      setUser: (user) => set({ user, isAuthenticated: true }),
      setAuthenticated: (value) => set({ isAuthenticated: value }),
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: "peakhire-auth",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
