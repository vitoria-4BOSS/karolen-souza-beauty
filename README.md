# Karolen Souza Beauty

Site completo para um estúdio de Design de Sobrancelhas: site institucional, sistema de
agendamento online e painel administrativo — construído com Next.js 15 (App Router),
TypeScript, Tailwind CSS, shadcn/ui, Prisma e NextAuth.

## Stack

- **Next.js 15** (App Router, Server Components) + **React 19** + **TypeScript**
- **Tailwind CSS v4** + **shadcn/ui** (Radix UI) + **Framer Motion** + **lucide-react**
- **Prisma ORM** — SQLite em desenvolvimento, PostgreSQL em produção
- **NextAuth (Auth.js v5)** com Credentials Provider para o painel admin
- **React Hook Form + Zod** para todos os formulários
- **TanStack Query** para dados do painel admin e do fluxo de agendamento
- **next-themes** para modo claro/escuro
- ESLint + Prettier (com `prettier-plugin-tailwindcss`)

## Estrutura do projeto

```
prisma/
  schema.prisma        modelos do banco de dados
  seed.ts               dados de exemplo (procedimentos, profissionais, etc.)
src/
  app/
    (public)/           site público (home, sobre, procedimentos, galeria, ...)
    admin/               painel administrativo (login + dashboard protegido)
    api/                 route handlers (agendamento, admin CRUD, upload, auth)
  components/
    ui/                  componentes shadcn/ui
    layout/              header, footer, providers, tema
    home/ procedures/ gallery/ before-after/ testimonials/ booking/ admin/ shared/
  hooks/                 hooks reutilizáveis (ex: slots de agendamento)
  services/              wrappers de fetch usados pelo TanStack Query
  lib/                   prisma client, auth, tema, validações zod, utils
  types/                 tipos compartilhados
```

## Sistema de tema (cores editáveis sem tocar em código)

As cores da marca vivem em **duas camadas**:

1. `src/lib/theme.ts` — paleta padrão (fallback), tipada.
2. `SiteSettings.colors` no banco de dados — editável em **Painel Admin → Configurações
   → Cores do tema**. Ao salvar, o componente `ThemeStyleInjector`
   (`src/components/layout/theme-style-injector.tsx`) injeta as cores como variáveis
   CSS (`--brand-primary`, `--brand-secondary`, `--brand-accent`, `--brand-background`,
   `--brand-button`, `--brand-text`) que todo o site consome via classes utilitárias
   (`bg-brand-primary`, `text-brand-text`, etc.) — nenhuma cor fica cravada no código.

O modo escuro usa uma paleta fixa e elegante (definida em `globals.css`), independente
das cores de marca configuráveis no admin.

## Instalação e configuração

### Pré-requisitos

- Node.js 20+ e npm

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar variáveis de ambiente

Copie o arquivo de exemplo e ajuste os valores:

```bash
cp .env.example .env
```

Variáveis:

