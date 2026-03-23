import NavBar from "@/components/layout/nav-bar/NavBar";
import Footer from "@/components/layout/footer/Footer";
import { getCart } from "@/services/cart";
import CartClient from "./CartClient";

export default async function Shopping() {
  const cart = await getCart()

  return (
    <>
    <div className="flex flex-col justify-between h-dvh font-chakra-petch">
      <NavBar />
      <div className="flex w-full  justify-center items-center font-chakra-petch gap-20">
        <div className="flex items-center justify-center gap-3">
          <CartClient cart={cart}/>
        </div>
      </div>
      <Footer/>
    </div>
    </>
  );
}