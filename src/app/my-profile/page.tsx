"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BuildingsIcon,
  BriefcaseIcon,
  PhoneIcon,
  WhatsappLogoIcon,
  EnvelopeSimpleIcon,
  GlobeIcon,
  InstagramLogoIcon,
  MapPinIcon,
  IdentificationCardIcon,
  CalendarBlankIcon,
  PencilSimpleIcon,
  CheckCircleIcon,
  WarningCircleIcon,
  ArrowLeftIcon,
} from "@phosphor-icons/react";
import { PortfolioDownloadLink } from "@/components/portfolio/PortfolioDownloadLink";
import {
  getPortfolioFileLabel,
  PortfolioFileIcon,
} from "@/components/portfolio/PortfolioFileDisplay";
import { PORTFOLIO_EDIT_PARTIAL_ERROR } from "@/lib/api/portfolio.api";
import { useAuth } from "@/contexts/AuthContext";
import {
  getCompradorMe,
  getFornecedorMe,
  getProfissionalMe,
  type FornecedorPerfil,
  type ProfissionalPerfil,
  type CompradorPerfil,
} from "@/lib/api/my-profile.api";
import { FornecedorEditForm } from "./components/FornecedorEditForm";
import { ProfissionalEditForm } from "./components/ProfissionalEditForm";
import { CompradorEditForm } from "./components/CompradorEditForm";
import {
  getDiscoveryHomeLabel,
  getDiscoveryHomePath,
} from "@/lib/routing";
import { formatCategoriaLabel } from "@/lib/catalog/formatCategoriaLabel";

function TagList({
  items,
  color,
}: {
  items?: string[];
  color: "green" | "blue";
}) {
  const list = items ?? [];
  if (!list.length)
    return <p className="text-sm text-gray-400">Não informado</p>;
  const cls =
    color === "green"
      ? "rounded-full bg-[#EEF6DB] px-3 py-1 text-xs font-medium text-[#5a7a1f]"
      : "rounded-full bg-[#E7EFF5] px-3 py-1 text-xs font-medium text-[#4F83A6]";
  return (
    <div className="flex flex-wrap gap-2">
      {list.map((t) => (
        <span key={t} className={cls}>
          {formatCategoriaLabel(t)}
        </span>
      ))}
    </div>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string | null;
}) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 shrink-0 text-gray-400">{icon}</span>
      <div className="min-w-0">
        <p className="text-xs text-gray-400">{label}</p>
        <p className="text-sm font-medium text-gray-800 break-all">{value}</p>
      </div>
    </div>
  );
}

function SectionCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-[#0B2443]">
        {title}
      </h2>
      {children}
    </div>
  );
}

// ─── views ──────────────────────────────────────────────────────────────────

function PortfolioSection({
  urls,
  color,
}: {
  urls: string[];
  color: "green" | "blue";
}) {
  if (!urls.length)
    return <p className="text-sm text-gray-400">Nenhum arquivo cadastrado</p>;
  return (
    <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
      {urls.map((url) => (
        <li key={url}>
          <PortfolioDownloadLink
            url={url}
            className={`flex w-full items-center gap-2 rounded-lg border px-3 py-2.5 text-sm transition hover:bg-gray-50 ${
              color === "green"
                ? "border-[#9CCB3B]/40 text-gray-800"
                : "border-[#4F83A6]/30 text-gray-800"
            }`}
          >
            <PortfolioFileIcon url={url} />
            <span className="truncate">{getPortfolioFileLabel(url)}</span>
          </PortfolioDownloadLink>
        </li>
      ))}
    </ul>
  );
}

const TIPOEMPRESA_LABEL: Record<string, string> = {
  mei: "MEI",
  lucro_presumido: "Lucro Presumido",
  simples_nacional: "Simples Nacional",
};

