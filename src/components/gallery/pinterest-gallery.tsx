import Image from "next/image"

export type GalleryItemData = {
  id: string
  url: string
  category: string
}

function dimensionsFromUrl(url: string) {
  try {
    const params = new URL(url, "http://localhost").searchParams
    return {
      width: Number(params.get("w")) || 600,
      height: Number(params.get("h")) || 600,
    }
  } catch {
    return { width: 600, height: 600 }
  }
}

export function PinterestGallery({ images }: { images: GalleryItemData[] }) {
  if (images.length === 0) {
    return (
      <p className="text-foreground/60 text-center text-sm">
        Nenhuma imagem cadastrada ainda.
      </p>
    )
  }

  return (
    <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4">
      {images.map((image) => {
        const { width, height } = dimensionsFromUrl(image.url)
        return (
          <div
            key={image.id}
            className="break-inside-avoid overflow-hidden rounded-2xl shadow-sm transition-shadow hover:shadow-lg"
          >
            <Image
              src={image.url}
              alt={image.category}
              width={width}
              height={height}
              unoptimized={image.url.startsWith("/api/placeholder")}
              className="h-auto w-full object-cover"
            />
          </div>
        )
      })}
    </div>
  )
}
