import { getCart } from "@/services/cart";
import CartClient from "./CartClient";

export default async function Shopping() {
  const cart = await getCart()

  return (
    <>
      <div className="flex w-full justify-center items-start font-chakra-petch gap-20 mt-10">
        <div className="flex gap-3">
          <CartClient cart={cart}/>
        </div>
      </div>
    </>
  );
}