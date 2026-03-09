import Link from "next/link"
import { PiShoppingCartSimple, PiHeartFill, PiUserCircleFill } from "react-icons/pi";

export default function MiddleBtn() {
    return (
        <div>
            <Link href='/shopping-cart'>
                <button>
                    <PiHeartFill size={28} />
                </button>
            </Link>

            <Link href='/shopping-cart'>
                <button>
                    <PiShoppingCartSimple size={28}/>
                </button>
            </Link>

            <Link href='/profile'>
                <button>
                    <PiUserCircleFill size={28} />
                </button>
            </Link>
        </div>
    )
}