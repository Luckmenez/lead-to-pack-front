export const paymentConfig = {
    boleto: {
        label: "Boleto Bancário",
        description: "Compensação em até 3 dias úteis",
    },
    pix: {
        label: "PIX",
        description: "Confirmação imediata",
    },
    cartao: {
        label: "Cartão de Crédito",
        description: "Aprovação instantânea",
    },
} as const


export type PaymentMethod = keyof typeof paymentConfig
