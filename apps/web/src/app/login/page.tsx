import Image from "next/image";
import { FaGoogle, FaInstagram, FaFacebook, FaLock } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

export default function LoginPage() {
  return (
    <main className="flex items-center justify-center min-h-screen bg-bg px-4">
      <div className="bg-second p-10 rounded-2xl w-full max-w-md shadow-2xl border-4 border-prim-light">
        <div className="flex justify-center mb-6">
          <Image
            src="/logo.png"
            alt="logo"
            width={180}
            height={180}
          />
        </div>

        <div className="mb-4">
          <label className="flex items-center gap-2 text-prim mb-1">
            <MdEmail className="text-prim text-xl" />
            <span className="text-sm font-semibold">E-mail</span>
          </label>

          <input
            type="email"
            placeholder="Digite seu e-mail"
            className="w-full bg-white text-black p-3 rounded-md outline-none border focus:border-prim"
          />
        </div>

        <div className="mb-4">
          <label className="flex items-center gap-2 text-prim mb-1">
            <FaLock className="text-prim text-xl" />
            <span className="text-sm font-semibold">Senha</span>
          </label>

          <input
            type="password"
            placeholder="Digite sua senha"
            className="w-full bg-white text-black p-3 rounded-md outline-none border focus:border-prim"
          />
        </div>

        <p className="text-sm text-prim mb-6 cursor-pointer hover:underline">
          Criar uma conta
        </p>

        <button className="w-full bg-prim text-white py-3 cursor-pointer rounded-md font-semibold hover:bg-third transition">
          Continuar
        </button>

        <p className="text-center text-sm font-semibold text-prim mt-6">
          Login com
        </p>

        <div className="flex justify-center gap-10 mt-6">

          <div className="flex flex-col items-center cursor-pointer hover:scale-110 transition">
            <FaGoogle className="text-prim" size={40} />
            <span className="text-xs mt-1 text-prim font-bold">Google</span>
          </div>

          <div className="flex flex-col items-center cursor-pointer hover:scale-110 transition">
            <FaInstagram className="text-prim" size={40} />
            <span className="text-xs mt-1 text-prim font-bold">Instagram</span>
          </div>

          <div className="flex flex-col items-center cursor-pointer hover:scale-110 transition">
            <FaFacebook className="text-prim" size={40} />
            <span className="text-xs mt-1 text-prim font-bold">Facebook</span>
          </div>

        </div>

      </div>
    </main>
  );
}
