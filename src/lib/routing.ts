import type { PersonaTipo } from "@/contexts/AuthContext";

export const FIND_SUPPLIERS_PATH = "/find-suppliers";
export const FIND_BUYERS_PATH = "/find-buyers";
export const MY_PROFILE_PATH = "/my-profile";

export function getDiscoveryHomePath(tipo: PersonaTipo): string {
  if (tipo === "comprador") return FIND_SUPPLIERS_PATH;
  return MY_PROFILE_PATH;
}

export function getDiscoveryHomeLabel(tipo: PersonaTipo): string {
  if (tipo === "comprador") return "Voltar à busca de fornecedores";
  return "Voltar ao meu perfil";
}
