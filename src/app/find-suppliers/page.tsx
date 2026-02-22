"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { getSuppliers, type SupplierItem } from "@/lib/api/suppliers.api";
import Link from "next/link";
import { MagnifyingGlassIcon, CubeIcon, EnvelopeSimpleIcon } from "@phosphor-icons/react";

const CATEGORIAS_PRODUTOS = [
  "Embalagens Primárias",
  "Embalagens Secundárias",
  "Embalagens Terciárias",
  "Acessórios e Componentes",
  "Etiquetas e Rótulos",
  "Embalagens Sustentáveis/Recicladas",
];

function SupplierCard({ supplier }: { supplier: SupplierItem }) {
  const categorias = Array.isArray(supplier.categoriasProdutos)
    ? supplier.categoriasProdutos
    : [];
  const descricao =
    supplier.descricaoInstitucional?.slice(0, 120) +
    (supplier.descricaoInstitucional?.length > 120 ? "..." : "");

  return (
    <article className="flex flex-col rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="mb-3 flex items-start gap-2">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#EEF6DB]">
          <CubeIcon size={20} weight="bold" color="#9CCB3B" />
        </span>
        <div>
          <h2 className="font-semibold text-[#0B2443]">{supplier.nomeFantasia}</h2>
          <span className="mt-1 inline-block rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
            Empresa Fornecedora
          </span>
        </div>
      </div>
      <p className="mb-3 flex-1 text-sm text-muted-foreground">{descricao}</p>
      {categorias.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-1">
          {categorias.slice(0, 4).map((cat) => (
            <span
              key={cat}
              className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-700"
            >
              {cat}
            </span>
          ))}
        </div>
      )}
      <div className="mt-auto flex flex-wrap gap-2">
        <Link
          href={`/supplier/${supplier.id}`}
          className="cursor-pointer rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Visualizar Perfil
        </Link>
        <Link
          href={`/supplier/${supplier.id}/contact`}
          className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-[#5B86A8] px-4 py-2 text-sm font-medium text-white hover:bg-[#4A748F]"
        >
          <EnvelopeSimpleIcon size={16} weight="bold" />
          Gerar Contato
        </Link>
      </div>
    </article>
  );
}

export default function FindSuppliersPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [categoria, setCategoria] = useState<string>("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<{
    data: SupplierItem[];
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
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user) return;

    setLoading(true);
    getSuppliers({
      page,
      limit: 9,
      search: search || undefined,
      categoria: categoria || undefined,
    })
      .then(setData)
      .catch(() => setData({ data: [], total: 0, page: 1, limit: 9, totalPages: 0 }))
      .finally(() => setLoading(false));
  }, [user, page, search, categoria]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
  };

  if (authLoading || !user) {
    return (
      <main className="flex min-h-[50vh] items-center justify-center">
        <p className="text-muted-foreground">Carregando...</p>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
      <section className="mb-8 text-center">
        <h1 className="text-2xl font-semibold text-[#0B2443]">
          Encontre Fornecedores de Embalagens
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Conecte-se com os melhores fornecedores e profissionais do setor
        </p>
      </section>

      <form onSubmit={handleSearch} className="mb-8 flex flex-col gap-4 rounded-xl border border-gray-200 bg-gray-50 p-4 sm:flex-row">
        <div className="relative flex-1">
          <MagnifyingGlassIcon
            className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground"
            size={20}
          />
          <input
            type="text"
            placeholder="Busque por empresa, produto, categoria..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-input bg-white py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#4F83A6]"
          />
        </div>
        <select
          value={categoria}
          onChange={(e) => {
            setCategoria(e.target.value);
            setPage(1);
          }}
          className="flex items-center gap-2 rounded-lg border border-input bg-white px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4F83A6]"
        >
          <option value="">Todas as categorias</option>
          {CATEGORIAS_PRODUTOS.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="cursor-pointer rounded-lg bg-[#5B86A8] px-6 py-2 text-sm font-medium text-white hover:bg-[#4A748F]"
        >
          Buscar
        </button>
      </form>

      {loading ? (
        <div className="flex min-h-[200px] items-center justify-center">
          <p className="text-muted-foreground">Carregando fornecedores...</p>
        </div>
      ) : data && data.data.length > 0 ? (
        <>
          <p className="mb-4 text-sm text-muted-foreground">
            {data.total} fornecedores encontrados
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.data.map((supplier) => (
              <SupplierCard key={supplier.id} supplier={supplier} />
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
            Nenhum fornecedor encontrado. Tente ajustar sua busca ou filtros.
          </p>
        </div>
      )}
    </main>
  );
}
