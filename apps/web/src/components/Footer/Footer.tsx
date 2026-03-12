import Logo from "@/components/brand/Logo";
import Link from "next/link";

export default function Footer() {
 return (
  <div className="relative flex items-center bg-prim py-2 px-2 lg:py-8 lg:px-12 mt-50">
   <Logo />

   <div className="absolute left-1/2 -translate-x-1/2 text-white text-center">
    <div className="flex gap-40 justify-center text-lg mb-6">
     <Link href="/">
      <h5>Termos de Uso</h5>
     </Link>
     <Link href="/">
      <h5>Política de Privacidade</h5>
     </Link>
     <Link href="/">
      <h5>Contato</h5>
     </Link>
     <Link href="/">
      <h5>Promoções</h5>
     </Link>
    </div>

    <h6 className="text-sm">© Copyright - 2026 RetroVault & seus Parceiros</h6>
   </div>

  </div>
 );
}