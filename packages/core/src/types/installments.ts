export type Installment = {
  amount: number
  installment_amount: number
  total_amount: number
  has_Interest: boolean
  label: string
  sublabel: string
}

export type InstallmentProduct = {
  price: number;
  quantity: number;
  max_installments: number;
  free_installments: number;
  min_installment_amount: number;
  monthly_interest_rate: number;
};