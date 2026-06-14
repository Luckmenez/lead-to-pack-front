import { apiClient } from "./client";

export type CatalogPerfil = "fornecedor" | "profissional";

export type CategoriasResponse = {
  perfil: CatalogPerfil;
  categorias: string[];
};

export async function getCategoriasCadastro(
  perfil: CatalogPerfil,
): Promise<CategoriasResponse> {
  return apiClient<CategoriasResponse>(`/catalog/categorias/${perfil}`);
}
