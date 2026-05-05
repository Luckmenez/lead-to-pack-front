"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { InterestGroup } from "@/app/buyer-registration/buyer-registration-component/InterestGroup";
import { FormField } from "@/components/ui/FormField";
import { PasswordField } from "@/components/ui/PasswordField";
import { ArrowLeftIcon, CubeIcon } from "@phosphor-icons/react";
import Link from "next/link";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  SupplierRegistrationFormData,
  supplierRegistrationSchema,
} from "../schemas/supplierRegistration.schema";
import { ProgressBar } from "@/app/supplier-registration/supplier-registration-component/progressBar";
import { maskCNPJ, maskPhonePersonal, normalizeEmail } from "@/utils/masks";
import { PortfolioDropzone } from "@/components/Dropzone";
import { registerFornecedor } from "@/lib/api/auth.api";
import { useAuth } from "@/contexts/AuthContext";

const ESTADOS_BR = [
  { uf: "AC", nome: "Acre" },
  { uf: "AL", nome: "Alagoas" },
  { uf: "AP", nome: "Amapá" },
  { uf: "AM", nome: "Amazonas" },
  { uf: "BA", nome: "Bahia" },
  { uf: "CE", nome: "Ceará" },
  { uf: "DF", nome: "Distrito Federal" },
  { uf: "ES", nome: "Espírito Santo" },
  { uf: "GO", nome: "Goiás" },
  { uf: "MA", nome: "Maranhão" },
  { uf: "MT", nome: "Mato Grosso" },
  { uf: "MS", nome: "Mato Grosso do Sul" },
  { uf: "MG", nome: "Minas Gerais" },
  { uf: "PA", nome: "Pará" },
  { uf: "PB", nome: "Paraíba" },
  { uf: "PR", nome: "Paraná" },
  { uf: "PE", nome: "Pernambuco" },
  { uf: "PI", nome: "Piauí" },
  { uf: "RJ", nome: "Rio de Janeiro" },
  { uf: "RN", nome: "Rio Grande do Norte" },
  { uf: "RS", nome: "Rio Grande do Sul" },
  { uf: "RO", nome: "Rondônia" },
  { uf: "RR", nome: "Roraima" },
  { uf: "SC", nome: "Santa Catarina" },
  { uf: "SP", nome: "São Paulo" },
  { uf: "SE", nome: "Sergipe" },
  { uf: "TO", nome: "Tocantins" },
];

