import Link from "next/link";
import { 
    PiTruck,
    PiChartBar,
    PiSealPercent,
    PiCassetteTape,
    PiGameController,
} from "react-icons/pi";

export default function CategoryBar() {
    return (
        <div className="bg-[#d9d9d9] border-2 border-black text-second md:w-[60%] lg:w-[50%] xl:w-[35%] rounded-lg justify-self-center p-2 text-xs lg:text-[13px] text-center font-chakra-petch">
            <div className="bg-[#d9d9d9] absolute mt-[-30] ml-2 p-1 h-6 border-2 rounded-b-none rounded-md border-black border-y-[#d9d9d9] border-t-black">
                <p className="text-black text-[13px] lg:text-[15px]">Categorias</p>
            </div>
            <ul className="flex justify-between px-3 z-2 gap-2 md:gap-0">
                <li>
                    <Link href='/' className="flex justify-center">
                        <PiGameController className="bg-third rounded-full w-12 h-12 lg:h-15 lg:w-15 p-2 text-3xl"/>
                    </Link>
                    <p className="text-black hidden md:flex justify-center-safe">Jogos</p>
                </li>
                <li>
                    <Link href='/' className="flex justify-center">
                        <PiCassetteTape className="bg-third rounded-full w-12 h-12 lg:h-15 lg:w-15 p-2 text-3xl"/>
                    </Link>
                    <p className="text-black hidden md:flex justify-center-safe">Filmes</p>
                </li>
                <li>
                    <Link href='/' className="flex justify-center">
                        <PiChartBar className="bg-third rounded-full w-12 h-12 lg:h-15 lg:w-15 p-2 text-3xl"/>
                    </Link>
                    <p className="text-black hidden md:flex justify-center-safe">Em Alta</p>
                </li>
                <li>
                    <Link href='/' className="flex justify-center">
                        <PiSealPercent className="bg-third rounded-full w-12 h-12 lg:h-15 lg:w-15 p-2 text-3xl"/>
                    </Link>
                    <p className="text-black hidden md:flex justify-center-safe">Ofertas</p>
                </li>
                <li>
                    <Link href='/' className="flex justify-center">
                        <PiTruck className="bg-third rounded-full w-12 h-12 lg:h-15 lg:w-15 p-2 text-3xl"/>
                    </Link>
                    <p className="text-black hidden md:flex">Frete Grátis</p>
                </li>
            </ul>
        </div>
    )
}