/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  eslint: {
    // Disable ESLint checks during builds
    ignoreDuringBuilds: true,
  },

  typescript: {
    // Type checking is already done separately
    ignoreBuildErrors: false,
  },
};

module.exports = nextConfig;