export default function SupplierRegistrationPage() {
  const form = useForm<SupplierRegistrationFormData>({
    resolver: zodResolver(supplierRegistrationSchema),
    defaultValues: {
      categoriasProdutos: [],
      materiais: [],
      servicos: [],
      setores: [],
      portfolio: [],
      cidade: "",
      estado: "",
      senha: "",
      confirmarSenha: "",
      aceitarPrivacidade: false,
      aceitarCookies: false,
    },
  });

  const router = useRouter();
  const { loginFornecedor } = useAuth();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = form;

  const onSubmit = async (data: SupplierRegistrationFormData) => {
    setSubmitError(null);
    try {
      const res = await registerFornecedor({
        senha: data.senha,
        telefone: String(data.telefone).replace(/\D/g, ""),
        whatsapp: String(data.whatsapp).replace(/\D/g, ""),
        email: data.email,
        cnpj: String(data.cnpj).replace(/\D/g, ""),
        razaoSocial: data.razaoSocial,
        nomeFantasia: data.nomeFantasia,
        categoriasProdutos: data.categoriasProdutos,
        materiais: data.materiais,
        servicos: data.servicos,
        setores: data.setores,
        descricaoInstitucional: data.descricaoInstitucional,
        formaPagamento: data.formaPagamento,
        cidade: data.cidade,
        estado: data.estado,
        tipoInscricao: data.tipoInscricao,
        numeroInscricao: data.numeroInscricao,
        tipoEmpresa: data.tipoEmpresa,
        website: data.website || "",
        redeSocial: data.redeSocial || "",
      });
      loginFornecedor(res.accessToken, res.fornecedor);
      router.push(
        `/supplier-registration/payment?payment=${data.formaPagamento}`,
      );
    } catch (e) {
      setSubmitError(
        e instanceof Error ? e.message : "Erro ao realizar cadastro",
      );
    }
  };

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <ProgressBar step={1} />
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
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EEF6DB]">
            <CubeIcon size={20} weight="bold" color="#9CCB3B" />
          </span>

          <div>
            <h1 className="text-xl font-semibold">Cadastro Fornecedor</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Preencha os dados da sua empresa para se cadastrar como fornecedor
              de embalagens.
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
            label="Telefone*"
            placeholder="(11) 3333-3333"
            name="telefone"
            register={register}
            error={errors.telefone?.message}
            onChangeCustom={maskPhonePersonal}
          />

          <FormField
            label="WhatsApp*"
            placeholder="(11) 99999-9999"
            name="whatsapp"
            register={register}
            error={errors.whatsapp?.message}
            onChangeCustom={maskPhonePersonal}
          />

          <FormField
            label="E-mail*"
            placeholder="contato@empresa.com.br"
            name="email"
            register={register}
            error={errors.email?.message}
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
            label="Nome Fantasia*"
            name="nomeFantasia"
            register={register}
            error={errors.nomeFantasia?.message}
          />

          <FormField
            label="Website"
            name="website"
            register={register}
            error={errors.website?.message}
            onChangeCustom={normalizeEmail}
          />

          <FormField
            label="Rede Social (Instagram/LinkedIn/TikTok)"
            name="redeSocial"
            register={register}
            error={errors.redeSocial?.message}
            onChangeCustom={normalizeEmail}
          />

          <div className="space-y-1">
            <label className="text-sm font-medium">Estado*</label>
            <select
              {...register("estado")}
              className={`w-full rounded-md border bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4F83A6] ${errors.estado ? "border-red-500" : "border-input"}`}
            >
              <option value="">Selecione o estado</option>
              {ESTADOS_BR.map((e) => (
                <option key={e.uf} value={e.uf}>
                  {e.nome}
                </option>
              ))}
            </select>
            {errors.estado && (
              <p className="text-xs text-red-500">{errors.estado.message}</p>
            )}
          </div>

          <FormField
            label="Cidade*"
            placeholder="Ex: São Paulo"
            name="cidade"
            register={register}
            error={errors.cidade?.message}
          />

          <div className="space-y-1">
            <label className="text-sm font-medium">Tipo de Inscrição*</label>
            <select
              {...register("tipoInscricao")}
              className={`w-full rounded-md border bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4F83A6] ${errors.tipoInscricao ? "border-red-500" : "border-input"}`}
            >
              <option value="">Selecione o tipo</option>
              <option value="estadual">Estadual</option>
              <option value="municipal">Municipal</option>
            </select>
            {errors.tipoInscricao && (
              <p className="text-xs text-red-500">
                {errors.tipoInscricao.message}
              </p>
            )}
          </div>

          <FormField
            label="Número de Inscrição*"
            placeholder="Ex: 123.456.789.000"
            name="numeroInscricao"
            register={register}
            error={errors.numeroInscricao?.message}
          />

          <div className="space-y-1">
            <label className="text-sm font-medium">Tipo de Empresa*</label>
            <select
              {...register("tipoEmpresa")}
              className={`w-full rounded-md border bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4F83A6] ${errors.tipoEmpresa ? "border-red-500" : "border-input"}`}
            >
              <option value="">Selecione o tipo de empresa</option>
              <option value="mei">MEI</option>
              <option value="lucro_presumido">Lucro Presumido</option>
              <option value="simples_nacional">Simples Nacional</option>
            </select>
            {errors.tipoEmpresa && (
              <p className="text-xs text-red-500">
                {errors.tipoEmpresa.message}
              </p>
            )}
          </div>
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
            Descrição institucional (Pitch)*
          </label>

          <textarea
            {...register("descricaoInstitucional")}
            rows={4}
            maxLength={500}
            className={`w-full rounded-md border p-3 text-sm ${
              errors.descricaoInstitucional?.message
                ? "border-red-500 focus:ring-red-500"
                : "border-input"
            }`}
          />

          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{errors.descricaoInstitucional?.message}</span>
            <span>Máx. 500 caracteres</span>
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
            <>
              <PortfolioDropzone
                value={field.value}
                onChange={(files: File[]) => field.onChange(files)}
                error={errors.portfolio?.message}
              />

              {errors.portfolio?.message && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.portfolio.message}
                </p>
              )}
            </>
          )}
        />

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
          <a href="#" className="block text-blue-600 hover:underline">
            • Termos de Uso
          </a>

          <a href="#" className="block text-blue-600 hover:underline">
            • Política de Privacidade
          </a>

          <a href="#" className="block text-blue-600 hover:underline">
            • Política de Cookies
          </a>

          <a href="#" className="block text-blue-600 hover:underline">
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
              Li e estou de acordo com os termos de uso e política de
              privacidade
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
        <div className="space-y-2">
          <h3 className="text-sm font-semibold">
            Selecione a forma de pagamento:
          </h3>

          <div className="pb-2 font-light text-sm">
            R$ 000,00/mês - Cancele quando quiser
          </div>

          {["cartao", "boleto", "pix"].map((p) => (
            <label
              key={p}
              className="flex cursor-pointer items-center gap-2 text-sm"
            >
              <input type="radio" value={p} {...register("formaPagamento")} />
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

        {submitError && (
          <p className="mb-4 text-sm text-red-500">{submitError}</p>
        )}

        <div className="mt-8 flex justify-center">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="rounded-full bg-[#5B86A8] px-10 hover:bg-[#4A748F]"
          >
            {isSubmitting ? "Cadastrando..." : "Avançar para pagamento"}
          </Button>
        </div>
      </form>
    </main>
  );
}
