import { z } from "zod"

export const profRegistrationSchema = z.object({
    cpf: z
        .string()
        .transform(v => v.replace(/\D/g, ""))
        .refine(v => v.length === 11, "CPF inválido"),

    nomeCompleto: z.string().min(3, "Informe seu nome completo"),

    apelido: z.string().min(2, "Informe seu apelido"),

    telefonePessoal: z
        .string()
        .min(10, "Telefone inválido")
        .transform(v => v.replace(/\D/g, "")),

    whatsappPessoal: z
        .string()
        .min(10, "WhatsApp inválido")
        .transform(v => v.replace(/\D/g, "")),

    emailPessoal: z.string().email({ message: "Informe um E-mail válido" }),

    website: z
        .string()
        .optional()
        .refine(v => !v || /^https?:\/\//.test(v), "Informe uma URL válida"),

    redeSocial: z.string().optional(),

    tipoEmpresa: z.enum(["mei", "lucro_presumido", "simples_nacional"], {
        message: "Selecione o tipo de empresa",
    }),

    categoriasProdutos: z.array(z.string()).min(1, "Selecione ao menos 1 categoria"),

    descricaoInstitucional: z
        .string({ message: "Campo obrigatório" })
        .min(30, "Mínimo de 30 caracteres")
        .max(300, "Máximo de 300 caracteres"),

    portfolio: z
        .array(z.instanceof(File))
        .max(5, "Máximo de 5 arquivos")
        .refine(
            files => files.length === 0 || files.every(f => f.size <= 10 * 1024 * 1024),
            "Cada arquivo deve ter no máximo 10MB"
        ),

    senha: z
        .string()
        .min(8, "Senha deve ter no mínimo 8 caracteres")
        .regex(
            /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,}$/,
            "Senha deve ter uma letra maiúscula e um caractere especial"
        ),

    confirmarSenha: z.string(),

    formaPagamento: z.enum(["cartao", "boleto", "pix"], {
        message: "Selecione uma forma de pagamento",
    }),

    aceitarPrivacidade: z.boolean().refine(v => v === true, {
        message: "Você deve aceitar os termos de privacidade",
    }),

    aceitarCookies: z.boolean().refine(v => v === true, {
        message: "Você deve aceitar a política de cookies",
    }),
}).refine(data => data.senha === data.confirmarSenha, {
    message: "As senhas não coincidem",
    path: ["confirmarSenha"],
})

export type ProfRegistrationFormData = z.infer<typeof profRegistrationSchema>
