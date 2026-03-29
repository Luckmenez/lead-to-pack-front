"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { getBuyers, type BuyerItem } from "@/lib/api/buyers.api";
import Link from "next/link";
import { EnvelopeSimpleIcon } from "@phosphor-icons/react";
import {
  DiscoveryResultsCount,
  DiscoverySearchSection,
} from "@/components/discovery/DiscoverySearchSection";

function BuyerCard({ buyer }: { buyer: BuyerItem }) {
  const titulo = buyer.nomeFantasia?.trim() || buyer.razaoSocial;

  return (
    <article className="flex flex-col rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md sm:flex-row">
      <div className="flex flex-1 flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-lg font-semibold text-[#0B2443]">{titulo}</h2>
          <span className="rounded border border-gray-300 bg-gray-50 px-2 py-0.5 text-xs text-gray-600">
            Empresa compradora
          </span>
        </div>

        <p className="text-sm text-gray-700">
          <span className="font-medium text-gray-800">Razão social:</span>{" "}
          {buyer.razaoSocial}
        </p>

        {(buyer.website || buyer.redeSocial) && (
          <div className="flex flex-wrap gap-3 text-sm text-[#4F83A6]">
            {buyer.website && (
              <a
                href={buyer.website}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                Site
              </a>
            )}
            {buyer.redeSocial && (
              <span className="text-gray-600">{buyer.redeSocial}</span>
            )}
          </div>
        )}
      </div>

      <div className="mt-4 flex shrink-0 flex-row gap-2 border-t border-gray-100 pt-4 sm:mt-0 sm:ml-6 sm:flex-col sm:border-l sm:border-t-0 sm:pt-0 sm:pl-6">
        <Link
          href={`/buyer/${buyer.id}`}
          className="cursor-pointer rounded-lg border border-gray-300 bg-white px-4 py-2 text-center text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Visualizar Perfil
        </Link>
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

export default function FindBuyersPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [searchInput, setSearchInput] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<{
    data: BuyerItem[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  } | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.replace("/choose-profile");
      return;
    }
    if (user.tipo === "comprador") {
      router.replace("/find-suppliers");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user || user.tipo === "comprador" || !hasSearched) return;

    setLoading(true);
    getBuyers({
      page,
      limit: 9,
      search: appliedSearch || undefined,
    })
      .then(setData)
      .catch(() =>
        setData({ data: [], total: 0, page: 1, limit: 9, totalPages: 0 })
      )
      .finally(() => setLoading(false));
  }, [user, page, appliedSearch, hasSearched]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
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

  return (
    <main className="mx-auto w-full max-w-[1200px] flex-1 px-6 py-10">
      <DiscoverySearchSection
        title="Encontre Empresas Compradoras"
        subtitle="Conecte-se com empresas que buscam fornecedores e soluções no setor de embalagens"
        searchPlaceholder="Busque por empresa, razão social ou nome fantasia..."
        searchValue={searchInput}
        onSearchChange={setSearchInput}
        onSubmit={handleSearch}
        showCategoryFilter={false}
      />

      {!hasSearched ? (
        <div className="rounded-xl border border-[#E2E8F0] bg-white p-12 text-center">
          <p className="text-[#757575]">
            Preencha a busca e clique em <span className="font-semibold text-[#284161]">Buscar</span> para exibir empresas compradoras cadastradas.
          </p>
        </div>
      ) : loading ? (
        <div className="flex min-h-[200px] items-center justify-center">
          <p className="text-muted-foreground">Carregando compradores...</p>
        </div>
      ) : data && data.data.length > 0 ? (
        <>
          <DiscoveryResultsCount total={data.total} entityLabel="compradores" />
          <div className="flex flex-col gap-4">
            {data.data.map((buyer) => (
              <BuyerCard key={buyer.id} buyer={buyer} />
            ))}
          </div>

          {data.totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="cursor-pointer rounded-lg border border-input px-4 py-2 text-sm disabled:opacity-50 hover:bg-muted"
              >
                Anterior
              </button>
              <span className="text-sm text-muted-foreground">
                Página {page} de {data.totalPages}
              </span>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
                disabled={page >= data.totalPages}
                className="cursor-pointer rounded-lg border border-input px-4 py-2 text-sm disabled:opacity-50 hover:bg-muted"
              >
                Próxima
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="rounded-xl border bg-white p-12 text-center">
          <p className="text-muted-foreground">
            Nenhum comprador encontrado. Tente ajustar sua busca.
          </p>
        </div>
      )}
    </main>
  );
}
