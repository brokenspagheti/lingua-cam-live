// Mock wrapper for Lingo compiler
const withLingo = (config) => {
    return config;
};

const isGitHubPages = process.env.GITHUB_PAGES === 'true';
const repoName = process.env.GITHUB_REPOSITORY?.split('/')[1] || '';
const basePath = isGitHubPages && repoName ? `/${repoName}` : '';

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false, // Useful for strict mode double socket connection issues
    eslint: {
        ignoreDuringBuilds: true,
    },
    typescript: {
        ignoreBuildErrors: true,
    },
    output: isGitHubPages ? 'export' : undefined,
    trailingSlash: isGitHubPages,
    images: {
        unoptimized: isGitHubPages,
    },
    basePath,
    assetPrefix: basePath || undefined,
};

module.exports = withLingo(nextConfig);
