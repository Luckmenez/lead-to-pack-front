"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { getSuppliers, type SupplierItem } from "@/lib/api/suppliers.api";
import Link from "next/link";
import { MagnifyingGlassIcon, EnvelopeSimpleIcon, MapPinIcon, FileTextIcon } from "@phosphor-icons/react";

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
  const materiais = Array.isArray(supplier.materiais) ? supplier.materiais : [];
  const tags = [...new Set([...categorias, ...materiais])].slice(0, 5);
  const descricao =
    supplier.descricaoInstitucional?.slice(0, 180) +
    (supplier.descricaoInstitucional?.length > 180 ? "..." : "");

  const supplierExt = supplier as SupplierItem & { cidade?: string; estado?: string; arquivos?: { nome: string; url: string }[] };
  const cidade = supplierExt.cidade;
  const estado = supplierExt.estado;
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
            <span>
              {[cidade, estado].filter(Boolean).join(", ")}
            </span>
          </div>
        )}

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

        {arquivos.length > 0 ? (
          <div className="flex flex-wrap gap-4 pt-1">
            {arquivos.map((arq, i) => (
              <div key={i} className="flex items-center gap-1.5 text-xs text-gray-600">
                <FileTextIcon size={14} weight="regular" />
                <span>{arq.nome}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="min-h-[1.5rem]" data-aria-label="Área preparada para arquivos futuros" />
        )}
      </div>

      <div className="mt-4 flex shrink-0 flex-row gap-2 border-t border-gray-100 pt-4 sm:mt-0 sm:ml-6 sm:flex-col sm:border-l sm:border-t-0 sm:pt-0 sm:pl-6">
        <Link
          href={`/supplier/${supplier.id}`}
          className="cursor-pointer rounded-lg border border-gray-300 bg-white px-4 py-2 text-center text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Visualizar Perfil
        </Link>
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
          <div className="flex flex-col gap-4">
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
