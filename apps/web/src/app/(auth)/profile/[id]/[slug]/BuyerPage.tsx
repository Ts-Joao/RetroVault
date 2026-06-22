"use client";

import { formatPrice, Order, User } from "@retrovault/core";
import { useState } from "react";
import { PiReceiptBold, PiStarFill, PiHeartBold } from "react-icons/pi";

type Props = {
  orders: any[] | undefined;
  user: any; // Recebe o modelo estendido com reviews/favorites
};

export default function BuyerPage({ orders, user }: Props) {
  const [activeTab, setActiveTab] = useState<"orders" | "wishlist" | "reviews">("orders");

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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {orders.map((order) => (
                  <div key={order.id} className="bg-zinc-50 p-4 rounded-xl border border-zinc-200/60 relative overflow-hidden flex flex-col justify-between">
                    <div className="absolute top-0 right-0 px-2 py-1 bg-zinc-200 text-zinc-600 font-mono text-[9px] font-bold rounded-bl-lg uppercase">
                      ID: #{order.id.slice(0, 8)}
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <span className={`text-[9px] px-2 py-0.5 rounded font-black uppercase tracking-wider ${
                          order.status === 'PAID' ? 'bg-green-100 text-green-700 border border-green-200' :
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
                          <div key={item.id} className="border-b border-zinc-200/40 last:border-b-0 pb-2 last:pb-0">
                            <p className="text-xs font-black text-zinc-800 uppercase line-clamp-1">
                              {item.product?.name || "Produto"}
                            </p>
                            <div className="flex flex-wrap gap-x-4 text-[11px] font-bold text-zinc-500 uppercase mt-0.5">
                              <span>Qtd: <span className="text-zinc-800">{item.amount}x</span></span>
                              <span>Preço: <span className="text-zinc-800">{formatPrice(Number(item.price))}</span></span>
                            </div>
                            <p className="text-[10px] text-zinc-400 font-bold uppercase mt-0.5">
                              Cód. Produto: <span className="text-zinc-500 font-mono">{item.productId}</span>
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="border-t border-zinc-200/60 mt-3 pt-3 flex justify-between items-center">
                      <span className="text-[10px] font-black uppercase tracking-wider text-zinc-400">Total Pago</span>
                      <span className="text-sm font-black text-zinc-900">{formatPrice(Number(order.totalAmount))}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 text-zinc-400 text-xs font-bold uppercase"><PiReceiptBold className="mx-auto text-2xl mb-2 opacity-40"/> Nenhum registro de transação encontrado.</div>
            )}
          </div>
        )}

        {/* ABA: LISTA DE DESEJOS */}
        {activeTab === "wishlist" && (
          <div className="text-center py-10 text-zinc-400 text-xs font-bold uppercase">
            <PiHeartBold className="mx-auto text-2xl mb-2 opacity-40"/>
            Inventário de Desejos vazio.
          </div>
        )}

        {/* ABA: AVALIAÇÕES */}
        {activeTab === "reviews" && (
          <div className="space-y-3">
            {user?.reviews && user.reviews.length > 0 ? (
              <div className="grid grid-cols-1 gap-3">
                {user.reviews.map((review: any) => (
                  <div key={review.id} className="bg-zinc-50 p-4 rounded-xl border border-zinc-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <span className="text-[10px] font-bold text-zinc-400 uppercase block mb-1">Produto ID: #{review.productId?.slice(0,8)}</span>
                      <p className="text-sm font-semibold text-zinc-800">"{review.comment ?? "Sem comentário escrito."}"</p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0 bg-white px-3 py-1.5 rounded-lg border border-zinc-200 shadow-xs">
                      {[...Array(5)].map((_, i) => (
                        <PiStarFill key={i} className={`text-xs ${i < review.rating ? "text-amber-400" : "text-zinc-200"}`} />
                      ))}
                      <span className="text-xs font-black text-zinc-700 ml-1">{review.rating}.0</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 text-zinc-400 text-xs font-bold uppercase">Nenhum produto foi avaliado por este operador ainda.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}