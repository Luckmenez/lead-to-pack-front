/** Exibição amigável (Title Case) sem alterar o valor salvo no banco/API. */
export function formatCategoriaLabel(value: string): string {
  return value
    .trim()
    .split(/\s+/)
    .map((part) => {
      if (!part || part === "/") return part;
      const lower = part.toLocaleLowerCase("pt-BR");
      return lower.charAt(0).toLocaleUpperCase("pt-BR") + lower.slice(1);
    })
    .join(" ");
}
