import {
  updateFornecedorPortfolio,
  updateProfissionalPortfolio,
} from "@/lib/api/auth.api"
import { deleteS3Files, uploadFilesToS3 } from "@/lib/api/upload.api"

export const PORTFOLIO_EDIT_PARTIAL_ERROR =
  "Dados do perfil salvos, mas o portfólio não foi atualizado. Tente enviar os arquivos novamente."

type PortfolioUserType = "fornecedor" | "profissional"

type SyncPortfolioOptions = {
  newFiles: File[]
  keptUrls: string[]
  userType: PortfolioUserType
  userId: string
  token: string
}

const PATCH_RETRIES = 3
const PATCH_RETRY_DELAY_MS = 600

async function withRetry<T>(fn: () => Promise<T>): Promise<T> {
  let lastError: unknown
  for (let attempt = 0; attempt < PATCH_RETRIES; attempt++) {
    try {
      return await fn()
    } catch (err) {
      lastError = err
      if (attempt < PATCH_RETRIES - 1) {
        await new Promise((r) => setTimeout(r, PATCH_RETRY_DELAY_MS * (attempt + 1)))
      }
    }
  }
  throw lastError
}

async function patchPortfolio(
  userType: PortfolioUserType,
  urls: string[],
  token: string,
): Promise<void> {
  if (userType === "fornecedor") {
    await updateFornecedorPortfolio(urls, token)
  } else {
    await updateProfissionalPortfolio(urls, token)
  }
}

export async function syncPortfolio({
  newFiles,
  keptUrls,
  userType,
  userId,
  token,
}: SyncPortfolioOptions): Promise<string[]> {
  if (newFiles.length === 0) {
    await withRetry(() => patchPortfolio(userType, keptUrls, token))
    return keptUrls
  }

  const ctx = { userType, userId, token }
  const newUrls = await uploadFilesToS3(newFiles, ctx)
  const finalUrls = [...keptUrls, ...newUrls]

  try {
    await withRetry(() => patchPortfolio(userType, finalUrls, token))
    return finalUrls
  } catch (err) {
    await deleteS3Files(newUrls, token)
    throw new Error(
      "Não foi possível salvar o portfólio. Os arquivos enviados foram descartados. Tente novamente.",
      { cause: err },
    )
  }
}

export async function saveNewPortfolio(
  files: File[],
  userType: PortfolioUserType,
  userId: string,
  token: string,
): Promise<string[]> {
  return syncPortfolio({
    newFiles: files,
    keptUrls: [],
    userType,
    userId,
    token,
  })
}
