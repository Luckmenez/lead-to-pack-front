import { useEffect, useState } from "react";
import {
  getCategoriasCadastro,
  type CatalogPerfil,
} from "@/lib/api/catalog.api";

export function useCategoriasCadastro(perfil: CatalogPerfil) {
  const [items, setItems] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    getCategoriasCadastro(perfil)
      .then((res) => {
        if (cancelled) return;
        setItems(res.categorias);
      })
      .catch((e) => {
        if (cancelled) return;
        setError(
          e instanceof Error ? e.message : "Erro ao carregar categorias",
        );
        setItems([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [perfil]);

  return { items, loading, error };
}
