import { z } from "zod";

export const loginCompradorSchema = z.object({
  cpf: z
    .string()
    .min(11, "CPF é obrigatório")
    .regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, "CPF inválido"),

  senha: z
    .string()
    .min(6, "Senha deve ter no mínimo 6 caracteres"),
});

export type LoginCompradorFormData = z.infer<typeof loginCompradorSchema>;
