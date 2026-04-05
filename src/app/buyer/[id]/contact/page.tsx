"use client";

import { useParams } from "next/navigation";
import { SolicitarContatoView } from "@/components/contato/SolicitarContatoView";

export default function BuyerContactPage() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : "";

  if (!id) {
    return (
      <main className="mx-auto max-w-2xl px-6 py-10">
        <p className="text-muted-foreground">Comprador inválido.</p>
      </main>
    );
  }

  return (
    <SolicitarContatoView
      tipoAlvo="comprador"
      targetId={id}
      allowedTipos={["fornecedor", "profissional"]}
      title="Gerar contato com o comprador"
      description="Enviaremos um e-mail para a empresa compradora com seus dados e um canal direto para resposta."
    />
  );
}
