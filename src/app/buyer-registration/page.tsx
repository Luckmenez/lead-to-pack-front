"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { FormField } from "@/components/ui/FormField"
import { PasswordField } from "@/components/ui/PasswordField"
import { ArrowLeftIcon, ShoppingCartIcon } from "@phosphor-icons/react"
import Link from "next/link"

import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { BuyerRegistrationFormData, buyerRegistrationSchema } from "../schemas/buyerRegistration.schema"
import { maskCNPJ, maskCPF, maskPhoneComercial, maskPhonePersonal, normalizeEmail } from "@/utils/masks"
import { registerComprador } from "@/lib/api/auth.api"
import { useAuth } from "@/contexts/AuthContext"


export default function BuyerRegistrationPage() {
    const form = useForm<BuyerRegistrationFormData>({
        resolver: zodResolver(buyerRegistrationSchema),
        defaultValues: {
            senha: "",
            confirmarSenha: "",
            aceitarPrivacidade: false,
            aceitarCookies: false,
        },
    })

    const router = useRouter()
    const { loginComprador } = useAuth()
    const [submitError, setSubmitError] = useState<string | null>(null)

    const {
        handleSubmit,
        register,
        formState: { errors, isSubmitting },
    } = form

    const onSubmit = async (data: BuyerRegistrationFormData) => {
        setSubmitError(null)
        try {
            const res = await registerComprador({
                cpf: String(data.cpf).replace(/\D/g, ""),
                senha: data.senha,
                nomeCompleto: data.nomeCompleto,
                telefonePessoal: String(data.telefonePessoal).replace(/\D/g, ""),
                emailPessoal: data.emailPessoal,
                cnpj: String(data.cnpj).replace(/\D/g, ""),
                razaoSocial: data.razaoSocial,
                nomeFantasia: data.nomeFantasia || undefined,
                emailComercial: data.emailComercial,
                telefoneComercial: String(data.telefoneComercial).replace(/\D/g, ""),
                website: data.website || undefined,
                redeSocial: data.redeSocial || undefined,
            })
            loginComprador(res.accessToken, res.comprador)
            router.push("/find-suppliers")
        } catch (e) {
            setSubmitError(e instanceof Error ? e.message : "Erro ao realizar cadastro")
        }
    }

    return (
        <main className="mx-auto max-w-6xl px-6 py-10">
            <div className="mb-6 flex justify-end">
                <Link
                    href="/choose-profile"
                    className="flex cursor-pointer items-center gap-2 rounded-full bg-[#E7EFF5] px-4 py-1.5 text-sm font-medium text-[#4F83A6] transition hover:bg-[#dbe7f0]"
                >
                    <ArrowLeftIcon size={14} weight="bold" />
                    Voltar
                </Link>
            </div>

            <section className="mb-8">
                <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E7EFF5]">
                        <ShoppingCartIcon size={20} weight="bold" color="#4F83A6" />
                    </span>

                    <div>
                        <h1 className="text-xl font-semibold">Cadastro Comprador</h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Preencha os dados da sua empresa para começar a buscar fornecedores.
                        </p>
                    </div>
                </div>
            </section>

            <form
                onSubmit={handleSubmit(onSubmit)}
                className="rounded-xl border bg-white p-6 shadow-sm"
            >
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FormField
                        label="CPF*"
                        placeholder="Ex: 000.000.000-00"
                        name="cpf"
                        register={register}
                        error={errors.cpf?.message}
                        onChangeCustom={maskCPF}
                    />

                    <FormField
                        label="Nome Completo*"
                        placeholder="Ex: João da Silva"
                        name="nomeCompleto"
                        register={register}
                        error={errors.nomeCompleto?.message}
                    />

                    <FormField
                        label="Telefone/Whatsapp pessoal*"
                        placeholder="(11) 99999-9999"
                        name="telefonePessoal"
                        register={register}
                        error={errors.telefonePessoal?.message}
                        onChangeCustom={maskPhonePersonal}
                    />

                    <FormField
                        label="E-mail pessoal*"
                        placeholder="contato@empresa.com.br"
                        name="emailPessoal"
                        register={register}
                        error={errors.emailPessoal?.message}
                        onChangeCustom={normalizeEmail}
                    />

                    <FormField
                        label="CNPJ*"
                        name="cnpj"
                        register={register}
                        error={errors.cnpj?.message}
                        onChangeCustom={maskCNPJ}
                    />

                    <FormField
                        label="Razão Social*"
                        name="razaoSocial"
                        register={register}
                        error={errors.razaoSocial?.message}
                    />

                    <FormField
                        label="Nome Fantasia"
                        name="nomeFantasia"
                        register={register}
                        error={errors.nomeFantasia?.message}
                    />

                    <FormField
                        label="Website"
                        name="website"
                        register={register}
                        error={errors.website?.message}
                    />

                    <FormField
                        label="Rede Social (Instagram/LinkedIn/TikTok)"
                        name="redeSocial"
                        register={register}
                        error={errors.redeSocial?.message}
                    />

                    <FormField
                        label="E-mail comercial*"
                        name="emailComercial"
                        register={register}
                        error={errors.emailComercial?.message}
                        onChangeCustom={normalizeEmail}
                    />

                    <FormField
                        label="Telefone/Whatsapp comercial*"
                        name="telefoneComercial"
                        register={register}
                        error={errors.telefoneComercial?.message}
                        onChangeCustom={maskPhoneComercial}
                    />
                </div>

                <hr className="my-8" />

                <section className="space-y-4">
                    <h2 className="text-sm font-semibold">
                        Defina uma senha de 8 dígitos para realizar seu login:
                    </h2>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <PasswordField
                            label="Senha*"
                            placeholder="Ex: Xplz@1234"
                            register={register}
                            name="senha"
                            error={errors.senha?.message}
                        />
                        <PasswordField
                            label="Confirme sua senha*"
                            placeholder="Confirme sua senha"
                            register={register}
                            name="confirmarSenha"
                            error={errors.confirmarSenha?.message}
                        />
                    </div>
                </section>

                <hr className="my-8" />
                <div className="mb-4 space-y-1 text-sm">
                    <a
                        href="#"
                        className="block text-blue-600 hover:underline"
                    >
                        • Termos de Uso
                    </a>

                    <a
                        href="#"
                        className="block text-blue-600 hover:underline"
                    >
                        • Política de Privacidade
                    </a>

                    <a
                        href="#"
                        className="block text-blue-600 hover:underline"
                    >
                        • Política de Cookies
                    </a>

                    <a
                        href="#"
                        className="block text-blue-600 hover:underline"
                    >
                        • Código de Conduta
                    </a>
                </div>


                <div className="space-y-3 text-sm pt-4">
                    <div className="flex cursor-pointer items-start gap-2">
                        <Controller
                            control={form.control}
                            name="aceitarPrivacidade"
                            render={({ field }) => (
                                <Checkbox
                                    checked={Boolean(field.value)}
                                    onCheckedChange={(v) => field.onChange(Boolean(v))}
                                />
                            )}
                        />
                        <label>
                            Li e estou de acordo com os termos de uso e política de privacidade
                        </label>
                    </div>

                    {errors.aceitarPrivacidade && (
                        <p className="text-xs text-red-500">
                            {errors.aceitarPrivacidade.message}
                        </p>
                    )}

                    <div className="flex cursor-pointer items-start gap-2">
                        <Controller
                            control={form.control}
                            name="aceitarCookies"
                            render={({ field }) => (
                                <Checkbox
                                    checked={Boolean(field.value)}
                                    onCheckedChange={(v) => field.onChange(Boolean(v))}
                                />
                            )}
                        />
                        <label>
                            Li e estou de acordo com a política de cookies e código de conduta
                        </label>
                    </div>

                    {errors.aceitarCookies && (
                        <p className="text-xs text-red-500">
                            {errors.aceitarCookies.message}
                        </p>
                    )}
                </div>

                <hr className="my-8" />

                {submitError && (
                    <p className="mb-4 text-sm text-red-500">{submitError}</p>
                )}

                <div className="mt-8 flex justify-center">
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="rounded-full bg-[#5B86A8] px-10 hover:bg-[#4A748F]"
                    >
                        {isSubmitting ? "Cadastrando..." : "Finalizar cadastro e buscar fornecedores"}
                    </Button>
                </div>
            </form>
        </main>
    )
}