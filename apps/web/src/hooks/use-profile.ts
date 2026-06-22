"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/context/auth.context";
import api from "@/lib/axios"; 
import { User } from "@retrovault/core";

export function useProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user?.sub) {
      console.log("[useProfile] Aguardando inicialização do usuário (user.sub está ausente).");
      setProfile(null);
      return;
    }

    async function fetchProfile() {
      setLoading(true);
      console.log(`[useProfile] Buscando perfil para o ID: ${user?.sub}`);
      try {
        const response = await api.get(`/users/${user?.sub}`);
        console.log("[useProfile] Perfil retornado com sucesso:", response.data);
        setProfile(response.data);
      } catch (error: any) {
        setProfile(null);
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [user?.sub]); 

  return { profile, loading };
}