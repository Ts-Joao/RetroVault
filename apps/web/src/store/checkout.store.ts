import { create } from "zustand";

export type PaymentValue = "pix" | "credit_card" | "debit_card" | "wallet";

interface CheckoutState {
  // Estados do Frete
  dynamicShippingCost: number;
  address: string;
  setShippingData: (cost: number, fullAddress: string) => void;

  // Estados do Cupom
  couponCode: string;
  couponDiscount: number;
  applyCoupon: (code: string, discount: number) => void;

  // Estados do Pagamento
  selectedPayment: PaymentValue | undefined;
  installmentIndex: number | null;
  paymentToken: string;
  setPayment: (method: PaymentValue) => void;
  setInstallment: (index: number | null) => void;
  setPaymentToken: (token: string) => void;

  // Resetador
  resetCheckout: () => void;
}

export const useCheckoutStore = create<CheckoutState>((set) => ({
  dynamicShippingCost: 0,
  address: "",
  setShippingData: (cost, fullAddress) => set({ dynamicShippingCost: cost, address: fullAddress }),

  couponCode: "",
  couponDiscount: 0,
  applyCoupon: (code, discount) => set({ couponCode: code, couponDiscount: discount }),

  selectedPayment: undefined,
  installmentIndex: null,
  paymentToken: "",
  setPayment: (method) => set({ selectedPayment: method, installmentIndex: null }), // limpa parcela ao trocar método
  setInstallment: (index) => set({ installmentIndex: index }),
  setPaymentToken: (token) => set({ paymentToken: token }),

  resetCheckout: () => set({
    dynamicShippingCost: 0,
    address: "",
    couponCode: "",
    couponDiscount: 0,
    selectedPayment: undefined,
    installmentIndex: null,
    paymentToken: "",
  }),
}));