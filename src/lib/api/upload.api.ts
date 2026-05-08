type UploadContext = {
  userType: "fornecedor" | "profissional"
  userId: string
}

async function getPresignedUrl(filename: string, contentType: string, ctx: UploadContext) {
  const res = await fetch("/api/upload", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ filename, contentType, userType: ctx.userType, userId: ctx.userId }),
  })

  if (!res.ok) throw new Error("Erro ao gerar URL de upload")

  return res.json() as Promise<{ presignedUrl: string; publicUrl: string }>
}

export async function uploadFileToS3(file: File, ctx: UploadContext): Promise<string> {
  const { presignedUrl, publicUrl } = await getPresignedUrl(file.name, file.type, ctx)

  const uploadRes = await fetch(presignedUrl, {
    method: "PUT",
    body: file,
    headers: { "Content-Type": file.type },
  })

  if (!uploadRes.ok) throw new Error(`Erro ao enviar arquivo: ${file.name}`)

  return publicUrl
}

export async function uploadFilesToS3(files: File[], ctx: UploadContext): Promise<string[]> {
  return Promise.all(files.map(file => uploadFileToS3(file, ctx)))
}
