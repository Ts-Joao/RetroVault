import type { CartItem, CartResponse } from "@retrovault/core";
import api from "./api";

async function parseJSON(res: Response) {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

async function ensureOk(res: Response) {
  if (!res.ok) {
    const data = await parseJSON(res);
    throw new Error(data?.message || `Request failed with ${res.status}`);
  }
  return res;
}

export async function getCart(): Promise<CartResponse> {
  const res = await api.request("/cart", { method: "GET" });
  await ensureOk(res);
  return res.json();
}

export async function addCartItem(
  productId: string,
  amount: number,
): Promise<CartItem> {
  const res = await api.request("/cart", {
    method: "POST",
    body: JSON.stringify({ productId, amount }),
  });
  await ensureOk(res);
  return res.json();
}

export async function updateCartItem(
  itemId: string,
  amount: number,
): Promise<CartItem> {
  const res = await api.request(`/cart/${itemId}`, {
    method: "PATCH",
    body: JSON.stringify({ amount }),
  });
  await ensureOk(res);
  return res.json();
}

export async function removeCartItem(
  cartId: string,
  itemId: string,
): Promise<void> {
  const res = await api.request(`/cart/${cartId}`, {
    method: "DELETE",
    body: JSON.stringify({ id: itemId }),
  });
  await ensureOk(res);
}

export async function clearCart(cartId: string): Promise<{ message: string }> {
  const res = await api.request(`/cart/clear/${cartId}`, {
    method: "DELETE",
  });
  await ensureOk(res);
  return res.json();
}
