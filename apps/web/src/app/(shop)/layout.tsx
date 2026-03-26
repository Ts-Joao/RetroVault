import NavBar from "@/components/layout/nav-bar/NavBar";
import Footer from "@/components/layout/footer/Footer";

type Props = {
  children: React.ReactNode
}

export default function ShopLayout({ children }: Props) {
  return (
      <div className=' flex flex-col min-h-dvh'>
        <NavBar />
          <main className="flex flex-col flex-1 gap-5">
            {children}
          </main>
        <Footer />
      </div>
  );
}
