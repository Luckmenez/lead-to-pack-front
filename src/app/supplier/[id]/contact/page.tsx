"use client";

import { useParams } from "next/navigation";
import { SolicitarContatoView } from "@/components/contato/SolicitarContatoView";

export default function SupplierContactPage() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : "";

  if (!id) {
    return (
      <main className="mx-auto max-w-2xl px-6 py-10">
        <p className="text-muted-foreground">Fornecedor inválido.</p>
      </main>
    );
  }

  return (
    <SolicitarContatoView
      tipoAlvo="fornecedor"
      targetId={id}
      allowedTipos={["comprador"]}
      title="Gerar contato com o fornecedor"
      description="Enviaremos um e-mail para a empresa fornecedora com seus dados de comprador e um canal direto para resposta (responder para o seu e-mail)."
    />
  );
}
