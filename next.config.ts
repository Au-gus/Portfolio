import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "portfolio-bice-psi-76.vercel.app",
          },
        ],
        destination: "https://karkiaustin.com.np/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
