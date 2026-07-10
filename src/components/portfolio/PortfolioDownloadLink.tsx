"use client"

import { useState, type ReactNode } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { apiClient } from "@/lib/api/client"
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
      const { downloadUrl } = await apiClient<{ downloadUrl: string }>(
        `/portfolio/download-url?url=${encodeURIComponent(url)}`,
        { token },
      )
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
