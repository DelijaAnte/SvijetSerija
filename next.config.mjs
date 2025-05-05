/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "static.tvmaze.com",
        pathname: "/**", // Omogućuje sve putanje s ovog hosta
      },
    ],
  },
};

export default nextConfig;
