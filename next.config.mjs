/** @type {import('next').NextConfig} */
const nextConfig = {
    swcMinify: false,
    reactStrictMode: true,
    images: {
      domains: ['replicate.delivery'],
    },
  }

export default nextConfig;
