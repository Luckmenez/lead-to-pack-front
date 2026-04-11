import { apiClient } from "./client";

export type SolicitarContatoBody = {
  mensagem?: string;
};

export type SolicitarContatoResponse = {
  enviado: boolean;
};

export async function solicitarContato(
  token: string,
  tipoAlvo: "fornecedor" | "comprador" | "profissional",
  id: string,
  body: SolicitarContatoBody = {}
): Promise<SolicitarContatoResponse> {
  return apiClient<SolicitarContatoResponse>(
    `/contatos/${tipoAlvo}/${id}`,
    {
      method: "POST",
      token,
      body: JSON.stringify(body),
    }
  );
}
