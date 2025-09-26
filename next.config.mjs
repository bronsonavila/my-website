/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: false,
  images: {
    remotePatterns: [{ hostname: 'images.ctfassets.net', protocol: 'https' }]
  }
}

export default nextConfig
