import { PiMagnifyingGlass } from "react-icons/pi";

export default function SearchBar() {
    return (
        <div className="bg-second rounded-lg flex items-center flex-1 max-w-lg mx-6 px-2 p-2 lg:mx-4 lg:px-4 lg:p-2 justify-between gap-2">
            <input type="text" placeholder="O que deseja comprar ?" id="searchId" className="focus:outline-none w-full placeholder:text-xs text-xs lg:text-lg lg:placeholder:text-lg placeholder:font-family-special-elite" />
            <button className="cursor-pointer">
                <PiMagnifyingGlass className="text-md lg:text-2xl"/>
            </button>
        </div>
    )
}