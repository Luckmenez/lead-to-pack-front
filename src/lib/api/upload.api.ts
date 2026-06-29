import { triggerSessionExpired } from "@/lib/auth/session-handler"
import { SessionExpiredError } from "@/lib/api/errors"

type UploadContext = {
  userType: "fornecedor" | "profissional"
  userId: string
  token: string
}

function handleUnauthorized(status: number, hadToken: boolean): void {
  if (status === 401 && hadToken) {
    triggerSessionExpired()
    throw new SessionExpiredError()
  }
}

async function getPresignedUrl(
  filename: string,
  contentType: string,
  ctx: UploadContext,
) {
  const res = await fetch("/api/upload", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${ctx.token}`,
    },
    body: JSON.stringify({
      filename,
      contentType,
      userType: ctx.userType,
      userId: ctx.userId,
    }),
  })

  if (!res.ok) {
    handleUnauthorized(res.status, Boolean(ctx.token))
    const body = (await res.json().catch(() => ({}))) as { error?: string }
    throw new Error(body.error ?? "Erro ao gerar URL de upload")
  }

  return res.json() as Promise<{ presignedUrl: string; publicUrl: string }>
}

export async function uploadFileToS3(
  file: File,
  ctx: UploadContext,
): Promise<string> {
  const { presignedUrl, publicUrl } = await getPresignedUrl(
    file.name,
    file.type,
    ctx,
  )

  const uploadRes = await fetch(presignedUrl, {
    method: "PUT",
    body: file,
    headers: { "Content-Type": file.type },
  })

  if (!uploadRes.ok) throw new Error(`Erro ao enviar arquivo: ${file.name}`)

  return publicUrl
}

export async function uploadFilesToS3(
  files: File[],
  ctx: UploadContext,
): Promise<string[]> {
  return Promise.all(files.map((file) => uploadFileToS3(file, ctx)))
}

export async function deleteS3File(url: string, token: string): Promise<void> {
  const res = await fetch("/api/delete", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ url }),
  })

  if (!res.ok) {
    handleUnauthorized(res.status, Boolean(token))
    const body = (await res.json().catch(() => ({}))) as { error?: string }
    throw new Error(body.error ?? "Erro ao remover arquivo")
  }
}

export async function deleteS3Files(urls: string[], token: string): Promise<void> {
  const results = await Promise.allSettled(
    urls.map((url) => deleteS3File(url, token)),
  )
  const failed = results.filter((r) => r.status === "rejected")
  if (failed.length > 0) {
    throw new Error("Erro ao remover arquivo do armazenamento")
  }
}
