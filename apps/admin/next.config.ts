/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['placehold.co'],
  },
  async rewrites() {
    // Verifica se está rodando dentro do Docker ou local
    const isDocker = process.env.IS_DOCKER === "true";
    const backendHost = isDocker ? "api:4000" : "localhost:4000";

    return [
      {
        source: "/api/:path*",
        destination: `http://${backendHost}/api/:path*`,
      },
      {
        source: "/uploads/:path*",
        destination: `http://${backendHost}/uploads/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;