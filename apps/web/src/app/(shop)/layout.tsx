import NavBar from "@/components/layout/nav-bar/NavBar";
import Footer from "@/components/layout/footer/Footer";

type Props = {
  children: React.ReactNode
}

export default function ShopLayout({ children }: Props) {
  return (
    <div className='flex flex-col min-h-screen justify-between bg-[#F4F4F6]'>
      <NavBar />
      <main className="flex-1 w-full h-full">
        {children}
      </main>
      <Footer />
    </div>
  );
}