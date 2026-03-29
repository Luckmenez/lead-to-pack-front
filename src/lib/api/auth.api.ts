import { apiClient } from "./client";

export type LoginCompradorRequest = {
  cpf: string;
  senha: string;
};

export type CompradorUser = {
  id: string;
  nomeCompleto: string;
  cpf: string;
  emailPessoal: string;
};

export type LoginCompradorResponse = {
  accessToken: string;
  comprador: CompradorUser;
};

export type RegisterCompradorRequest = {
  senha: string;
  nomeCompleto: string;
  telefonePessoal: string;
  whatsappPessoal: string;
  email: string;
  cnpj: string;
  razaoSocial: string;
  telefoneComercial: string;
  whatsappComercial: string;
  nomeFantasia?: string;
  website?: string;
  redeSocial?: string;
};

export async function registerComprador(
  data: RegisterCompradorRequest
): Promise<LoginCompradorResponse> {
  return apiClient<LoginCompradorResponse>("/auth/comprador/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function loginComprador(
  data: LoginCompradorRequest
): Promise<LoginCompradorResponse> {
  return apiClient<LoginCompradorResponse>("/auth/comprador/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export type LoginResponse =
  | (LoginCompradorResponse & { tipo: "comprador" })
  | (LoginFornecedorResponse & { tipo: "fornecedor" });

export async function login(data: LoginCompradorRequest): Promise<LoginResponse> {
  return apiClient<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export type LoginFornecedorRequest = {
  cpf: string;
  senha: string;
};

export type FornecedorUser = {
  id: string;
  nomeCompleto: string;
  cpf: string;
  emailPessoal: string;
  nomeFantasia: string;
};

export type LoginFornecedorResponse = {
  accessToken: string;
  fornecedor: FornecedorUser;
};

export type RegisterFornecedorRequest = {
  senha: string;
  telefone: string;
  whatsapp: string;
  email: string;
  cnpj: string;
  razaoSocial: string;
  nomeFantasia: string;
  categoriasProdutos: string[];
  materiais: string[];
  servicos: string[];
  setores: string[];
  descricaoInstitucional: string;
  formaPagamento: "cartao" | "boleto" | "pix";
  cidade: string;
  estado: string;
  tipoInscricao: "estadual" | "municipal";
  numeroInscricao: string;
  tipoEmpresa: "mei" | "lucro_presumido" | "simples_nacional";
  website?: string;
  redeSocial?: string;
};

export async function registerFornecedor(
  data: RegisterFornecedorRequest
): Promise<LoginFornecedorResponse> {
  return apiClient<LoginFornecedorResponse>("/auth/fornecedor/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function loginFornecedor(
  data: LoginFornecedorRequest
): Promise<LoginFornecedorResponse> {
  return apiClient<LoginFornecedorResponse>("/auth/fornecedor/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export type RegisterProfissionalRequest = {
  cpf: string;
  senha: string;
  nomeCompleto: string;
  apelido: string;
  telefonePessoal: string;
  whatsappPessoal: string;
  emailPessoal: string;
  categoriasProdutos: string[];
  materiais: string[];
  servicos: string[];
  setores: string[];
  descricaoInstitucional: string;
  formaPagamento: "cartao" | "boleto" | "pix";
  website?: string;
  redeSocial?: string;
};

export type ProfissionalUser = {
  id: string;
  nomeCompleto: string;
  cpf: string;
  emailPessoal: string;
};

export type LoginProfissionalResponse = {
  accessToken: string;
  profissional: ProfissionalUser;
};

export async function registerProfissional(
  data: RegisterProfissionalRequest
): Promise<LoginProfissionalResponse> {
  return apiClient<LoginProfissionalResponse>("/auth/profissional/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
}
