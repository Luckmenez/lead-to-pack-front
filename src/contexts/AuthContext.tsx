"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"
import type {
  CompradorUser,
  FornecedorUser,
  ProfissionalUser,
} from "@/lib/api/auth.api"

const TOKEN_KEY = "lead2pack_token"
const USER_KEY = "lead2pack_user"
const TIPO_KEY = "lead2pack_tipo"

export type PersonaTipo = "comprador" | "fornecedor" | "profissional"

export type AuthUser =
  | (CompradorUser & { tipo: "comprador" })
  | (FornecedorUser & { tipo: "fornecedor" })
  | (ProfissionalUser & { tipo: "profissional" })

type AuthState = {
  token: string | null
  user: AuthUser | null
  isLoading: boolean
  isAuthenticated: boolean
}

type AuthContextValue = AuthState & {
  loginComprador: (token: string, comprador: CompradorUser) => void
  loginFornecedor: (token: string, fornecedor: FornecedorUser) => void
  loginProfissional: (token: string, profissional: ProfissionalUser) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    token: null,
    user: null,
    isLoading: true,
    isAuthenticated: false,
  })

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    localStorage.removeItem(TIPO_KEY)
    setState({
      token: null,
      user: null,
      isLoading: false,
      isAuthenticated: false,
    })
  }, [])

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY)
    const rawUser = localStorage.getItem(USER_KEY)
    const tipo = localStorage.getItem(TIPO_KEY) as PersonaTipo | null
    const user =
      rawUser && tipo
        ? ({ ...JSON.parse(rawUser), tipo } as AuthUser)
        : null

    setState({
      token,
      user,
      isLoading: false,
      isAuthenticated: Boolean(token && user),
    })
  }, [])

  const loginComprador = useCallback((token: string, comprador: CompradorUser) => {
    const user: AuthUser = { ...comprador, tipo: "comprador" }
    localStorage.setItem(TOKEN_KEY, token)
    localStorage.setItem(USER_KEY, JSON.stringify(comprador))
    localStorage.setItem(TIPO_KEY, "comprador")
    setState({
      token,
      user,
      isLoading: false,
      isAuthenticated: true,
    })
  }, [])

  const loginFornecedor = useCallback((token: string, fornecedor: FornecedorUser) => {
    const user: AuthUser = { ...fornecedor, tipo: "fornecedor" }
    localStorage.setItem(TOKEN_KEY, token)
    localStorage.setItem(USER_KEY, JSON.stringify(fornecedor))
    localStorage.setItem(TIPO_KEY, "fornecedor")
    setState({
      token,
      user,
      isLoading: false,
      isAuthenticated: true,
    })
  }, [])

  const loginProfissional = useCallback(
    (token: string, profissional: ProfissionalUser) => {
      const user: AuthUser = { ...profissional, tipo: "profissional" }
      localStorage.setItem(TOKEN_KEY, token)
      localStorage.setItem(USER_KEY, JSON.stringify(profissional))
      localStorage.setItem(TIPO_KEY, "profissional")
      setState({
        token,
        user,
        isLoading: false,
        isAuthenticated: true,
      })
    },
    []
  )

  const value = useMemo<AuthContextValue>(
    () => ({
      ...state,
      loginComprador,
      loginFornecedor,
      loginProfissional,
      logout,
    }),
    [state, loginComprador, loginFornecedor, loginProfissional, logout]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider")
  }
  return ctx
}
