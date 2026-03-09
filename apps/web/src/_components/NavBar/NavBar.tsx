import Image from 'next/image';
import MiddleBtn from './MiddleNav';

export default function NavBar() {
    return (
        <nav className="flex items-center justify-between bg-prim py-4">
            <Image src='/logo.png' alt='Logo' height={30} width={150} />
            <MiddleBtn/>
        </nav>
    )
}