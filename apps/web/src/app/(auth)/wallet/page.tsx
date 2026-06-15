import { getUserById } from '@/lib/services/user.server'
import { getWalletHistory, getWallet } from '@/lib/services/wallet.server'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

function parseSub(token: string) {
  const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64url').toString()) as { sub: string }
  return payload.sub
}

export default async function WalletPage() {
  const token = (await cookies()).get('access_token')?.value
  if (!token) redirect('/login')

  const sub = parseSub(token)
  const [user, wallet, history] = await Promise.all([
    getUserById(sub),
    getWallet(sub),
    getWalletHistory(sub),
  ])

  return (
    <div className="flex flex-col gap-6 p-5">
      <div>
        <h1 className="text-3xl font-bold">Carteira</h1>
        <p className="text-gray-600">{user?.name}</p>
      </div>

      <section className="rounded-lg bg-white p-5 shadow-sm">
        <p className="text-sm text-gray-500">Saldo disponível</p>
        <p className="text-3xl font-bold">R$ {Number(wallet.balance).toFixed(2)}</p>
      </section>

      <section className="rounded-lg bg-white p-5 shadow-sm">
        <h2 className="mb-3 text-xl font-semibold">Extrato</h2>
        <div className="space-y-3">
          {history.length === 0 ? (
            <p className="text-gray-500">Sem movimentações.</p>
          ) : history.map((item) => (
            <article key={item.id} className="flex items-center justify-between rounded-md border p-3">
              <div>
                <p className="font-medium">{item.description}</p>
                <p className="text-sm text-gray-500">{new Date(item.createdAt).toLocaleString('pt-BR')}</p>
              </div>
              <p className={item.type === 'DEPOSIT' ? 'text-emerald-600' : 'text-red-600'}>
                {item.type === 'DEPOSIT' ? '+' : '-'} R$ {Number(item.amount).toFixed(2)}
              </p>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
