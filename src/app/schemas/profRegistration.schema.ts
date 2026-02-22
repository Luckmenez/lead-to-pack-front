import { z } from "zod"

export const profRegistrationSchema = z.object({
    cpf: z.string().min(11, "CPF inválido"),

    nomeCompleto: z.string().min(3, "Informe seu nome completo"),

    endereco: z.string().min(5, "Informe o endereço"),
    numero: z.string().min(1, "Informe o número"),
    complemento: z.string().optional(),

    cep: z.string().min(8, "CEP inválido"),
    cidade: z.string().min(2, "Informe a cidade"),
    uf: z.string().length(2, "UF inválida"),

    nomeExibicao: z.string().min(3, "Informe o nome para exibição"),

    descricao: z
        .string()
        .min(300, "Mínimo de 300 caracteres")
        .max(2000, "Limite de caracteres atingido"),

    whatsapp: z.string().min(10, "WhatsApp inválido"),

    website: z
        .string()
        .optional()
        .refine(v => !v || /^https?:\/\//.test(v), {
            message: "Informe uma URL válida",
        }),


    categoriasAtuacao: z
        .array(z.string())
        .min(1, "Selecione ao menos 1 categoria")
        .max(5, "Máximo de 5 categorias"),

    portfolio: z
        .array(z.instanceof(File))
        .min(1, "Envie ao menos um arquivo"),

    aceitarTermos: z
        .boolean()
        .refine(val => val === true, {
            message: "Você deve aceitar os termos e a politica de privacidade",
        }),
})

export type ProfRegistrationFormData = z.infer<
    typeof profRegistrationSchema
>
