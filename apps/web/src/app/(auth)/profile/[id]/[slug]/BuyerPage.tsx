"use client";

import { Favorite, formatPrice, Order, Review, User } from "@retrovault/core";
import { useEffect, useState } from "react";
import { PiReceiptBold, PiStarFill, PiHeartBold } from "react-icons/pi";
import Link from "next/link";
import { getUserReviews } from "@/lib/services/review.service";
import { getFavorites } from "@/lib/services/favorites.service";

type Props = {
  orders: any[] | undefined;
  user: any;
};

export default function BuyerPage({ orders, user }: Props) {
  const [activeTab, setActiveTab] = useState<"orders" | "wishlist" | "reviews">("orders");
  const [reviews, setReviews] = useState<Review[]>([]);
  const [favorites, setFavorites] = useState<any[]>([]);

  const fetchReviews = async () => {
    try {
      const data = await getUserReviews(user.id);
      setReviews(data);
    } catch (error) {
      console.error("Erro ao buscar avaliações:", error);
    }
  };

  const fetchFavorites = async () => {
    try {
      const data = await getFavorites();
      setFavorites(data);
    } catch (error) {
      console.error("Erro ao buscar favoritos:", error);
    }
  };

  useEffect(() => {
    fetchReviews();
    fetchFavorites();
  }, []);

  return (
    <div className="bg-white rounded-b-2xl">

      {/* Abas Estilizadas */}
      <div className="border-t border-b border-zinc-100 flex bg-zinc-50">
        {(["orders", "wishlist", "reviews"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-4 text-xs font-black uppercase tracking-wider transition-all relative border-r last:border-r-0 border-zinc-100 
                ${activeTab === tab ? "text-[#CD463A] bg-white cursor-default" : "text-zinc-400 cursor-pointer hover:text-zinc-700"}`}
          >
            {tab === "orders" ? "Histórico de Pedidos" : tab === "wishlist" ? "Lista de Desejos" : "Minhas Avaliações"}
            {activeTab === tab && (
              <span className="absolute bottom-0 left-0 w-full h-1 bg-[#CD463A]" />
            )}
          </button>
        ))}
      </div>

      <div className="p-6 md:p-8">
        {/* ABA: PEDIDOS */}
        {activeTab === "orders" && (
          <div className="space-y-4">
            {orders && orders.length > 0 ? (
              <div className="columns-1 md:columns-2 gap-4 space-y-4 [column-fill:balance]">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="break-inside-avoid bg-zinc-50 p-4 rounded-xl border border-zinc-200/60 relative overflow-hidden flex flex-col justify-between mb-4 last:mb-0 w-full transition-all duration-200 hover:bg-white hover:border-zinc-300 hover:shadow-sm hover:-translate-y-0.5 group"
                  >
                    <div className="absolute top-0 right-0 px-2 py-1 bg-zinc-200 text-zinc-600 font-mono text-[9px] font-bold rounded-bl-lg uppercase transition-colors group-hover:bg-zinc-300/70">
                      ID: #{order.id.slice(0, 8)}
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <span className={`text-[9px] px-2 py-0.5 rounded font-black uppercase tracking-wider ${order.status === 'PAID' ? 'bg-green-100 text-green-700 border border-green-200' :
                            order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-700 border border-blue-200' :
                              order.status === 'DELIVERED' ? 'bg-zinc-100 text-zinc-700 border border-zinc-200' :
                                order.status === 'CANCELED' ? 'bg-red-100 text-red-700 border border-red-200' :
                                  'bg-amber-100 text-amber-700 border border-amber-200'
                          }`}>
                          {order.status === 'PENDING' ? 'Pendente' :
                            order.status === 'PAID' ? 'Pago' :
                              order.status === 'SHIPPED' ? 'Enviado' :
                                order.status === 'DELIVERED' ? 'Entregue' :
                                  order.status === 'CANCELED' ? 'Cancelado' : order.status}
                        </span>
                      </div>

                      <div className="space-y-2 pt-1">
                        {order.orderItems?.map((item: any) => (
                          <Link
                            href={`/products/${item.productId}/${item.product?.slug || 'item'}`}
                            key={item.id}
                            className="block border-b border-zinc-200/40 last:border-b-0 pb-2 last:pb-0 group/item"
                          >
                            <p className="text-xs font-black text-zinc-800 uppercase line-clamp-1 group-hover:text-[#CD463A] group-hover/item:underline transition-colors duration-200">
                              {item.product?.name || "Produto"}
                            </p>
                            <div className="flex flex-wrap gap-x-4 text-[11px] font-bold text-zinc-500 uppercase mt-0.5">
                              <span>Qtd: <span className="text-zinc-800">{item.amount}x</span></span>
                              <span>Preço: <span className="text-zinc-800">{formatPrice(Number(item.price))}</span></span>
                            </div>
                            <p className="text-[10px] text-zinc-400 font-bold uppercase mt-0.5">
                              Cód. Produto: <span className="text-zinc-500 font-mono">{item.productId}</span>
                            </p>
                          </Link>
                        ))}
                      </div>
                    </div>

                    <div className="border-t border-zinc-200/60 mt-3 pt-3 flex justify-between items-center transition-colors group-hover:border-zinc-300">
                      <span className="text-[10px] font-black uppercase tracking-wider text-zinc-400">Total Pago</span>
                      <span className="text-sm font-black text-zinc-900 group-hover:text-[#CD463A] transition-colors duration-200">
                        {formatPrice(Number(order.totalAmount))}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 text-zinc-400 text-xs font-bold uppercase">
                <PiReceiptBold className="mx-auto text-2xl mb-2 opacity-40" />
                Nenhum registro de transação encontrado.
              </div>
            )}
          </div>
        )}

        {/* ABA: LISTA DE DESEJOS */}
        {activeTab === "wishlist" && (
          <div className="space-y-4">
            {favorites && favorites.length > 0 ? (
              <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4 [column-fill:balance]">
                {favorites.map((fav: any) => {
                  const rawUrl = fav.product?.photos?.[0]?.url;
                  
                  let imageUrl = null;
                  if (rawUrl) {
                    if (rawUrl.startsWith('http')) {
                      imageUrl = rawUrl;
                    } else {
                      // Trata e remove a barra inicial para evitar duplicidade com a URL da API
                      const cleanUrl = rawUrl.startsWith('/') ? rawUrl.slice(1) : rawUrl;
                      const baseUrl = process.env.NEXT_PUBLIC_API_URL?.endsWith('/') 
                        ? process.env.NEXT_PUBLIC_API_URL 
                        : `${process.env.NEXT_PUBLIC_API_URL}/`;
                        
                      imageUrl = `${baseUrl}${cleanUrl}`;
                    }
                  }

                  return (
                    <Link
                      key={fav.id}
                      href={`/products/${fav.productId}/${fav.product?.slug || 'item'}`}
                      className="block group break-inside-avoid mb-4 last:mb-0 w-full hover:cursor-pointer"
                    >
                      <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-200/60 flex flex-col justify-between gap-3 transition-all duration-200 hover:bg-white hover:border-zinc-300 hover:shadow-sm hover:-translate-y-0.5">

                        <div className="flex gap-3 items-start">
                          {/* Container da Imagem do Produto */}
                          <div className="w-16 h-16 bg-white border border-zinc-200/60 rounded-lg shrink-0 overflow-hidden relative flex items-center justify-center p-1">
                            {imageUrl ? (
                              <img
                                src={imageUrl}
                                alt={fav.product?.name || "Imagem do produto"}
                                className="object-contain w-full h-full group-hover:scale-105 transition-transform duration-200"
                              />
                            ) : (
                              <span className="text-[9px] font-bold text-zinc-400 uppercase">Sem foto</span>
                            )}
                          </div>

                          <div className="space-y-1 flex-1">
                            <span className="text-[9px] font-black text-zinc-400 uppercase block tracking-wider">
                              Item Salvo
                            </span>
                            <h4 className="text-xs font-black text-zinc-800 uppercase line-clamp-2 group-hover:text-[#CD463A] transition-colors duration-200">
                              {fav.product?.name || "Produto Favorito"}
                            </h4>
                            {fav.product?.price && (
                              <p className="text-sm font-black text-zinc-900 mt-1">
                                {formatPrice(Number(fav.product.price))}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="border-t border-zinc-200/40 pt-2 flex justify-between items-center text-[10px] font-bold uppercase tracking-wider">
                          <span className="text-zinc-400 font-mono text-[9px]">ID: #{fav.productId?.slice(0, 8)}</span>
                          <span className="text-[#CD463A] opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center gap-1">
                            Acessar Produto &rarr;
                          </span>
                        </div>

                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-10 text-zinc-400 text-xs font-bold uppercase">
                <PiHeartBold className="mx-auto text-2xl mb-2 opacity-40" />
                Inventário de Desejos vazio.
              </div>
            )}
          </div>
        )}

        {/* ABA: AVALIAÇÕES */}
        {activeTab === "reviews" && (
          <div className="space-y-3">
            {reviews && reviews.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {reviews.map((review: any) => (
                  <Link
                    key={review.id}
                    href={`/products/${review.productId}/${review.product?.slug || 'item'}`}
                    className="block group"
                  >
                    <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-200/60 flex items-center justify-between gap-4 transition-all duration-200 hover:bg-white hover:border-zinc-300 hover:shadow-sm hover:-translate-y-0.5">
                      <div className="space-y-1">
                        <span className="text-[10px] font-black text-zinc-400 uppercase block tracking-wider">
                          Produto Avaliado
                        </span>
                        <div className="flex flex-col gap-1 font-bold">
                          <span className="text-sm text-zinc-800 group-hover:text-[#CD463A] transition-colors duration-200">
                            {review.product?.name || "Produto"}
                          </span>
                          <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
                            ID: #{review.productId?.slice(0, 8)}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0 bg-white px-3 py-2 rounded-lg border border-zinc-200 shadow-sm transition-all duration-200 group-hover:border-zinc-300">
                        <div className="flex items-center gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <PiStarFill
                              key={i}
                              className={`text-sm ${i < review.rating ? "text-amber-400" : "text-zinc-200"}`}
                            />
                          ))}
                        </div>
                        <span className="text-xs font-black text-zinc-800 ml-1.5 mt-0.5">
                          {review.rating}.0
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 text-zinc-400 text-xs font-bold uppercase">
                Nenhum produto foi avaliado por este operador ainda.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}