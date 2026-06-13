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
import { updateProfissional, type ProfissionalPerfil } from "@/lib/api/my-profile.api";
import { updateProfissionalPortfolio } from "@/lib/api/auth.api";
import { uploadFilesToS3 } from "@/lib/api/upload.api";
import { PROFISSIONAL_CATEGORIAS } from "@/lib/catalog/categoriasCadastro";

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
  categoriasProdutos: z.array(z.string()).min(1, "Selecione ao menos 1 categoria"),
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
      nomeCompleto: perfil.nomeCompleto,
      apelido: perfil.apelido,
      telefonePessoal: perfil.telefonePessoal,
      whatsappPessoal: perfil.whatsappPessoal,
      emailPessoal: perfil.emailPessoal,
      website: perfil.website ?? "",
      redeSocial: perfil.redeSocial ?? "",
      categoriasProdutos: perfil.categoriasProdutos ?? [],
      descricaoInstitucional: perfil.descricaoInstitucional,
    },
  });

  const onSubmit = async (data: EditFormData) => {
    setSubmitError(null);
    setPortfolioError(null);

    try {
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
          descricaoInstitucional: data.descricaoInstitucional,
        },
        token
      );

      let portfolioUrls = updated.portfolioUrls;

      const portfolioChanged =
        newFiles.length > 0 ||
        keptUrls.length !== (perfil.portfolioUrls?.length ?? 0) ||
        keptUrls.some((url, i) => url !== perfil.portfolioUrls[i]);

      if (portfolioChanged) {
        let finalUrls = [...keptUrls];
        if (newFiles.length > 0) {
          const newUrls = await uploadFilesToS3(newFiles, {
            userType: "profissional",
            userId: perfil.id,
          });
          finalUrls = [...keptUrls, ...newUrls];
        }
        portfolioUrls = finalUrls;
        await updateProfissionalPortfolio(portfolioUrls, token);
      }

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
          Categorias
        </h2>
        <InterestGroup
          title="Selecione suas categorias"
          name="categoriasProdutos"
          items={[...PROFISSIONAL_CATEGORIAS]}
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
          Portfólio <span className="font-normal normal-case text-gray-400">(opcional)</span>
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
