/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.cdn.bubble.io',
        port: ''
      },
      {
        protocol: 'https',
        hostname: 'img.icons8.com',
        port: ''
      }
    ]
  }
}

export default nextConfig
