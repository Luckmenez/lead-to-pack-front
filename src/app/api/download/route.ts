import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import {
  canAccessPortfolioFile,
  getAuthenticatedUser,
} from "@/lib/auth/verify-jwt"

const s3 = new S3Client({
  region: process.env.APP_AWS_REGION!,
  credentials: {
    accessKeyId: process.env.APP_AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.APP_AWS_SECRET_ACCESS_KEY!,
  },
  requestChecksumCalculation: "WHEN_REQUIRED",
  responseChecksumValidation: "WHEN_REQUIRED",
})

export async function GET(req: Request) {
  const user = getAuthenticatedUser(req)
  if (!user) {
    return Response.json({ error: "Não autorizado" }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const publicUrl = searchParams.get("url")

  if (!publicUrl) {
    return Response.json({ error: "url é obrigatório" }, { status: 400 })
  }

  const bucket = process.env.APP_AWS_BUCKET_NAME!
  const prefix = `https://${bucket}.s3.${process.env.APP_AWS_REGION}.amazonaws.com/`

  if (!publicUrl.startsWith(prefix)) {
    return Response.json({ error: "URL inválida" }, { status: 400 })
  }

  const key = decodeURIComponent(publicUrl.slice(prefix.length))

  if (!canAccessPortfolioFile(user, key)) {
    return Response.json({ error: "Acesso negado" }, { status: 403 })
  }

  const command = new GetObjectCommand({ Bucket: bucket, Key: key })
  const downloadUrl = await getSignedUrl(s3, command, { expiresIn: 300 })

  return Response.json({ downloadUrl })
}
