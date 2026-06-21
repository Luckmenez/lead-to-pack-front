import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"

const s3 = new S3Client({
  region: process.env.APP_AWS_REGION!,
  credentials: {
    accessKeyId: process.env.APP_AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.APP_AWS_SECRET_ACCESS_KEY!,
  },
  requestChecksumCalculation: "WHEN_REQUIRED",
  responseChecksumValidation: "WHEN_REQUIRED",
})

export async function POST(req: Request) {
  const { filename, contentType, userType, userId } = await req.json()

  if (!filename || !contentType || !userType || !userId) {
    return Response.json({ error: "filename, contentType, userType e userId são obrigatórios" }, { status: 400 })
  }

  const safeName = filename.replace(/[^a-zA-Z0-9._-]/g, "_")
  const key = `portfolio/${userType}/${userId}/${Date.now()}-${safeName}`

  const command = new PutObjectCommand({
    Bucket: process.env.APP_AWS_BUCKET_NAME!,
    Key: key,
    ContentType: contentType,
  })

  const presignedUrl = await getSignedUrl(s3, command, { expiresIn: 60 })
  const publicUrl = `https://${process.env.APP_AWS_BUCKET_NAME}.s3.${process.env.APP_AWS_REGION}.amazonaws.com/${key}`

  return Response.json({ presignedUrl, publicUrl })
}
