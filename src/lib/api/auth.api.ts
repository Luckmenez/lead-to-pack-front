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

export async function loginFornecedor(
  data: LoginFornecedorRequest
): Promise<LoginFornecedorResponse> {
  return apiClient<LoginFornecedorResponse>("/auth/fornecedor/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
}
