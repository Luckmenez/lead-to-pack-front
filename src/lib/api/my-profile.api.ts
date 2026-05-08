import { apiClient } from "./client";

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
