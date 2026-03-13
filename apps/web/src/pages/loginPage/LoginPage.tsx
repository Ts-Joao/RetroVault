import Logo from "@/components/brand/Logo";
import { FaUserAlt } from "react-icons/fa";

export default function LoginPage() {
    return (
        <>

            <main>
                <Logo />

                <FaUserAlt className="text-[var(--color-second)]" />
            </main>
        </>
    );
}