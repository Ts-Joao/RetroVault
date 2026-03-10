import Link from "next/link";
import Image from "next/image";

export default function Logo() {
    return (
        <Link href='/' aria-label="Home" >
            <Image src='/logo.png' alt='Logo' width={80} height={20} className="md:w-38 md:h-20" priority/>
        </Link>
    )
}