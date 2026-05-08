import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"
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

export async function POST(req: Request) {
  const { filename, contentType } = await req.json()

  if (!filename || !contentType) {
    return Response.json({ error: "filename e contentType são obrigatórios" }, { status: 400 })
  }

  const key = `portfolio/${Date.now()}-${filename.replace(/[^a-zA-Z0-9._-]/g, "_")}`

  const command = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: key,
    ContentType: contentType,
  })

  const presignedUrl = await getSignedUrl(s3, command, { expiresIn: 60 })
  const publicUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`

  return Response.json({ presignedUrl, publicUrl })
}
