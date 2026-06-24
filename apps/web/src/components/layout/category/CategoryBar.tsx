"use client";

import { useState, useRef } from "react";
import { 
  PiGridFourBold, 
  PiGameControllerBold, 
  PiDiscBold, 
  PiTelevisionBold, 
  PiCassetteTapeBold,
  PiSparkleBold 
} from "react-icons/pi";

const CATEGORIES = [
  { id: "all", name: "Todos os Itens", icon: <PiGridFourBold /> },
  { id: "consoles", name: "Consoles & Arcade", icon: <PiGameControllerBold /> },
  { id: "midias", name: "Jogos & Mídias Retro", icon: <PiDiscBold /> },
  { id: "hardware", name: "Hardware & Telas CRT", icon: <PiTelevisionBold /> },
  { id: "audio-video", name: "Fitas & K7 / VHS", icon: <PiCassetteTapeBold /> },
  { id: "colecionaveis", name: "Memorabilia & Geek", icon: <PiSparkleBold /> },
];

interface CategoriesBarProps {
  onCategoryChange?: (categoryId: string) => void;
}

export default function CategoriesBar({ onCategoryChange }: CategoriesBarProps) {
  const [activeCategory, setActiveCategory] = useState("all");
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleCategorySelect = (id: string) => {
    setActiveCategory(id);
    if (onCategoryChange) {
      onCategoryChange(id); 
    }
  };

  return (
    <div className="w-full bg-white border-b border-zinc-200/80 sticky top-0 z-10 font-chakra-petch">
      <div className="mx-auto w-[92%] max-w-7xl relative">
        
        {/* Container com scroll horizontal invisível e suave */}
        <div 
          ref={scrollRef}
          className="flex items-center gap-2 overflow-x-auto py-3 no-scrollbar scroll-smooth snap-x select-none"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {CATEGORIES.map((category) => {
            const isActive = activeCategory === category.id;
            
            return (
              <button
                key={category.id}
                onClick={() => handleCategorySelect(category.id)}
                className={`snap-start flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-black uppercase tracking-wider transition-all shrink-0 cursor-pointer duration-200
                  ${isActive 
                    ? "bg-[#CD463A] border-[#CD463A] text-white shadow-sm shadow-[#CD463A]/20" 
                    : "bg-zinc-50 border-zinc-200 text-zinc-400 hover:text-zinc-700 hover:border-zinc-300 hover:bg-white"
                  }`}
              >
                {/* Ícone */}
                <span className={`text-base transition-transform duration-200 ${isActive ? "scale-110" : ""}`}>
                  {category.icon}
                </span>
                
                {/* Nome da Categoria */}
                <span>{category.name}</span>
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
}