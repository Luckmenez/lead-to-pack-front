import { z } from "zod";

const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
const cnpjRegex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;

export const loginCompradorSchema = z.object({
  document: z
    .string()
    .min(1, "Documento é obrigatório")
    .refine(
      (val) => {
        const digits = val.replace(/\D/g, "");
        if (digits.length === 11) return cpfRegex.test(val);
        if (digits.length === 14) return cnpjRegex.test(val);
        return false;
      },
      { message: "Documento inválido (informe CPF ou CNPJ)" }
    ),

  senha: z
    .string()
    .min(6, "Senha deve ter no mínimo 6 caracteres"),
});

export type LoginCompradorFormData = z.infer<typeof loginCompradorSchema>;
