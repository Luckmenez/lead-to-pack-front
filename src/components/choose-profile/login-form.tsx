"use client"

import Image from "next/image"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { EyeIcon, LockIcon, UserIcon } from "@phosphor-icons/react"

export function LoginForm() {
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
                    <div className="grid grid-cols-[240px_240px_300px] items-end gap-4">

                        <div>
                            <Label className="pb-2">Login</Label>
                            <div className="relative">
                                <UserIcon
                                    size={18}
                                    weight="fill"
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                                />
                                <Input
                                    placeholder="Login"
                                    className="pl-10 border border-gray-300 bg-white/95 focus:border-[#5B86A8]"
                                />
                            </div>
                        </div>

                        <div>
                            <Label className="pb-2">Senha</Label>
                            <div className="relative">
                                <LockIcon
                                    size={18}
                                    weight="fill"
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                                />

                                <EyeIcon
                                    size={18}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-muted-foreground"
                                />

                                <Input
                                    type="password"
                                    placeholder="Senha"
                                    className="pl-10 pr-10 border border-gray-300 bg-white/95 focus:border-[#5B86A8]"
                                />
                            </div>
                        </div>
                        <Button className="h-10 w-66 rounded-full bg-[#5B86A8] font-semibold hover:bg-[#4A748F]">
                            Entrar
                        </Button>
                    </div>

                    <div className="mt-4 flex justify-end">
                        <div className="w-[300px] text-right">
                            <a className="text-sm text-blue-600 hover:underline">
                                Esqueci a senha
                            </a>

                            <div className="mt-1 text-xs text-muted-foreground">
                                Política de Privacidade / Coleta de Dados / LGPD
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
