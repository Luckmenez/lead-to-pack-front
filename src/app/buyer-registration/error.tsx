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
      backHref="/choose-profile"
      backLabel="Voltar ao início"
    />
  );
}
