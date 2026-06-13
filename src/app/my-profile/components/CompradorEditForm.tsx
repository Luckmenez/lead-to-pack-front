"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/FormField";
import { maskPhonePersonal } from "@/utils/masks";
import {
  updateComprador,
  type CompradorPerfil,
} from "@/lib/api/my-profile.api";

const editSchema = z.object({
  nomeCompleto: z.string().min(3, "Informe o nome completo"),
  email: z.string().email("E-mail inválido"),
  telefone: z.string().min(10, "Telefone inválido"),
  whatsapp: z.string().min(10, "WhatsApp inválido"),
  razaoSocial: z.string().min(3, "Informe a Razão Social"),
  nomeFantasia: z.string().optional().or(z.literal("")),
  website: z
    .string()
    .refine((v) => !v || /^https?:\/\//.test(v), "Informe uma URL válida (https://...)")
    .optional()
    .or(z.literal("")),
  redeSocial: z.string().optional().or(z.literal("")),
});

type EditFormData = z.infer<typeof editSchema>;

type Props = {
  perfil: CompradorPerfil;
  token: string;
  onSuccess: (updated: CompradorPerfil) => void;
  onCancel: () => void;
};

export function CompradorEditForm({ perfil, token, onSuccess, onCancel }: Props) {
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EditFormData>({
    resolver: zodResolver(editSchema),
    defaultValues: {
      nomeCompleto: perfil.nomeCompleto,
      email: perfil.email,
      telefone: perfil.telefonePessoal,
      whatsapp: perfil.whatsappPessoal,
      razaoSocial: perfil.razaoSocial,
      nomeFantasia: perfil.nomeFantasia ?? "",
      website: perfil.website ?? "",
      redeSocial: perfil.redeSocial ?? "",
    },
  });

  const onSubmit = async (data: EditFormData) => {
    setSubmitError(null);
    try {
      const telefoneDigits = data.telefone.replace(/\D/g, "");
      const whatsappDigits = data.whatsapp.replace(/\D/g, "");

      const updated = await updateComprador(
        {
          nomeCompleto: data.nomeCompleto,
          email: data.email,
          telefonePessoal: telefoneDigits,
          whatsappPessoal: whatsappDigits,
          telefoneComercial: telefoneDigits,
          whatsappComercial: whatsappDigits,
          razaoSocial: data.razaoSocial,
          nomeFantasia: data.nomeFantasia || null,
          website: data.website || "",
          redeSocial: data.redeSocial || "",
        },
        token,
      );

      onSuccess(updated);
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
            label="E-mail*"
            name="email"
            register={register}
            error={errors.email?.message}
          />
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
              {perfil.cnpj || "—"}
            </p>
          </div>
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
        </div>
      </div>

      {submitError && <p className="text-sm text-red-500">{submitError}</p>}

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="rounded-full bg-[#0B2443] px-8 hover:bg-[#0a1e38]"
        >
          {isSubmitting ? "Salvando..." : "Salvar alterações"}
        </Button>
      </div>
    </form>
  );
}
