import { ProfileCard } from "@/components/choose-profile/profile-card"
import { LoginForm } from "@/components/choose-profile/login-form"

export default function ChooseProfilePage() {
    return (
        <main className="flex flex-col items-center">
            <section className="py-16 text-center">
                <h1 className="text-3xl font-bold">Escolha seu Perfil</h1>
                <p className="mt-2 text-muted-foreground">
                    Cada tipo de usuário tem funcionalidades específicas para maximizar
                    seus resultados na plataforma Lead2Pack
                </p>

                <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <ProfileCard type="comprador" />
                    <ProfileCard type="fornecedor" />
                    <ProfileCard type="profissional" />
                </div>
            </section>
            <section className="text-center">
                <h2 className="text-3xl font-semibold">
                    Já é cadastrado? Faça seu login:
                </h2>
            </section>

            <LoginForm />
        </main>
    )
}
