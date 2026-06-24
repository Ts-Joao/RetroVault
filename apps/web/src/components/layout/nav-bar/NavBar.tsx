import Logo from "@/components/brand/Logo";
import MiddleBtn from "./MiddleNav";
import SearchBar from "./SearchBar";

export default function NavBar() {
  return (
    <header className="sticky top-0 z-50 w-full bg-prim border-b-2 border-third/30 shadow-sm">
      <nav className="mx-auto flex h-20 max-w-[1440px] items-center justify-between px-4 md:px-10 lg:px-12">
        
        {/* Logo - Lado Esquerdo */}
        <div className="w-1/4 flex-shrink-0 flex items-center">
          <Logo />
        </div>

        {/* Search - Centralizado Absoluto no Desktop */}
        <div className="hidden flex-1 md:flex justify-center items-center w-2/4">
          <SearchBar />
        </div>

        {/* Actions - Lado Direito */}
        <div className="w-1/4 flex items-center justify-end gap-2">
          <MiddleBtn />
        </div>
      </nav>
      
      {/* Barra de Busca no Mobile */}
      <div className="flex w-full px-4 pb-3 md:hidden bg-prim">
         <SearchBar />
      </div>
    </header>
  );
}