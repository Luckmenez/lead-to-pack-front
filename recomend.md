🎯 Recomendação: Next.js 14+ (App Router)
Por que Next.js ao invés de Vite?
Critério Next.js Vite + React
SEO ✅ SSR/SSG nativo ❌ Requer configuração extra
Páginas públicas ✅ Server Components ⚠️ Client-side only
Autenticação ✅ Middleware integrado ⚠️ Implementação manual
API Routes ✅ Backend integrado ❌ Precisa de servidor separado
Deploy ✅ Vercel otimizado ✅ Flexível
📁 Estrutura de Pastas Proposta

src/
├── app/ # App Router (Next.js 14+)
│ ├── (auth)/ # Grupo de rotas de autenticação
│ │ ├── login/
│ │ │ └── page.tsx
│ │ ├── cadastro/
│ │ │ ├── comprador/
│ │ │ │ └── page.tsx
│ │ │ ├── fornecedor/
│ │ │ │ └── page.tsx
│ │ │ └── profissional/
│ │ │ └── page.tsx
│ │ └── layout.tsx # Layout sem header/sidebar
│ │
│ ├── (public)/ # Páginas públicas (SEO)
│ │ ├── fornecedores/
│ │ │ ├── page.tsx # Lista de fornecedores
│ │ │ └── [slug]/
│ │ │ └── page.tsx # Perfil público do fornecedor
│ │ ├── profissionais/
│ │ │ ├── page.tsx
│ │ │ └── [slug]/
│ │ │ └── page.tsx
│ │ └── layout.tsx # Layout público com header
│ │
│ ├── (dashboard)/ # Área logada
│ │ ├── comprador/
│ │ │ ├── page.tsx # Dashboard do comprador
│ │ │ ├── buscar/
│ │ │ │ └── page.tsx
│ │ │ └── conexoes/
│ │ │ └── page.tsx
│ │ ├── fornecedor/
│ │ │ ├── page.tsx # Dashboard do fornecedor
│ │ │ ├── meu-perfil/
│ │ │ │ └── page.tsx
│ │ │ └── estatisticas/
│ │ │ └── page.tsx
│ │ ├── profissional/
│ │ │ ├── page.tsx
│ │ │ └── meu-perfil/
│ │ │ └── page.tsx
│ │ └── layout.tsx # Layout com sidebar
│ │
│ ├── api/ # API Routes
│ │ ├── auth/
│ │ │ └── [...nextauth]/
│ │ │ └── route.ts
│ │ └── v1/
│ │ ├── fornecedores/
│ │ └── profissionais/
│ │
│ ├── layout.tsx # Root layout
│ ├── page.tsx # Home
│ └── globals.css
│
├── components/
│ ├── ui/ # Shadcn/ui components
│ │ ├── button.tsx
│ │ ├── input.tsx
│ │ ├── card.tsx
│ │ └── ...
│ ├── common/ # Componentes compartilhados
│ │ ├── header/
│ │ │ ├── header.tsx
│ │ │ └── nav-links.tsx
│ │ ├── sidebar/
│ │ ├── footer/
│ │ └── loading/
│ └── features/ # Componentes por feature
│ ├── auth/
│ │ ├── login-form.tsx
│ │ ├── cadastro-comprador-form.tsx
│ │ ├── cadastro-fornecedor-form.tsx
│ │ └── cadastro-profissional-form.tsx
│ ├── fornecedor/
│ │ ├── fornecedor-card.tsx
│ │ ├── fornecedor-perfil.tsx
│ │ └── fornecedor-editor.tsx
│ ├── profissional/
│ │ └── ...
│ └── comprador/
│ ├── busca-filtros.tsx
│ └── conexao-card.tsx
│
├── lib/ # Utilitários e configurações
│ ├── api/ # Cliente API
│ │ ├── client.ts # Axios/Fetch configurado
│ │ ├── endpoints.ts
│ │ └── hooks/ # React Query hooks
│ │ ├── use-fornecedores.ts
│ │ ├── use-profissionais.ts
│ │ └── use-conexoes.ts
│ ├── auth/ # Configuração de auth
│ │ ├── auth-options.ts
│ │ └── session.ts
│ ├── validations/ # Schemas Zod
│ │ ├── auth.schema.ts
│ │ ├── fornecedor.schema.ts
│ │ └── profissional.schema.ts
│ └── utils/ # Funções utilitárias
│ ├── cn.ts # classnames helper
│ ├── format.ts
│ └── constants.ts
│
├── hooks/ # Custom hooks globais
│ ├── use-auth.ts
│ ├── use-user-type.ts
│ └── use-media-query.ts
│
├── types/ # TypeScript types
│ ├── user.ts
│ ├── fornecedor.ts
│ ├── profissional.ts
│ └── api.ts
│
├── stores/ # Estado global (Zustand)
│ ├── auth-store.ts
│ └── ui-store.ts
│
└── middleware.ts # Proteção de rotas
🔧 Stack Tecnológica Recomendada
Categoria Tecnologia Justificativa
Framework Next.js 14+ SSR, SEO, App Router
UI Shadcn/ui + Tailwind Componentes acessíveis, customizáveis
Formulários React Hook Form + Zod Performance + validação tipada
State Server TanStack Query Cache, loading states, mutations
State Client Zustand Simples, sem boilerplate
Auth NextAuth.js (Auth.js) Integração nativa com Next
HTTP Client Axios ou Fetch Interceptors, error handling
🔐 Estratégia de Autenticação por Tipo

