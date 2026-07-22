export const NAV_LINKS = [
  { href: "/", label: "Início" },
  { href: "/sobre", label: "Sobre" },
  { href: "/procedimentos", label: "Procedimentos" },
  { href: "/galeria", label: "Galeria" },
  { href: "/antes-e-depois", label: "Antes e Depois" },
  { href: "/depoimentos", label: "Depoimentos" },
  { href: "/precos", label: "Preços" },
  { href: "/contato", label: "Contato" },
] as const

export const FOOTER_LINKS = [
  { href: "/politica-de-privacidade", label: "Política de Privacidade" },
  { href: "/termos-de-uso", label: "Termos de Uso" },
] as const

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
