import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3"
import {
  canDeletePortfolioFile,
  getAuthenticatedUser,
  parsePortfolioKeyFromPublicUrl,
} from "@/lib/auth/verify-jwt"

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
  requestChecksumCalculation: "WHEN_REQUIRED",
  responseChecksumValidation: "WHEN_REQUIRED",
})

export async function POST(req: Request) {
  const user = getAuthenticatedUser(req)
  if (!user) {
    return Response.json({ error: "Não autorizado" }, { status: 401 })
  }

  if (user.tipo !== "fornecedor" && user.tipo !== "profissional") {
    return Response.json({ error: "Acesso negado" }, { status: 403 })
  }

  const { url } = await req.json()
  if (!url || typeof url !== "string") {
    return Response.json({ error: "url é obrigatório" }, { status: 400 })
  }

  const key = parsePortfolioKeyFromPublicUrl(url)
  if (!key) {
    return Response.json({ error: "URL inválida" }, { status: 400 })
  }

  if (!canDeletePortfolioFile(user, key)) {
    return Response.json({ error: "Acesso negado" }, { status: 403 })
  }

  await s3.send(
    new DeleteObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: key,
    }),
  )

  return Response.json({ ok: true })
}