function FornecedorView({ perfil, onEdit }: { perfil: FornecedorPerfil; onEdit: () => void }) {
  const tipoLabel = TIPOEMPRESA_LABEL[perfil.tipoEmpresa] ?? perfil.tipoEmpresa;
  const since = new Date(perfil.createdAt).toLocaleDateString("pt-BR", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-start gap-4 rounded-xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#EEF6DB]">
          <BuildingsIcon size={28} weight="bold" color="#9CCB3B" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-bold text-[#0B2443]">
              {perfil.nomeFantasia}
            </h1>
            <span className="rounded border border-gray-200 bg-gray-50 px-2 py-0.5 text-xs text-gray-500">
              Empresa Fornecedora
            </span>
          </div>
          <p className="mt-1 text-sm text-gray-500">{perfil.razaoSocial}</p>
          {perfil.cidade && perfil.estado && (
            <div className="mt-2 flex items-center gap-1 text-sm text-gray-500">
              <MapPinIcon size={14} />
              {perfil.cidade}, {perfil.estado}
            </div>
          )}
        </div>
        <div className="flex shrink-0 flex-col items-end gap-2">
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <CalendarBlankIcon size={13} />
            Membro desde {since}
          </div>
          <button
            onClick={onEdit}
            className="flex items-center gap-1.5 rounded-full bg-[#EEF6DB] px-3 py-1.5 text-xs font-medium text-[#5a7a1f] transition hover:bg-[#ddf0a0]"
          >
            <PencilSimpleIcon size={13} weight="bold" />
            Editar perfil
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Contato */}
        <SectionCard title="Contato">
          <div className="space-y-3">
            <InfoRow icon={<PhoneIcon size={16} />} label="Telefone" value={perfil.telefone} />
            <InfoRow icon={<WhatsappLogoIcon size={16} />} label="WhatsApp" value={perfil.whatsapp} />
            <InfoRow icon={<EnvelopeSimpleIcon size={16} />} label="E-mail" value={perfil.email} />
            <InfoRow icon={<GlobeIcon size={16} />} label="Website" value={perfil.website} />
            <InfoRow icon={<InstagramLogoIcon size={16} />} label="Rede Social" value={perfil.redeSocial} />
          </div>
        </SectionCard>

        {/* Dados empresariais */}
        <SectionCard title="Dados Empresariais">
          <div className="space-y-3">
            <InfoRow icon={<IdentificationCardIcon size={16} />} label="CNPJ" value={perfil.cnpj} />
            <InfoRow icon={<BuildingsIcon size={16} />} label="Tipo de Empresa" value={tipoLabel} />
            <InfoRow
              icon={<IdentificationCardIcon size={16} />}
              label={`Inscrição ${perfil.tipoInscricao === "estadual" ? "Estadual" : "Municipal"}`}
              value={perfil.numeroInscricao}
            />
          </div>
        </SectionCard>
      </div>

      {/* Pitch */}
      <SectionCard title="Descrição Institucional">
        <p className="text-sm leading-relaxed text-gray-700">
          {perfil.descricaoInstitucional}
        </p>
      </SectionCard>

      {/* Portfólio */}
      <SectionCard title="Portfólio">
        <PortfolioSection urls={perfil.portfolioUrls} color="green" />
      </SectionCard>

      {/* Categorias */}
      <SectionCard title="Categorias">
        <TagList items={perfil.categoriasProdutos} color="green" />
      </SectionCard>
    </div>
  );
}

function ProfissionalView({ perfil, onEdit }: { perfil: ProfissionalPerfil; onEdit: () => void }) {
  const tipoLabel = TIPOEMPRESA_LABEL[perfil.tipoEmpresa] ?? perfil.tipoEmpresa;
  const since = new Date(perfil.createdAt).toLocaleDateString("pt-BR", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-start gap-4 rounded-xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#E7EFF5]">
          <BriefcaseIcon size={28} weight="bold" color="#4F83A6" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-bold text-[#0B2443]">
              {perfil.nomeCompleto}
            </h1>
            <span className="rounded border border-gray-200 bg-gray-50 px-2 py-0.5 text-xs text-gray-500">
              Profissional do Setor
            </span>
          </div>
          {perfil.apelido && (
            <p className="mt-1 text-sm text-gray-500">{perfil.apelido}</p>
          )}
        </div>
        <div className="flex shrink-0 flex-col items-end gap-2">
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <CalendarBlankIcon size={13} />
            Membro desde {since}
          </div>
          <button
            onClick={onEdit}
            className="flex items-center gap-1.5 rounded-full bg-[#E7EFF5] px-3 py-1.5 text-xs font-medium text-[#4F83A6] transition hover:bg-[#d0e4f0]"
          >
            <PencilSimpleIcon size={13} weight="bold" />
            Editar perfil
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Contato */}
        <SectionCard title="Contato">
          <div className="space-y-3">
            <InfoRow icon={<PhoneIcon size={16} />} label="Telefone" value={perfil.telefonePessoal} />
            <InfoRow icon={<WhatsappLogoIcon size={16} />} label="WhatsApp" value={perfil.whatsappPessoal} />
            <InfoRow icon={<EnvelopeSimpleIcon size={16} />} label="E-mail" value={perfil.emailPessoal} />
            <InfoRow icon={<GlobeIcon size={16} />} label="Website" value={perfil.website} />
            <InfoRow icon={<InstagramLogoIcon size={16} />} label="Rede Social" value={perfil.redeSocial} />
          </div>
        </SectionCard>

        {/* Dados pessoais */}
        <SectionCard title="Identificação">
          <div className="space-y-3">
            <InfoRow icon={<IdentificationCardIcon size={16} />} label="CPF" value={perfil.cpf} />
            <InfoRow icon={<BriefcaseIcon size={16} />} label="Tipo de Empresa" value={tipoLabel} />
          </div>
        </SectionCard>
      </div>

      {/* Pitch */}
      <SectionCard title="Descrição Institucional">
        <p className="text-sm leading-relaxed text-gray-700">
          {perfil.descricaoInstitucional}
        </p>
      </SectionCard>

      {/* Portfólio */}
      <SectionCard title="Portfólio">
        <PortfolioSection urls={perfil.portfolioUrls} color="blue" />
      </SectionCard>

      {/* Categorias */}
      <SectionCard title="Categorias">
        <TagList items={perfil.categoriasProdutos} color="blue" />
      </SectionCard>
    </div>
  );
}

