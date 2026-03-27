"use client";

import Link from "next/link"
import { useState } from "react";
import {
    PiBag,
    PiHeart,
    PiUserCircleFill,
    PiBell,
    PiListBold,
    PiXSquare,
} from "react-icons/pi";

export default function MiddleBtn() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav>
            <ul className="hidden md:gap-5 lg:gap-10 md:flex">
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
                    <Link href='/profile'>
                        <PiUserCircleFill className="text-second cursor-pointer lg:text-4xl md:text-2xl"/>
                    </Link>
                </li>
                <li>
                    <Link href='/cart'>
                        <PiBag className="text-second cursor-pointer md:text-2xl lg:text-4xl"/>
                    </Link>
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
                    <Link href='/profile' className="flex items-center gap-1">
                        <PiUserCircleFill className="text-prim cursor-pointer text-lg"/>
                        <p>Perfil</p>
                    </Link>
                </li>
                <li>
                    <Link href='/cart' className="flex items-center gap-1">
                        <PiBag className="text-prim cursor-pointer text-lg"/>
                        <p>Sacola</p>
                    </Link>
                </li>
            </ul>
        </nav>
    )
}