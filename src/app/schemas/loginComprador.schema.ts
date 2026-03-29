import { z } from "zod";

export const loginCompradorSchema = z.object({
  email: z.string().min(1, "E-mail é obrigatório").email("E-mail inválido"),

  senha: z.string().min(1, "Senha é obrigatória"),
});

export type LoginCompradorFormData = z.infer<typeof loginCompradorSchema>;
