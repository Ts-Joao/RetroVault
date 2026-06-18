/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['placehold.co'],
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://api:4000/api/:path*",
      },
      {
        source: "/uploads/:path*",
        destination: "http://api:4000/uploads/:path*",
      },
    ];
  },
};

module.exports = nextConfig;