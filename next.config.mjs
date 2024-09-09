/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.cdn.bubble.io",
        port: "",
      },
      {
        protocol: "https",
        hostname: "img.icons8.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "api-statements.tnet.ge",
        port: "",
      },
      {
        protocol: "https",
        hostname: "static.my.ge",
        port: "",
      },
    ]
  }
};

export default nextConfig;
