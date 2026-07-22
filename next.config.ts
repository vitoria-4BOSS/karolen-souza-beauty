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
  },
}

export default nextConfig
