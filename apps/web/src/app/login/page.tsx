import Image from "next/image";
import { FaGoogle, FaInstagram, FaFacebook, FaLock } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

export default function LoginPage() {
  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-100 gap-6">
      <div className="bg-second p-10 rounded-lg w-[700px] h-[700px] text-white shadow- border-prim-light border-4 ">
        
        <Image className="ml-50 mt-[-10]"   
          src="/logo.png"
          alt="logo"
          width={200}
          height={200}
        />

        <div className="mb-4">
            <label className="flex items-center gap-2 text-sm mb-1">
                <MdEmail className="text-black text-3xl mt-5 m-2"/>
                <p className="text-black ml-[-7] mt-2">E-mail</p>
            </label>

            <input
                type="email"
                alt="email"
                className="w-full  bg-black text-white p-2 rounded outline-none"
            />
        </div>

        <div className="mb-4">
            <label className="flex items-center gap-2 text-sm mb-1">
                <FaLock className="text-black text-3xl mt-5 m-2"/>
                <p className="text-black ml-[-8] mt-3.5">PassWord</p>
            </label>

            <input 
                type="password"
                className="w-full bg-black text-white p-2 rounded outline-none" 
            />
        </div>

        <p className="text-sm text-black mb-6 cursor-pointer ">
          &gt; criar uma conta
        </p>

        <button className="w-full bg-black text-white text-black mt-4 py-2 rounded-md mb-6 hover:opacity-90">
          Continue
        </button>

        <p className="text-center text-sm mb- font-bold text-black">
          Login com
        </p>

        <div className="flex justify-center gap-20 mt-10 text-center">
          <div className="flex flex-col items-center cursor-pointer">
            <FaGoogle className="text-black"size={50}/>
            <span className="text-xs mt-1  text-black size-10 font-bold">Google</span>
          </div>

          <div className="flex flex-col items-center cursor-pointer">
            <FaInstagram className="text-black" size={50}/>
            <span className="text-xs mt-1 text-black size-10 font-bold">Instagram</span>
          </div>
          
          <div className="flex flex-col items-center cursor-pointer">
            <FaFacebook className="text-black" size={50}/>
            <span className="text-xs mt-1 text-black size-10 font-bold">Facebook</span>
          </div>
        </div>

      </div>
    </main>
  )
}
