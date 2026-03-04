"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserCircleIcon, SignOutIcon } from "@phosphor-icons/react";
import { useAuth } from "@/contexts/AuthContext";

export function Header() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();

  const displayName =
    user?.tipo === "comprador"
      ? user.nomeCompleto
      : user?.tipo === "fornecedor"
        ? user.nomeFantasia
        : null;

  const handleLogout = () => {
    logout();
    router.push("/choose-profile");
  };

  return (
    <header className="w-full shrink-0 bg-white px-8 py-4 shadow-[0_3px_10px_rgba(0,0,0,0.18)]">
      <div className="flex items-center justify-between">
        <Link
          href={user?.tipo === "comprador" ? "/find-suppliers" : "/"}
          className="relative h-12 w-48 cursor-pointer"
        >
          <Image
            src="/logo_Lead2Pack.svg"
            alt="Lead 2 Pack Logo"
            fill
            loading="eager"
          />
        </Link>
        {isAuthenticated && displayName && (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <UserCircleIcon
                size={28}
                weight="fill"
                className="text-[#4F83A6]"
              />
              <span className="text-sm font-medium text-[#0B2443]">
                {displayName}
              </span>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-1.5 rounded-full bg-[#E7EFF5] px-3 py-1.5 text-sm font-medium text-[#4F83A6] transition hover:bg-[#dbe7f0]"
            >
              <SignOutIcon size={16} weight="bold" />
              Sair
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
