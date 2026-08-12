/** @type {import('next').NextConfig} */
const BACKEND_URL = (
  process.env.BACKEND_URL || "http://localhost:5001"
).replace(/\/$/, "");

const nextConfig = {
  async rewrites() {
    // fallback: after App Router handlers (e.g. /api/nextauth) are checked
    return {
      fallback: [
        {
          source: "/api/:path*",
          destination: `${BACKEND_URL}/api/:path*`,
        },
      ],
    };
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
};

export default nextConfig;
