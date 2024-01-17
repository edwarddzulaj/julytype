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
        protocol: "http",
        hostname: "localhost",
        port: "1337",
        pathname: "/assets/**",
      },
      {
        protocol: "https",
        hostname: "strapi-julytype-1zhv.onrender.com",
        pathname: "/uploads/**",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/admin/:path*",
        destination:
          process.env.NEXT_PUBLIC_STRAPI_ENV === "production"
            ? "https://strapi-julytype-1zhv.onrender.com/admin/"
            : "http://localhost:1337/admin/",
        permanent: true,
      },
      {
        source: "/typefaces",
        destination: "/",
        permanent: true,
      },
    ];
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\bcanvas\.node\b/,
      use: "raw-loader",
    });

    return config;
  },
};

module.exports = nextConfig;
