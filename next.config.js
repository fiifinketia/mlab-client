/** @type {import('next').NextConfig} */
const removeImports = require("next-remove-imports")();

const nextConfig = {
	reactStrictMode: true,
	experimental: {
		esmExternals: "loose",
	},
	env: {
		JWT_SECRET: process.env.JWT_SECRET,
		JWT_AUDIENCE: process.env.JWT_AUDIENCE,
		JWT_ISSUER: process.env.JWT_ISSUER,
		GITLAB_SERVER: process.env.GITLAB_SERVER,
	},
};

module.exports = removeImports(nextConfig);
