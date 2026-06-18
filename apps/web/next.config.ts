import type { NextConfig } from "next";

const nextConfig: NextConfig = {
<<<<<<< HEAD
=======
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.INTERNAL_API_URL}/api/:path*`,
      },
    ]
  },
  /* config options here */
>>>>>>> 35c80e73a3e36c106a51f8eca270c9b7b2b4c205
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '4000',
      }
    ],
    unoptimized: true,
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:4000/api/:path*",
      },
      {
        source: "/uploads/:path*",
        destination: "http://localhost:4000/uploads/:path*",
      },
    ];
  },
};

export default nextConfig;