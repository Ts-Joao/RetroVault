import type { Product } from "../types/product"
import type { Installment } from "../types/installments"
import { calculeCartInstallments } from "./installmentsUtils"

export function getProductInstallments(product: Product, quantity = 1): Installment[] {
  return calculeCartInstallments([
    {
      price: product.price,
      quantity,
      max_installments: product.max_installments,
      free_installments: product.free_installments,
      min_installment_amount: product.min_installment_amount,
      monthly_interest_rate: product.monthly_interest_rate,
    },
  ])
}

export function getBestProductInstallment(product: Product, quantity = 1): Installment {
  const installments = getProductInstallments(product, quantity)
  return (
    installments.at(-1) ?? {
      amount: 1,
      installments: 1,
      installment_amount: product.price,
      total_amount: product.price,
      has_Interest: false,
      label: `1x de R$ ${product.price}`,
      sublabel: "",
    }
  )
}
