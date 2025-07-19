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
  // Enable static generation where possible
  output: 'standalone',
  // Ensure proper routing
  experimental: {
    appDir: true,
  },
}

export default nextConfig
