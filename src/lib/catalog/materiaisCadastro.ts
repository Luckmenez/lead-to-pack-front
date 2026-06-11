import {
  FORNECEDOR_CATEGORIAS,
  PROFISSIONAL_CATEGORIAS,
  categoriasParaFiltro,
} from "./categoriasCadastro";

/** @deprecated Use FORNECEDOR_CATEGORIAS ou getCategoriasFiltroPorPerfil */
export const MATERIAIS_FILTRO_OPCOES: string[] = [...FORNECEDOR_CATEGORIAS];

export function getCategoriasFiltroPorPerfil(
  perfil: "fornecedor" | "profissional",
) {
  const lista =
    perfil === "fornecedor"
      ? FORNECEDOR_CATEGORIAS
      : PROFISSIONAL_CATEGORIAS;
  return categoriasParaFiltro(lista);
}
