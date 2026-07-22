import { revalidatePath } from "next/cache"

/**
 * As páginas públicas fazem consulta direta ao Prisma (sem cookies/headers), então o
 * Next.js as trata como estáticas e as gera no build. Sem isso, uma alteração salva no
 * painel admin só apareceria no site após um novo deploy.
 */
export function revalidatePublicSite() {
  revalidatePath("/", "layout")
}
