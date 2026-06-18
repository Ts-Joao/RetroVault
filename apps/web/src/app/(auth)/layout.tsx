import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import NavBar from "@/components/layout/nav-bar/NavBar";
import Footer from "@/components/layout/footer/Footer";

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token');
  if (!token) redirect('/login');

  return (
    <div className='flex flex-col min-h-dvh justify-between'>
      <NavBar />
      <main className="grid grid-col flex-1 gap-5 h-full">
        {children}
      </main>
      <Footer />
    </div>
  )
}