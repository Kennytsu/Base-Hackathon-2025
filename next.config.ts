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

  webpack: (config, { isServer }) => {
    // Ignore React Native modules and optional dependencies that aren't needed in web environment
    config.resolve.alias = {
      ...config.resolve.alias,
      '@react-native-async-storage/async-storage': false,
      'react-native': false,
      'react-native-webview': false,
      'pino-pretty': false,
    };

    // Fallback for node modules
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };

    return config;
  },
};

module.exports = nextConfig;
