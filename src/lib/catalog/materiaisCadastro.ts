import { PROF_REGISTRATION_CATEGORIES } from "@/app/prof-registration/constants/profRegistration";

/** Mesmos itens de `InterestGroup` materiais em fornecedor e profissional. */
export const MATERIAIS_PADRAO_CADASTRO = [
  "Papel / Papelão",
  "Plásticos",
  "Vidro",
  "Metal e Alumínio",
  "Madeira / Bambu",
  "Tecido / Têxtil",
  "Biopolímeros / Compostáveis",
  "Multicamadas / Laminados",
  "Rótulos e Etiquetas",
  "Outros (Cerâmica, EPS)",
] as const;

function flattenProfRegistrationMateriais(): string[] {
  return Object.values(PROF_REGISTRATION_CATEGORIES).flat() as string[];
}

/**
 * Opções do filtro de material na busca: tudo o que pode ser cadastrado como
 * material (lista padrão + itens do cadastro estendido do profissional).
 */
export const MATERIAIS_FILTRO_OPCOES: string[] = Array.from(
  new Set<string>([
    ...MATERIAIS_PADRAO_CADASTRO,
    ...flattenProfRegistrationMateriais(),
  ])
).sort((a, b) => a.localeCompare(b, "pt-BR"));
