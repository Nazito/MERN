/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    // fallback: after App Router handlers (e.g. /api/nextauth) are checked
    return {
      fallback: [
        {
          source: "/api/:path*",
          destination: "http://localhost:5001/api/:path*",
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
