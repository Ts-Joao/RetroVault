import Image from "next/image";
import { FaGoogle, FaInstagram, FaFacebook, FaLock } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

export default function LoginPage() {
  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-100 gap-6">
      <div className="bg-second p-10 rounded-lg w-[700px] h-[700px] text-white shadow-lg ">
        
        <Image className="ml-50 mt-[-10]"   
          src="/logo.png"
          alt="logo"
          width={200}
          height={200}
        />

        <div className="mb-4">
            <label className="flex items-center gap-2 text-sm mb-1">
                <MdEmail className="text-black text-3xl mt-5"/>
                E-mail
            </label>

            <input
                className=""
            />
        </div>

      </div>
    </main>
  )
}
