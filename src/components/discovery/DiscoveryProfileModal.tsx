"use client";

import { useEffect } from "react";
import { FileTextIcon, XIcon } from "@phosphor-icons/react";
import type { SupplierItem } from "@/lib/api/suppliers.api";
import type { ProfessionalItem } from "@/lib/api/professionals.api";

/** Simulação até existir bucket/arquivos reais no backend. */
const MOCK_PROFILE_FILES = [
  "Catálogo Digital",
  "Certificação ISO 9001",
  "Apresentação Comercial",
] as const;

export type DiscoveryProfileModalState =
  | { variant: "supplier"; item: SupplierItem }
  | { variant: "professional"; item: ProfessionalItem }
  | null;

type Props = {
  state: DiscoveryProfileModalState;
  onClose: () => void;
};

export function DiscoveryProfileModal({ state, onClose }: Props) {
  const open = state != null;

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

  if (!state) return null;

  const title =
    state.variant === "supplier"
      ? state.item.nomeFantasia
      : state.item.apelido;
  const badge =
    state.variant === "supplier"
      ? "Empresa Fornecedora"
      : "Profissional do setor";
  const pitch =
    state.item.descricaoInstitucional?.trim() ||
    "Nenhuma descrição cadastrada.";
  const categorias = Array.isArray(state.item.categoriasProdutos)
    ? state.item.categoriasProdutos
    : [];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="presentation"
    >
      <button
        type="button"
        className="absolute inset-0 cursor-default bg-black/50"
        aria-label="Fechar modal"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="discovery-profile-title"
        className="relative z-10 max-h-[min(90vh,720px)] w-full max-w-[703px] overflow-y-auto rounded-[25px] border border-[#E2E8F0] bg-white p-4 shadow-xl"
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

        <div className="pr-10">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <h2
              id="discovery-profile-title"
              className="text-xl font-bold text-[#0B2443] sm:text-2xl"
            >
              {title}
            </h2>
            <span className="rounded border border-gray-300 bg-gray-50 px-2 py-0.5 text-xs text-gray-600">
              {badge}
            </span>
          </div>

          {state.variant === "professional" && (
            <p className="mb-3 text-sm text-gray-600">
              {state.item.nomeCompleto}
            </p>
          )}

          <p className="mb-6 text-sm leading-relaxed text-gray-700">{pitch}</p>

          <section className="mb-6">
            <h3 className="mb-3 text-sm font-bold text-[#0B2443]">
              Materiais disponíveis:
            </h3>
            <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {MOCK_PROFILE_FILES.map((label) => (
                <li key={label}>
                  <div className="flex cursor-default items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-800">
                    <FileTextIcon
                      size={20}
                      weight="regular"
                      className="shrink-0 text-gray-500"
                    />
                    <span className="truncate">{label}</span>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h3 className="mb-3 text-sm font-bold text-[#0B2443]">
              Categorias de atuação:
            </h3>
            {categorias.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {categorias.map((cat) => (
                  <span
                    key={cat}
                    className="rounded-full bg-gray-100 px-3 py-1.5 text-sm text-gray-800"
                  >
                    {cat}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">
                Nenhuma categoria cadastrada.
              </p>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
