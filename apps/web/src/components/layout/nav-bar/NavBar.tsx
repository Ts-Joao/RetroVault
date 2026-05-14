import Logo from "@/components/brand/Logo";
import MiddleBtn from "./MiddleNav";
import SearchBar from "./SearchBar";
// import { getMe } from "@/lib/services/auth.service";

export default async function NavBar() {
  // const user = await getMe()

  return (
    <nav className="flex items-center justify-between bg-prim px-2 lg:py-0 md:px-10 lg:px-12 sticky top-0 z-10">
      <Logo />
      <SearchBar />
      <MiddleBtn />
    </nav>
  );
}
