"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
  backHref?: string;
  backLabel?: string;
};

export function RoutePageError({
  error,
  reset,
  backHref = "/choose-profile",
  backLabel = "Voltar ao início",
}: Props) {
  return (
    <main className="mx-auto flex min-h-[50vh] max-w-lg flex-col items-center justify-center px-6 py-10 text-center">
      <h1 className="text-lg font-semibold text-[#0B2443]">
        Algo deu errado
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {error.message || "Não foi possível carregar esta página."}
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <Button
          type="button"
          onClick={reset}
          className="rounded-full bg-[#5B86A8] px-6 hover:bg-[#4A748F]"
        >
          Tentar novamente
        </Button>
        <Link
          href={backHref}
          className="rounded-full border border-[#E2E8F0] bg-white px-6 py-2 text-sm font-medium text-[#4F83A6] transition hover:bg-[#E7EFF5]"
        >
          {backLabel}
        </Link>
      </div>
    </main>
  );
}
