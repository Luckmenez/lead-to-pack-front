"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/FormField";
import { CategoriasInterestGroup } from "@/components/catalog/CategoriasInterestGroup";
import { PortfolioEditor } from "./PortfolioEditor";
import { maskPhonePersonal } from "@/utils/masks";
import { optionalWebsiteField, WEBSITE_PLACEHOLDER } from "@/utils/website";
import { updateFornecedor, type FornecedorPerfil } from "@/lib/api/my-profile.api";
import {
  PORTFOLIO_EDIT_PARTIAL_ERROR,
  PortfolioS3DeleteWarning,
  syncPortfolio,
} from "@/lib/api/portfolio.api";

const ESTADOS_BR = [
  { uf: "AC", nome: "Acre" }, { uf: "AL", nome: "Alagoas" },
  { uf: "AP", nome: "Amapá" }, { uf: "AM", nome: "Amazonas" },
  { uf: "BA", nome: "Bahia" }, { uf: "CE", nome: "Ceará" },
  { uf: "DF", nome: "Distrito Federal" }, { uf: "ES", nome: "Espírito Santo" },
  { uf: "GO", nome: "Goiás" }, { uf: "MA", nome: "Maranhão" },
  { uf: "MT", nome: "Mato Grosso" }, { uf: "MS", nome: "Mato Grosso do Sul" },
  { uf: "MG", nome: "Minas Gerais" }, { uf: "PA", nome: "Pará" },
  { uf: "PB", nome: "Paraíba" }, { uf: "PR", nome: "Paraná" },
  { uf: "PE", nome: "Pernambuco" }, { uf: "PI", nome: "Piauí" },
  { uf: "RJ", nome: "Rio de Janeiro" }, { uf: "RN", nome: "Rio Grande do Norte" },
  { uf: "RS", nome: "Rio Grande do Sul" }, { uf: "RO", nome: "Rondônia" },
  { uf: "RR", nome: "Roraima" }, { uf: "SC", nome: "Santa Catarina" },
  { uf: "SP", nome: "São Paulo" }, { uf: "SE", nome: "Sergipe" },
  { uf: "TO", nome: "Tocantins" },
];

const editSchema = z.object({
  telefone: z.string().min(10, "Telefone inválido"),
  whatsapp: z.string().min(10, "WhatsApp inválido"),
  email: z.string().email("E-mail inválido"),
  razaoSocial: z.string().min(3, "Informe a Razão Social"),
  nomeFantasia: z.string().min(2, "Informe o nome fantasia"),
  website: optionalWebsiteField,
  redeSocial: z.string().optional().or(z.literal("")),
  cidade: z.string().min(2, "Informe a cidade"),
  estado: z.string().min(2, "Selecione o estado"),
  tipoInscricao: z.enum(["estadual", "municipal"], { message: "Selecione o tipo" }),
  numeroInscricao: z.string().min(1, "Informe o número de inscrição"),
  tipoEmpresa: z.enum(["mei", "lucro_presumido", "simples_nacional"], {
    message: "Selecione o tipo de empresa",
  }),
  categoriasProdutos: z.array(z.string()).min(1, "Selecione ao menos 1 categoria"),
  descricaoInstitucional: z.string().min(30, "Mínimo de 30 caracteres").max(500),
});

type EditFormData = z.infer<typeof editSchema>;

type Props = {
  perfil: FornecedorPerfil;
  token: string;
  onSuccess: (updated: FornecedorPerfil) => void;
  onProfileUpdated: (updated: FornecedorPerfil) => void;
  onCancel: () => void;
};

