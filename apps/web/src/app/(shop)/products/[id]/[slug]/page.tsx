import { notFound } from 'next/navigation'
import Image from 'next/image'

import FavoriteButton from '@/components/Favoritos/ButtonFavorites'
import { getProductById } from '@/lib/services/product.service'
import { getProductReviews } from '@/lib/services/review.service'

interface ProductPageProps {
  params: Promise<{ id: string; slug: string }>
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params
  const product = await getProductById(id).catch(() => null)

  if (!product) {
    notFound()
  }

  const currentProduct = product
  const reviews = await getProductReviews(currentProduct.id).catch(() => [])

  return (
    <div className="p-5">
      <div className="grid gap-6 lg:grid-cols-[420px_minmax(0,1fr)]">
        <section className="rounded-lg bg-white p-4 shadow-sm">
          <div className="aspect-[4/5] overflow-hidden rounded-md bg-gray-100">
            {currentProduct.photos?.[0]?.url ? (
              <Image src={currentProduct.photos[0].url} alt={currentProduct.name} width={800} height={1000} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-gray-400">Sem foto</div>
            )}
          </div>
        </section>

        <section className="space-y-5 rounded-lg bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-semibold text-gray-900">{currentProduct.name}</h1>
              <p className="mt-2 text-sm text-gray-500">Vendido por {currentProduct.sellerId}</p>
            </div>
            <FavoriteButton productId={currentProduct.id} />
          </div>

          <div>
            <p className="text-sm text-gray-500">Preço</p>
            <p className="text-2xl font-bold text-gray-900">R$ {Number(currentProduct.price).toFixed(2)}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Gêneros</p>
            <p className="text-base text-gray-900">{currentProduct.genre?.join(', ') || 'Sem gênero informado'}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Tipo</p>
            <p className="text-base text-gray-900">{currentProduct.type?.join(', ') || 'Sem tipo informado'}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Avaliações</p>
            <div className="mt-2 space-y-3">
              {reviews.length === 0 ? (
                <p className="text-sm text-gray-500">Nenhuma avaliação cadastrada.</p>
              ) : (
                reviews.map((review) => (
                  <article key={review.id} className="rounded-md border border-gray-200 p-3">
                    <p className="font-semibold text-gray-900">{review.name}</p>
                    <p className="text-sm text-gray-600">{review.comments}</p>
                  </article>
                ))
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
