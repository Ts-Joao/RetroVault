'use client'

import { useState } from "react";
import { PiGearBold, PiXBold, PiUserCircleFill, PiLockBold, PiCameraBold } from "react-icons/pi";
import { User } from "@retrovault/core";
import { useToast } from "../ui/toast-provider";
import api from "@/lib/axios";

type Props = {
  user: User & {
    profilePic?: { url: string } | null;
    photo?: string | null;
    phone: string | undefined
  }
}

export default function EditProfileModal({ user }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [cep, setCep] = useState(user.defaultCep || '');
  const [phone, setPhone] = useState(user.phone);
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [photoPreview, setPhotoPreview] = useState<string | null>(
    `${user.profilePic?.url}` ||
    user.photo ||
    "/image/placeholder-pfp.webp"
  );

  const toast = useToast();

  function handleCepChange(value: string) {
    const raw = value.replace(/\D/g, '');
    const formatted = raw.replace(/^(\d{5})(\d)/, '$1-$2');
    setCep(formatted.substring(0, 9));
  }

  function handlePhoneChange(value: string) {
    const raw = value.replace(/\D/g, '');
    let formatted = raw;
    if (raw.length <= 10) {
      formatted = raw.replace(/^(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
    } else {
      formatted = raw.replace(/^(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
    }
    setPhone(formatted.substring(0, 15));
  }

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    const formData = new FormData();
    formData.append("file", file);

    try {
      await api.post("/uploads/profile", formData);
      toast.success("Foto de perfil atualizada com sucesso!");

    } catch (error: any) {
      console.error(error);
      toast.error("Erro ao atualizar foto de perfil.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const cleanCep = cep.replace(/\D/g, '');
    const cleanPhone = phone?.replace(/\D/g, '');

    const payload: any = {
      name,
      email,
      defaultCep: cleanCep || null,
      phone: cleanPhone || undefined,
    };

    if (password && newPassword) {
      payload.password = password;
      payload.newPassword = newPassword;
    }

    try {
      await api.patch(`/users/${user.id}`, payload);
      setIsOpen(false);
      toast.success('Perfil atualizado com sucesso!');
    } catch (error: any) {
      console.error(error);
      const errMsg = error.response?.data?.message || 'Erro ao atualizar perfil!';
      toast.error(Array.isArray(errMsg) ? errMsg[0] : errMsg);
    }
  };

  return (
    <>
      {/* Botão de Configuração */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-black uppercase tracking-wider rounded-xl border border-zinc-200 transition-all active:scale-95 cursor-pointer"
      >
        <PiGearBold className="text-sm" />
        Configurar Perfil
      </button>

      {/* 🚀 Estrutura do Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 font-chakra-petch animate-fade-in">
          <div className="relative bg-white w-full max-w-xl rounded-2xl shadow-2xl border-2 border-zinc-100 overflow-hidden max-h-[90vh] flex flex-col">

            {/* Engineering Corners no Modal */}
            <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-[#CD463A]"></div>
            <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-[#CD463A]"></div>

            {/* Header */}
            <div className="p-5 border-b border-zinc-100 flex items-center justify-between bg-zinc-50 shrink-0">
              <div className="flex items-center gap-2">
                <PiGearBold className="text-lg text-[#CD463A]" />
                <h2 className="text-sm font-black uppercase tracking-wider text-zinc-800">Parâmetros do Operador</h2>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-zinc-400 hover:text-red-600 transition-colors p-1 cursor-pointer"
              >
                <PiXBold className="text-lg" />
              </button>
            </div>

            {/* Conteúdo com Scroll para telas pequenas */}
            <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-5 flex-1">

              {/* Seção da Foto de Perfil */}
              <div className="flex flex-col items-center gap-2 pb-2 border-b border-zinc-100">
                <div className="relative h-20 w-20 rounded-xl border-2 border-zinc-200 bg-zinc-50 overflow-hidden group">
                  <img
                    src={photoPreview || "/image/placeholder-pfp.webp"}
                    alt="Preview"
                    className="object-cover w-full h-full"
                  />
                  <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <PiCameraBold className="text-white text-lg" />
                    <input type="file" className="sr-only" accept="image/*" onChange={handlePhotoChange} />
                  </label>
                </div>
                <span className="text-[10px] font-bold text-zinc-400 uppercase">Alterar Identidade Visual</span>
              </div>

              {/* Grid de Inputs Principais */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-zinc-500 text-[10px] font-black uppercase">Nome Exibido</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-zinc-50 border-2 border-zinc-100 rounded-xl py-2.5 px-4 text-sm font-bold focus:outline-none focus:border-[#CD463A] transition-all"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-zinc-500 text-[10px] font-black uppercase">E-mail do Sistema</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-zinc-50 border-2 border-zinc-100 rounded-xl py-2.5 px-4 text-sm font-bold focus:outline-none focus:border-[#CD463A] transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-zinc-500 text-[10px] font-black uppercase">CEP Residencial</label>
                  <input
                    type="text"
                    value={cep}
                    onChange={(e) => handleCepChange(e.target.value)}
                    placeholder="00000-000"
                    className="w-full bg-zinc-50 border-2 border-zinc-100 rounded-xl py-2.5 px-4 text-sm font-bold focus:outline-none focus:border-[#CD463A] transition-all"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-zinc-500 text-[10px] font-black uppercase">Terminal Celular</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    placeholder="(00) 00000-0000"
                    className="w-full bg-zinc-50 border-2 border-zinc-100 rounded-xl py-2.5 px-4 text-sm font-bold focus:outline-none focus:border-[#CD463A] transition-all"
                  />
                </div>
              </div>

              {/* Seção de Segurança / Senha */}
              <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-100 space-y-3">
                <div className="flex items-center gap-1.5 border-b border-zinc-200 pb-1.5 mb-1">
                  <PiLockBold className="text-[#CD463A]" />
                  <span className="text-[10px] font-black uppercase tracking-wider text-zinc-700">Alterar Chave de Acesso</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-zinc-400 text-[9px] font-bold uppercase">Senha Atual</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-white border border-zinc-200 rounded-lg py-2 px-3 text-xs font-bold focus:outline-none focus:border-[#CD463A]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-zinc-400 text-[9px] font-bold uppercase">Nova Senha</label>
                    <input
                      type="password"
                      placeholder="Mín. 8 caracteres"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full bg-white border border-zinc-200 rounded-lg py-2 px-3 text-xs font-bold focus:outline-none focus:border-[#CD463A]"
                    />
                  </div>
                </div>
              </div>

              {/* Footer de Ações dentro do Form */}
              <div className="pt-2 flex justify-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2.5 border border-zinc-200 text-zinc-500 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-zinc-50 transition-all cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#CD463A] hover:bg-[#DC5246] text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-sm transition-all active:scale-95 cursor-pointer"
                >
                  Salvar Alterações
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </>
  );
}