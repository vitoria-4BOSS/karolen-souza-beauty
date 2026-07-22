export function placeholderImage(
  label: string,
  opts?: { w?: number; h?: number; seed?: string }
) {
  const params = new URLSearchParams({
    label,
    w: String(opts?.w ?? 800),
    h: String(opts?.h ?? 600),
    seed: opts?.seed ?? label,
  })
  return `/api/placeholder?${params.toString()}`
}