// ─── comprador view ──────────────────────────────────────────────────────────

function CompradorView({ perfil, onEdit }: { perfil: CompradorPerfil; onEdit: () => void }) {
  return (
    <div className="space-y-4">
      <div className="flex items-start gap-4 rounded-xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#EEF6DB]">
          <IdentificationCardIcon size={28} weight="bold" color="#9CCB3B" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-bold text-[#0B2443]">
              {perfil.nomeCompleto}
            </h1>
            <span className="rounded border border-gray-200 bg-gray-50 px-2 py-0.5 text-xs text-gray-500">
              Comprador
            </span>
          </div>
          {perfil.nomeFantasia && (
            <p className="mt-1 text-sm text-gray-500">{perfil.nomeFantasia}</p>
          )}
        </div>
        <button
          onClick={onEdit}
          className="flex shrink-0 items-center gap-1.5 rounded-full bg-[#EEF6DB] px-3 py-1.5 text-xs font-medium text-[#5a7a1f] transition hover:bg-[#ddf0a0]"
        >
          <PencilSimpleIcon size={13} weight="bold" />
          Editar perfil
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <SectionCard title="Contato">
          <div className="space-y-3">
            <InfoRow icon={<EnvelopeSimpleIcon size={16} />} label="E-mail" value={perfil.email} />
            <InfoRow icon={<PhoneIcon size={16} />} label="Telefone" value={perfil.telefonePessoal} />
            <InfoRow icon={<WhatsappLogoIcon size={16} />} label="WhatsApp" value={perfil.whatsappPessoal} />
            <InfoRow icon={<GlobeIcon size={16} />} label="Website" value={perfil.website} />
            <InfoRow icon={<InstagramLogoIcon size={16} />} label="Rede Social" value={perfil.redeSocial} />
          </div>
        </SectionCard>

        <SectionCard title="Dados Empresariais">
          <div className="space-y-3">
            <InfoRow icon={<IdentificationCardIcon size={16} />} label="CNPJ" value={perfil.cnpj} />
            <InfoRow icon={<BuildingsIcon size={16} />} label="Razão Social" value={perfil.razaoSocial} />
            <InfoRow icon={<BuildingsIcon size={16} />} label="Nome Fantasia" value={perfil.nomeFantasia} />
          </div>
        </SectionCard>
      </div>
    </div>
  );
}

// ─── page ───────────────────────────────────────────────────────────────────

export default function MeuPerfilPage() {
  const { user, token, isLoading: authLoading, refreshCompradorUser, refreshFornecedorUser, refreshProfissionalUser } = useAuth();
  const router = useRouter();
  const [perfil, setPerfil] = useState<
    FornecedorPerfil | ProfissionalPerfil | CompradorPerfil | null
  >(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [portfolioPartialWarning, setPortfolioPartialWarning] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!user || !token) {
      router.replace("/choose-profile");
      return;
    }

    if (user.tipo === "comprador") {
      const fetchComprador = async () => {
        try {
          setPerfil(await getCompradorMe(token));
        } catch {
          setError("Não foi possível carregar seu perfil. Tente novamente.");
        } finally {
          setLoading(false);
        }
      };
      fetchComprador();
      return;
    }

    const fetch = async () => {
      try {
        if (user.tipo === "fornecedor") {
          setPerfil(await getFornecedorMe(token));
        } else {
          setPerfil(await getProfissionalMe(token));
        }
      } catch {
        setError("Não foi possível carregar seu perfil. Tente novamente.");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [user, token, authLoading, router]);

  const refreshHeaderFromPerfil = (
    updated: FornecedorPerfil | ProfissionalPerfil | CompradorPerfil,
  ) => {
    if (user?.tipo === "comprador") {
      const comprador = updated as CompradorPerfil;
      refreshCompradorUser({
        nomeCompleto: comprador.nomeCompleto,
        email: comprador.email,
      });
    } else if (user?.tipo === "fornecedor") {
      const fornecedor = updated as FornecedorPerfil;
      refreshFornecedorUser({
        nomeFantasia: fornecedor.nomeFantasia,
        email: fornecedor.email,
      });
    } else if (user?.tipo === "profissional") {
      const profissional = updated as ProfissionalPerfil;
      refreshProfissionalUser({
        apelido: profissional.apelido,
        nomeCompleto: profissional.nomeCompleto,
        emailPessoal: profissional.emailPessoal,
      });
    }
  };

  const handleSaved = (updated: FornecedorPerfil | ProfissionalPerfil | CompradorPerfil) => {
    setPerfil(updated);
    setEditMode(false);
    setPortfolioPartialWarning(false);
    setSavedSuccess(true);
    refreshHeaderFromPerfil(updated);
    setTimeout(() => setSavedSuccess(false), 4000);
  };

  const handleProfileUpdated = (
    updated: FornecedorPerfil | ProfissionalPerfil,
  ) => {
    setPerfil(updated);
    setPortfolioPartialWarning(true);
    refreshHeaderFromPerfil(updated);
  };

  if (authLoading || loading) {
    return (
      <main className="flex min-h-[50vh] items-center justify-center">
        <p className="text-muted-foreground">Carregando perfil...</p>
      </main>
    );
  }

  if (error || !perfil) {
    return (
      <main className="flex min-h-[50vh] items-center justify-center">
        <p className="text-sm text-red-500">
          {error ?? "Perfil não encontrado."}
        </p>
      </main>
    );
  }

  const docLabel =
    user?.tipo === "fornecedor" ? "CNPJ" : user?.tipo === "profissional" ? "CPF" : null;

  const discoveryHome =
    user?.tipo != null ? getDiscoveryHomePath(user.tipo) : "/choose-profile";
  const discoveryHomeLabel =
    user?.tipo != null
      ? getDiscoveryHomeLabel(user.tipo)
      : "Voltar";

  return (
    <main className="mx-auto w-full max-w-[1000px] flex-1 px-6 py-10">
      <Link
        href={discoveryHome}
        className="mb-6 inline-flex items-center gap-2 rounded-full bg-[#E7EFF5] px-4 py-1.5 text-sm font-medium text-[#4F83A6] transition hover:bg-[#dbe7f0]"
      >
        <ArrowLeftIcon size={14} weight="bold" />
        {discoveryHomeLabel}
      </Link>

      {savedSuccess && (
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          <CheckCircleIcon size={18} weight="fill" className="shrink-0" />
          Perfil atualizado com sucesso!
        </div>
      )}

      {editMode ? (
        <>
          <div className="mb-6">
            <h1 className="text-xl font-bold text-[#0B2443]">Editar Perfil</h1>
            {docLabel && (
              <p className="text-sm text-gray-500">
                Atualize seus dados. O {docLabel} não pode ser alterado.
              </p>
            )}
          </div>

          {portfolioPartialWarning && (
            <div className="mb-4 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              <WarningCircleIcon size={18} weight="fill" className="mt-0.5 shrink-0" />
              <span>{PORTFOLIO_EDIT_PARTIAL_ERROR}</span>
            </div>
          )}

          {user?.tipo === "fornecedor" ? (
            <FornecedorEditForm
              perfil={perfil as FornecedorPerfil}
              token={token!}
              onSuccess={handleSaved}
              onProfileUpdated={handleProfileUpdated}
              onCancel={() => {
                setEditMode(false);
                setPortfolioPartialWarning(false);
              }}
            />
          ) : user?.tipo === "profissional" ? (
            <ProfissionalEditForm
              perfil={perfil as ProfissionalPerfil}
              token={token!}
              onSuccess={handleSaved}
              onProfileUpdated={handleProfileUpdated}
              onCancel={() => {
                setEditMode(false);
                setPortfolioPartialWarning(false);
              }}
            />
          ) : (
            <CompradorEditForm
              perfil={perfil as CompradorPerfil}
              token={token!}
              onSuccess={handleSaved}
              onCancel={() => setEditMode(false)}
            />
          )}
        </>
      ) : user?.tipo === "fornecedor" ? (
        <FornecedorView
          perfil={perfil as FornecedorPerfil}
          onEdit={() => {
            setPortfolioPartialWarning(false);
            setEditMode(true);
          }}
        />
      ) : user?.tipo === "profissional" ? (
        <ProfissionalView
          perfil={perfil as ProfissionalPerfil}
          onEdit={() => {
            setPortfolioPartialWarning(false);
            setEditMode(true);
          }}
        />
      ) : (
        <CompradorView
          perfil={perfil as CompradorPerfil}
          onEdit={() => {
            setPortfolioPartialWarning(false);
            setEditMode(true);
          }}
        />
      )}
    </main>
  );
}
