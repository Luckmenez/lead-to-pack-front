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


    emailPessoal: z.string().email({ message: "Informe o seu email pessoal" }),
    emailComercial: z.string().email({ message: "Informe o seu email comercial" }),

    cnpj: z
        .string()
        .transform(v => v.replace(/\D/g, ""))
        .refine(v => v.length === 14, "CNPJ inválido"),

    razaoSocial: z.string().min(3, "Informe a Razão Social"),

    nomeFantasia: z.string().min(2, "Informe o nome fantasia"),

    website: z
        .string()
        .min(1, "Informe o site")
        .regex(/^https?:\/\//, "Informe uma URL válida"),

    redeSocial: z
        .string()
        .min(3, "Informe uma rede social válida"),

    telefoneComercial: z
        .string().min(10, "Telefone inválido")
        .transform(v => v.replace(/\D/g, "")),


    categoriasProdutos: z.array(z.string()).min(1, "Selecione ao menos 1 Produto"),
    materiais: z.array(z.string()).min(1, "Selecione ao menos 1 material"),
    servicos: z.array(z.string()).min(1, "Selecione ao menos 1 serviço"),
    setores: z.array(z.string()).min(1, "Selecione ao menos 1 setor"),

    descricaoInstitucional: z
        .string({ message: "Campo obrigatório" })
        .min(30, "Mínimo de 30 caracteres")
        .max(300),

    portfolio: z
        .array(z.instanceof(File))
        .min(1, "Envie ao menos um arquivo")
        .refine(
            files => files.every(f => f.size <= 10 * 1024 * 1024),
            "Cada arquivo deve ter no máximo 10MB"
        ),

    formaPagamento: z.enum(["cartao", "boleto", "pix"], { message: "Selecione uma forma de pagamento" }),

    aceitarPrivacidade: z.literal(true, {
        message: "Você deve aceitar os termos de privacidade",
    }),
    aceitarCookies: z.literal(true, {
        message: "Você deve aceitar a política de cookies",
    }),
})

export type SupplierRegistrationFormData = z.infer<
    typeof supplierRegistrationSchema
>
