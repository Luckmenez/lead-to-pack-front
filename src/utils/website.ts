import { z } from "zod";

export const WEBSITE_PLACEHOLDER = "www.suaempresa.com.br";

/** Adiciona https:// quando o usuário digita só o domínio. Vazio permanece vazio. */
export function normalizeWebsite(value: string | null | undefined): string {
  const trimmed = (value ?? "").trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

export function isValidWebsite(value: string): boolean {
  if (!value) return true;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export const optionalWebsiteField = z
  .string()
  .transform(normalizeWebsite)
  .refine(isValidWebsite, "Informe uma URL válida");
