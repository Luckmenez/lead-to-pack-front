import { z } from "zod"

export const buyerRegistrationSchema = z.object({
  nomeCompleto: z
    .string()
    .min(3, "Nome completo é obrigatório"),

  email: z
    .string()
    .email("E-mail inválido"),

  telefonePessoal: z
    .string()
    .min(10, "Telefone pessoal é obrigatório"),

  cnpj: z
    .string()
    .min(14, "CNPJ é obrigatório"),

  razaoSocial: z.string().min(3, "Informe a Razão Social"),

  nomeFantasia: z.string().min(2, "Informe o nome fantasia").optional(),

  website: z
    .string()
    .regex(/^https?:\/\//, "Informe uma URL válida")
    .optional()
    .or(z.literal("")),

  redeSocial: z
    .string()
    .optional(),

  telefoneComercial: z
    .string()
    .min(10, "Telefone comercial é obrigatório"),

  whatsapp: z
    .string()
    .min(10, "WhatsApp é obrigatório"),

  senha: z
    .string()
    .min(8, "Senha deve ter no mínimo 8 caracteres")
    .regex(
      /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,}$/,
      "Senha deve ter uma letra maiúscula e um caractere especial"
    ),
  confirmarSenha: z.string(),

  aceitarPrivacidade: z.boolean().refine((v) => v === true, {
    message: "Você deve aceitar os termos de privacidade",
  }),
  aceitarCookies: z.boolean().refine((v) => v === true, {
    message: "Você deve aceitar a política de cookies",
  }),
}).refine((data) => data.senha === data.confirmarSenha, {
  message: "As senhas não coincidem",
  path: ["confirmarSenha"],
})

export type BuyerRegistrationFormData = z.infer<
  typeof buyerRegistrationSchema
>
