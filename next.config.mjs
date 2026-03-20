/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "https://portal.sabedoriamistica.com.br",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
