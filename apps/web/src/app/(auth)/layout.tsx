import { redirect } from "next/navigation"
import { cookies } from "next/headers"

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token');
  if (!token) redirect('/login');

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      {children}
    </div>
  )
}