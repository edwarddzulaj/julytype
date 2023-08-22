/** @type {import('next').NextConfig} */

const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "1337",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "images.pexels.com",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/admin/:path*",
        destination:
          process.env.NEXT_PUBLIC_STRAPI_ENV === "production"
            ? "https://strapi-julytype.onrender.com/admin/"
            : "http://localhost:1337/admin/",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;