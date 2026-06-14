/** Exibição amigável (Title Case) sem alterar o valor salvo no banco/API. */
export function formatCategoriaLabel(value: string): string {
  return value
    .split(" ")
    .map((part) => {
      if (!part || part === "/") return part;
      return part.charAt(0).toLocaleUpperCase("pt-BR") + part.slice(1);
    })
    .join(" ");
}
