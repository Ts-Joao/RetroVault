import Logo from "../../brand/Logo";
import MiddleBtn from "./MiddleNav";
import SearchBar from "./SearchBar";

export default function NavBar() {
  return (
    <nav className="flex items-center justify-between bg-prim py-2 px-2 lg:py-4 lg:px-12 sticky top-0 z-10">
      <Logo />
      <SearchBar />
      <MiddleBtn />
    </nav>
  );
}
