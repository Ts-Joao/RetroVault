"use client";

import NavBar from "@/components/layout/nav-bar/NavBar";
import ProductCart from "@/components/product-cart/ProductCart";

export default function Shopping() {
  return (
    <>
      <NavBar />
      <div className="flex items-center justify-center gap-3">
        <div className="flex flex-col items-center justify-center mt-10 gap-2">
          <ProductCart />
          <ProductCart />
        </div>
        <div>
        </div>

      </div>
    </>
  );
}
