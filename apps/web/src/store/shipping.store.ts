import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ShippingOption {
  name: string;
  price: number;
  deadline: number;
}

interface ShippingData {
  cep: string;
  city: string;
  state: string;
  pac: ShippingOption;
  sedex: ShippingOption;
}

interface ShippingState {
  shippingLoading: boolean;
  shipping: ShippingData | null;
  calculate: (cep: string) => Promise<void>;
  clear: () => void;
}

export const useShippingStore = create<ShippingState>()(
  persist(
    (set) => ({
      shippingLoading: false,
      shipping: null,

      calculate: async (cep: string) => {
        set({ shippingLoading: true });

        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/shipping/${cep}`,
            {
              credentials: 'include',
            }
          );

          if (!response.ok) {
            throw new Error("Erro ao buscar o frete");
          }

          const data: ShippingData = await response.json();

          set({ shipping: data });
        } catch (error) {
          console.error("Erro na requisição de frete:", error);
          set({ shipping: null });
        } finally {
          set({ shippingLoading: false });
        }
      },

      clear: () => set({ shipping: null }),
    }),
    {
      name: 'shipping-storage',
      partialize: (state) => ({ shipping: state.shipping }), 
    }
  )
);