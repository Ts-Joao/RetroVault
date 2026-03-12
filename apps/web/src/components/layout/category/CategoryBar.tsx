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
        <div className="bg-[#d9d9d9] border-2 border-black text-second w-[60%] rounded-lg justify-self-center p-2 text-xs text-center font-chakra-petch">
            <div className="bg-[#d9d9d9] absolute mt-[-30] ml-2 p-1 h-6 border-2 rounded-b-none rounded-md border-black border-y-[#d9d9d9] border-t-black">
                <p className="text-black">Categorias</p>
            </div>
            <ul className="flex justify-between px-3 z-2">
                <li>
                    <Link href='/' className="flex justify-center">
                        <PiGameController className="bg-third rounded-full w-12 h-12 p-2 text-3xl"/>
                    </Link>
                    <p className="text-black">Jogos</p>
                </li>
                <li>
                    <Link href='/' className="flex justify-center">
                        <PiCassetteTape className="bg-third rounded-full w-12 h-12 p-2 text-3xl"/>
                    </Link>
                    <p className="text-black">Filmes</p>
                </li>
                <li>
                    <Link href='/' className="flex justify-center">
                        <PiChartBar className="bg-third rounded-full w-12 h-12 p-2 text-3xl"/>
                    </Link>
                    <p className="text-black">Em Alta</p>
                </li>
                <li>
                    <Link href='/' className="flex justify-center">
                        <PiSealPercent className="bg-third rounded-full w-12 h-12 p-2 text-3xl"/>
                    </Link>
                    <p className="text-black">Ofertas</p>
                </li>
                <li>
                    <Link href='/' className="flex justify-center">
                        <PiTruck className="bg-third rounded-full w-12 h-12 p-2 text-3xl"/>
                    </Link>
                    <p className="text-black">Frete Grátis</p>
                </li>
            </ul>
        </div>
    )
}