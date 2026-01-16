import { z } from "zod"

export const supplierRegistrationSchema = z.object({
    cpf: z
        .string()
        .transform(v => v.replace(/\D/g, ""))
        .refine(v => v.length === 11, "CPF inválido"),

    nomeCompleto: z.string().min(3),

    telefonePessoal: z
        .string().min(10, "Telefone inválido")
        .transform(v => v.replace(/\D/g, "")),


    emailPessoal: z.string().email(),

    cnpj: z
        .string()
        .transform(v => v.replace(/\D/g, ""))
        .refine(v => v.length === 14, "CNPJ inválido"),

    razaoSocial: z.string().min(3),

    nomeFantasia: z.string().optional(),

    website: z
        .string()
        .optional()
        .refine(
            v => !v || v.length === 0 || /^https?:\/\//.test(v),
            { message: "Informe uma URL válida" }
        ),

    redeSocial: z.string().optional(),

    emailComercial: z.string().email(),

    telefoneComercial: z
        .string().min(10, "Telefone inválido")
        .transform(v => v.replace(/\D/g, "")),


    categoriasProdutos: z.array(z.string()).min(1, "Selecione ao menos 1 Produto"),
    materiais: z.array(z.string()).min(1, "Selecione ao menos 1 material"),
    servicos: z.array(z.string()).min(1, "Selecione ao menos 1 serviço"),
    setores: z.array(z.string()).min(1, "Selecione ao menos 1 setor"),

    descricaoInstitucional: z
        .string()
        .min(30, "Mínimo de 30 caracteres")
        .max(300),

    portfolio: z
        .array(z.instanceof(File))
        .min(1, "Envie ao menos um arquivo")
        .refine(
            files => files.every(f => f.size <= 10 * 1024 * 1024),
            "Cada arquivo deve ter no máximo 10MB"
        ),

    formaPagamento: z.enum(["cartao", "boleto", "pix"], {message: "Selecione uma forma de pagamento"}),

    aceitarPrivacidade: z.literal(true, {
        errorMap: () => ({ message: "Obrigatório aceitar os termos" }),
    }),

    aceitarCookies: z.literal(true, {
        errorMap: () => ({ message: "Obrigatório aceitar os termos" }),
    }),
})

export type SupplierRegistrationFormData = z.infer<
    typeof supplierRegistrationSchema
>
