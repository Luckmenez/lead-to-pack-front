import { apiClient } from "./client";

export type SupplierItem = {
  id: string;
  nomeFantasia: string;
  descricaoInstitucional: string;
  categoriasProdutos: string[];
  materiais: string[];
  servicos: string[];
  setores: string[];
  cidade?: string;
  estado?: string;
};

export type GetSuppliersParams = {
  page?: number;
  limit?: number;
  search?: string;
  categoria?: string;
};

export type GetSuppliersResponse = {
  data: SupplierItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export async function getSuppliers(
  params: GetSuppliersParams = {}
): Promise<GetSuppliersResponse> {
  const searchParams = new URLSearchParams();
  if (params.page != null) searchParams.set("page", String(params.page));
  if (params.limit != null) searchParams.set("limit", String(params.limit));
  if (params.search) searchParams.set("search", params.search);
  if (params.categoria) searchParams.set("categoria", params.categoria);

  const query = searchParams.toString();
  const path = `/fornecedores${query ? `?${query}` : ""}`;

  return apiClient<GetSuppliersResponse>(path);
}
