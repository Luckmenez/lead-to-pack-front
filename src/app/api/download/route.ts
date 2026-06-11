import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
  requestChecksumCalculation: "WHEN_REQUIRED",
  responseChecksumValidation: "WHEN_REQUIRED",
})

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const publicUrl = searchParams.get("url")

  if (!publicUrl) {
    return Response.json({ error: "url é obrigatório" }, { status: 400 })
  }

  // Extrai a key do S3 a partir da URL pública
  // Formato: https://{bucket}.s3.{region}.amazonaws.com/{key}
  const bucket = process.env.AWS_BUCKET_NAME!
  const prefix = `https://${bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/`

  if (!publicUrl.startsWith(prefix)) {
    return Response.json({ error: "URL inválida" }, { status: 400 })
  }

  const key = decodeURIComponent(publicUrl.slice(prefix.length))

  const command = new GetObjectCommand({ Bucket: bucket, Key: key })
  const presignedUrl = await getSignedUrl(s3, command, { expiresIn: 300 })

  return Response.redirect(presignedUrl)
}
