import { getOrdersByUserId } from "@/lib/services/orders.server";
import { getUserById } from "@/lib/services/user.server";
import SellerPage from "./SellerPage";
import BuyerPage from "./BuyerPage";
import Image from "next/image";
import { redirect } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { PiSignOutBold, PiCalendarBlankBold, PiMapPinBold } from "react-icons/pi";
import EditProfileModal from "@/components/profile/EditProfileModal";
import { Order, User } from "@retrovault/core";

interface ProfileProps {
  params: Promise<{ id: string; slug: string }>;
}

export default async function Profile({ params }: ProfileProps) {
    const { id } = await params;
    const user = await getUserById(id);
    
    if (!user)
        return <div className="text-center py-20 font-chakra-petch text-zinc-800 font-bold">OPERADOR NÃO ENCONTRADO NO BANCO DE DADOS.</div>;

    let orders: Order[] = [];
    let reviews = [];

    try {
      orders = await getOrdersByUserId(id);
      // reviews = await getReviewsByUserId(id);
    } catch (err: any) {
      if (isRedirectError(err)) throw err;
      if (err?.response?.status === 401) {
        redirect('/login');
      }
    }

    const handleLogout = async () => {
      'use server'
      // deleteCookie("access_token")
      // deleteCookie("refresh_token")
      redirect('/login');
    };

  return (
    <main className="min-h-[87dvh] pt-5 bg-[#F8F9FA] font-chakra-petch pb-12">
      <div className="max-w-4xl mx-auto">
        
        {/* 🚀 Card Container com Cantos de Engenharia */}
        <div className="relative mx-4 my-8 md:mx-8 md:my-12 rounded-2xl bg-white border border-zinc-200 shadow-xl overflow-visible">
          
          {/* Cantos Industriais */}
          <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-[#CD463A] rounded-tl-2xl z-10"></div>
          <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-[#CD463A] rounded-tr-2xl z-10"></div>

          {/* Banner */}
          <div className="relative w-full h-44 md:h-48 rounded-t-2xl overflow-hidden bg-zinc-900">
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#white_1px,transparent_1px)] [background-size:16px_16px]"></div>
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent" />
          </div>

          {/* Foto de Perfil */}
          <div className="absolute left-6 md:left-10 top-24 md:top-28 z-10">
            <div className="relative h-28 w-28 md:h-32 md:w-32 rounded-xl border-4 border-white overflow-hidden shadow-md bg-zinc-100">
              <Image
                src={user.photo ?? "/image/placeholder-pfp.webp"}
                alt="Foto de perfil"
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Botão de Logout Técnico no Topo */}
          <div className="absolute right-4 top-4 z-10">
            <form action={handleLogout}>
              <button type="submit" className="flex items-center gap-2 px-4 py-2 bg-black/60 hover:bg-[#CD463A] text-white text-xs font-black uppercase tracking-wider rounded-lg border border-white/20 transition-all cursor-pointer">
                <PiSignOutBold className="text-sm" />
                Desconectar
              </button>
            </form>
          </div>

          {/* Área de Informações Principais */}
          <div className="bg-white px-6 md:px-10 pt-14 md:pt-16 pb-6 border-b border-zinc-100">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-zinc-900 text-xl md:text-2xl font-black uppercase tracking-tight">
                    {user.name}
                  </h1>
                  <span className="text-[9px] px-2 py-0.5 bg-zinc-100 text-zinc-500 rounded font-black uppercase border border-zinc-200">
                    {user.role}
                  </span>
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-zinc-400 text-xs font-semibold">
                  <span className="flex items-center gap-1"><PiMapPinBold /> CEP: {user.defaultCep ?? "Não informado"}</span>
                  <span className="flex items-center gap-1"><PiCalendarBlankBold /> Membro desde: {new Date(user.createdAt!).toLocaleDateString('pt-BR')}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto">
                <EditProfileModal user={user as User & { phone: string | undefined }} />
                {user.role === "BUYER" && (
                  <button className="px-5 py-2.5 bg-[#CD463A] hover:bg-[#DC5246] text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all active:scale-95 shadow-sm cursor-pointer">
                    Seguir Loja
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Alternância de Páginas */}
          {user.role === "SELLER" ? (
            <SellerPage user={user} />
          ) : (
            <BuyerPage orders={orders} user={user}/>
          )}

        </div>
      </div>
    </main>
  );
}