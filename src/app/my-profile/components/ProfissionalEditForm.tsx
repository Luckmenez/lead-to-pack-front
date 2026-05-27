"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/FormField";
import { InterestGroup } from "@/app/buyer-registration/buyer-registration-component/InterestGroup";
import { PortfolioEditor } from "./PortfolioEditor";
import { maskPhonePersonal } from "@/utils/masks";
import { uploadFilesToS3 } from "@/lib/api/upload.api";
import { updateProfissional, type ProfissionalPerfil } from "@/lib/api/my-profile.api";
import { updateProfissionalPortfolio } from "@/lib/api/auth.api";

const editSchema = z.object({
  nomeCompleto: z.string().min(3, "Informe seu nome completo"),
  apelido: z.string().min(2, "Informe seu apelido"),
  telefonePessoal: z.string().min(10, "Telefone inválido"),
  whatsappPessoal: z.string().min(10, "WhatsApp inválido"),
  emailPessoal: z.string().email("E-mail inválido"),
  website: z
    .string()
    .refine((v) => !v || /^https?:\/\//.test(v), "Informe uma URL válida (https://...)")
    .optional()
    .or(z.literal("")),
  redeSocial: z.string().optional().or(z.literal("")),
  categoriasProdutos: z.array(z.string()).min(1, "Selecione ao menos 1"),
  materiais: z.array(z.string()).min(1, "Selecione ao menos 1"),
  servicos: z.array(z.string()).min(1, "Selecione ao menos 1"),
  setores: z.array(z.string()).min(1, "Selecione ao menos 1"),
  descricaoInstitucional: z
    .string()
    .min(30, "Mínimo de 30 caracteres")
    .max(300, "Máximo de 300 caracteres"),
});

type EditFormData = z.infer<typeof editSchema>;

type Props = {
  perfil: ProfissionalPerfil;
  token: string;
  onSuccess: (updated: ProfissionalPerfil) => void;
  onCancel: () => void;
};

export function ProfissionalEditForm({ perfil, token, onSuccess, onCancel }: Props) {
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
      nomeCompleto: perfil.nomeCompleto,
      apelido: perfil.apelido,
      telefonePessoal: perfil.telefonePessoal,
      whatsappPessoal: perfil.whatsappPessoal,
      emailPessoal: perfil.emailPessoal,
      website: perfil.website ?? "",
      redeSocial: perfil.redeSocial ?? "",
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
          userType: "profissional",
          userId: perfil.id,
        });
      }

      const portfolioUrls = [...keptUrls, ...uploadedUrls];

      const updated = await updateProfissional(
        {
          nomeCompleto: data.nomeCompleto,
          apelido: data.apelido,
          telefonePessoal: data.telefonePessoal.replace(/\D/g, ""),
          whatsappPessoal: data.whatsappPessoal.replace(/\D/g, ""),
          emailPessoal: data.emailPessoal,
          website: data.website || "",
          redeSocial: data.redeSocial || "",
          categoriasProdutos: data.categoriasProdutos,
          materiais: data.materiais,
          servicos: data.servicos,
          setores: data.setores,
          descricaoInstitucional: data.descricaoInstitucional,
        },
        token
      );

      await updateProfissionalPortfolio(portfolioUrls, token);

      onSuccess({ ...updated, portfolioUrls });
    } catch (e) {
      setSubmitError(e instanceof Error ? e.message : "Erro ao salvar perfil");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="rounded-xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-[#0B2443]">
          Dados Pessoais
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            label="Nome Completo*"
            name="nomeCompleto"
            register={register}
            error={errors.nomeCompleto?.message}
          />
          <FormField
            label="Apelido*"
            name="apelido"
            register={register}
            error={errors.apelido?.message}
          />
          <FormField
            label="Telefone*"
            placeholder="(11) 3333-3333"
            name="telefonePessoal"
            register={register}
            error={errors.telefonePessoal?.message}
            onChangeCustom={maskPhonePersonal}
          />
          <FormField
            label="WhatsApp*"
            placeholder="(11) 99999-9999"
            name="whatsappPessoal"
            register={register}
            error={errors.whatsappPessoal?.message}
            onChangeCustom={maskPhonePersonal}
          />
          <FormField
            label="E-mail*"
            name="emailPessoal"
            register={register}
            error={errors.emailPessoal?.message}
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
          <div className="space-y-1">
            <label className="text-sm font-medium">CPF</label>
            <p className="rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-500">
              {perfil.cpf}
            </p>
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
            maxLength={300}
            className={`w-full rounded-md border p-3 text-sm ${errors.descricaoInstitucional ? "border-red-500" : "border-input"}`}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span className="text-red-500">{errors.descricaoInstitucional?.message}</span>
            <span>Máx. 300 caracteres</span>
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
          color="blue"
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
