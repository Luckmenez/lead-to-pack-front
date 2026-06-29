"use client"

import { useState, type ReactNode } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { triggerSessionExpired } from "@/lib/auth/session-handler"
import { SessionExpiredError } from "@/lib/api/errors"

type PortfolioDownloadLinkProps = {
  url: string
  className?: string
  children: ReactNode
}

export function PortfolioDownloadLink({
  url,
  className,
  children,
}: PortfolioDownloadLinkProps) {
  const { token } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleClick(e: React.MouseEvent) {
    e.preventDefault()
    if (!token) return

    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/download?url=${encodeURIComponent(url)}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!res.ok) {
        if (res.status === 401) {
          triggerSessionExpired()
          throw new SessionExpiredError()
        }
        const body = (await res.json().catch(() => ({}))) as { error?: string }
        throw new Error(body.error ?? "Erro ao abrir arquivo")
      }

      const { downloadUrl } = (await res.json()) as { downloadUrl: string }
      window.open(downloadUrl, "_blank", "noopener,noreferrer")
    } catch (err) {
      if (!(err instanceof SessionExpiredError)) {
        setError(err instanceof Error ? err.message : "Erro ao abrir arquivo")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button
      type="button"
      onClick={handleClick}
      disabled={loading || !token}
      className={className}
    >
      {children}
    </button>
    {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </>
  )
}
