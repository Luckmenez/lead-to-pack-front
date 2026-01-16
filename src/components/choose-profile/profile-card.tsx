"use client"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BriefcaseIcon, CubeIcon, ShoppingCartIcon } from "@phosphor-icons/react"
import Link from "next/link"


type ProfileType = "comprador" | "fornecedor" | "profissional"

type Props = {
    type: ProfileType
}

const config = {
    comprador: {
        title: "Comprador",
        description:
            "Ideal para empresas que buscam fornecedores de embalagens e insumos",
        price: "Gratuito",
        icon: ShoppingCartIcon,
        color: "#4F83A6",
        bg: "bg-[#E7EFF5]",
        button: "bg-[#4F83A6] hover:bg-[#3f6f8f]",
        buttonLabel: "Cadastrar Empresa",
    },
    fornecedor: {
        title: "Fornecedor",
        description:
            "Para empresas fornecedoras que querem ampliar sua carteira de clientes",
        price: "R$ 000,00/mês",
        sub: "Cancele quando quiser",
        icon: CubeIcon,
        color: "#9CCB3B",
        bg: "bg-[#EEF6DB]",
        button: "bg-[#9CCB3B] hover:bg-[#88b82f]",
        buttonLabel: "Cadastrar Fornecedor",
    },
    profissional: {
        title: "Profissional do Setor",
        description:
            "Para profissionais independentes do setor de embalagens",
        price: "R$ 000,00/mês",
        sub: "Cancele quando quiser",
        icon: BriefcaseIcon,
        color: "#1F2F44",
        bg: "bg-[#E4E9EF]",
        button: "bg-[#1F2F44] hover:bg-[#162233]",
        buttonLabel: "Cadastrar Prof. do Setor",
    },
} satisfies Record<ProfileType, any>

export function ProfileCard({ type }: Props) {
    const data = config[type]
    const Icon = data.icon

    return (
        <Card className="flex h-[420px] w-[280px] flex-col rounded-xl border shadow-sm transition hover:shadow-md">
            <CardContent className="flex flex-col items-center text-center gap-3 pt-7">
                <div
                    className={`flex h-14 w-14 items-center justify-center rounded-full ${data.bg}`}
                >
                    <Icon size={26} weight="bold" color={data.color} />
                </div>

                <h3
                    className="text-base font-semibold"
                    style={{ color: data.color }}
                >
                    {data.title}
                </h3>

                <p className="px-5 text-sm text-muted-foreground">
                    {data.description}
                </p>


                <div className="mt-2 min-h-[48px]">
                    <p className="font-semibold text-black">{data.price}</p>
                    {data.sub && (
                        <p className="text-xs text-muted-foreground">
                            {data.sub}
                        </p>
                    )}
                </div>
            </CardContent>
            <CardFooter className="mt-auto px-6 pb-6">
                {type === "comprador" ? (
                    <Link href="/buyer-registration" className="w-full">
                        <Button
                            className={`w-full rounded-lg text-white ${data.button}`}
                        >
                            {data.buttonLabel}
                        </Button>
                    </Link>
                ) : (
                    <Button
                        className={`w-full rounded-lg text-white ${data.button}`}
                    >
                        {data.buttonLabel}
                    </Button>
                )}
            </CardFooter>

        </Card>
    )
}
