"use client";

import { useEffect, useState } from "react";
import { CubeIcon, ShoppingCartIcon, XIcon } from "@phosphor-icons/react";
import type { CompradorUser, FornecedorUser } from "@/lib/api/auth.api";

export type ChooseProfileLoginModalState = {
  email: string;
  senha: string;
  comprador: CompradorUser;
  fornecedor: FornecedorUser;
};

type Props = {
  state: ChooseProfileLoginModalState | null;
  onClose: () => void;
  onChoose: (perfil: "comprador" | "fornecedor") => Promise<void>;
};

export function ChooseProfileLoginModal({
  state,
  onClose,
  onChoose,
}: Props) {
  const open = state != null;
  const [selecting, setSelecting] = useState<"comprador" | "fornecedor" | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      setSelecting(null);
      setError(null);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !selecting) onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose, selecting]);

  if (!state) return null;

  const handleChoose = async (perfil: "comprador" | "fornecedor") => {
    setError(null);
    setSelecting(perfil);
    try {
      await onChoose(perfil);
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Não foi possível concluir o login"
      );
    } finally {
      setSelecting(null);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="presentation"
    >
      <button
        type="button"
        className="absolute inset-0 cursor-default bg-black/50"
        aria-label="Fechar modal"
        onClick={() => !selecting && onClose()}
        disabled={Boolean(selecting)}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="choose-profile-login-title"
        className="relative z-10 max-h-[min(90vh,640px)] w-full max-w-[520px] overflow-y-auto rounded-[25px] border border-[#E2E8F0] bg-white p-6 shadow-xl sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={() => !selecting && onClose()}
          disabled={Boolean(selecting)}
          className="absolute right-3 top-3 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 transition hover:bg-gray-50 disabled:pointer-events-none disabled:opacity-50"
          aria-label="Fechar"
        >
          <XIcon size={20} weight="bold" />
        </button>

        <div className="pr-8">
          <h2
            id="choose-profile-login-title"
            className="text-xl font-bold text-[#0B2443] sm:text-2xl"
          >
            Qual perfil você deseja acessar?
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-gray-600">
            Este e-mail está cadastrado como comprador e como fornecedor.
            Escolha com qual perfil deseja entrar nesta sessão.
          </p>

          <div className="mt-6 flex flex-col gap-4">
            <button
              type="button"
              disabled={Boolean(selecting)}
              onClick={() => handleChoose("comprador")}
              className="flex w-full cursor-pointer items-start gap-4 rounded-2xl border border-gray-200 bg-white p-4 text-left shadow-sm transition hover:border-[#4F83A6]/40 hover:bg-[#E7EFF5]/50 disabled:cursor-wait disabled:opacity-70"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#E7EFF5]">
                <ShoppingCartIcon size={26} weight="bold" color="#4F83A6" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-sm font-bold text-[#4F83A6]">
                  Comprador
                </span>
                <p className="mt-1 text-sm font-semibold text-[#0B2443]">
                  {state.comprador.nomeCompleto}
                </p>
                <p className="mt-0.5 truncate text-xs text-gray-500">
                  {state.comprador.email}
                </p>
                {selecting === "comprador" && (
                  <p className="mt-2 text-xs text-[#4F83A6]">Entrando...</p>
                )}
              </div>
            </button>

            <button
              type="button"
              disabled={Boolean(selecting)}
              onClick={() => handleChoose("fornecedor")}
              className="flex w-full cursor-pointer items-start gap-4 rounded-2xl border border-gray-200 bg-white p-4 text-left shadow-sm transition hover:border-[#9CCB3B]/40 hover:bg-[#EEF6DB]/50 disabled:cursor-wait disabled:opacity-70"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#EEF6DB]">
                <CubeIcon size={26} weight="bold" color="#9CCB3B" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-sm font-bold text-[#7BA32E]">
                  Fornecedor
                </span>
                <p className="mt-1 text-sm font-semibold text-[#0B2443]">
                  {state.fornecedor.nomeFantasia}
                </p>
                <p className="mt-0.5 truncate text-xs text-gray-500">
                  {state.fornecedor.email}
                </p>
                {selecting === "fornecedor" && (
                  <p className="mt-2 text-xs text-[#7BA32E]">Entrando...</p>
                )}
              </div>
            </button>
          </div>

          {error && (
            <p className="mt-4 text-sm text-red-600" role="alert">
              {error}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
