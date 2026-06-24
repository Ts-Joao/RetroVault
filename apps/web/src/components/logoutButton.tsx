'use client';

import { useSessionStore } from '@retrovault/store';
import { clearAccessTokenCookie } from '@/lib/session';
import { useRouter } from 'next/navigation';
import { PiSignOutBold } from 'react-icons/pi';

export function LogoutButton() {
  const router = useRouter();
  const { clearUser } = useSessionStore();

  const handleLogout = () => {
    clearUser();
    clearAccessTokenCookie();
    router.push('/login');
  };

  return (
    <button
      onClick={() => handleLogout()}
      className="flex items-center gap-2 px-4 py-2 bg-black/60 hover:bg-[#CD463A] text-white text-xs font-black uppercase tracking-wider rounded-lg border border-white/20 transition-all cursor-pointer">
      <PiSignOutBold className="text-sm" />
      Desconectar
    </button>
  )
}