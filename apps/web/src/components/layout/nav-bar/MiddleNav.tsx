"use client";

import { useAuth } from "@/lib/context/auth.context";
import { logout } from "@/lib/services/auth.service";
import { useSessionStore } from "@retrovault/store";
import { clearAccessTokenCookie } from "@/lib/session";
import Link from "next/link"
import { useState } from "react";
import {
    PiBag,
    PiHeart,
    PiUserCircleFill,
    PiBell,
    PiListBold,
    PiXSquare,
    PiUserPlus,
    PiWallet,
} from "react-icons/pi";

export default function MiddleBtn() {
    const { user, refresh } = useAuth();
    const { clearUser } = useSessionStore()
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = async () => {
        await logout()
        clearUser()
        clearAccessTokenCookie()
        await refresh()
    }

    return (
        <nav>
            <ul className="hidden md:gap-5 lg:gap-10 md:flex items-center">
                <li>
                    <Link href='/notifications'>
                        <PiBell className="text-second cursor-pointer lg:text-4xl md:text-2xl"/>
                    </Link>
                </li>
                <li>
                    <Link href='/favorites'>
                        <PiHeart className="text-second cursor-pointer lg:text-4xl md:text-2xl"/>
                    </Link>
                </li>
                <li>
                    <Link href='/cart'>
                        <PiBag className="text-second cursor-pointer md:text-2xl lg:text-4xl"/>
                    </Link>
                </li>
                <li>
                    <Link href='/wallet'>
                        <PiWallet className="text-second cursor-pointer md:text-2xl lg:text-4xl"/>
                    </Link>
                </li>
                <li>
                    { user ? (
                        <Link href={`/profile/${user?.sub}/${user?.slug}`} className="flex items-center gap-2 text-second">
                            <PiUserCircleFill className="cursor-pointer lg:text-4xl md:text-2xl"/>
                            <span className="max-w-[140px] truncate text-sm">{user.name ?? user.email}</span>
                        </Link>
                    ) : (
                        <Link href='/login'>
                            <PiUserPlus className="text-second cursor-pointer lg:text-4xl md:text-2xl"/>
                        </Link>
                    )}
                </li>
            </ul>

            <button onClick={() => setIsOpen(!isOpen)} className="flex md:hidden">
                {isOpen ? (
                    <PiXSquare className="text-4xl text-second" />
                    ) : (
                    <PiListBold className="text-second cursor-pointer text-4xl"/>
                )}
            </button>

            <ul className={`fixed bg-second font-chakra-petch border-2 rounded-md border-third right-1 px-2 py-1 md:hidden ${isOpen ? 'translate-x-0 block' : 'translate-x-full opacity-0 hidden'}`}>
                <li>
                    <Link href='/notifications' className="flex items-center gap-1">
                        <PiBell className="text-prim cursor-pointer text-lg"/>
                        <p>Notificações</p>
                    </Link>
                </li>
                <li>
                    <Link href='/favorites' className="flex items-center gap-1">
                        <PiHeart className="text-prim cursor-pointer text-lg"/>
                        <p>Favoritos</p>
                    </Link>
                </li>
                <li>
                    <Link href='/cart' className="flex items-center gap-1">
                        <PiBag className="text-prim cursor-pointer text-lg"/>
                        <p>Sacola</p>
                    </Link>
                </li>
                <li>
                    <Link href='/wallet' className="flex items-center gap-1">
                        <PiWallet className="text-prim cursor-pointer text-lg"/>
                        <p>Carteira</p>
                    </Link>
                </li>
                <li>
                    { user ? (
                        <Link href={`/profile/${user.sub}/${user.slug}`} className="flex items-center gap-1">
                            <PiUserCircleFill className="text-prim cursor-pointer text-lg"/>
                            <p>Perfil</p>
                        </Link>
                    ) : (
                        <Link href='/login' className="flex items-center gap-1">
                            <PiUserPlus className="text-prim cursor-pointer text-lg"/>
                            <p>Login</p>
                        </Link>
                    )}
                </li>
            </ul>
        </nav>
    )
}
