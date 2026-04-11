"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { useAuth, type PersonaTipo } from "@/contexts/AuthContext";
import { solicitarContato } from "@/lib/api/contato.api";

type TipoAlvo = "fornecedor" | "comprador" | "profissional";

type Props = {
  tipoAlvo: TipoAlvo;
  targetId: string;
  allowedTipos: PersonaTipo[];
  title: string;
  description: string;
  /** Se omitido em contato com profissional, usa find-suppliers ou find-buyers conforme o perfil logado. */
  backHref?: string;
  backLabel?: string;
};

export function SolicitarContatoView({
  tipoAlvo,
  targetId,
  allowedTipos,
  title,
  description,
  backHref: backHrefProp,
  backLabel: backLabelProp,
}: Props) {
  const router = useRouter();
  const { token, user, isLoading } = useAuth();

  const resolvedBack =
    backHrefProp ??
    (tipoAlvo === "fornecedor"
      ? "/find-suppliers"
      : tipoAlvo === "comprador"
        ? "/find-buyers"
        : user?.tipo === "comprador"
          ? "/find-suppliers"
          : "/find-buyers");
  const resolvedBackLabel =
    backLabelProp ??
    (resolvedBack === "/find-suppliers"
      ? "Voltar à busca de fornecedores"
      : "Voltar à busca de compradores");
  const [mensagem, setMensagem] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState(false);

  const allowed = user && allowedTipos.includes(user.tipo);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !allowed) return;
    setError(null);
    setSubmitting(true);
    try {
      await solicitarContato(token, tipoAlvo, targetId, {
        mensagem: mensagem.trim() || undefined,
      });
      setOk(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Não foi possível enviar o pedido."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <main className="mx-auto max-w-2xl px-6 py-10">
        <p className="text-muted-foreground">Carregando...</p>
      </main>
    );
  }

  if (!user || !token) {
    return (
      <main className="mx-auto max-w-2xl px-6 py-10">
        <p className="text-muted-foreground mb-4">
          Faça login para gerar o contato.
        </p>
        <Button asChild variant="outline" className="cursor-pointer">
          <Link href="/choose-profile">Ir para login</Link>
        </Button>
      </main>
    );
  }

  if (!allowed) {
    return (
      <main className="mx-auto max-w-2xl px-6 py-10">
        <p className="text-muted-foreground mb-4">
          Seu perfil atual não pode usar esta ação nesta tela.
        </p>
        <Button
          type="button"
          variant="outline"
          className="cursor-pointer"
          onClick={() => router.push("/choose-profile")}
        >
          Trocar perfil
        </Button>
      </main>
    );
  }

  if (ok) {
    return (
      <main className="mx-auto max-w-2xl px-6 py-10">
        <div className="rounded-xl border border-[#E2E8F0] bg-white p-8 shadow-sm">
          <h1 className="text-xl font-bold text-[#0B2443]">
            Pedido de contato enviado
          </h1>
          <p className="mt-3 text-sm text-gray-600">
            Enviamos um e-mail para a outra parte com seus dados e canal de
            resposta. Em breve poderão retornar diretamente pelo e-mail
            informado.
          </p>
          <Button asChild className="mt-6 cursor-pointer bg-[#5B86A8] hover:bg-[#4A748F]">
            <Link href={resolvedBack}>{resolvedBackLabel}</Link>
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-2xl px-6 py-10">
      <Link
        href={resolvedBack}
        className="mb-6 inline-flex items-center gap-2 text-sm text-[#284161] hover:underline"
      >
        <ArrowLeftIcon size={18} />
        {resolvedBackLabel}
      </Link>

      <div className="rounded-xl border border-[#E2E8F0] bg-white p-6 shadow-sm sm:p-8">
        <h1 className="text-2xl font-bold text-[#0B2443]">{title}</h1>
        <p className="mt-2 text-sm text-gray-600">{description}</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label
              htmlFor="mensagem-contato"
              className="mb-2 block text-sm font-medium text-[#0B2443]"
            >
              Mensagem opcional
            </label>
            <textarea
              id="mensagem-contato"
              rows={5}
              value={mensagem}
              onChange={(e) => setMensagem(e.target.value)}
              placeholder="Contexto do contato, necessidade, prazo…"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#5B86A8] focus:outline-none focus:ring-1 focus:ring-[#5B86A8]"
              maxLength={2000}
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Até 2000 caracteres. O e-mail principal já inclui seus dados de
              cadastro.
            </p>
          </div>

          {error && (
            <p className="text-sm text-red-600" role="alert">
              {error}
            </p>
          )}

          <Button
            type="submit"
            disabled={submitting}
            className="cursor-pointer bg-[#0B2443] hover:bg-[#0a1e38] disabled:opacity-70"
          >
            {submitting ? "Enviando…" : "Gerar contato (enviar e-mail)"}
          </Button>
        </form>
      </div>
    </main>
  );
}
