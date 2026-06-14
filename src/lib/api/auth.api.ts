import { apiClient } from "./client";

export type LoginCompradorRequest = {
  email: string;
  senha: string;
};

export type CompradorUser = {
  id: string;
  nomeCompleto: string;
  email: string;
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
  whatsappComercial: string;
  email: string;
  cnpj: string;
  razaoSocial: string;
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

export type FornecedorUser = {
  id: string;
  email: string;
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
  descricaoInstitucional: string;
  formaPagamento: "cartao" | "boleto" | "pix";
  cidade: string;
  estado: string;
  tipoInscricao: "estadual" | "municipal";
  numeroInscricao: string;
  tipoEmpresa: "mei" | "lucro_presumido" | "simples_nacional";
  website?: string;
  redeSocial?: string;
  portfolioUrls?: string[];
};

export async function registerFornecedor(
  data: RegisterFornecedorRequest
): Promise<LoginFornecedorResponse> {
  return apiClient<LoginFornecedorResponse>("/auth/fornecedor/register", {
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
  tipoEmpresa: "mei" | "lucro_presumido" | "simples_nacional";
  categoriasProdutos: string[];
  descricaoInstitucional: string;
  portfolioUrls?: string[];
  formaPagamento: "cartao" | "boleto" | "pix";
  website?: string;
  redeSocial?: string;
};

export type ProfissionalUser = {
  id: string;
  nomeCompleto: string;
  apelido: string;
  emailPessoal: string;
};

export type LoginProfissionalResponse = {
  accessToken: string;
  profissional: ProfissionalUser;
};

export type LoginPrecisaEscolherPerfilResponse = {
  precisaEscolherPerfil: true;
  perfisDisponiveis: ("comprador" | "fornecedor")[];
  comprador: CompradorUser;
  fornecedor: FornecedorUser;
};

export type LoginResponse =
  | (LoginCompradorResponse & { tipo: "comprador" })
  | (LoginFornecedorResponse & { tipo: "fornecedor" })
  | (LoginProfissionalResponse & { tipo: "profissional" })
  | LoginPrecisaEscolherPerfilResponse;

export type LoginSelecionarPerfilRequest = LoginCompradorRequest & {
  perfil: "comprador" | "fornecedor";
};

export type LoginSelecionarPerfilResponse =
  | (LoginCompradorResponse & { tipo: "comprador" })
  | (LoginFornecedorResponse & { tipo: "fornecedor" });

export function isLoginPrecisaEscolherPerfil(
  res: LoginResponse
): res is LoginPrecisaEscolherPerfilResponse {
  return (
    "precisaEscolherPerfil" in res &&
    res.precisaEscolherPerfil === true
  );
}

export async function login(data: LoginCompradorRequest): Promise<LoginResponse> {
  return apiClient<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function loginSelecionarPerfil(
  data: LoginSelecionarPerfilRequest
): Promise<LoginSelecionarPerfilResponse> {
  return apiClient<LoginSelecionarPerfilResponse>(
    "/auth/login/selecionar-perfil",
    {
      method: "POST",
      body: JSON.stringify(data),
    }
  );
}

export async function registerProfissional(
  data: RegisterProfissionalRequest
): Promise<LoginProfissionalResponse> {
  return apiClient<LoginProfissionalResponse>("/auth/profissional/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateFornecedorPortfolio(
  portfolioUrls: string[],
  token: string
): Promise<void> {
  return apiClient("/fornecedores/portfolio", {
    method: "PATCH",
    token,
    body: JSON.stringify({ portfolioUrls }),
  });
}

export async function updateProfissionalPortfolio(
  portfolioUrls: string[],
  token: string
): Promise<void> {
  return apiClient("/profissionais/portfolio", {
    method: "PATCH",
    token,
    body: JSON.stringify({ portfolioUrls }),
  });
}

export async function forgotPassword(email: string): Promise<{ message: string }> {
  return apiClient<{ message: string }>("/auth/esqueci-senha", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export async function resetPassword(
  token: string,
  novaSenha: string
): Promise<{ message: string }> {
  return apiClient<{ message: string }>("/auth/redefinir-senha", {
    method: "POST",
    body: JSON.stringify({ token, novaSenha }),
  });
}
