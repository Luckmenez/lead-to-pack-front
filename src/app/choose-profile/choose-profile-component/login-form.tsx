"use client";

import Image from "next/image";
import loginBg from "../../../../public/login-bg.jpg";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  EyeIcon,
  EyeSlashIcon,
  LockIcon,
  EnvelopeSimple,
} from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import {
  isLoginPrecisaEscolherPerfil,
  login,
  loginSelecionarPerfil,
} from "@/lib/api/auth.api";
import { ChooseProfileLoginModal } from "./choose-profile-login-modal";
import type { ChooseProfileLoginModalState } from "./choose-profile-login-modal";
import {
  LoginCompradorFormData,
  loginCompradorSchema,
} from "@/app/schemas/loginComprador.schema";
export function LoginForm() {
  const router = useRouter();
  const { loginComprador, loginFornecedor, loginProfissional } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [profileChoice, setProfileChoice] =
    useState<ChooseProfileLoginModalState | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginCompradorFormData>({
    resolver: zodResolver(loginCompradorSchema),
    defaultValues: { email: "", senha: "" },
  });

  const onSubmit = async (data: LoginCompradorFormData) => {
    setSubmitError(null);
    try {
      const res = await login({ email: data.email.trim(), senha: data.senha });
      if (isLoginPrecisaEscolherPerfil(res)) {
        setProfileChoice({
          email: data.email.trim(),
          senha: data.senha,
          comprador: res.comprador,
          fornecedor: res.fornecedor,
        });
        return;
      }
      if (res.tipo === "comprador" && res.comprador) {
        loginComprador(res.accessToken, res.comprador);
        router.push("/find-suppliers");
      } else if (res.tipo === "fornecedor" && res.fornecedor) {
        loginFornecedor(res.accessToken, res.fornecedor);
        router.push("/find-buyers");
      } else if (res.tipo === "profissional" && res.profissional) {
        loginProfissional(res.accessToken, res.profissional);
        router.push("/find-buyers");
      }
    } catch (e) {
      setSubmitError(e instanceof Error ? e.message : "Erro ao fazer login");
    }
  };

  const handleProfileChoice = async (perfil: "comprador" | "fornecedor") => {
    if (!profileChoice) return;
    const res = await loginSelecionarPerfil({
      email: profileChoice.email,
      senha: profileChoice.senha,
      perfil,
    });
    setProfileChoice(null);
    if (res.tipo === "comprador" && res.comprador) {
      loginComprador(res.accessToken, res.comprador);
      router.push("/find-suppliers");
    } else if (res.tipo === "fornecedor" && res.fornecedor) {
      loginFornecedor(res.accessToken, res.fornecedor);
      router.push("/find-buyers");
    }
  };

  return (
    <>
      <ChooseProfileLoginModal
        state={profileChoice}
        onClose={() => setProfileChoice(null)}
        onChoose={handleProfileChoice}
      />
    <section className="relative mt-20 w-full overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src={loginBg}
          alt="Embalagens sustentáveis"
          fill
          className="object-cover"
          priority
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.15) 40%, rgba(255,255,255,0.85) 60%, rgba(255,255,255,1) 72%)",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="ml-auto w-full max-w-2xl p-4 sm:max-w-3xl sm:p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 items-center gap-4 sm:grid-cols-[1fr_1fr_auto] sm:gap-3">
              <div className="min-w-0">
                <div className="relative">
                  <EnvelopeSimple
                    size={18}
                    weight="fill"
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  />
                  <Input
                    type="email"
                    autoComplete="email"
                    placeholder="E-mail"
                    aria-label="E-mail"
                    className="pl-10 border border-gray-300 bg-white/95 focus:border-[#5B86A8]"
                    {...register("email")}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="min-w-0">
                <div className="relative">
                  <LockIcon
                    size={18}
                    weight="fill"
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    aria-label={
                      showPassword ? "Ocultar senha" : "Mostrar senha"
                    }
                  >
                    {showPassword ? (
                      <EyeSlashIcon size={18} />
                    ) : (
                      <EyeIcon size={18} />
                    )}
                  </button>
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Senha"
                    aria-label="Senha"
                    className="pl-10 pr-10 border border-gray-300 bg-white/95 focus:border-[#5B86A8]"
                    {...register("senha")}
                  />
                </div>
                {errors.senha && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.senha.message}
                  </p>
                )}
              </div>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-10 min-w-[120px] shrink-0 rounded-full bg-[#5B86A8] font-semibold hover:bg-[#4A748F] cursor-pointer disabled:opacity-70 sm:min-w-[140px]"
              >
                {isSubmitting ? "Entrando..." : "Entrar"}
              </Button>
            </div>

            {submitError && (
              <p className="text-sm text-red-500">{submitError}</p>
            )}

            <div className="mt-4 flex justify-end">
              <div className="w-full max-w-[300px] text-right sm:w-[300px]">
                <a
                  href="#"
                  className="cursor-pointer text-sm text-blue-600 hover:underline"
                >
                  Esqueci a senha
                </a>

                <div className="mt-1 text-xs text-muted-foreground">
                  Política de Privacidade / Coleta de Dados / LGPD
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
    </>
  );
}
