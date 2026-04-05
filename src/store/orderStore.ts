import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type OrderItem = {
  reference:   string;
  quantity:    number;
  weightGrams: number;
  pricePerGram: number;
  itemTotal:   number;
};

export type Order = {
  /** Local ID (timestamp string) */
  id:        string;
  /** Reference returned by Supabase if available */
  dbId?:     number;
  prenom:    string;
  nom:       string;
  phone:     string;
  items:     OrderItem[];
  totalMad:  number;
  locale:    string;
  status:    'pending' | 'confirmed' | 'cancelled';
  createdAt: string; // ISO string
};

type OrderState = {
  orders: Order[];
  addOrder: (order: Omit<Order, 'id' | 'createdAt' | 'status'>) => void;
  clearOrders: () => void;
};

export const useOrderStore = create<OrderState>()(
  persist(
    (set) => ({
      orders: [],

      addOrder: (order) =>
        set((state) => ({
          orders: [
            {
              ...order,
              id:        Date.now().toString(),
              status:    'pending',
              createdAt: new Date().toISOString(),
            },
            ...state.orders, // newest first
          ],
        })),

      clearOrders: () => set({ orders: [] }),
    }),
    {
      name: 'aura-orders-storage',
    }
  )
);
