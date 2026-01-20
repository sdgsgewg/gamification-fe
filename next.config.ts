import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["acctihmbqsiftxmlcygv.supabase.co"],
  },
  // Abaikan error TypeScript saat build
  typescript: {
    ignoreBuildErrors: true,
  },
  // Abaikan error ESLint saat build di Vercel
  eslint: {
    ignoreDuringBuilds: true,
  },
  productionBrowserSourceMaps: false,
};

export default nextConfig;
