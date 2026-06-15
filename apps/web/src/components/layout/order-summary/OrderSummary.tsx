"use client";

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { IoIosArrowDown } from "react-icons/io";
import { useSelect } from "@retrovault/ui-hooks";
import { PiPixLogoBold, PiCreditCardBold, PiWalletBold } from "react-icons/pi";
import { calculeCartInstallments, CartItem, formatPrice, Installment, InstallmentProduct, Product } from "@retrovault/core";
import { useAuth } from '@/lib/context/auth.context';
import { useToast } from '@/components/ui/toast-provider';
import { checkoutOrder, PaymentMethod } from '@/lib/services/orders.client';
import { simulatePayment, confirmPayment } from '@/lib/services/payment.client';
import { useCartStore, useWalletStore } from '@retrovault/store';

export type PaymentValue = 'pix' | 'credit_card' | 'debit_card' | 'wallet';

type Props = {
  total: number
  shippingCost: number
  itens: CartItem[]
  checkoutMode?: 'cart' | 'single'
  product?: Product
  seller?: { id: string; slug: string; name: string }
  buyerWallet?: { balance: string | number } | null
  walletHistory?: unknown[]
  walletLoading?: boolean
}

export default function Ordersummary({ total, shippingCost, itens, buyerWallet }: Props) {
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()
  const { clearLocally } = useCartStore()
  const { clear: clearWallet } = useWalletStore()
  const [address, setAddress] = useState('')
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [paymentToken, setPaymentToken] = useState('')

  const cupom = 0
  const finalPrice = total - cupom + shippingCost

  const { isOpen, selected, toggle, selectOption } = useSelect<PaymentValue>();
  const { isOpen: isOpenInstallment, selected: installmentIndex, toggle: toggleInstallment, selectOption: selectInstallment } = useSelect<number>();

  const installmentProducts: InstallmentProduct[] = itens.map(item => ({
    price: item.product.price,
    quantity: item.amount,
    max_installments: item.product.max_installments,
    free_installments: item.product.free_installments,
    min_installment_amount: item.product.min_installment_amount,
    monthly_interest_rate: item.product.monthly_interest_rate,
  }))

  const installment: Installment[] = calculeCartInstallments(installmentProducts, finalPrice)
  const selectedInstallment = installmentIndex != null ? installment[installmentIndex] : null

  const paymentOptions = useMemo(() => ([
    {
      value: 'wallet' as PaymentValue,
      label: 'Carteira',
      sublabel: buyerWallet ? `Saldo: R$ ${Number(buyerWallet.balance).toFixed(2)}` : 'Saldo indisponível',
      icon: <PiWalletBold />,
      iconClass: 'bg-emerald-50 text-emerald-700',
    },
    {
      value: 'pix' as PaymentValue,
      label: 'PIX',
      sublabel: 'Transferência instantânea',
      icon: <PiPixLogoBold />,
      iconClass: 'bg-teal-50 text-teal-700',
    },
    {
      value: 'credit_card' as PaymentValue,
      label: 'Cartão de Crédito',
      sublabel: 'Visa, Mastercard, Elo',
      icon: <PiCreditCardBold />,
      iconClass: 'bg-red-50 text-prim',
    },
    {
      value: 'debit_card' as PaymentValue,
      label: 'Cartão de Débito',
      sublabel: 'Pagamento imediato',
      icon: <PiCreditCardBold />,
      iconClass: 'bg-blue-50 text-blue-700',
    },
  ]), [buyerWallet])

  const selectedOption = paymentOptions.find((p) => p.value === selected)

  async function handleCheckout() {
    if (!user?.sub) {
      toast('Faça login para continuar.', 'error')
      router.push('/login')
      return
    }

    if (!address.trim()) {
      toast('Informe o endereço de entrega.', 'error')
      return
    }

    if (!selected) {
      toast('Selecione a forma de pagamento.', 'error')
      return
    }

    setCheckoutLoading(true)
    try {
      const paymentMethodMap: Record<PaymentValue, PaymentMethod> = { pix: 'PIX', credit_card: 'CREDIT_CARD', debit_card: 'DEBIT_CARD', wallet: 'WALLET' }
      const order = await checkoutOrder(user.sub, address, paymentMethodMap[selected], selected === 'credit_card' ? (installmentIndex ?? 1) + 1 : 1)

      if (selected === 'wallet') {
        toast('Pagamento aprovado pela carteira.', 'success')
        clearLocally()
        clearWallet()
        router.push(`/profile/${user.sub}/${user.slug}`)
        return
      }

      const token = await simulatePayment(order.id, user.sub)
      setPaymentToken(token)
      toast('Pedido criado. Confirme o pagamento com o token gerado.', 'success')
    } catch (error: any) {
      toast(error?.response?.data?.message || 'Erro ao finalizar checkout.', 'error')
    } finally {
      setCheckoutLoading(false)
    }
  }

  async function handleConfirmPayment() {
    if (!paymentToken) {
      toast('Gere o token primeiro.', 'error')
      return
    }

    setCheckoutLoading(true)
    try {
      await confirmPayment(paymentToken)
      toast('Pagamento confirmado com sucesso.', 'success')
      clearLocally()
      router.push(`/profile/${user?.sub}/${user?.slug}`)
    } catch (error: any) {
      toast(error?.response?.data?.message || 'Erro ao confirmar pagamento.', 'error')
    } finally {
      setCheckoutLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-6 justify-center">
      <div className="grid gap-2 rounded-lg bg-[#d9d9d9] px-3 py-2">
        <h1>Endereço de entrega</h1>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Rua, número, bairro, cidade"
          className="flex w-full justify-self-center rounded-lg bg-white px-2 py-1 focus:outline-none"
        />
      </div>

      <div className="grid gap-2 rounded-lg bg-[#d9d9d9] px-3 py-2">
        <h1>Cupom:</h1>
        <div className="grid gap-1">
          <input type="text" placeholder="Insira o Cupom" className="flex w-full justify-self-center rounded-lg bg-white px-2 py-1 focus:outline-none" />
          <input type="button" value="Aplicar Cupom" className="w-full cursor-pointer rounded-md bg-submit py-0.5 text-sm" />
        </div>
      </div>

      <div className="flex flex-col justify-between rounded-lg bg-[#d9d9d9] px-3 py-2">
        <div className="grid gap-0.5">
          <p className="flex justify-between">Produto: <span className="text-[#168634]">+ R$ {formatPrice(total)}</span></p>
          <p className="flex justify-between">Frete: <span className="text-[#168634]">+ R$ {formatPrice(shippingCost)}</span></p>
          <p className="flex justify-between">Cupom: <span className="text-prim">- R$ {formatPrice(cupom)}</span></p>
        </div>
        <h1 className="flex justify-between text-xl">Total <span>R$ {formatPrice(finalPrice)}</span></h1>
      </div>

      <div className="rounded-lg bg-[#d9d9d9] px-3 py-2">
        <h1>Forma de pagamento</h1>
        <div className="relative w-full">
          <button onClick={toggle} className={`w-full px-2 py-1.5 bg-white text-start flex items-center justify-between gap-2 border border-gray-200 transition-all duration-150 cursor-pointer hover:border-gray-300 hover:bg-amber-50 ${isOpen ? 'rounded-b-lg border-t-0' : 'rounded-lg'}`}>
            <div className="flex items-center gap-2.5">
              <div className={`w-6 h-6 rounded-md flex items-center justify-center text-base shrink-0 ${selectedOption?.iconClass ?? 'bg-gray-100 text-gray-400'}`}>
                {selectedOption?.icon ?? <PiCreditCardBold />}
              </div>
              <span className={`text-sm font-medium ${selected ? 'text-gray-900' : 'text-gray-400'}`}>
                {selectedOption?.label ?? 'Selecione'}
              </span>
            </div>
            <IoIosArrowDown className={`text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
          </button>

          {isOpen && (
            <ul className="absolute bottom-full left-0 right-0 z-10 overflow-hidden rounded-t-xl border border-gray-300 border-b-0 bg-white">
              {paymentOptions.filter((p) => p.value !== selected).map((opt) => (
                <li key={opt.value} onClick={() => selectOption(opt.value)} className="flex cursor-pointer items-center gap-2.5 border-b border-gray-100 px-2 py-1.5 transition-colors hover:bg-amber-50">
                  <div className={`w-6 h-6 rounded-md flex items-center justify-center text-base shrink-0 ${opt.iconClass}`}>
                    {opt.icon}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{opt.label}</p>
                    <p className="text-xs text-gray-400">{opt.sublabel}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className={`grid transition-all duration-200 ${selected === 'credit_card' ? 'grid-rows-[1fr] mt-2' : 'grid-rows-[0fr]'}`}>
          <div className={`${isOpenInstallment ? 'overflow-visible' : 'overflow-hidden'} min-h-0`}>
            <div className="relative w-full">
              <button onClick={toggleInstallment} className={`w-full px-2 py-1.5 bg-white text-start flex items-center justify-between gap-2 border border-gray-200 transition-all duration-150 cursor-pointer hover:border-gray-300 hover:bg-amber-50 ${isOpenInstallment ? 'rounded-b-lg border-t-0' : 'rounded-lg'}`}>
                <span className={`text-sm font-medium ${selectedInstallment ? 'text-gray-900' : 'text-gray-400'}`}>
                  {selectedInstallment?.label ?? 'Selecione as parcelas'}
                </span>
                {selectedInstallment && <span className="text-xs text-gray-400">{selectedInstallment.sublabel}</span>}
                <IoIosArrowDown className={`transition-transform duration-200 ${isOpenInstallment ? 'rotate-180' : ''}`} />
              </button>

              {isOpenInstallment && (
                <ul className="absolute bottom-full left-0 right-0 z-10 overflow-hidden rounded-t-xl border border-gray-300 border-b-0 bg-white text-sm">
                  {installment.map((inst, i) => ({ inst, i })).filter(({ i }) => i !== installmentIndex).map(({ inst, i }) => (
                    <li key={inst.amount} onClick={() => selectInstallment(i)} className="flex cursor-pointer items-center gap-2.5 border-b border-gray-100 px-2 py-1.5 transition-colors hover:bg-amber-50">
                      <p>{inst.label}</p>
                      {inst.has_Interest && <p>{inst.sublabel}</p>}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        {selected === 'wallet' && buyerWallet && (
          <p className="mt-2 text-sm text-gray-600">Saldo atual: R$ {Number(buyerWallet.balance).toFixed(2)}</p>
        )}
      </div>

      <div className="grid gap-2">
        <button onClick={handleCheckout} disabled={checkoutLoading} className="rounded-lg bg-submit px-6 py-3 text-lg font-semibold disabled:opacity-60">
          {checkoutLoading ? 'Processando...' : selected === 'wallet' ? 'Pagar com carteira' : 'Gerar pagamento'}
        </button>
        {paymentToken && selected !== 'wallet' && (
          <div className="grid gap-2 rounded-lg bg-[#d9d9d9] p-3">
            <p className="text-sm text-gray-700">Token de confirmação</p>
            <div className="rounded-md bg-white px-3 py-2 font-mono text-sm break-all">{paymentToken}</div>
            <button onClick={handleConfirmPayment} disabled={checkoutLoading} className="rounded-lg bg-emerald-600 px-6 py-3 text-lg font-semibold text-white disabled:opacity-60">
              {checkoutLoading ? 'Confirmando...' : 'Confirmar pagamento'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
