/** @type {import('next').NextConfig} */
const nextConfig = {
  // reactStrictMode: true,
  swcMinify: true,
  // experimental: {
  //   runtime: "experimental-edge",
  // },
  images: {
    domains: ['lens.infura-ipfs.io'],
    unoptimized: true,
  },
}

module.exports = nextConfig
