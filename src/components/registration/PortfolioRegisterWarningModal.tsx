"use client";

import { useEffect } from "react";
import Link from "next/link";
import { WarningCircleIcon, XIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";

type Props = {
  open: boolean;
  onClose: () => void;
};

export function PortfolioRegisterWarningModal({ open, onClose }: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="presentation"
    >
      <button
        type="button"
        className="absolute inset-0 cursor-default bg-black/50"
        aria-label="Fechar aviso"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="portfolio-register-warning-title"
        className="relative z-10 w-full max-w-[480px] rounded-[25px] border border-[#E2E8F0] bg-white p-6 shadow-xl sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 transition hover:bg-gray-50"
          aria-label="Fechar"
        >
          <XIcon size={20} weight="bold" />
        </button>

        <div className="pr-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FFF8E6]">
            <WarningCircleIcon size={28} weight="fill" className="text-[#D97706]" />
          </div>

          <h2
            id="portfolio-register-warning-title"
            className="mt-4 text-xl font-bold text-[#0B2443] sm:text-2xl"
          >
            Conta criada com sucesso
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-gray-600">
            Seu cadastro foi concluído, mas não foi possível enviar o portfólio
            neste momento. Você pode adicionar os arquivos em{" "}
            <Link
              href="/my-profile"
              className="font-medium text-[#4F83A6] underline-offset-2 hover:underline"
              onClick={onClose}
            >
              Meu Perfil
            </Link>{" "}
            quando quiser.
          </p>

          <Button
            type="button"
            onClick={onClose}
            className="mt-6 w-full rounded-full bg-[#5B86A8] px-8 hover:bg-[#4A748F]"
          >
            Entendi
          </Button>
        </div>
      </div>
    </div>
  );
}
