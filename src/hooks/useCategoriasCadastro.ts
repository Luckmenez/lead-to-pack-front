import { useEffect, useState } from "react";
import {
  getCategoriasCadastro,
  type CatalogPerfil,
} from "@/lib/api/catalog.api";

const cache: Partial<Record<CatalogPerfil, string[]>> = {};

export function useCategoriasCadastro(perfil: CatalogPerfil) {
  const [items, setItems] = useState<string[]>(cache[perfil] ?? []);
  const [loading, setLoading] = useState(!cache[perfil]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (cache[perfil]) {
      setItems(cache[perfil]!);
      setLoading(false);
      setError(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    getCategoriasCadastro(perfil)
      .then((res) => {
        if (cancelled) return;
        cache[perfil] = res.categorias;
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
