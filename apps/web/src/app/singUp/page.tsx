import Image from "next/image";
import { FaGoogle, FaFacebook, FaLock } from "react-icons/fa";
import { MdEmail, MdPerson } from "react-icons/md";

export default function SignUp() {
  return (
    <main className="flex items-center justify-center min-h-screen bg-bg px-4">
      <div className="flex w-full max-w-4xl items-center gap-16">
        
        <div className="hidden lg:flex flex-col gap-4 flex-1">
          <h1 className="text-7xl font-black leading-none text-black tracking-tight border-l-4 border-prim pl-4">
            RETRO<br />
            <span className="text-prim">VAULT</span>
          </h1>
        </div>

        <div className="bg-second p-10 rounded-2xl w-full  shadow-2xl border-4 border-prim-light">
          <div className="flex justify-center mb-6">
            <Image src="/logo.png" alt="logo" width={180} height={180} />
          </div>

          <div className="mb-4">
            <label className="flex items-center gap-2 text-black mb-1">
              <MdPerson className="text-prim text-xl" />
              <span className="text-sm font-semibold text-prim">Nome</span>
            </label>
            <input
              type="text"
              placeholder="Digite seu nome"
              className="w-full bg-white text-black p-3 rounded-md outline-none border focus:border-prim"
            />
          </div>

          <div className="mb-4">
            <label className="flex items-center gap-2 text-black mb-1">
              <MdEmail className="text-prim text-xl" />
              <span className="text-sm font-semibold text-prim">E-mail</span>
            </label>
            <input
              type="email"
              placeholder="Digite seu e-mail"
              className="w-full bg-white text-black p-3 rounded-md outline-none border focus:border-prim"
            />
          </div>

          <div className="mb-4">
            <label className="flex items-center gap-2 text-black mb-1">
              <FaLock className="text-prim text-xl" />
              <span className="text-sm font-semibold text-prim">Senha</span>
            </label>
            <input
              type="password"
              placeholder="Digite sua senha"
              className="w-full bg-white text-black p-3 rounded-md outline-none border focus:border-prim"
            />
          </div>

          <div className="mb-6">
            <label className="flex items-center gap-2 text-black mb-1">
              <FaLock className="text-prim text-xl" />
              <span className="text-sm font-semibold text-prim">Confirmar senha</span>
            </label>
            <input
              type="password"
              placeholder="Repita sua senha"
              className="w-full bg-white text-black p-3 rounded-md outline-none border focus:border-prim"
            />
          </div>

          <p className="text-sm text-prim mb-6 cursor-pointer hover:underline">
            Já tenho uma conta
          </p>

          <button className="w-full bg-prim text-white py-3 rounded-md font-semibold hover:bg-third transition cursor-pointer">
            Criar conta
          </button>

          <p className="text-center text-sm font-semibold text-prim mt-6 mb-4">
            Registrar com
          </p>

          <div className="flex justify-center gap-6 mt-2">
            <button className="flex flex-col items-center gap-1.5 bg-white border-2 border-stone-200 rounded-xl px-5 py-3 cursor-pointer">
              <FaGoogle className="text-prim" size={28} />
              <span className="text-xs font-bold text-prim">Google</span>
            </button>

            <button className="flex flex-col items-center gap-1.5 bg-white border-2 border-stone-200 rounded-xl px-5 py-3 cursor-pointer">
              <FaFacebook className="text-prim" size={28} />
              <span className="text-xs font-bold text-prim">Facebook</span>
            </button>
          </div>
        </div>

      </div>
    </main>
  );
}