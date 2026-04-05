import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserInfo = {
  prenom: string;
  nom: string;
  phone: string;
};

type UserState = {
  // 🌐 Unique browser identifier — generated once, persisted forever
  browserUuid: string;
  // 👤 Customer info (filled after first order)
  user: UserInfo | null;
  setUser: (user: UserInfo) => void;
  clearUser: () => void;
};

/** Generate a simple UUID v4 */
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      // Generated once on first visit — never changes
      browserUuid: generateUUID(),
      user: null,
      setUser: (user) => set({ user }),
      clearUser: () => set({ user: null }),
    }),
    {
      name: 'aura-user-storage',
    }
  )
);
