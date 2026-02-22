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
  cpf: string;
  senha: string;
  nomeCompleto: string;
  telefonePessoal: string;
  emailPessoal: string;
  cnpj: string;
  razaoSocial: string;
  emailComercial: string;
  telefoneComercial: string;
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
  cpf: string;
  senha: string;
  nomeCompleto: string;
  telefonePessoal: string;
  emailPessoal: string;
  cnpj: string;
  razaoSocial: string;
  nomeFantasia: string;
  emailComercial: string;
  telefoneComercial: string;
  categoriasProdutos: string[];
  materiais: string[];
  servicos: string[];
  setores: string[];
  descricaoInstitucional: string;
  formaPagamento: "cartao" | "boleto" | "pix";
  cidade: string;
  estado: string;
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
