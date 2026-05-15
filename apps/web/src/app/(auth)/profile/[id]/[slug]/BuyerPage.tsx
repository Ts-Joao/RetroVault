"use client";

import { formatPrice, Order } from "@retrovault/core";
import { useState } from "react";

type Props = {
  orders: Order[];
};

export default function BuyerPage({ orders }: Props) {
  const [activeTab, setActiveTab] = useState<"orders" | "wishlist" | "reviews">(
    "orders",
  );

  return (
    <div>
      {/* Tabs */}
      <div className="bg-bg border-t border-white/10 flex">
        {(["orders", "wishlist", "reviews"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 text-sm font-semibold transition-colors relative 
                ${activeTab === tab ? "text-amber-400 cursor-default" : "text-black cursor-pointer hover:text-gray-500"}`}
          >
            {tab === "orders"
              ? "Pedidos"
              : tab === "wishlist"
                ? "Lista de Desejos"
                : "Avaliações"}
            {activeTab === tab && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-amber-400 rounded-full" />
            )}
          </button>
        ))}
      </div>

      {activeTab === "orders" && (
        <div>
          <p className="text-black">Pedidos</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {orders.map((order) => (
              <div key={order.id}>
                <p className="text-black">{order.id}</p>
                <p className="text-black">{order.sellerId}</p>
                <p className="text-black">{order.productId}</p>
                <p className="text-black">{order.quantity}</p>
                <p className="text-black">{formatPrice(order.total)}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "wishlist" && (
        <div>
          <p className="text-black">Lista de Desejos</p>
        </div>
      )}

      {activeTab === "reviews" && (
        <div>
          <p className="text-black">Avaliações</p>
        </div>
      )}
    </div>
  );
}
