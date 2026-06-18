"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/context/auth.context";
import axios from "axios";
import { User } from "@retrovault/core";

export function useProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user?.sub) {
      setProfile(null);
      return;
    }

    async function fetchProfile() {
      setLoading(true);
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/users/profile/${user?.sub}`);
        setProfile(response.data);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [user?.sub]);

  return { profile, loading };
}