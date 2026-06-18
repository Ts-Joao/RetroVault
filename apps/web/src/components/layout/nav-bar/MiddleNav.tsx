"use client";

import { useAuth } from "@/lib/context/auth.context";
import { useProfile } from "@/hooks/use-profile";
import { logout } from "@/lib/services/auth.service";
import { useSessionStore } from "@retrovault/store";
import { clearAccessTokenCookie } from "@/lib/session";
import Link from "next/link";
import { useState } from "react";
import {
    PiBagBold,
    PiHeartBold,
    PiUserCircleFill,
    PiBellBold,
    PiListBold,
    PiXBold,
    PiUserPlusBold,
    PiWalletBold,
} from "react-icons/pi";

export default function MiddleBtn() {
    const { user, refresh } = useAuth();
    const { profile } = useProfile();
    const { clearUser } = useSessionStore();
    const [isOpen, setIsOpen] = useState(false);

    const navLinks = [
        { href: "/notifications", icon: PiBellBold, label: "Avisos" },
        { href: "/favorites", icon: PiHeartBold, label: "Desejos" },
        { href: "/cart", icon: PiBagBold, label: "Sacola" },
        { href: "/wallet", icon: PiWalletBold, label: "Carteira" },
    ];

    return (
        <nav className="font-chakra-petch">
            {/* --- DESKTOP --- */}
            <ul className="hidden md:flex items-center gap-1 lg:gap-2">
                {navLinks.map((link) => {
                    const Icon = link.icon;
                    return (
                        <li key={link.href}>
                            <Link 
                                href={link.href}
                                className="w-10 h-10 flex items-center justify-center rounded-xl text-second hover:bg-second/10 hover:text-[#D9A128] transition-all duration-200 cursor-pointer"
                            >
                                <Icon className="text-xl lg:text-2xl" />
                            </Link>
                        </li>
                    );
                })}

                <div className="w-px h-6 bg-third/30 mx-2 hidden lg:block" />

                <li>
                    {user ? (
                        <Link 
                            href={`/profile/${user?.sub}/${user?.slug}`} 
                            className="flex items-center gap-3 p-1 pr-3 rounded-2xl border border-transparent hover:border-third/20 hover:bg-second/5 transition-all duration-200 group text-second"
                        >
                            <div className="w-9 h-9 rounded-xl overflow-hidden border-2 border-third/40 shadow-sm bg-prim group-hover:scale-105 transition-transform duration-200">
                                {profile?.photo ? (
                                    <img src={profile.photo} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <PiUserCircleFill className="w-full h-full text-second/60" />
                                )}
                            </div>
                            <div className="hidden lg:flex flex-col leading-none">
                                <span className="text-[11px] font-black uppercase tracking-tight text-second truncate max-w-[100px]">
                                    {profile?.name?.split(' ')[0] ?? user.name?.split(' ')[0] ?? "Usuário"}
                                </span>
                                <span className="text-[9px] text-emerald-600 font-bold uppercase mt-0.5">Online</span>
                            </div>
                        </Link>
                    ) : (
                        <Link 
                            href='/login'
                            className="flex items-center gap-2 px-4 py-2 bg-second text-prim rounded-xl hover:opacity-90 transition-all active:scale-95 shadow-sm"
                        >
                            <PiUserPlusBold className="text-lg" />
                            <span className="text-xs font-bold uppercase">Entrar</span>
                        </Link>
                    )}
                </li>
            </ul>

            {/* --- MOBILE --- */}
            <div className="flex md:hidden items-center gap-3">
                <Link href="/cart" className="relative w-10 h-10 flex items-center justify-center text-second">
                    <PiBagBold className="text-2xl" />
                </Link>

                <button 
                    onClick={() => setIsOpen(!isOpen)} 
                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-second/10 text-second"
                >
                    {isOpen ? <PiXBold className="text-xl" /> : <PiListBold className="text-xl" />}
                </button>
            </div>

            {/* DROPDOWN MOBILE (Ganha visual de cartão flutuante retrô) */}
            {isOpen && (
                <>
                    <div className="fixed inset-0 top-20 z-40 bg-zinc-900/40 backdrop-blur-xs" onClick={() => setIsOpen(false)} />
                    <ul className="absolute right-4 top-14 w-64 bg-prim border-2 border-third shadow-2xl rounded-2xl p-3 space-y-1 animate-in fade-in slide-in-from-top-5 duration-200 z-50">
                        {navLinks.map((link) => (
                            <li key={link.href}>
                                <Link 
                                    href={link.href} 
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center gap-4 p-3 rounded-2xl hover:bg-second/10 text-second font-bold text-sm"
                                >
                                    <div className="w-8 h-8 flex items-center justify-center bg-second/5 text-[#D9A128] rounded-lg border border-third/20">
                                        <link.icon className="text-lg" />
                                    </div>
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                        <div className="h-px bg-third/20 my-2 mx-3" />
                        <li>
                            {user ? (
                                <Link href={`/profile/${user.sub}/${user.slug}`} className="flex items-center gap-3 p-3 bg-second/5 border border-third/10 rounded-2xl text-second">
                                    <div className="w-8 h-8 rounded-full overflow-hidden border border-third/30">
                                        {profile?.photo ? <img src={profile.photo} className="w-full h-full object-cover" /> : <PiUserCircleFill className="w-full h-full text-second/40" />}
                                    </div>
                                    <p className="text-xs font-black uppercase truncate">{profile?.name?.split(' ')[0] ?? user.name?.split(' ')[0] ?? "Usuário"}</p>
                                </Link>
                            ) : (
                                <Link href='/login' className="flex items-center gap-3 p-3 bg-second text-prim rounded-2xl justify-center">
                                    <PiUserPlusBold className="text-xl text-amber-400" />
                                    <p className="text-xs font-bold uppercase">Entrar na Conta</p>
                                </Link>
                            )}
                        </li>
                    </ul>
                </>
            )}
        </nav>
    );
}