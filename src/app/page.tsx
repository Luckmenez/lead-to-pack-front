"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function Home() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;
    if (user?.tipo === "comprador") {
      router.replace("/find-suppliers");
    } else if (
      user?.tipo === "fornecedor" ||
      user?.tipo === "profissional"
    ) {
      router.replace("/find-buyers");
    } else {
      router.replace("/choose-profile");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  return null;
}
