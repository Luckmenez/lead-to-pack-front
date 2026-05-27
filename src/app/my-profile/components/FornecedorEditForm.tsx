"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/FormField";
import { InterestGroup } from "@/app/buyer-registration/buyer-registration-component/InterestGroup";
import { PortfolioEditor } from "./PortfolioEditor";
import { maskPhonePersonal } from "@/utils/masks";
import { uploadFilesToS3 } from "@/lib/api/upload.api";
import { updateFornecedor, type FornecedorPerfil } from "@/lib/api/my-profile.api";
import { updateFornecedorPortfolio } from "@/lib/api/auth.api";

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
  website: z
    .string()
    .refine((v) => !v || /^https?:\/\//.test(v), "Informe uma URL válida (https://...)")
    .optional()
    .or(z.literal("")),
  redeSocial: z.string().optional().or(z.literal("")),
  cidade: z.string().min(2, "Informe a cidade"),
  estado: z.string().min(2, "Selecione o estado"),
  tipoInscricao: z.enum(["estadual", "municipal"], { message: "Selecione o tipo" }),
  numeroInscricao: z.string().min(1, "Informe o número de inscrição"),
  tipoEmpresa: z.enum(["mei", "lucro_presumido", "simples_nacional"], {
    message: "Selecione o tipo de empresa",
  }),
  categoriasProdutos: z.array(z.string()).min(1, "Selecione ao menos 1"),
  materiais: z.array(z.string()).min(1, "Selecione ao menos 1"),
  servicos: z.array(z.string()).min(1, "Selecione ao menos 1"),
  setores: z.array(z.string()).min(1, "Selecione ao menos 1"),
  descricaoInstitucional: z.string().min(30, "Mínimo de 30 caracteres").max(500),
});

type EditFormData = z.infer<typeof editSchema>;

type Props = {
  perfil: FornecedorPerfil;
  token: string;
  onSuccess: (updated: FornecedorPerfil) => void;
  onCancel: () => void;
};

export function FornecedorEditForm({ perfil, token, onSuccess, onCancel }: Props) {
  const [keptUrls, setKeptUrls] = useState<string[]>(perfil.portfolioUrls);
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
      categoriasProdutos: perfil.categoriasProdutos,
      materiais: perfil.materiais,
      servicos: perfil.servicos,
      setores: perfil.setores,
      descricaoInstitucional: perfil.descricaoInstitucional,
    },
  });

  const onSubmit = async (data: EditFormData) => {
    setSubmitError(null);

    if (keptUrls.length + newFiles.length === 0) {
      setPortfolioError("O portfólio deve ter ao menos 1 arquivo");
      return;
    }
    setPortfolioError(null);

    try {
      let uploadedUrls: string[] = [];
      if (newFiles.length > 0) {
        uploadedUrls = await uploadFilesToS3(newFiles, {
          userType: "fornecedor",
          userId: perfil.id,
        });
      }

      const portfolioUrls = [...keptUrls, ...uploadedUrls];

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
          materiais: data.materiais,
          servicos: data.servicos,
          setores: data.setores,
          descricaoInstitucional: data.descricaoInstitucional,
        },
        token
      );

      await updateFornecedorPortfolio(portfolioUrls, token);

      onSuccess({ ...updated, portfolioUrls });
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
          Interesses
        </h2>
        <div className="space-y-5">
          <InterestGroup
            title="Categorias de Produtos"
            name="categoriasProdutos"
            items={["Embalagens Primárias", "Embalagens Secundárias", "Embalagens Terciárias", "Acessórios e Componentes", "Etiquetas e Rótulos", "Embalagens Sustentáveis/Recicladas"]}
            control={control}
            error={errors.categoriasProdutos?.message}
          />
          <InterestGroup
            title="Materiais"
            name="materiais"
            items={["Papel / Papelão", "Plásticos", "Vidro", "Metal e Alumínio", "Madeira / Bambu", "Tecido / Têxtil", "Biopolímeros / Compostáveis", "Multicamadas / Laminados", "Rótulos e Etiquetas", "Outros (Cerâmica, EPS)"]}
            control={control}
            error={errors.materiais?.message}
          />
          <InterestGroup
            title="Serviços"
            name="servicos"
            items={["Design & Desenvolvimento", "Prototipagem e Amostras", "Impressão e Personalização", "Produção Própria", "Private Label", "Fornecimento Sob Demanda (JIT)", "Consultoria em Embalagens", "Logística e Armazenagem", "Reciclagem e Pós-consumo"]}
            control={control}
            error={errors.servicos?.message}
          />
          <InterestGroup
            title="Setores"
            name="setores"
            items={["Alimentos & Bebidas", "Farmacêutico & Hospitalar", "Cosmético & Higiene", "Editorial / Papelaria", "Domissanitários", "Pet", "E-commerce & Logística", "Industrial & Químico", "Moda & Têxtil", "Eletrônicos", "Orgânicos", "Bebidas Alcoólicas", "Outros"]}
            control={control}
            error={errors.setores?.message}
          />
        </div>
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
          Portfólio
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
