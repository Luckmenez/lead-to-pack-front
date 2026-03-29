import { apiClient } from "./client";

export type ProfessionalItem = {
  id: string;
  nomeCompleto: string;
  apelido: string;
  descricaoInstitucional: string;
  categoriasProdutos: string[];
  materiais: string[];
  servicos: string[];
  setores: string[];
  website?: string | null;
  redeSocial?: string | null;
};

export type GetProfessionalsParams = {
  page?: number;
  limit?: number;
  search?: string;
  material?: string;
};

export type GetProfessionalsResponse = {
  data: ProfessionalItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export async function getProfessionals(
  params: GetProfessionalsParams = {}
): Promise<GetProfessionalsResponse> {
  const searchParams = new URLSearchParams();
  if (params.page != null) searchParams.set("page", String(params.page));
  if (params.limit != null) searchParams.set("limit", String(params.limit));
  if (params.search) searchParams.set("search", params.search);
  if (params.material) searchParams.set("material", params.material);

  const query = searchParams.toString();
  const path = `/profissionais${query ? `?${query}` : ""}`;

  return apiClient<GetProfessionalsResponse>(path);
}
