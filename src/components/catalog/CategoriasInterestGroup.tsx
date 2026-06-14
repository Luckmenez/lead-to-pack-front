"use client";

import { Control } from "react-hook-form";
import { InterestGroup } from "@/app/buyer-registration/buyer-registration-component/InterestGroup";
import { useCategoriasCadastro } from "@/hooks/useCategoriasCadastro";
import type { CatalogPerfil } from "@/lib/api/catalog.api";

type Props = {
  perfil: CatalogPerfil;
  title: string;
  name: string;
  control: Control<any>;
  error?: string;
};

export function CategoriasInterestGroup({
  perfil,
  title,
  name,
  control,
  error,
}: Props) {
  const { items, loading, error: loadError } = useCategoriasCadastro(perfil);

  if (loading) {
    return (
      <p className="text-sm text-muted-foreground">Carregando categorias...</p>
    );
  }

  if (loadError) {
    return <p className="text-sm text-red-500">{loadError}</p>;
  }

  return (
    <InterestGroup
      title={title}
      name={name}
      items={items}
      control={control}
      error={error}
    />
  );
}
