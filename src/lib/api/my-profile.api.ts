import { apiClient } from "./client";

export type CompradorPerfil = {
  id: string;
  nomeCompleto: string;
  email: string;
  cnpj: string;
  razaoSocial: string;
  nomeFantasia: string | null;
  telefone: string;
  whatsapp: string;
  website: string | null;
  redeSocial: string | null;
};

const COMPRADOR_PROFILE_KEY = "lead2pack_comprador_profile";

export function loadCompradorExtra(): Omit<CompradorPerfil, "id" | "nomeCompleto" | "email"> {
  if (typeof window === "undefined") {
    return { cnpj: "", razaoSocial: "", nomeFantasia: null, telefone: "", whatsapp: "", website: null, redeSocial: null };
  }
  const raw = localStorage.getItem(COMPRADOR_PROFILE_KEY);
  if (!raw) return { cnpj: "", razaoSocial: "", nomeFantasia: null, telefone: "", whatsapp: "", website: null, redeSocial: null };
  return JSON.parse(raw);
}

export function saveCompradorExtra(data: Omit<CompradorPerfil, "id" | "nomeCompleto" | "email">): void {
  localStorage.setItem(COMPRADOR_PROFILE_KEY, JSON.stringify(data));
}

export function clearCompradorExtra(): void {
  localStorage.removeItem(COMPRADOR_PROFILE_KEY);
}

export type FornecedorPerfil = {
  id: string;
  email: string;
  telefone: string;
  whatsapp: string;
  cnpj: string;
  razaoSocial: string;
  nomeFantasia: string;
  website: string;
  redeSocial: string;
  cidade: string;
  estado: string;
  tipoInscricao: string;
  numeroInscricao: string;
  tipoEmpresa: string;
  categoriasProdutos: string[];
  materiais: string[];
  servicos: string[];
  setores: string[];
  descricaoInstitucional: string;
  portfolioUrls: string[];
  formaPagamento: string;
  createdAt: string;
};

export type ProfissionalPerfil = {
  id: string;
  cpf: string;
  nomeCompleto: string;
  apelido: string;
  telefonePessoal: string;
  whatsappPessoal: string;
  emailPessoal: string;
  website: string | null;
  redeSocial: string | null;
  categoriasProdutos: string[];
  materiais: string[];
  servicos: string[];
  setores: string[];
  descricaoInstitucional: string;
  portfolioUrls: string[];
  formaPagamento: string;
  createdAt: string;
};

export async function getFornecedorMe(token: string): Promise<FornecedorPerfil> {
  return apiClient<FornecedorPerfil>("/fornecedores/me", { token });
}

export async function getProfissionalMe(token: string): Promise<ProfissionalPerfil> {
  return apiClient<ProfissionalPerfil>("/profissionais/me", { token });
}

export type UpdateFornecedorRequest = Partial<
  Omit<FornecedorPerfil, "id" | "cnpj" | "createdAt">
>;

export async function updateFornecedor(
  data: UpdateFornecedorRequest,
  token: string
): Promise<FornecedorPerfil> {
  return apiClient<FornecedorPerfil>("/fornecedores/me", {
    method: "PATCH",
    token,
    body: JSON.stringify(data),
  });
}

export type UpdateProfissionalRequest = Partial<
  Omit<ProfissionalPerfil, "id" | "cpf" | "createdAt">
>;

export async function updateProfissional(
  data: UpdateProfissionalRequest,
  token: string
): Promise<ProfissionalPerfil> {
  return apiClient<ProfissionalPerfil>("/profissionais/me", {
    method: "PATCH",
    token,
    body: JSON.stringify(data),
  });
}
