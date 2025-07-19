/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Ensure proper handling of dynamic routes
  trailingSlash: false,
  // Ensure proper routing for Vercel
  experimental: {
    appDir: true,
  },
}

export default nextConfig
