import { apiClient } from "./client";
import { asStringArray } from "./profile-normalize";

export type CompradorPerfil = {
  id: string;
  nomeCompleto: string;
  email: string;
  telefonePessoal: string;
  whatsappPessoal: string;
  cnpj: string;
  razaoSocial: string;
  nomeFantasia: string | null;
  telefoneComercial: string;
  whatsappComercial: string;
  website: string | null;
  redeSocial: string | null;
  createdAt: string;
};

export async function getCompradorMe(token: string): Promise<CompradorPerfil> {
  return apiClient<CompradorPerfil>("/compradores/me", { token });
}

export type UpdateCompradorRequest = Partial<
  Omit<CompradorPerfil, "id" | "cnpj" | "createdAt">
>;

export async function updateComprador(
  data: UpdateCompradorRequest,
  token: string,
): Promise<CompradorPerfil> {
  return apiClient<CompradorPerfil>("/compradores/me", {
    method: "PATCH",
    token,
    body: JSON.stringify(data),
  });
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
  tipoEmpresa: string;
  categoriasProdutos: string[];
  descricaoInstitucional: string;
  portfolioUrls: string[];
  formaPagamento: string;
  createdAt: string;
};

export async function getFornecedorMe(token: string): Promise<FornecedorPerfil> {
  const raw = await apiClient<FornecedorPerfil>("/fornecedores/me", { token });
  return {
    ...raw,
    categoriasProdutos: asStringArray(raw.categoriasProdutos),
    portfolioUrls: asStringArray(raw.portfolioUrls),
  };
}

export async function getProfissionalMe(token: string): Promise<ProfissionalPerfil> {
  const raw = await apiClient<ProfissionalPerfil>("/profissionais/me", { token });
  return {
    ...raw,
    categoriasProdutos: asStringArray(raw.categoriasProdutos),
    portfolioUrls: asStringArray(raw.portfolioUrls),
  };
}

export type UpdateFornecedorRequest = Partial<
  Omit<FornecedorPerfil, "id" | "cnpj" | "createdAt">
>;

export async function updateFornecedor(
  data: UpdateFornecedorRequest,
  token: string
): Promise<FornecedorPerfil> {
  const raw = await apiClient<FornecedorPerfil>("/fornecedores/me", {
    method: "PATCH",
    token,
    body: JSON.stringify(data),
  });
  return {
    ...raw,
    categoriasProdutos: asStringArray(raw.categoriasProdutos),
    portfolioUrls: asStringArray(raw.portfolioUrls),
  };
}

export type UpdateProfissionalRequest = Partial<
  Omit<ProfissionalPerfil, "id" | "cpf" | "createdAt">
>;

export async function updateProfissional(
  data: UpdateProfissionalRequest,
  token: string
): Promise<ProfissionalPerfil> {
  const raw = await apiClient<ProfissionalPerfil>("/profissionais/me", {
    method: "PATCH",
    token,
    body: JSON.stringify(data),
  });
  return {
    ...raw,
    categoriasProdutos: asStringArray(raw.categoriasProdutos),
    portfolioUrls: asStringArray(raw.portfolioUrls),
  };
}
