"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { FIND_SUPPLIERS_PATH, MY_PROFILE_PATH } from "@/lib/routing";

export default function FindBuyersPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.replace("/choose-profile");
      return;
    }
    if (user.tipo === "comprador") {
      router.replace(FIND_SUPPLIERS_PATH);
      return;
    }
    router.replace(MY_PROFILE_PATH);
  }, [user, authLoading, router]);

  return (
    <main className="flex min-h-[50vh] items-center justify-center">
      <p className="text-muted-foreground">
        {authLoading || !user ? "Carregando..." : "Redirecionando..."}
      </p>
    </main>
  );
}
