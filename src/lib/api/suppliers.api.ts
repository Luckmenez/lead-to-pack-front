import { apiClient } from "./client";

export type SupplierItem = {
  id: string;
  nomeFantasia: string;
  descricaoInstitucional: string;
  categoriasProdutos: string[];
  cidade?: string;
  estado?: string;
};

export type GetSuppliersParams = {
  page?: number;
  limit?: number;
  search?: string;
  /** Material cadastrado (lista alinhada ao catálogo de cadastro). */
  material?: string;
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
  if (params.material) searchParams.set("material", params.material);

  const query = searchParams.toString();
  const path = `/fornecedores${query ? `?${query}` : ""}`;

  return apiClient<GetSuppliersResponse>(path);
}
