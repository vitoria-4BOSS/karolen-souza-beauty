import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  images: {
    localPatterns: [
      {
        pathname: "/api/placeholder",
        search: "*",
      },
      {
        pathname: "/uploads/**",
      },
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
    ],
  },
}

export default nextConfig
