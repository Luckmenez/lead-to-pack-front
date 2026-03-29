"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { getSuppliers, type SupplierItem } from "@/lib/api/suppliers.api";
import {
  getProfessionals,
  type ProfessionalItem,
} from "@/lib/api/professionals.api";
import Link from "next/link";
import {
  EnvelopeSimpleIcon,
  MapPinIcon,
  FileTextIcon,
} from "@phosphor-icons/react";
import {
  DiscoveryResultsCount,
  DiscoverySearchSection,
} from "@/components/discovery/DiscoverySearchSection";
import {
  DiscoveryProfileModal,
  type DiscoveryProfileModalState,
} from "@/components/discovery/DiscoveryProfileModal";
import { MATERIAIS_FILTRO_OPCOES } from "@/lib/catalog/materiaisCadastro";

type ListResponse<T> = {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

function SupplierCard({
  supplier,
  onViewProfile,
}: {
  supplier: SupplierItem;
  onViewProfile: () => void;
}) {
  const categorias = Array.isArray(supplier.categoriasProdutos)
    ? supplier.categoriasProdutos
    : [];
  const materiais = Array.isArray(supplier.materiais) ? supplier.materiais : [];
  const tags = [...new Set([...categorias, ...materiais])].slice(0, 5);
  const descricao =
    supplier.descricaoInstitucional?.slice(0, 180) +
    (supplier.descricaoInstitucional?.length > 180 ? "..." : "");

  const cidade = supplier.cidade;
  const estado = supplier.estado;
  const supplierExt = supplier as SupplierItem & {
    arquivos?: { nome: string; url: string }[];
  };
  const arquivos = supplierExt.arquivos ?? [];

  return (
    <article className="flex flex-col rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md sm:flex-row">
      <div className="flex flex-1 flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-lg font-semibold text-[#0B2443]">
            {supplier.nomeFantasia}
          </h2>
          <span className="rounded border border-gray-300 bg-gray-50 px-2 py-0.5 text-xs text-gray-600">
            Empresa Fornecedora
          </span>
        </div>

        <p className="text-sm leading-relaxed text-gray-700">{descricao}</p>

        {(cidade || estado) && (
          <div className="flex items-center gap-1.5 text-sm text-gray-600">
            <MapPinIcon size={16} weight="fill" className="text-gray-400" />
            <span>{[cidade, estado].filter(Boolean).join(", ")}</span>
          </div>
        )}

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded bg-[#EEF6DB] px-2.5 py-1 text-xs text-[#5a7a1f]"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {arquivos.length > 0 ? (
          <div className="flex flex-wrap gap-4 pt-1">
            {arquivos.map((arq, i) => (
              <div
                key={i}
                className="flex items-center gap-1.5 text-xs text-gray-600"
              >
                <FileTextIcon size={14} weight="regular" />
                <span>{arq.nome}</span>
              </div>
            ))}
          </div>
        ) : (
          <div
            className="min-h-[1.5rem]"
            data-aria-label="Área preparada para arquivos futuros"
          />
        )}
      </div>

      <div className="mt-4 flex shrink-0 flex-row gap-2 border-t border-gray-100 pt-4 sm:mt-0 sm:ml-6 sm:flex-col sm:border-l sm:border-t-0 sm:pt-0 sm:pl-6">
        <button
          type="button"
          onClick={onViewProfile}
          className="cursor-pointer rounded-lg border border-gray-300 bg-white px-4 py-2 text-center text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Visualizar Perfil
        </button>
        <Link
          href={`/supplier/${supplier.id}/contact`}
          className="flex cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-[#0B2443] px-4 py-2 text-sm font-medium text-white hover:bg-[#0a1e38]"
        >
          <EnvelopeSimpleIcon size={16} weight="bold" />
          Gerar Contato
        </Link>
      </div>
    </article>
  );
}

