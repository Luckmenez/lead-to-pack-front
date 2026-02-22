"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { EyeIcon, EyeSlashIcon, LockIcon, IdentificationCard } from "@phosphor-icons/react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/contexts/AuthContext"
import { login } from "@/lib/api/auth.api"
import {
    LoginCompradorFormData,
    loginCompradorSchema,
} from "@/app/schemas/loginComprador.schema"
import { maskCPF } from "@/utils/masks"

export function LoginForm() {
    const router = useRouter()
    const { loginComprador, loginFornecedor } = useAuth()
    const [showPassword, setShowPassword] = useState(false)
    const [submitError, setSubmitError] = useState<string | null>(null)

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setValue,
    } = useForm<LoginCompradorFormData>({
        resolver: zodResolver(loginCompradorSchema),
        defaultValues: { cpf: "", senha: "" },
    })

    const onSubmit = async (data: LoginCompradorFormData) => {
        setSubmitError(null)
        try {
            const res = await login({ cpf: data.cpf, senha: data.senha })
            if (res.tipo === "comprador" && res.comprador) {
                loginComprador(res.accessToken, res.comprador)
                router.push("/find-suppliers")
            } else if (res.tipo === "fornecedor" && res.fornecedor) {
                loginFornecedor(res.accessToken, res.fornecedor)
                router.push("/")
            }
        } catch (e) {
            setSubmitError(e instanceof Error ? e.message : "Erro ao fazer login")
        }
    }

    return (
        <section className="relative mt-20 w-full overflow-hidden">
            <div className="absolute inset-0">
                <Image
                    src="/login-bg.jfif"
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

            <div className="relative mx-auto max-w-6xl px-6 py-16">
                <div className="ml-auto max-w-xl p-6">
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
                        <div className="grid grid-cols-[240px_240px_300px] items-end gap-4">
                            <div>
                                <Label className="pb-2">CPF</Label>
                                <div className="relative">
                                    <IdentificationCard
                                        size={18}
                                        weight="fill"
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                                    />
                                    <Input
                                        placeholder="000.000.000-00"
                                        className="pl-10 border border-gray-300 bg-white/95 focus:border-[#5B86A8]"
                                        {...register("cpf", {
                                            onChange: (e) =>
                                                setValue(
                                                    "cpf",
                                                    maskCPF(e.target.value),
                                                    {
                                                        shouldValidate: true,
                                                    }
                                                ),
                                        })}
                                    />
                                </div>
                                {errors.cpf && (
                                    <p className="mt-1 text-xs text-red-500">
                                        {errors.cpf.message}
                                    </p>
                                )}
                            </div>

                            <div>
                                <Label className="pb-2">Senha</Label>
                                <div className="relative">
                                    <LockIcon
                                        size={18}
                                        weight="fill"
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword((p) => !p)
                                        }
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                        aria-label={
                                            showPassword
                                                ? "Ocultar senha"
                                                : "Mostrar senha"
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
                                className="h-10 w-66 rounded-full bg-[#5B86A8] font-semibold hover:bg-[#4A748F] cursor-pointer disabled:opacity-70"
                            >
                                {isSubmitting ? "Entrando..." : "Entrar"}
                            </Button>
                        </div>

                        {submitError && (
                            <p className="text-sm text-red-500">
                                {submitError}
                            </p>
                        )}

                        <div className="mt-4 flex justify-end">
                            <div className="w-[300px] text-right">
                                <a href="#" className="cursor-pointer text-sm text-blue-600 hover:underline">
                                    Esqueci a senha
                                </a>

                                <div className="mt-1 text-xs text-muted-foreground">
                                    Política de Privacidade / Coleta de Dados /
                                    LGPD
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    )
}
