import api from "@/lib/api";
import { Product, ProductDetails } from "@retrovault/core";

function parseProduct(product: any): Product {
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    price: Number(product.price ?? 0),
    photos: Array.isArray(product.photos)
      ? product.photos.map((photo: any) => ({
          id: photo.id,
          url: photo.url,
          productId: photo.productId ?? product.id,
        }))
      : [],
    sellerId: product.sellerId,
    rating: Number(product.rating ?? 0),
    max_installments: product.maxInstallments ?? product.max_installments ?? 1,
    free_installments:
      product.freeInstallments ?? product.free_installments ?? 1,
    min_installment_amount: Number(
      product.minInstallmentAmount ?? product.min_installment_amount ?? 0,
    ),
    monthly_interest_rate: Number(
      product.monthlyInterestRate ?? product.monthly_interest_rate ?? 0,
    ),
    shipping_cost: Number(product.shippingCost ?? product.shipping_cost ?? 0),
    type: product.mediaType ? [product.mediaType.name] : (product.type ?? []),
    genre: Array.isArray(product.genre)
      ? product.genre.map((item: any) => item?.name ?? item).filter(Boolean)
      : (product.genre ?? []),
    cep: product.cep ?? "",
    city: product.city ?? "",
    state: product.state ?? "",
    ...(product.seller
      ? {
          seller: {
            id: product.seller.id,
            name: product.seller.name,
            slug: product.seller.slug,
          },
        }
      : {}),
  };
}

function parseProductDetails(product: any): ProductDetails {
  return {
    ...parseProduct(product),
    description: product.description ?? "",
    amount: product.amount ?? 0,
    comments: product.comments ?? "",
  };
}

export async function getProducts(): Promise<Product[]> {
  const res = await api.request("/products/active", { method: "GET" });
  if (!res.ok) {
    throw new Error("Falha ao buscar produtos");
  }

  const products = await res.json();
  return Array.isArray(products)
    ? products.map((product: any) => parseProduct(product))
    : [];
}

export async function getProductById(
  id: string,
): Promise<ProductDetails | undefined> {
  const res = await api.request(`/products/active/${id}`, { method: "GET" });
  if (!res.ok) {
    if (res.status === 404) return undefined;
    throw new Error("Falha ao buscar produto");
  }

  const product = await res.json();
  return parseProductDetails(product);
}

export async function getProductsByUserId(userId: string): Promise<Product[]> {
  const res = await api.request(`/products/seller/${userId}`, {
    method: "GET",
  });
  if (!res.ok) {
    throw new Error("Falha ao buscar produtos do vendedor");
  }

  const products = await res.json();
  return Array.isArray(products)
    ? products.map((product: any) => parseProduct(product))
    : [];
}
