import { apiClient } from "@/lib/api/client"

type UploadContext = {
  userType: "fornecedor" | "profissional"
  userId: string
  token: string
}

async function getPresignedUrl(
  filename: string,
  contentType: string,
  ctx: UploadContext,
) {
  return apiClient<{ presignedUrl: string; publicUrl: string }>(
    "/portfolio/upload-url",
    {
      method: "POST",
      token: ctx.token,
      body: JSON.stringify({
        filename,
        contentType,
        userType: ctx.userType,
        userId: ctx.userId,
      }),
    },
  )
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
  await apiClient("/portfolio/delete", {
    method: "POST",
    token,
    body: JSON.stringify({ url }),
  })
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
