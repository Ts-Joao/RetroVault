import Logo from "@/components/brand/Logo";
import Link from "next/link";

export default function Footer() {
 return (
  <footer className="bg-prim text-white py-6 px-4 lg:px-12 mt-50">
   <div className="grid grid-cols-1 md:grid-cols-3 lg:flex-row items-center justify-between gap-10 md:gap-6">
    <div className="flex justify-center-safe">
        <Logo />
    </div>
    <div className="grid md:flex justify-center text-center gap-1 md:gap-6 text-lg text-nowrap">
     <Link href="/">Termos de Uso</Link>
     <Link href="/">Política de Privacidade</Link>
     <Link href="/">Contato</Link>
    </div>
   </div>
   <div className="text-center text-sm mt-6">
    © Copyright - 2026 RetroVault & seus Parceiros
   </div>
  </footer>
 );
}
