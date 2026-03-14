// Mock wrapper for Lingo compiler
const withLingo = (config) => {
    return config;
};

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false, // Useful for strict mode double socket connection issues
    eslint: {
        ignoreDuringBuilds: true,
    },
    typescript: {
        ignoreBuildErrors: true,
    },
};

module.exports = withLingo(nextConfig);
