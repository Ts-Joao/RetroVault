import Logo from "@/components/brand/Logo";
import Link from "next/link";

export default function Footer() {
 return (
  <footer className="bg-prim text-second border-t-2 border-third/30 px-4 md:px-10 lg:px-12 pt-10 pb-6 font-chakra-petch w-full">
   <div className="mx-auto max-w-[1440px] flex flex-col md:flex-row items-center justify-between gap-8 pb-8">
    
    <div className="flex items-center justify-center min-w-[150px] h-auto">
        <Logo />
    </div>
    
    <div className="flex flex-col sm:flex-row items-center justify-center text-center gap-4 md:gap-8 text-sm uppercase tracking-wider font-bold">
     <Link 
      href="/termos-de-uso" 
      className="hover:text-[#D9A128] transition-colors duration-200"
     >
      Termos de Uso
     </Link>
     <Link 
      href="/politica-de-privacidade" 
      className="hover:text-[#D9A128] transition-colors duration-200"
     >
      Política de Privacidade
     </Link>
     <Link 
      href="/contato" 
      className="hover:text-[#D9A128] transition-colors duration-200"
     >
      Contato
     </Link>
    </div>
   </div>

   {/* Linha Divisória */}
   <div className="mx-auto max-w-[1440px] h-px bg-third/20 w-full mb-4" />
   
   {/* Copyright */}
   <div className="text-center text-[11px] font-sans font-medium text-second/60">
    © Copyright 2026 - RetroVault & seus Parceiros. Todos os direitos reservados.
   </div>
  </footer>
 );
}