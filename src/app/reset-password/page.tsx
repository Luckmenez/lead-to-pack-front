"use client";

import { useState, useEffect, Suspense } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import { LockIcon, EyeIcon, EyeSlashIcon } from "@phosphor-icons/react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { resetPassword } from "@/lib/api/auth.api";

const senhaSchema = z
  .object({
    novaSenha: z
      .string()
      .min(8, "Mínimo 8 caracteres")
      .regex(
        /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,}$/,
        "A senha deve ter ao menos uma letra maiúscula e um caractere especial"
      ),
    confirmarSenha: z.string(),
  })
  .refine((d) => d.novaSenha === d.confirmarSenha, {
    message: "As senhas não coincidem",
    path: ["confirmarSenha"],
  });

type FormData = z.infer<typeof senhaSchema>;

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showNova, setShowNova] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (!token) {
      setError("Link inválido. Solicite um novo link de recuperação.");
    }
  }, [token]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(senhaSchema) });

  const onSubmit = async (data: FormData) => {
    if (!token) return;
    setError(null);
    try {
      await resetPassword(token, data.novaSenha);
      setDone(true);
      setTimeout(() => router.push("/choose-profile"), 3000);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro ao redefinir senha");
    }
  };

  return (
    <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-md">
      <h1 className="mb-2 text-2xl font-bold text-gray-900">
        Criar nova senha
      </h1>

      {done ? (
        <div className="mt-4 space-y-4">
          <p className="text-sm text-green-700">
            Senha redefinida com sucesso! Você será redirecionado para o login
            em instantes...
          </p>
          <Link
            href="/choose-profile"
            className="block text-center text-sm text-blue-600 hover:underline"
          >
            Ir para o login agora
          </Link>
        </div>
      ) : (
        <>
          <p className="mb-6 text-sm text-gray-600">
            Crie uma nova senha para sua conta. Ela deve ter pelo menos 8
            caracteres, uma letra maiúscula e um caractere especial.
          </p>

          {error && !token ? (
            <div className="space-y-4">
              <p className="text-sm text-red-500">{error}</p>
              <Link
                href="/forgot-password"
                className="block text-center text-sm text-blue-600 hover:underline"
              >
                Solicitar novo link
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Nova senha
                </label>
                <div className="relative">
                  <LockIcon
                    size={18}
                    weight="fill"
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNova((p) => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    aria-label={showNova ? "Ocultar senha" : "Mostrar senha"}
                  >
                    {showNova ? (
                      <EyeSlashIcon size={18} />
                    ) : (
                      <EyeIcon size={18} />
                    )}
                  </button>
                  <Input
                    type={showNova ? "text" : "password"}
                    placeholder="Nova senha"
                    className="pl-10 pr-10 border border-gray-300 focus:border-[#5B86A8]"
                    {...register("novaSenha")}
                  />
                </div>
                {errors.novaSenha && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.novaSenha.message}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Confirmar nova senha
                </label>
                <div className="relative">
                  <LockIcon
                    size={18}
                    weight="fill"
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((p) => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    aria-label={
                      showConfirm ? "Ocultar senha" : "Mostrar senha"
                    }
                  >
                    {showConfirm ? (
                      <EyeSlashIcon size={18} />
                    ) : (
                      <EyeIcon size={18} />
                    )}
                  </button>
                  <Input
                    type={showConfirm ? "text" : "password"}
                    placeholder="Confirmar nova senha"
                    className="pl-10 pr-10 border border-gray-300 focus:border-[#5B86A8]"
                    {...register("confirmarSenha")}
                  />
                </div>
                {errors.confirmarSenha && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.confirmarSenha.message}
                  </p>
                )}
              </div>

              {error && <p className="text-sm text-red-500">{error}</p>}

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-full bg-[#5B86A8] font-semibold hover:bg-[#4A748F] disabled:opacity-70"
              >
                {isSubmitting ? "Salvando..." : "Salvar nova senha"}
              </Button>
            </form>
          )}
        </>
      )}
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <Suspense fallback={<div className="w-full max-w-md rounded-xl bg-white p-8 shadow-md" />}>
        <ResetPasswordForm />
      </Suspense>
    </main>
  );
}
