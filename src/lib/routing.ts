import type { PersonaTipo } from "@/contexts/AuthContext";

export const FIND_SUPPLIERS_PATH = "/find-suppliers";
export const FIND_BUYERS_PATH = "/find-buyers";

export function getDiscoveryHomePath(tipo: PersonaTipo): string {
  return tipo === "comprador" ? FIND_SUPPLIERS_PATH : FIND_BUYERS_PATH;
}

export function getDiscoveryHomeLabel(tipo: PersonaTipo): string {
  return tipo === "comprador"
    ? "Voltar à busca de fornecedores"
    : "Voltar à busca de compradores";
}
