/** @type {import('next').NextConfig} */
const removeImports = require("next-remove-imports")();

const nextConfig = {
	reactStrictMode: true,
	experimental: {
		esmExternals: "loose",
	},
	env: {
		JWT_SECRET: process.env.JWT_SECRET,
	},
};

module.exports = removeImports(nextConfig);
