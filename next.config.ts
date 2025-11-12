import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // ✅ อนุญาตทุกโดเมน https
      },
      {
        protocol: "http",
        hostname: "**", // ✅ (เผื่อบางเว็บเป็น http)
      },
    ],
  },
};

export default nextConfig;
