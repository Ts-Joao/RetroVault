import Link from "next/link";
import Image from "next/image";

export default function Logo() {
    return (
        <Link href='/' aria-label="Home" className="relative w-20 h-20 md:w-25 md:h-25 lg:w-30 lg:h-30" >
            <Image src='/logo.png' alt='Logo' fill className="object-contain" priority/>
        </Link>
    )
}