// middleware.ts
import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

const routePermissions = {
'/comprador': ['COMPRADOR'],
'/fornecedor': ['FORNECEDOR'],
'/profissional': ['PROFISSIONAL'],
}

export async function middleware(request) {
const token = await getToken({ req: request })
const path = request.nextUrl.pathname

// Verifica permissão baseada no tipo de usuário
for (const [route, roles] of Object.entries(routePermissions)) {
if (path.startsWith(route) && !roles.includes(token?.userType)) {
return NextResponse.redirect(new URL('/login', request.url))
}
}
}
📝 Padrão para Formulários

// lib/validations/auth.schema.ts
import { z } from 'zod'

export const cadastroCompradorSchema = z.object({
nome: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
email: z.string().email('Email inválido'),
empresa: z.string().optional(),
telefone: z.string().regex(/^\d{10,11}$/, 'Telefone inválido'),
})

export const cadastroFornecedorSchema = cadastroCompradorSchema.extend({
cnpj: z.string().length(14, 'CNPJ deve ter 14 dígitos'),
categorias: z.array(z.string()).min(1, 'Selecione ao menos uma categoria'),
descricao: z.string().min(50, 'Descreva sua empresa em ao menos 50 caracteres'),
})

// Tipo inferido automaticamente
export type CadastroComprador = z.infer<typeof cadastroCompradorSchema>
📊 Exemplo de Componente Feature

// components/features/auth/cadastro-fornecedor-form.tsx
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { cadastroFornecedorSchema, type CadastroFornecedor } from '@/lib/validations/auth.schema'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useCadastro } from '@/lib/api/hooks/use-cadastro'

export function CadastroFornecedorForm() {
const { register, handleSubmit, formState: { errors } } = useForm<CadastroFornecedor>({
resolver: zodResolver(cadastroFornecedorSchema),
})

const { mutate, isPending } = useCadastro('fornecedor')

return (

<form onSubmit={handleSubmit((data) => mutate(data))}>
<Input {...register('nome')} error={errors.nome?.message} />
<Input {...register('email')} error={errors.email?.message} />
<Input {...register('cnpj')} error={errors.cnpj?.message} />
{/_ ... outros campos _/}
<Button type="submit" loading={isPending}>
Cadastrar como Fornecedor
</Button>
</form>
)
}
🚀 Comandos para Iniciar o Projeto

# Criar projeto Next.js

npx create-next-app@latest marketplace --typescript --tailwind --eslint --app --src-dir

# Instalar dependências

cd marketplace
npm install @tanstack/react-query zustand axios
npm install react-hook-form @hookform/resolvers zod
npm install next-auth

# Configurar Shadcn/ui

npx shadcn@latest init
npx shadcn@latest add button input card form
Próximos Passos
Quer que eu:

Crie os arquivos base do projeto com essa estrutura?
Detalhe mais alguma parte (ex: autenticação, formulários, API)?
Ajuste a arquitetura para algum requisito específico?
