import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { getAuthenticatedUser } from "@/lib/auth/verify-jwt"

const s3 = new S3Client({
  region: process.env.APP_AWS_REGION!,
  credentials: {
    accessKeyId: process.env.APP_AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.APP_AWS_SECRET_ACCESS_KEY!,
  },
  requestChecksumCalculation: "WHEN_REQUIRED",
  responseChecksumValidation: "WHEN_REQUIRED",
})

const ALLOWED_USER_TYPES = new Set(["fornecedor", "profissional"])

export async function POST(req: Request) {
  const user = getAuthenticatedUser(req)
  if (!user) {
    // DEBUG TEMPORÁRIO — remover depois de diagnosticar o 401
    const authHeader = req.headers.get("authorization")
    return Response.json(
      {
        error: "Não autorizado",
        debugHasAuthHeader: authHeader !== null,
        debugAuthHeaderPreview: authHeader?.slice(0, 15) ?? null,
        debugHasJwtSecretEnv: Boolean(process.env.JWT_SECRET),
        debugHasAppAwsBucketEnv: Boolean(process.env.APP_AWS_BUCKET_NAME),
        debugHasNextPublicApiUrlEnv: Boolean(process.env.NEXT_PUBLIC_API_URL),
        debugEnvKeysSample: Object.keys(process.env).filter(
          (k) => k.includes("AWS") || k.includes("JWT") || k.includes("NEXT_PUBLIC"),
        ),
      },
      { status: 401 },
    )
  }

  const { filename, contentType, userType, userId } = await req.json()

  if (!filename || !contentType || !userType || !userId) {
    return Response.json(
      { error: "filename, contentType, userType e userId são obrigatórios" },
      { status: 400 },
    )
  }

  if (!ALLOWED_USER_TYPES.has(userType)) {
    return Response.json({ error: "Tipo de usuário inválido" }, { status: 400 })
  }

  if (user.tipo !== userType || user.sub !== userId) {
    return Response.json({ error: "Acesso negado" }, { status: 403 })
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
