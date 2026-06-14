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
