"use client";

import { useParams } from "next/navigation";
import { SolicitarContatoView } from "@/components/contato/SolicitarContatoView";

export default function ProfessionalContactPage() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : "";

  if (!id) {
    return (
      <main className="mx-auto max-w-2xl px-6 py-10">
        <p className="text-muted-foreground">Profissional inválido.</p>
      </main>
    );
  }

  return (
    <SolicitarContatoView
      tipoAlvo="profissional"
      targetId={id}
      allowedTipos={["comprador", "fornecedor"]}
      title="Gerar contato com o profissional"
      description="Enviaremos um e-mail para o profissional com seus dados cadastrais e um canal direto para resposta."
    />
  );
}
