"use client"

import Link from "next/link"
import { ArrowLeftIcon, BuildingsIcon } from "@phosphor-icons/react"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { FormField } from "@/components/ui/FormField"
import { PortfolioDropzone } from "@/components/Dropzone"

import {
    ProfRegistrationFormData,
    profRegistrationSchema,
} from "../schemas/profRegistration.schema"

import { maskCEP, maskCPF, maskPhonePersonal, normalizeEmail, numberEnterprise } from "@/utils/masks"
import { PROF_REGISTRATION_CATEGORIES } from "./constants/profRegistration"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"



export default function ProfRegistrationPage() {
    const form = useForm<ProfRegistrationFormData>({
        resolver: zodResolver(profRegistrationSchema),
        defaultValues: {
            categoriasAtuacao: [],
            portfolio: [],
            aceitarTermos: false,
             uf: "",
        },
    })

    const {
        handleSubmit,
        register,
        control,
        watch,
        setValue,
        formState: { errors },
    } = form

    const selectedCategories = watch("categoriasAtuacao") || []
    const canSelectMore = selectedCategories.length < 5

    function onSubmit(data: ProfRegistrationFormData) {
        console.log(data)
    }

    return (
        <main className="mx-auto max-w-6xl px-6 py-10">
            <div className="mb-6 flex justify-end">
                <Link
                    href="/choose-profile"
                    className="flex items-center gap-2 rounded-full bg-[#E7EFF5] px-4 py-1.5 text-sm font-medium text-[#4F83A6]"
                >
                    <ArrowLeftIcon size={14} weight="bold" />
                    Voltar
                </Link>
            </div>

            <div className="mb-8 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E7EFF5]">
                    <BuildingsIcon size={20} weight="bold" color="#4F83A6" />
                </span>

                <div>
                    <h1 className="text-xl font-semibold">
                        Cadastro Completo – Profissional Liberal (PF)
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Preencha seus dados para começar a oferecer seus serviços.
                    </p>
                </div>
            </div>

            <form
                onSubmit={handleSubmit(onSubmit)}
                className="overflow-hidden rounded-xl  bg-white"
            >
                <div className="bg-[#5084AB80] px-6 py-6 rounded-2xl">
                    <h3 className="mb-4 text-sm font-bold text-[#1f3b52]">
                        Dados Cadastrais
                    </h3>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <FormField
                            label="CPF"
                            name="cpf"
                            placeholder="000.000.000-00"
                            register={register}
                            error={errors.cpf?.message}
                            onChangeCustom={maskCPF}
                        />

                        <FormField
                            label="Nome Completo"
                            name="nomeCompleto"
                            placeholder="João Silva Santos"
                            register={register}
                            error={errors.nomeCompleto?.message}
                        />
                    </div>
                </div>

                <div className="space-y-8 p-6">
                    <div className="grid grid-cols-12 gap-4">
                        <div className="col-span-12">
                            <FormField
                                label="Endereço"
                                name="endereco"
                                placeholder="Ex: Rua José da Silva Mendes"
                                register={register}
                                error={errors.endereco?.message}
                            />
                        </div>

                        <div className="col-span-12 md:col-span-4">
                            <FormField
                                label="Número"
                                name="numero"
                                register={register}
                                error={errors.numero?.message}
                                onChangeCustom={numberEnterprise}
                            />
                        </div>

                        <div className="col-span-12 md:col-span-8">
                            <FormField
                                label="Complemento"
                                name="complemento"
                                register={register}
                                error={errors.complemento?.message}
                            />
                        </div>

                        <div className="col-span-12 md:col-span-3">
                            <FormField
                                label="CEP"
                                name="cep"
                                placeholder="00000-000"
                                register={register}
                                error={errors.cep?.message}
                                onChangeCustom={maskCEP}
                            />
                        </div>

                        <div className="col-span-12 md:col-span-7">
                            <FormField
                                label="Cidade"
                                name="cidade"
                                register={register}
                                error={errors.cidade?.message}
                            />
                        </div>

                        <div className="space-y-1 w-32">
                            <label className="text-sm font-medium">UF</label>

                            <Controller
                                control={control}
                                name="uf"
                                render={({ field }) => (
                                    <Select
                                        value={field.value}
                                        onValueChange={field.onChange}
                                    >
                                        <SelectTrigger className={`w-full ${errors.uf ? "border-red-500" : ""}`}>
                                            <SelectValue placeholder="Estado" />
                                        </SelectTrigger>

                                        <SelectContent>
                                            {[
                                                "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA",
                                                "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN",
                                                "RS", "RO", "RR", "SC", "SP", "SE", "TO",
                                            ].map(uf => (
                                                <SelectItem key={uf} value={uf}>
                                                    {uf}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />

                            {errors.uf && (
                                <p className="text-xs text-red-500">{errors.uf.message}</p>
                            )}

                        </div>

                    </div>

                    <FormField
                        label="Nome para Exibição"
                        name="nomeExibicao"
                        placeholder="João Silva – Designer de Embalagens"
                        register={register}
                        error={errors.nomeExibicao?.message}
                    />

                    <div>
                        <label className="text-sm font-medium">
                            Descrição dos Serviços (Pitch)
                        </label>

                        <textarea
                            {...register("descricao")}
                            rows={5}
                            maxLength={2001}
                            className={`mt-1 w-full rounded-md border p-3 text-sm ${errors.descricao ? "border-red-500" : ""
                                }`}
                        />

                        <p className="mt-1 text-xs text-muted-foreground">
                            Mínimo 300 caracteres recomendado
                        </p>

                        {errors.descricao && (
                            <p className="text-xs text-red-500">
                                {errors.descricao.message}
                            </p>
                        )}
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <FormField
                            label="WhatsApp"
                            name="whatsapp"
                            placeholder="(11) 99999-9999"
                            register={register}
                            error={errors.whatsapp?.message}
                            onChangeCustom={maskPhonePersonal}
                        />

                        <FormField
                            label="Website"
                            name="website"
                            placeholder="https://www.suaempresa.com.br"
                            register={register}
                            error={errors.website?.message}
                            onChangeCustom={normalizeEmail}
                        />
                    </div>

                    <div>
                        <h3 className="mb-4 text-sm font-semibold">
                            Categorias de Atuação (até 5)
                        </h3>

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-5">
                            {Object.entries(PROF_REGISTRATION_CATEGORIES).map(([group, items]) => (
                                <div key={group} className="space-y-2">
                                    <p className="text-sm font-medium">{group}</p>

                                    {items.map(item => {
                                        const checked = selectedCategories.includes(item)

                                        return (
                                            <label key={item} className="flex items-center gap-2 text-sm">
                                                <input
                                                    type="checkbox"
                                                    checked={checked}
                                                    disabled={!checked && !canSelectMore}
                                                    onChange={() => {
                                                        const updated = checked
                                                            ? selectedCategories.filter(i => i !== item)
                                                            : [...selectedCategories, item]

                                                        setValue("categoriasAtuacao", updated)
                                                    }}
                                                />
                                                {item}
                                            </label>
                                        )
                                    })}
                                </div>
                            ))}
                        </div>
                        <hr className="my-8" />

                        <p className="mt-2 text-xs text-muted-foreground">
                            {selectedCategories.length}/5 categorias selecionadas
                        </p>

                        {errors.categoriasAtuacao && (
                            <p className="text-xs text-red-500">
                                {errors.categoriasAtuacao.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <p className="mb-2 text-sm font-medium">
                            Upload de portfólio* (PDF, JPG, PNG – máx. 10MB cada)
                        </p>

                        <Controller
                            control={control}
                            name="portfolio"
                            render={({ field }) => (
                                <PortfolioDropzone
                                    value={field.value}
                                    onChange={field.onChange}
                                    error={errors.portfolio?.message}
                                />
                            )}
                        />

                        {errors.portfolio && (
                            <p className="mt-1 text-xs text-red-500">
                                {errors.portfolio.message}
                            </p>
                        )}
                    </div>
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
                    </div>

                    <div className="flex items-start gap-2 text-sm">
                        <Controller
                            control={control}
                            name="aceitarTermos"
                            render={({ field }) => (
                                <Checkbox
                                    checked={Boolean(field.value)}
                                    onCheckedChange={v => field.onChange(Boolean(v))}
                                />
                            )}
                        />
                        <span>Aceito os Termos de Uso e a Política de Privacidade</span>
                    </div>

                    {errors.aceitarTermos && (
                        <p className="text-xs text-red-500">
                            {errors.aceitarTermos.message}
                        </p>
                    )}



                    <div className="rounded-md bg-gray-100 p-4 text-2x2 text-gray-600 p-6">
                        <strong>Próximo Passo:</strong>
                        <p className="mt-1">
                            Após finalizar o cadastro, será gerado automaticamente o 1º boleto
                            de pagamento. Seu perfil será ativado somente após a confirmação do
                            pagamento.
                        </p>
                    </div>

                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                        Finalizar cadastro
                    </Button>
                </div>
            </form>
        </main>
    )
}
