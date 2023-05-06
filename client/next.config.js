/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    async rewrites() {
      return [
          {
              source: '/api/:slug*',
              destination: `${process.env.SERVER_HOST}/:slug*` // for proxy
          },
      ]
  },
  }
  
  module.exports = nextConfig