"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BuildingsIcon,
  EnvelopeSimpleIcon,
  GlobeIcon,
  InstagramLogoIcon,
  MagnifyingGlassIcon,
} from "@phosphor-icons/react";
import { useAuth } from "@/contexts/AuthContext";
import { getBuyers, type BuyerItem } from "@/lib/api/buyers.api";
import {
  DiscoveryResultsCount,
  DiscoverySearchSection,
} from "@/components/discovery/DiscoverySearchSection";
import { FIND_SUPPLIERS_PATH } from "@/lib/routing";

type ListResponse = {
  data: BuyerItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

function BuyerCard({ buyer }: { buyer: BuyerItem }) {
  const displayName = buyer.nomeFantasia || buyer.razaoSocial;

  return (
    <article className="flex flex-col rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md sm:flex-row">
      <div className="flex flex-1 flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-lg font-semibold text-[#0B2443]">{displayName}</h2>
          <span className="rounded border border-gray-300 bg-gray-50 px-2 py-0.5 text-xs text-gray-600">
            Empresa Compradora
          </span>
        </div>

        {buyer.nomeFantasia && buyer.razaoSocial && (
          <p className="text-sm text-gray-600">{buyer.razaoSocial}</p>
        )}

        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
          {buyer.website && (
            <div className="flex items-center gap-1.5">
              <GlobeIcon size={16} className="text-gray-400" />
              <span className="truncate">{buyer.website}</span>
            </div>
          )}
          {buyer.redeSocial && (
            <div className="flex items-center gap-1.5">
              <InstagramLogoIcon size={16} className="text-gray-400" />
              <span className="truncate">{buyer.redeSocial}</span>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 flex shrink-0 flex-row gap-2 border-t border-gray-100 pt-4 sm:mt-0 sm:ml-6 sm:flex-col sm:border-l sm:border-t-0 sm:pt-0 sm:pl-6">
        <Link
          href={`/buyer/${buyer.id}/contact`}
          className="flex cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-[#0B2443] px-4 py-2 text-sm font-medium text-white hover:bg-[#0a1e38]"
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
}: {
  page: number;
  totalPages: number;
  onPageChange: (p: number) => void;
}) {
  if (totalPages <= 1) return null;
  return (
    <div
      className="mt-6 flex items-center justify-center gap-2"
      role="navigation"
      aria-label="Paginação compradores"
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

export default function FindBuyersPage() {
  const { user, token, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [searchInput, setSearchInput] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [hasSearched, setHasSearched] = useState(true);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [buyerData, setBuyerData] = useState<ListResponse | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.replace("/choose-profile");
      return;
    }
    if (user.tipo === "comprador") {
      router.replace(FIND_SUPPLIERS_PATH);
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user || user.tipo === "comprador" || !hasSearched || !token) return;

    const fetchData = async () => {
      setLoading(true);
      setSearchError(null);
      try {
        const data = await getBuyers(
          {
            search: appliedSearch || undefined,
            limit: 9,
            page,
          },
          token,
        );
        setBuyerData(data);
      } catch (e) {
        setSearchError(
          e instanceof Error
            ? e.message
            : "Não foi possível carregar os resultados. Tente novamente.",
        );
        setBuyerData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, token, page, appliedSearch, hasSearched]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchError(null);
    setAppliedSearch(searchInput);
    setHasSearched(true);
    setPage(1);
  };

  if (authLoading || !user || user.tipo === "comprador") {
    return (
      <main className="flex min-h-[50vh] items-center justify-center">
        <p className="text-muted-foreground">Carregando...</p>
      </main>
    );
  }

  const hasResults = buyerData && buyerData.data.length > 0;
  const isEmpty = !loading && buyerData && !hasResults;

  return (
    <main className="mx-auto w-full max-w-[1200px] flex-1 px-6 py-10">
      <DiscoverySearchSection
        title="Encontre Empresas Compradoras"
        subtitle="Conecte-se com empresas que buscam fornecedores e profissionais do setor"
        beforeSearch={
          <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#E7EFF5]">
            <BuildingsIcon size={28} weight="bold" color="#4F83A6" />
          </span>
        }
        searchPlaceholder="Busque por nome fantasia ou razão social..."
        searchValue={searchInput}
        onSearchChange={setSearchInput}
        onSubmit={handleSearch}
      />

      {!hasSearched ? (
        <div className="rounded-xl border border-[#E2E8F0] bg-white p-12 text-center shadow-sm">
          <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#E7EFF5]">
            <MagnifyingGlassIcon size={28} weight="bold" color="#4F83A6" />
          </span>
          <h3 className="mb-2 text-base font-semibold text-[#0B2443]">
            Encontre empresas compradoras
          </h3>
          <p className="mx-auto max-w-sm text-sm text-[#757575]">
            Use a busca acima para filtrar por nome fantasia ou razão social.
            Os resultados aparecem aqui.
          </p>
        </div>
      ) : loading ? (
        <div className="flex min-h-[200px] items-center justify-center">
          <p className="text-muted-foreground">Carregando resultados...</p>
        </div>
      ) : searchError ? (
        <div
          className="rounded-xl border border-red-200 bg-red-50 p-8 text-center"
          role="alert"
        >
          <p className="text-sm font-medium text-red-700">{searchError}</p>
          <p className="mt-2 text-sm text-red-600">
            Verifique sua conexão ou tente buscar novamente.
          </p>
        </div>
      ) : isEmpty ? (
        <div className="rounded-xl border bg-white p-12 text-center">
          <p className="text-muted-foreground">
            Nenhum resultado encontrado. Tente ajustar sua busca.
          </p>
        </div>
      ) : buyerData ? (
        <section>
          <h2 className="mb-4 font-sans text-lg font-semibold text-[#284161]">
            Empresas compradoras
          </h2>
          <DiscoveryResultsCount
            total={buyerData.total}
            entityLabel="compradores"
          />
          <div className="flex flex-col gap-4">
            {buyerData.data.map((buyer) => (
              <BuyerCard key={buyer.id} buyer={buyer} />
            ))}
          </div>
          <PaginationBar
            page={buyerData.page}
            totalPages={buyerData.totalPages}
            onPageChange={setPage}
          />
        </section>
      ) : null}
    </main>
  );
}
