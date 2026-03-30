import NavBar from "@/components/layout/nav-bar/NavBar";
import Footer from "@/components/layout/footer/Footer";

type Props = {
  children: React.ReactNode
}

export default function ShopLayout({ children }: Props) {
  return (
      <div className='flex flex-col min-h-dvh justify-between'>
        <NavBar />
          <main className="grid grid-col flex-1 gap-5 h-full">
            {children}
          </main>
        <Footer />
      </div>
  );
}
