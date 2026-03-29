import { z } from "zod"

export const supplierRegistrationSchema = z.object({
    telefone: z
        .string().min(10, "Telefone inválido")
        .transform(v => v.replace(/\D/g, "")),

    whatsapp: z
        .string().min(10, "WhatsApp inválido")
        .transform(v => v.replace(/\D/g, "")),

    email: z.string().email({ message: "Informe um E-mail válido" }),

    cnpj: z
        .string()
        .transform(v => v.replace(/\D/g, ""))
        .refine(v => v.length === 14, "CNPJ inválido"),

    razaoSocial: z.string().min(3, "Informe a Razão Social"),

    nomeFantasia: z.string().min(2, "Informe o nome fantasia"),

    website: z
        .string()
        .refine(v => !v || /^https?:\/\//.test(v), "Informe uma URL válida")
        .optional()
        .or(z.literal("")),

    redeSocial: z
        .string()
        .optional()
        .or(z.literal("")),

    cidade: z.string().min(2, "Informe a cidade"),
    estado: z.string().min(2, "Selecione o estado"),

    tipoInscricao: z.enum(["estadual", "municipal"], { message: "Selecione o tipo de inscrição" }),
    numeroInscricao: z.string().min(1, "Informe o número de inscrição"),

    tipoEmpresa: z.enum(["mei", "lucro_presumido", "simples_nacional"], { message: "Selecione o tipo de empresa" }),

    categoriasProdutos: z.array(z.string()).min(1, "Selecione ao menos 1 Produto"),
    materiais: z.array(z.string()).min(1, "Selecione ao menos 1 material"),
    servicos: z.array(z.string()).min(1, "Selecione ao menos 1 serviço"),
    setores: z.array(z.string()).min(1, "Selecione ao menos 1 setor"),

    descricaoInstitucional: z
        .string({ message: "Campo obrigatório" })
        .min(30, "Mínimo de 30 caracteres")
        .max(500),

    portfolio: z
        .array(z.instanceof(File))
        .min(1, "Envie ao menos um arquivo")
        .refine(
            files => files.every(f => f.size <= 10 * 1024 * 1024),
            "Cada arquivo deve ter no máximo 10MB"
        ),

    formaPagamento: z.enum(["cartao", "boleto", "pix"], { message: "Selecione uma forma de pagamento" }),

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

export type SupplierRegistrationFormData = z.infer<
    typeof supplierRegistrationSchema
>
