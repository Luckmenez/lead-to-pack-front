"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState, useEffect } from "react";
import { UserCircleIcon, SignOutIcon, UserIcon, CaretDownIcon } from "@phosphor-icons/react";
import { useAuth } from "@/contexts/AuthContext";
import { getDiscoveryHomePath } from "@/lib/routing";

export function Header() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const displayName =
    user?.tipo === "comprador"
      ? user.nomeCompleto
      : user?.tipo === "fornecedor"
        ? user.nomeFantasia
        : user?.tipo === "profissional"
          ? user.apelido
          : null;

  const handleLogout = () => {
    logout();
    router.push("/choose-profile");
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="w-full shrink-0 bg-white px-8 py-4 shadow-[0_3px_10px_rgba(0,0,0,0.18)]">
      <div className="flex items-center justify-between">
        <Link
          href={isAuthenticated && user ? getDiscoveryHomePath(user.tipo) : "/"}
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
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              className="flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium text-[#0B2443] transition hover:bg-gray-100"
            >
              <UserCircleIcon size={28} weight="fill" className="text-[#4F83A6]" />
              <span>{displayName}</span>
              <CaretDownIcon
                size={14}
                weight="bold"
                className={`text-gray-400 transition-transform ${menuOpen ? "rotate-180" : ""}`}
              />
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-full z-50 mt-1 min-w-[160px] rounded-xl border border-gray-200 bg-white py-1 shadow-lg">
                <Link
                  href="/my-profile"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <UserIcon size={16} className="text-[#4F83A6]" />
                  Meu Perfil
                </Link>
                <div className="my-1 border-t border-gray-100" />
                <button
                  type="button"
                  onClick={() => { setMenuOpen(false); handleLogout(); }}
                  className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <SignOutIcon size={16} className="text-[#4F83A6]" />
                  Sair
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
