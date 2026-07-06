/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
  async rewrites() {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://peakhire.onrender.com';
    // Remove trailing slash if present to avoid generating double slashes (e.g. //api/...) 
    // which causes Vercel Edge to return a 308 Permanent Redirect loop.
    const normalizedBackendUrl = backendUrl.replace(/\/+$/, '');
    
    return [
      {
        source: '/api/:path*',
        destination: `${normalizedBackendUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
