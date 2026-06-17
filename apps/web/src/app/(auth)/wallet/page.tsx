'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  PiWalletBold, 
  PiArrowDownLeftBold, 
  PiArrowUpRightBold, 
  PiPlusCircleBold, 
  PiCoinsBold,
  PiClockCounterClockwiseBold
} from 'react-icons/pi'
import { useAuth } from '@/lib/context/auth.context'
import { useToast } from '@/components/ui/toast-provider'
import { getWallet, getWalletHistory, depositWallet } from '@/lib/services/wallet.client'
import { formatPrice } from '@retrovault/core'

type WalletData = {
  balance: string | number
}

type HistoryItem = {
  id: string
  description: string
  amount: string | number
  type: 'DEPOSIT' | 'WITHDRAW' | 'PURCHASE'
  createdAt: string
}

export default function WalletPage() {
  const { user } = useAuth()
  const toast = useToast()
  const router = useRouter()

  const [wallet, setWallet] = useState<WalletData | null>(null)
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [depositAmount, setDepositAmount] = useState<string>('')
  const [isDepositing, setIsDepositing] = useState(false)

  async function loadWalletData() {
    if (!user?.sub) return
    try {
      const [walletData, historyData] = await Promise.all([
        getWallet(user.sub),
        getWalletHistory(user.sub)
      ])
      setWallet(walletData)
      setHistory(historyData)
    } catch (error) {
      toast.error('Erro ao carregar dados da carteira.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!user) {
      return
    }
    loadWalletData()
  }, [user])

  async function handleDeposit(e: React.FormEvent) {
    e.preventDefault()
    if (!user?.sub) return

    const value = parseFloat(depositAmount.replace(',', '.'))
    if (isNaN(value) || value <= 0) {
      toast.error('Insira um valor válido para depósito.')
      return
    }

    setIsDepositing(true)
    try {
      await depositWallet(user.sub, value)
      toast.success(`Depósito de R$ ${formatPrice(value)} realizado com sucesso!`)
      setDepositAmount('')
      await loadWalletData()
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Erro ao processar depósito.')
    } finally {
      setIsDepositing(false)
    }
  }

  const quickValues = [20, 50, 100, 200]

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 font-chakra-petch">
        <div className="animate-pulse flex flex-col items-center gap-3">
          <PiWalletBold className="text-4xl text-zinc-300 animate-bounce" />
          <p className="text-sm text-zinc-400">Carregando sua carteira digital...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto w-[95%] max-w-6xl py-8 font-chakra-petch space-y-6">
      
      {/* Cabeçalho */}
      <div className="flex items-center justify-between border-b border-zinc-200 pb-5">
        <div className="flex items-center gap-3">
          <div className="bg-amber-50 p-2.5 rounded-xl border border-amber-100 flex items-center justify-center text-[#D9A128]">
            <PiWalletBold className="text-2xl" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Minha Carteira</h1>
            <p className="text-xs text-zinc-400 mt-0.5">Gerencie seu saldo virtual e acompanhe seu extrato</p>
          </div>
        </div>
        <div className="text-right hidden sm:block">
          <p className="text-xs text-zinc-400 font-sans">Usuário</p>
          <p className="font-bold text-zinc-800 text-sm">{user?.name}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[380px_1fr] items-start">
        
        {/* COLUNA DA ESQUERDA: Saldo e Adicionar Dinheiro */}
        <div className="space-y-6">
          
          {/* Card de Saldo Atual */}
          <div className="relative overflow-hidden bg-zinc-900 text-white p-6 rounded-2xl border border-zinc-800 shadow-lg">
            <div className="absolute right-[-20px] bottom-[-20px] text-zinc-800/40 text-9xl pointer-events-none font-black select-none">
              <PiCoinsBold />
            </div>
            <p className="text-xs font-bold uppercase tracking-widest text-zinc-400">Saldo Disponível</p>
            <h2 className="text-4xl font-black text-white mt-2 tracking-tight">
              R$ {wallet ? formatPrice(Number(wallet.balance)) : '0,00'}
            </h2>
            <div className="mt-4 flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg w-fit">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              <span>Carteira ativa e pronta para uso</span>
            </div>
          </div>

          {/* Form de Depósito */}
          <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-zinc-100">
              <PiPlusCircleBold className="text-xl text-[#D9A128]" />
              <h3 className="font-bold text-zinc-900 text-sm uppercase tracking-wider">Depositar Saldo</h3>
            </div>

            <form onSubmit={handleDeposit} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-wide">Valor do depósito (R$)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-zinc-400">R$</span>
                  <input
                    type="text"
                    placeholder="0,00"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value.replace(/[^0-9,.]/g, ''))}
                    className="w-full rounded-xl border border-zinc-300 pl-10 pr-4 py-2.5 text-sm font-bold focus:outline-none focus:border-zinc-500 text-zinc-800 bg-zinc-50/40 font-sans placeholder-zinc-300"
                  />
                </div>
              </div>

              {/* Botões Rápidos */}
              <div className="grid grid-cols-4 gap-2">
                {quickValues.map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setDepositAmount(val.toString())}
                    className="py-1.5 text-xs font-bold text-zinc-600 bg-zinc-100 rounded-lg hover:bg-zinc-200/80 transition active:scale-95 border border-zinc-200/30 cursor-pointer"
                  >
                    +{val}
                  </button>
                ))}
              </div>

              <button
                type="submit"
                disabled={isDepositing || !depositAmount}
                className="w-full rounded-xl bg-[#D9A128] py-3 text-xs font-bold text-white uppercase tracking-wider hover:brightness-95 transition disabled:opacity-50 font-chakra-petch shadow-sm mt-2 cursor-pointer"
              >
                {isDepositing ? 'Processando...' : 'Adicionar fundos'}
              </button>
            </form>
          </div>

        </div>

        {/* COLUNA DA DIREITA: Extrato / Histórico */}
        <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm space-y-4 min-h-[400px]">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
            <div className="flex items-center gap-2">
              <PiClockCounterClockwiseBold className="text-xl text-zinc-500" />
              <h3 className="text-lg font-bold text-zinc-900">Extrato de Movimentações</h3>
            </div>
            <span className="text-xs bg-zinc-100 text-zinc-500 px-2 py-0.5 rounded font-bold">
              {history.length} {history.length === 1 ? 'operação' : 'operações'}
            </span>
          </div>

          <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1">
            {history.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center px-4">
                <p className="text-zinc-400 text-sm font-medium">Sua carteira ainda não possui nenhuma movimentação.</p>
                <p className="text-xs text-zinc-300 mt-1 font-sans">Deposite fundos para começar a comprar ou vender na plataforma.</p>
              </div>
            ) : (
              history.map((item) => {
                const isInput = item.type === 'DEPOSIT';
                
                return (
                  <article 
                    key={item.id} 
                    className="flex items-center justify-between rounded-xl border border-zinc-100 bg-zinc-50/40 p-4 transition hover:bg-zinc-50"
                  >
                    <div className="flex items-center gap-3">
                      {/* Ícone dinâmico baseado no tipo */}
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-base border shrink-0 ${
                        isInput 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                          : 'bg-red-50 text-red-600 border-red-100'
                      }`}>
                        {isInput ? <PiArrowDownLeftBold /> : <PiArrowUpRightBold />}
                      </div>
                      <div>
                        <p className="font-bold text-sm text-zinc-800 leading-tight">
                          {item.description || (isInput ? 'Depósito via Pix' : 'Pagamento de Pedido')}
                        </p>
                        <p className="text-[11px] text-zinc-400 font-sans mt-0.5">
                          {new Date(item.createdAt).toLocaleString('pt-BR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className={`font-black text-sm ${isInput ? 'text-emerald-600' : 'text-red-600'}`}>
                        {isInput ? '+' : '-'} R$ {formatPrice(Number(item.amount))}
                      </p>  
                      <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                        isInput ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                      }`}>
                        {item.type === 'DEPOSIT' ? 'Entrada' : 'Saída'}
                      </span>
                    </div>
                  </article>
                )
              })
            )}
          </div>
        </div>

      </div>
    </div>
  )
}