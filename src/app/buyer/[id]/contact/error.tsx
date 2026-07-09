"use client";

import { RoutePageError } from "@/components/route/RoutePageError";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <RoutePageError
      error={error}
      reset={reset}
      backHref="/my-profile"
      backLabel="Voltar ao meu perfil"
    />
  );
}
