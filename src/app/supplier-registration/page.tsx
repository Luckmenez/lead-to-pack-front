"use client"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { InterestGroup } from "@/components/buyer-registration/InterestGroup"
import { FormField } from "@/components/buyer-registration/FormField"
import { ArrowLeftIcon, CubeIcon } from "@phosphor-icons/react"
import Link from "next/link"

import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
    SupplierRegistrationFormData,
    supplierRegistrationSchema,
} from "../schemas/supplierRegistration.schema"
import { ProgressBar } from "@/components/supplier-registration/progressBar"
import { PortfolioDropzone } from "@/components/supplier-registration/Dropzone"
import { useRouter } from "next/navigation"

export default function SupplierRegistrationPage() {
    const form = useForm<SupplierRegistrationFormData>({
        resolver: zodResolver(supplierRegistrationSchema),
        defaultValues: {
            categoriasProdutos: [],
            materiais: [],
            servicos: [],
            setores: [],
            portfolio: [],
            aceitarPrivacidade: false,
            aceitarCookies: false,
        },
    })

    const {
        handleSubmit,
        register,
        watch,
        setValue,
        formState: { errors },
    } = form

    const router = useRouter()

    const onSubmit = (data: SupplierRegistrationFormData) => {
        console.log("FORM DATA ETAPA 1:", data)

        router.push(
            `/supplier-registration/payment?payment=${data.formaPagamento}`
        )
    }


    return (
        <main className="mx-auto max-w-6xl px-6 py-10">
            <ProgressBar step={1} />
            <div className="mb-6 flex justify-end">
                <Link
                    href="/choose-profile"
                    className="flex items-center gap-2 rounded-full bg-[#E7EFF5] px-4 py-1.5 text-sm font-medium text-[#4F83A6] transition hover:bg-[#dbe7f0]"
                >
                    <ArrowLeftIcon size={14} weight="bold" />
                    Voltar
                </Link>
            </div>

            <section className="mb-8">
                <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EEF6DB]">
                        <CubeIcon size={20} weight="bold" color="#9CCB3B" />
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
                    />

                    <FormField
                        label="E-mail pessoal*"
                        placeholder="contato@empresa.com.br"
                        name="emailPessoal"
                        register={register}
                        error={errors.emailPessoal?.message}
                    />

                    <FormField
                        label="CNPJ*"
                        name="cnpj"
                        register={register}
                        error={errors.cnpj?.message}
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
                    />

                    <FormField
                        label="E-mail comercial*"
                        name="emailComercial"
                        register={register}
                        error={errors.emailComercial?.message}
                    />

                    <FormField
                        label="Telefone/Whatsapp comercial*"
                        name="telefoneComercial"
                        register={register}
                        error={errors.telefoneComercial?.message}
                    />
                </div>

                <hr className="my-8" />

                <section className="space-y-6">
                    <h2 className="text-sm font-semibold">
                        Selecione os itens de interesse:
                    </h2>

                    <InterestGroup
                        title="Categorias de Produtos"
                        name="categoriasProdutos"
                        items={[
                            "Embalagens Primárias",
                            "Embalagens Secundárias",
                            "Embalagens Terciárias",
                            "Acessórios e Componentes",
                            "Etiquetas e Rótulos",
                            "Embalagens Sustentáveis/Recicladas",
                        ]}
                        control={form.control}
                        error={errors.categoriasProdutos?.message}
                    />

                    <InterestGroup
                        title="Materiais"
                        name="materiais"
                        items={[
                            "Papel / Papelão",
                            "Plásticos",
                            "Vidro",
                            "Metal e Alumínio",
                            "Madeira / Bambu",
                            "Tecido / Têxtil",
                            "Biopolímeros / Compostáveis",
                            "Multicamadas / Laminados",
                            "Rótulos e Etiquetas",
                            "Outros (Cerâmica, EPS)",
                        ]}
                        control={form.control}
                        error={errors.materiais?.message}
                    />

                    <InterestGroup
                        title="Serviços"
                        name="servicos"
                        items={[
                            "Design & Desenvolvimento",
                            "Prototipagem e Amostras",
                            "Impressão e Personalização",
                            "Produção Própria",
                            "Private Label",
                            "Fornecimento Sob Demanda (JIT)",
                            "Consultoria em Embalagens",
                            "Logística e Armazenagem",
                            "Reciclagem e Pós-consumo",
                        ]}
                        control={form.control}
                        error={errors.servicos?.message}
                    />

                    <InterestGroup
                        title="Setores"
                        name="setores"
                        items={[
                            "Alimentos & Bebidas",
                            "Farmacêutico & Hospitalar",
                            "Cosmético & Higiene",
                            "Editorial / Papelaria",
                            "Domissanitários",
                            "Pet",
                            "E-commerce & Logística",
                            "Industrial & Químico",
                            "Moda & Têxtil",
                            "Eletrônicos",
                            "Orgânicos",
                            "Bebidas Alcoólicas",
                            "Outros",
                        ]}
                        control={form.control}
                        error={errors.setores?.message}
                    />
                </section>

                <hr className="my-8" />
                <div className="space-y-1">
                    <label className="text-sm font-medium">
                        Descrição institucional*
                    </label>

                    <textarea
                        {...register("descricaoInstitucional")}
                        rows={4}
                        maxLength={300}
                        className="w-full rounded-md border border-input p-3 text-sm"
                        placeholder="Descreva sua empresa, especialidades e diferenciais..."
                    />

                    <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{errors.descricaoInstitucional?.message}</span>
                        <span>Máx. 300 caracteres</span>
                    </div>
                </div>
                <hr className="my-8" />

                <label className="text-sm font-medium">
                    Upload de portfólio* (PDF, JPG, PNG - máx. 10MB cada)
                </label>

                <Controller
                    control={form.control}
                    name="portfolio"
                    render={({ field }) => (
                        <PortfolioDropzone
                            onChange={(files: File[]) => field.onChange(files)}
                        />
                    )}
                />

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
                    <div className="flex items-start gap-2">


                        <Checkbox
                            checked={watch("aceitarPrivacidade")}
                            onCheckedChange={(v) =>
                                setValue("aceitarPrivacidade", Boolean(v))
                            }
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

                    <div className="flex items-start gap-2">
                        <Checkbox
                            checked={watch("aceitarCookies")}
                            onCheckedChange={(v) =>
                                setValue("aceitarCookies", Boolean(v))
                            }
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
                <div className="space-y-2">
                    <h3 className="text-sm font-semibold">
                        Selecione a forma de pagamento:
                    </h3>

                    <div className="pb-2 font-light text-sm">
                        R$ 000,00/mês - Cancele quando quiser
                    </div>

                    {["cartao", "boleto", "pix"].map(p => (
                        <label key={p} className="flex items-center gap-2 text-sm">
                            <input
                                type="radio"
                                value={p}
                                {...register("formaPagamento")}
                            />
                            {p === "cartao" && "Cartão de crédito"}
                            {p === "boleto" && "Boleto bancário"}
                            {p === "pix" && "PIX"}
                        </label>
                    ))}

                    {errors.formaPagamento && (
                        <p className="text-xs text-red-500">
                            {errors.formaPagamento.message}
                        </p>
                    )}
                </div>
                <hr className="my-8" />

                <div className="mt-8 flex justify-center">
                    <Button
                        type="submit"
                        className="rounded-full bg-[#5B86A8] px-10 hover:bg-[#4A748F]"
                    >
                        Avançar para pagamento
                    </Button>
                </div>
            </form>
        </main>
    )
}
