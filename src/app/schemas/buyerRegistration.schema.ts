import { z } from "zod"

export const buyerRegistrationSchema = z.object({
  cpf: z
    .string()
    .min(11, "CPF é obrigatório")
    .regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, "CPF inválido"),

  nomeCompleto: z
    .string()
    .min(3, "Nome completo é obrigatório"),

  telefonePessoal: z
    .string()
    .min(10, "Telefone pessoal é obrigatório"),

  emailPessoal: z
    .string()
    .email("E-mail pessoal inválido"),

  cnpj: z
    .string()
    .min(14, "CNPJ é obrigatório"),

  razaoSocial: z.string().min(3, "Informe a Razão Social"),

  nomeFantasia: z.string().min(2, "Informe o nome fantasia"),

  website: z
    .string()
    .min(1, "Informe o site")
    .regex(/^https?:\/\//, "Informe uma URL válida"),

  redeSocial: z
    .string()
    .min(3, "Informe uma rede social válida"),

  emailComercial: z
    .string()
    .email("E-mail comercial inválido"),

  telefoneComercial: z
    .string()
    .min(10, "Telefone comercial é obrigatório"),

  categoriasProdutos: z.array(z.string()).min(1, "Selecione ao menos uma categoria"),
  materiais: z.array(z.string()).min(1, "Selecione ao menos um material"),
  servicos: z.array(z.string()).min(1, "Selecione ao menos um serviço"),
  setores: z.array(z.string()).min(1, "Selecione ao menos um setor"),

  aceitarPrivacidade: z.literal(true, {
    message: "Você deve aceitar os termos de privacidade",
  }),
  aceitarCookies: z.literal(true, {
    message: "Você deve aceitar a política de cookies",
  }),

})

export type BuyerRegistrationFormData = z.infer<
  typeof buyerRegistrationSchema
>
