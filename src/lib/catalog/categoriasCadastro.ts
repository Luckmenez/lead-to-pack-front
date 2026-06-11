/** Textos exatos conforme documento do cliente. */
export const FORNECEDOR_CATEGORIAS = [
  "plásticos flexíveis",
  "metal",
  "papel",
  "vidro",
  "plásticos semi rígidos",
  "madeira",
  "papelão ondulado",
  "insumos indiretos",
  "plasticos rígidos",
  "papel cartão",
  "rotulos e etiquetas",
  "blister",
  "promocional",
  "alumínio",
  "máquinas e equipametos",
  "editorial",
  "descartáveis",
  "adereços de presente",
  "materias primas e insumos",
  "impressão digital",
  "entidades do setor",
  "reciclagem e sustentabilidade",
  "gráfica rápida",
  "tecnologia e sistemas",
  "copakers / comodatos",
  "brindes",
  "proteção para transporte",
  "outros",
] as const;

/** Textos exatos conforme documento do cliente. */
export const PROFISSIONAL_CATEGORIAS = [
  "Consultoria Técnica",
  "Designer de Embalagens",
  "Criação Logo e Arte",
  "Consultoria de Processo",
  "Consultoria Comercial",
  "Representação Comercial",
  "Exportação",
  "Outros",
] as const;

export type FornecedorCategoria = (typeof FORNECEDOR_CATEGORIAS)[number];
export type ProfissionalCategoria = (typeof PROFISSIONAL_CATEGORIAS)[number];

/** Ordem alfabética com "Todos" por último (filtro de busca). */
export function categoriasParaFiltro(
  categorias: readonly string[],
): { value: string; label: string }[] {
  const ordenadas = [...categorias].sort((a, b) =>
    a.localeCompare(b, "pt-BR", { sensitivity: "base" }),
  );

  return [
    { value: "", label: "Todos" },
    ...ordenadas.map((c) => ({ value: c, label: c })),
  ];
}
