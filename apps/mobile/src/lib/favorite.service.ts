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

export async function getFavorites(): Promise<any[]> {
  const res = await api.request("/favorites", { method: "GET" });
  await ensureOk(res);
  return res.json();
}

export async function addFavorite(productId: string): Promise<any> {
  const res = await api.request(`/favorites/${productId}`, {
    method: "POST",
  });
  await ensureOk(res);
  return res.json();
}

export async function deleteFavorite(productId: string): Promise<void> {
  const res = await api.request(`/favorites/${productId}`, {
    method: "DELETE",
  });
  await ensureOk(res);
}

export async function isProductFavorited(productId: string): Promise<boolean> {
  const res = await api.request(`/favorites/${productId}`, { method: "GET" });
  await ensureOk(res);
  const data = await res.json();
  return !!data.isFavorited;
}
