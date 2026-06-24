import type { Product } from "../types/product";

function slugifyProductName(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function getProductUrl(product: Product) {
  const slug = slugifyProductName(product.name);
  return `/products/${product.id}/${slug}`;
}