function ProfessionalCard({
  professional,
  onViewProfile,
}: {
  professional: ProfessionalItem;
  onViewProfile: () => void;
}) {
  const categorias = Array.isArray(professional.categoriasProdutos)
    ? professional.categoriasProdutos
    : [];
  const materiais = Array.isArray(professional.materiais)
    ? professional.materiais
    : [];
  const tags = [...new Set([...categorias, ...materiais])].slice(0, 5);
  const descricao =
    professional.descricaoInstitucional?.slice(0, 180) +
    (professional.descricaoInstitucional?.length > 180 ? "..." : "");

  return (
    <article className="flex flex-col rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md sm:flex-row">
      <div className="flex flex-1 flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-lg font-semibold text-[#0B2443]">
            {professional.apelido}
          </h2>
          <span className="rounded border border-gray-300 bg-gray-50 px-2 py-0.5 text-xs text-gray-600">
            Profissional do setor
          </span>
        </div>
        <p className="text-sm text-gray-600">{professional.nomeCompleto}</p>

        <p className="text-sm leading-relaxed text-gray-700">{descricao}</p>

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded bg-[#E7EFF5] px-2.5 py-1 text-xs text-[#4F83A6]"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="mt-4 flex shrink-0 flex-row gap-2 border-t border-gray-100 pt-4 sm:mt-0 sm:ml-6 sm:flex-col sm:border-l sm:border-t-0 sm:pt-0 sm:pl-6">
        <button
          type="button"
          onClick={onViewProfile}
          className="cursor-pointer rounded-lg border border-gray-300 bg-white px-4 py-2 text-center text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Visualizar Perfil
        </button>
        <Link
          href={`/professional/${professional.id}/contact`}
          className="flex cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-[#1F2F44] px-4 py-2 text-sm font-medium text-white hover:bg-[#162233]"
        >
          <EnvelopeSimpleIcon size={16} weight="bold" />
          Gerar Contato
        </Link>
      </div>
    </article>
  );
}

function PaginationBar({
  page,
  totalPages,
  onPageChange,
  ariaLabel,
}: {
  page: number;
  totalPages: number;
  onPageChange: (p: number) => void;
  ariaLabel: string;
}) {
  if (totalPages <= 1) return null;
  return (
    <div
      className="mt-6 flex items-center justify-center gap-2"
      role="navigation"
      aria-label={ariaLabel}
    >
      <button
        type="button"
        onClick={() => onPageChange(Math.max(1, page - 1))}
        disabled={page <= 1}
        className="cursor-pointer rounded-lg border border-input px-4 py-2 text-sm disabled:opacity-50 hover:bg-muted"
      >
        Anterior
      </button>
      <span className="text-sm text-muted-foreground">
        Página {page} de {totalPages}
      </span>
      <button
        type="button"
        onClick={() => onPageChange(Math.min(totalPages, page + 1))}
        disabled={page >= totalPages}
        className="cursor-pointer rounded-lg border border-input px-4 py-2 text-sm disabled:opacity-50 hover:bg-muted"
      >
        Próxima
      </button>
    </div>
  );
}

export default function FindSuppliersPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [searchInput, setSearchInput] = useState("");
  const [materialInput, setMaterialInput] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [appliedMaterial, setAppliedMaterial] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [pageSuppliers, setPageSuppliers] = useState(1);
  const [pageProfessionals, setPageProfessionals] = useState(1);
  const [loading, setLoading] = useState(false);
  const [supplierData, setSupplierData] = useState<ListResponse<
    SupplierItem
  > | null>(null);
  const [professionalData, setProfessionalData] = useState<ListResponse<
    ProfessionalItem
  > | null>(null);
  const [profileModal, setProfileModal] =
    useState<DiscoveryProfileModalState>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.replace("/choose-profile");
      return;
    }
    if (user.tipo !== "comprador") {
      router.replace("/find-buyers");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user || user.tipo !== "comprador" || !hasSearched) return;

    setLoading(true);
    const params = {
      search: appliedSearch || undefined,
      material: appliedMaterial || undefined,
      limit: 9,
    };

    Promise.all([
      getSuppliers({ ...params, page: pageSuppliers }),
      getProfessionals({ ...params, page: pageProfessionals }),
    ])
      .then(([sup, prof]) => {
        setSupplierData(sup);
        setProfessionalData(prof);
      })
      .catch(() => {
        setSupplierData({
          data: [],
          total: 0,
          page: 1,
          limit: 9,
          totalPages: 0,
        });
        setProfessionalData({
          data: [],
          total: 0,
          page: 1,
          limit: 9,
          totalPages: 0,
        });
      })
      .finally(() => setLoading(false));
  }, [
    user,
    pageSuppliers,
    pageProfessionals,
    appliedSearch,
    appliedMaterial,
    hasSearched,
  ]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setAppliedSearch(searchInput);
    setAppliedMaterial(materialInput);
    setHasSearched(true);
    setPageSuppliers(1);
    setPageProfessionals(1);
  };

  if (authLoading || !user || user.tipo !== "comprador") {
    return (
      <main className="flex min-h-[50vh] items-center justify-center">
        <p className="text-muted-foreground">Carregando...</p>
      </main>
    );
  }

  const materialOptions = MATERIAIS_FILTRO_OPCOES.map((m) => ({
    value: m,
    label: m,
  }));

  const hasSuppliers = supplierData && supplierData.data.length > 0;
  const hasProfessionals = professionalData && professionalData.data.length > 0;
  const bothEmpty = !loading && supplierData && professionalData && !hasSuppliers && !hasProfessionals;

  return (
    <main className="mx-auto w-full max-w-[1200px] flex-1 px-6 py-10">
      <DiscoveryProfileModal
        state={profileModal}
        onClose={() => setProfileModal(null)}
      />
      <DiscoverySearchSection
        title="Encontre Fornecedores de Embalagens"
        subtitle="Conecte-se com os melhores fornecedores e profissionais do setor"
        searchPlaceholder="Busque por nome da empresa, produto ou material..."
        searchValue={searchInput}
        onSearchChange={setSearchInput}
        onSubmit={handleSearch}
        showCategoryFilter
        categoryValue={materialInput}
        onCategoryChange={setMaterialInput}
        categoryOptions={materialOptions}
        categoryPlaceholder="Todos os materiais"
      />

      {!hasSearched ? (
        <div className="rounded-xl border border-[#E2E8F0] bg-white p-12 text-center">
          <p className="text-[#757575]">
            Preencha os campos acima e clique em <span className="font-semibold text-[#284161]">Buscar</span> para exibir fornecedores e profissionais cadastrados.
          </p>
        </div>
      ) : loading ? (
        <div className="flex min-h-[200px] items-center justify-center">
          <p className="text-muted-foreground">Carregando resultados...</p>
        </div>
      ) : bothEmpty ? (
        <div className="rounded-xl border bg-white p-12 text-center">
          <p className="text-muted-foreground">
            Nenhum resultado encontrado. Tente ajustar sua busca ou filtros.
          </p>
        </div>
      ) : (
        <>
          {hasSuppliers && supplierData && (
            <section className="mb-10">
              <h2 className="mb-4 font-sans text-lg font-semibold text-[#284161]">
                Fornecedores
              </h2>
              <DiscoveryResultsCount
                total={supplierData.total}
                entityLabel="fornecedores"
              />
              <div className="flex flex-col gap-4">
                {supplierData.data.map((supplier) => (
                  <SupplierCard
                    key={supplier.id}
                    supplier={supplier}
                    onViewProfile={() =>
                      setProfileModal({ variant: "supplier", item: supplier })
                    }
                  />
                ))}
              </div>
              <PaginationBar
                page={supplierData.page}
                totalPages={supplierData.totalPages}
                onPageChange={setPageSuppliers}
                ariaLabel="Paginação fornecedores"
              />
            </section>
          )}

          {hasProfessionals && professionalData && (
            <section>
              <h2 className="mb-4 font-sans text-lg font-semibold text-[#284161]">
                Profissionais do setor
              </h2>
              <DiscoveryResultsCount
                total={professionalData.total}
                entityLabel="profissionais"
              />
              <div className="flex flex-col gap-4">
                {professionalData.data.map((p) => (
                  <ProfessionalCard
                    key={p.id}
                    professional={p}
                    onViewProfile={() =>
                      setProfileModal({
                        variant: "professional",
                        item: p,
                      })
                    }
                  />
                ))}
              </div>
              <PaginationBar
                page={professionalData.page}
                totalPages={professionalData.totalPages}
                onPageChange={setPageProfessionals}
                ariaLabel="Paginação profissionais"
              />
            </section>
          )}
        </>
      )}
    </main>
  );
}
