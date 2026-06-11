"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { EnvelopeSimple } from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { forgotPassword } from "@/lib/api/auth.api";

const schema = z.object({
  email: z.string().email("Informe um e-mail válido"),
});

type FormData = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setError(null);
    try {
      await forgotPassword(data.email.trim());
      setSent(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro ao enviar e-mail");
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-md">
        <h1 className="mb-2 text-2xl font-bold text-gray-900">
          Recuperar senha
        </h1>

        {sent ? (
          <div className="mt-4 space-y-4">
            <p className="text-sm text-gray-600">
              Se este e-mail estiver cadastrado, você receberá um link para
              redefinir sua senha em breve. Verifique também sua caixa de spam.
            </p>
            <Link
              href="/choose-profile"
              className="block text-center text-sm text-blue-600 hover:underline"
            >
              Voltar para o login
            </Link>
          </div>
        ) : (
          <>
            <p className="mb-6 text-sm text-gray-600">
              Informe o e-mail cadastrado e enviaremos um link para você criar
              uma nova senha.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <div className="relative">
                  <EnvelopeSimple
                    size={18}
                    weight="fill"
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  />
                  <Input
                    type="email"
                    placeholder="Seu e-mail"
                    className="pl-10 border border-gray-300 focus:border-[#5B86A8]"
                    {...register("email")}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {error && <p className="text-sm text-red-500">{error}</p>}

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-full bg-[#5B86A8] font-semibold hover:bg-[#4A748F] disabled:opacity-70"
              >
                {isSubmitting ? "Enviando..." : "Enviar link de recuperação"}
              </Button>
            </form>

            <div className="mt-4 text-center">
              <Link
                href="/choose-profile"
                className="text-sm text-blue-600 hover:underline"
              >
                Voltar para o login
              </Link>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
