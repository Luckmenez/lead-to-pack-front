"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeftIcon, CreditCardIcon } from "@phosphor-icons/react"
import Link from "next/link"
import { ProgressBar } from "@/components/supplier-registration/progressBar"
import { useSearchParams, useRouter } from "next/navigation"
import { paymentConfig, PaymentMethod } from "./payment.config"

export default function SupplierPaymentPage() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const payment = searchParams.get("payment") as PaymentMethod | null
  const selectedPayment = payment ? paymentConfig[payment] : null

  return (
    <main className="w-full">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <ProgressBar step={2} />

        <div className="mb-6 flex justify-end">
          <Link
            href="/supplier-registration"
            className="flex items-center gap-2 rounded-full bg-[#E7EFF5] px-4 py-1.5 text-sm font-medium text-[#4F83A6] hover:bg-[#dbe7f0]"
          >
            <ArrowLeftIcon size={14} weight="bold" />
            Voltar
          </Link>
        </div>

        <section className="mb-10 text-center">
          <h1 className="text-xl font-semibold">
            Finalize seu Cadastro com o Pagamento
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Confirme o plano e finalize sua inscrição.
          </p>
        </section>
      </div>

      <section className="bg-gray-50 py-14">
        <div className="mx-auto max-w-md">
          <div className="rounded-xl border bg-white p-6 shadow-sm space-y-6">
            <div className="space-y-2">
              <h3 className="text-sm font-semibold">Resumo do Plano</h3>

              <div className="flex justify-between text-sm">
                <span>Plano selecionado:</span>
                <span className="font-medium">Profissional</span>
              </div>

              <div className="flex justify-between text-sm">
                <span>Valor mensal:</span>
                <span>R$ 79,00</span>
              </div>

              <div className="flex justify-between text-sm font-semibold">
                <span>Total a pagar:</span>
                <span className="text-[#4F83A6]">R$ 79,00</span>
              </div>
            </div>

            {selectedPayment && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold">Forma de Pagamento</h3>

                <div className="flex items-center gap-3 rounded-lg border border-[#4F83A6] bg-[#F5F9FC] p-3">
                  <CreditCardIcon size={22} className="text-[#4F83A6]" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      {selectedPayment.label}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {selectedPayment.description}
                    </p>
                  </div>
                  <span className="text-[#4F83A6]">✔</span>
                </div>

                <p className="text-xs text-muted-foreground">
                  {payment === "boleto" &&
                    "O boleto será enviado para seu e-mail e ficará disponível para download."}

                  {payment === "pix" &&
                    "O pagamento via PIX será confirmado imediatamente após a transação."}

                  {payment === "cartao" &&
                    "O pagamento com cartão será processado automaticamente."}
                </p>
              </div>
            )}
          </div>

          <div className="mt-8 flex justify-center">
            <Button
              className="rounded-full bg-[#5B86A8] px-10 hover:bg-[#4A748F]"
              onClick={() =>
                router.push(
                  `/supplier-registration/success?payment=${payment}`
                )
              }
            >
              Finalizar cadastro
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}
