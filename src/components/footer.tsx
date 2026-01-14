"use client"

import Image from "next/image"
import {
    LinkedinLogoIcon,
    InstagramLogoIcon,
    FacebookLogoIcon,
    XLogoIcon,
} from "@phosphor-icons/react"

export function Footer() {
    return (
        <footer className="relative w-full bg-[#0B2443] text-white">
            <div className="mx-auto flex max-w-6xl flex-col items-end px-8 py-12">
                <span className="mb-4 text-sm tracking-widest">
                    SIGA-NOS
                </span>

                <div className="mb-6 flex gap-3">
                    <SocialIcon>
                        <LinkedinLogoIcon size={18} weight="bold" />
                    </SocialIcon>
                    <SocialIcon>
                        <XLogoIcon size={18} weight="bold" />
                    </SocialIcon>
                    <SocialIcon>
                        <InstagramLogoIcon size={18} weight="bold" />
                    </SocialIcon>
                    <SocialIcon>
                        <FacebookLogoIcon size={18} weight="bold" />
                    </SocialIcon>
                </div>

                <div className="relative h-10 w-44">
                    <Image
                        src="/logo_Lead2Pack.svg"
                        alt="Lead2Pack"
                        fill
                    />
                </div>
            </div>

            <div className="mx-auto max-w-6xl border-t border-white/30" />

            <div className="mx-auto flex max-w-6xl px-8 py-4 text-sm text-blue-200">
                © 2025 Todos os direitos reservados | Lead2Pack 2025
            </div>

            <a
                href="#"
                aria-label="WhatsApp"
                className="absolute bottom-6 right-6 z-50 flex items-center justify-center rounded-full bg-[#25D366] shadow-lg hover:scale-105 hover:opacity-95 transition"
            >
                <Image
                    src="/whatsapp-svgrepo-com.svg"
                    alt="WhatsApp"
                    width={42}
                    height={42}
                />
            </a>

        </footer>
    )
}

function SocialIcon({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-white text-[#0B2443] hover:opacity-80 transition">
            {children}
        </div>
    )
}
