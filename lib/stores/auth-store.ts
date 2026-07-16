import { create } from "zustand";
import { persist } from "zustand/middleware";

type AuthUser = {
  username: string;
  userGroup: string;
  userRole: string;
  userEmail: string;
};

type AuthState = {
  user: AuthUser | null;
  login: (username: string) => boolean;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      login: (username) => {
        set({
          user: {
            username,
            userGroup: "88+DE",
            userRole: "root",
            userEmail: "demo@example.com",
          },
        });
        return true;
      },
      logout: () => set({ user: null }),
    }),
    {
      name: "fork-repair-auth",
    },
  ),
);
