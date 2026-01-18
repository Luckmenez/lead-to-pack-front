"use client"

import { Button } from "@/components/ui/button"
import { ProgressBar } from "@/app/supplier-registration/supplier-registration-component/progressBar"
import { useSearchParams, useRouter } from "next/navigation"
import { paymentConfig, PaymentMethod } from "../payment/payment.config"
import { ArrowLeftIcon, CubeIcon } from "@phosphor-icons/react"
import Link from "next/link"

export default function SupplierSuccessPage() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const payment = searchParams.get("payment") as PaymentMethod | null
  const selectedPayment = payment ? paymentConfig[payment] : null

  return (
    <main>
      <div className="mx-auto max-w-6xl px-6 py-10">
        <ProgressBar step={3} />

        <div className="mb-6 flex justify-end">
          <Link
            href="/choose-profile"
            className="flex items-center gap-2 rounded-full bg-[#E7EFF5] px-4 py-1.5 text-sm font-medium text-[#4F83A6] hover:bg-[#dbe7f0]"
          >
            <ArrowLeftIcon size={14} weight="bold" />
            Voltar
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EEF6DB]">
            <CubeIcon size={20} weight="bold" color="#9CCB3B" />
          </span>

          <div>
            <h1 className="text-xl font-semibold">Cadastro Fornecedor</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Preencha os dados da sua empresa para começar a buscar fornecedores.
            </p>
          </div>
        </div>
      </div>

      <section className="bg-[#F7F8FA] py-14">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <h2 className="text-xl font-semibold">
            Cadastro Concluído com Sucesso!
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Seu cadastro será ativado após a confirmação do pagamento e aprovação do administrador.
          </p>

          <div className="mx-auto mt-8 max-w-md rounded-xl border bg-white p-6 shadow-sm text-left space-y-6">
            <div>
              <h3 className="text-sm font-semibold">Status do Cadastro</h3>
              <span className="mt-2 inline-block rounded-full bg-yellow-100 px-3 py-1 text-xs text-yellow-700">
                Aguardando confirmação de pagamento
              </span>
            </div>

            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Plano selecionado:</span>
                <span className="font-medium">Profissional</span>
              </div>

              <div className="flex justify-between">
                <span>Forma de pagamento:</span>
                <span className="font-medium">
                  {selectedPayment?.label}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Valor:</span>
                <span className="font-medium">R$ 79,00/mês</span>
              </div>
            </div>

            {payment === "boleto" && (
              <div className="rounded-lg bg-gray-50 p-4 text-sm space-y-2">
                <p className="font-medium">O que acontece agora?</p>
                <ol className="list-decimal pl-4 text-muted-foreground space-y-1">
                  <li>Realize o pagamento do boleto até a data de vencimento</li>
                  <li>Aguarde a compensação bancária (até 3 dias úteis)</li>
                  <li>Nossa equipe analisará seu cadastro</li>
                  <li>Você receberá um e-mail com a confirmação da ativação</li>
                </ol>
              </div>
            )}
          </div>

          <div className="mt-8 flex justify-center gap-3">
            {payment === "boleto" && (
              <Button variant="outline">
                Baixar boleto novamente
              </Button>
            )}

            <Button
              className="bg-[#5B86A8] hover:bg-[#4A748F]"
              onClick={() => router.push("/")}
            >
              Continuar
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}