export function FornecedorEditForm({
  perfil,
  token,
  onSuccess,
  onProfileUpdated,
  onCancel,
}: Props) {
  const [keptUrls, setKeptUrls] = useState<string[]>(perfil.portfolioUrls ?? []);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [portfolioError, setPortfolioError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<EditFormData>({
    resolver: zodResolver(editSchema),
    defaultValues: {
      telefone: perfil.telefone,
      whatsapp: perfil.whatsapp,
      email: perfil.email,
      razaoSocial: perfil.razaoSocial,
      nomeFantasia: perfil.nomeFantasia,
      website: perfil.website ?? "",
      redeSocial: perfil.redeSocial ?? "",
      cidade: perfil.cidade,
      estado: perfil.estado,
      tipoInscricao: perfil.tipoInscricao as "estadual" | "municipal",
      numeroInscricao: perfil.numeroInscricao,
      tipoEmpresa: perfil.tipoEmpresa as "mei" | "lucro_presumido" | "simples_nacional",
      categoriasProdutos: perfil.categoriasProdutos ?? [],
      descricaoInstitucional: perfil.descricaoInstitucional,
    },
  });

  const onSubmit = async (data: EditFormData) => {
    setSubmitError(null);
    setPortfolioError(null);

    try {
      const updated = await updateFornecedor(
        {
          telefone: data.telefone.replace(/\D/g, ""),
          whatsapp: data.whatsapp.replace(/\D/g, ""),
          email: data.email,
          razaoSocial: data.razaoSocial,
          nomeFantasia: data.nomeFantasia,
          website: data.website || "",
          redeSocial: data.redeSocial || "",
          cidade: data.cidade,
          estado: data.estado,
          tipoInscricao: data.tipoInscricao,
          numeroInscricao: data.numeroInscricao,
          tipoEmpresa: data.tipoEmpresa,
          categoriasProdutos: data.categoriasProdutos,
          descricaoInstitucional: data.descricaoInstitucional,
        },
        token
      );

      const portfolioChanged =
        newFiles.length > 0 ||
        keptUrls.length !== (perfil.portfolioUrls?.length ?? 0) ||
        keptUrls.some((url, i) => url !== perfil.portfolioUrls[i]);

      if (!portfolioChanged) {
        onSuccess(updated);
        return;
      }

      try {
        const portfolioUrls = await syncPortfolio({
          newFiles,
          keptUrls,
          previousUrls: perfil.portfolioUrls ?? [],
          userType: "fornecedor",
          userId: perfil.id,
          token,
        });
        onSuccess({ ...updated, portfolioUrls });
      } catch (err) {
        if (err instanceof PortfolioS3DeleteWarning) {
          onProfileUpdated({ ...updated, portfolioUrls: err.portfolioUrls });
          setPortfolioError(err.message);
          return;
        }
        onProfileUpdated(updated);
        setPortfolioError(PORTFOLIO_EDIT_PARTIAL_ERROR);
      }
    } catch (e) {
      setSubmitError(e instanceof Error ? e.message : "Erro ao salvar perfil");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="rounded-xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-[#0B2443]">
          Dados de Contato
        </h2>
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
            name="email"
            register={register}
            error={errors.email?.message}
          />
          <FormField
            label="Website"
            name="website"
            placeholder={WEBSITE_PLACEHOLDER}
            register={register}
            error={errors.website?.message}
          />
          <FormField
            label="Rede Social (Instagram/LinkedIn/TikTok)"
            name="redeSocial"
            register={register}
            error={errors.redeSocial?.message}
          />
        </div>
      </div>

      <div className="rounded-xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-[#0B2443]">
          Dados Empresariais
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-1">
            <label className="text-sm font-medium">CNPJ</label>
            <p className="rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-500">
              {perfil.cnpj}
            </p>
          </div>
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
          <div className="space-y-1">
            <label className="text-sm font-medium">Estado*</label>
            <select
              {...register("estado")}
              className={`w-full rounded-md border bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4F83A6] ${errors.estado ? "border-red-500" : "border-input"}`}
            >
              <option value="">Selecione o estado</option>
              {ESTADOS_BR.map((e) => (
                <option key={e.uf} value={e.uf}>{e.nome}</option>
              ))}
            </select>
            {errors.estado && <p className="text-xs text-red-500">{errors.estado.message}</p>}
          </div>
          <FormField
            label="Cidade*"
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
              <option value="">Selecione</option>
              <option value="estadual">Estadual</option>
              <option value="municipal">Municipal</option>
            </select>
            {errors.tipoInscricao && (
              <p className="text-xs text-red-500">{errors.tipoInscricao.message}</p>
            )}
          </div>
          <FormField
            label="Número de Inscrição*"
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
              <option value="">Selecione</option>
              <option value="mei">MEI</option>
              <option value="lucro_presumido">Lucro Presumido</option>
              <option value="simples_nacional">Simples Nacional</option>
            </select>
            {errors.tipoEmpresa && (
              <p className="text-xs text-red-500">{errors.tipoEmpresa.message}</p>
            )}
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-[#0B2443]">
          Categorias
        </h2>
        <CategoriasInterestGroup
          perfil="fornecedor"
          title="Selecione suas categorias"
          name="categoriasProdutos"
          control={control}
          error={errors.categoriasProdutos?.message}
        />
      </div>

      <div className="rounded-xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-[#0B2443]">
          Descrição Institucional
        </h2>
        <div className="space-y-1">
          <textarea
            {...register("descricaoInstitucional")}
            rows={4}
            maxLength={500}
            className={`w-full rounded-md border p-3 text-sm ${errors.descricaoInstitucional ? "border-red-500" : "border-input"}`}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span className="text-red-500">{errors.descricaoInstitucional?.message}</span>
            <span>Máx. 500 caracteres</span>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-[#0B2443]">
          Portfólio <span className="font-normal normal-case text-gray-400">(opcional)</span>
        </h2>
        <PortfolioEditor
          keptUrls={keptUrls}
          newFiles={newFiles}
          onRemoveExisting={(url) => setKeptUrls((prev) => prev.filter((u) => u !== url))}
          onNewFilesChange={setNewFiles}
          color="green"
          error={portfolioError ?? undefined}
        />
      </div>

      {submitError && <p className="text-sm text-red-500">{submitError}</p>}

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="rounded-full bg-[#5B86A8] px-8 hover:bg-[#4A748F]"
        >
          {isSubmitting ? "Salvando..." : "Salvar alterações"}
        </Button>
      </div>
    </form>
  );
}