| Variável                               | Descrição                                                                                                                                                                      |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `DATABASE_URL`                         | Connection string do banco. Em dev: `file:./dev.db` (SQLite).                                                                                                                  |
| `NEXTAUTH_SECRET`                      | Segredo para assinar as sessões. Gere com `npx auth secret` ou `openssl rand -base64 32`.                                                                                      |
| `NEXTAUTH_URL`                         | URL base da aplicação (ex: `http://localhost:3000`). **Deve bater com a porta/domínio real.**                                                                                  |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD`       | Credenciais do usuário admin criado pelo `seed.ts`.                                                                                                                            |
| `NEXT_PUBLIC_SITE_URL`                 | URL pública usada em metadata, sitemap e Open Graph.                                                                                                                           |
| `RESEND_API_KEY` / `RESEND_FROM_EMAIL` | Opcional — se definidos, o estúdio recebe um e-mail a cada novo agendamento (via [Resend](https://resend.com)). Sem isso, o sistema apenas registra o agendamento normalmente. |

### 3. Criar o banco de dados e popular com dados de exemplo

```bash
npm run db:migrate   # cria o banco SQLite e aplica as migrations
npm run db:seed      # popular procedimentos, profissionais, horários, galeria, etc.
```

(O `db:seed` também roda automaticamente depois de `db:migrate` no primeiro uso, e cria
o usuário admin com o e-mail/senha definidos em `.env`.)

### 4. Rodar em desenvolvimento

```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000). O painel administrativo fica em
[http://localhost:3000/admin/login](http://localhost:3000/admin/login).

## Comandos disponíveis

| Comando               | Descrição                                        |
| --------------------- | ------------------------------------------------ |
| `npm run dev`         | Servidor de desenvolvimento                      |
| `npm run build`       | Build de produção                                |
| `npm run start`       | Sobe o build de produção                         |
| `npm run lint`        | ESLint                                           |
| `npm run format`      | Prettier (escreve as correções)                  |
| `npm run db:migrate`  | Cria/atualiza o schema do banco (Prisma Migrate) |
| `npm run db:generate` | Regenera o Prisma Client                         |
| `npm run db:seed`     | Popula o banco com dados de exemplo              |
| `npm run db:studio`   | Abre o Prisma Studio (GUI do banco)              |

## Preparando para produção (PostgreSQL)

1. Provisione um banco Postgres (ex: [Neon](https://neon.tech), [Supabase](https://supabase.com), Railway, RDS).
2. Em `prisma/schema.prisma`, troque:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
3. Configure `DATABASE_URL` de produção com a connection string do Postgres.
4. Rode as migrations no ambiente de produção:
   ```bash
   npx prisma migrate deploy
   npm run db:seed   # opcional — só se quiser os dados de exemplo
   ```
5. Defina as demais variáveis de ambiente de produção (`NEXTAUTH_SECRET` — gere um novo
   valor só para produção —, `NEXTAUTH_URL`, `NEXT_PUBLIC_SITE_URL` com o domínio real,
   `ADMIN_EMAIL`/`ADMIN_PASSWORD` do primeiro admin, e opcionalmente `RESEND_API_KEY`).
6. Gere o build e suba a aplicação:
   ```bash
   npm run build
   npm run start
   ```

### Upload de imagens em produção

O endpoint `/api/admin/upload` grava arquivos em `public/uploads`. Isso funciona bem em
um servidor Node.js tradicional (VPS, Railway, Render), mas **não funciona em plataformas
serverless com filesystem somente-leitura** (ex: Vercel). Para essas plataformas, troque a
implementação de `src/app/api/admin/upload/route.ts` por um provedor de armazenamento de
objetos (Vercel Blob, Amazon S3, Cloudflare R2, Cloudinary etc.) — a interface do
componente `<ImageUploader />` não precisa mudar, só o destino do upload.

## Contas e dados de exemplo

O `seed.ts` cria:

- 1 usuário administrador (`ADMIN_EMAIL` / `ADMIN_PASSWORD` do `.env`)
- 6 procedimentos, 2 profissionais com horários de trabalho (seg–sáb)
- 12 fotos de galeria, 4 pares de antes/depois, 5 depoimentos
- Configurações do site com dados de contato fictícios

As imagens de exemplo são geradas localmente em `/api/placeholder` (gradientes com o
nome do item) — **substitua pelas fotos reais do estúdio pelo próprio painel admin**
(Procedimentos, Galeria, Depoimentos, Configurações → Logo).

## Observações

- O aviso de build `A Node.js API is used ... jose/deflate` é conhecido e inofensivo:
  vem de um caminho de código do NextAuth (JWE/compressão) que não é usado, já que o
  projeto usa apenas JWT assinado (não criptografado).
- Lighthouse: o projeto usa Server Components, `next/image`, fontes otimizadas via
  `next/font` e code-splitting automático do App Router. Rode uma auditoria local
  (`npm run build && npm run start`, depois Lighthouse no Chrome DevTools) para números
  reais no seu ambiente/hardware.
