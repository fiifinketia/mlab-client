/** @type {import('next').NextConfig} */
const removeImports = require("next-remove-imports")();

const nextConfig = {
  reactStrictMode: true,
  experimental: {
    esmExternals: 'loose'
  },
};

module.exports = removeImports(nextConfig);
