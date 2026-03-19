import Logo from "@/components/brand/Logo";
import Link from "next/link";

export default function Footer() {
 return (
  <footer className="bg-prim text-white py-5 px-4 lg:px-12">
   <div className="grid grid-cols-1 md:grid-cols-3 lg:flex-row items-center justify-between gap-10 md:gap-6">
    <div className="flex justify-center-safe">
        <Logo />
    </div>
    <div className="grid md:flex justify-center text-center gap-1 md:gap-6 text-md text-nowrap">
     <Link href="/">Termos de Uso</Link>
     <Link href="/">Política de Privacidade</Link>
     <Link href="/">Contato</Link>
    </div>
   </div>
   <div className="text-center text-xs mt-5">
    © Copyright - 2026 RetroVault & seus Parceiros
   </div>
  </footer>
 );
}
