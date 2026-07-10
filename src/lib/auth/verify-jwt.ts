import { createHmac, timingSafeEqual } from "node:crypto"

export type JwtPayload = {
  sub: string
  email: string
  tipo: "comprador" | "fornecedor" | "profissional"
  exp?: number
  iat?: number
}

function getJwtSecret(): string {
  return process.env.JWT_SECRET ?? "lead2pack-dev-secret-change-in-production"
}

export function getBearerToken(req: Request): string | null {
  const auth = req.headers.get("authorization")
  if (!auth?.startsWith("Bearer ")) return null
  return auth.slice(7).trim() || null
}

export function verifyJwt(token: string): JwtPayload | null {
  const parts = token.split(".")
  if (parts.length !== 3) return null

  const [headerB64, payloadB64, signatureB64] = parts
  const expectedSig = createHmac("sha256", getJwtSecret())
    .update(`${headerB64}.${payloadB64}`)
    .digest("base64url")

  const sigBuf = Buffer.from(signatureB64)
  const expectedBuf = Buffer.from(expectedSig)

  if (
    sigBuf.length !== expectedBuf.length ||
    !timingSafeEqual(sigBuf, expectedBuf)
  ) {
    return null
  }

  let payload: JwtPayload
  try {
    const json = Buffer.from(payloadB64, "base64url").toString("utf8")
    payload = JSON.parse(json) as JwtPayload
  } catch {
    return null
  }

  if (payload.exp && payload.exp * 1000 < Date.now()) return null
  if (!payload.sub || !payload.tipo) return null

  return payload
}

export function getAuthenticatedUser(req: Request): JwtPayload | null {
  const token = getBearerToken(req)
  if (!token) return null
  return verifyJwt(token)
}

export function canAccessPortfolioFile(user: JwtPayload, key: string): boolean {
  const match = key.match(/^portfolio\/(fornecedor|profissional)\/([^/]+)\//)
  if (!match) return false

  if (user.tipo === "comprador") return true

  const [, userType, userId] = match
  return user.tipo === userType && user.sub === userId
}

export function canDeletePortfolioFile(user: JwtPayload, key: string): boolean {
  const match = key.match(/^portfolio\/(fornecedor|profissional)\/([^/]+)\//)
  if (!match) return false

  const [, userType, userId] = match
  return user.tipo === userType && user.sub === userId
}

export function parsePortfolioKeyFromPublicUrl(publicUrl: string): string | null {
  const bucket = process.env.APP_AWS_BUCKET_NAME
  const region = process.env.APP_AWS_REGION
  if (!bucket || !region) return null

  const prefix = `https://${bucket}.s3.${region}.amazonaws.com/`
  if (!publicUrl.startsWith(prefix)) return null

  return decodeURIComponent(publicUrl.slice(prefix.length))
}
