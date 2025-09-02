/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Don't bundle mysql2 on the client side
      config.resolve.fallback = {
        ...config.resolve.fallback,
        net: false,
        tls: false,
        fs: false,
        crypto: false,
        stream: false,
        util: false,
        buffer: false,
        events: false,
        timers: false,
        path: false,
        os: false,
        url: false,
        querystring: false,
        http: false,
        https: false,
        zlib: false,
      };
      
      // Exclude mysql2 from client bundle
      config.externals = config.externals || [];
      config.externals.push('mysql2');
    }
    return config;
  },
  serverExternalPackages: ['mysql2'],
  experimental: {
    serverComponentsExternalPackages: ['mysql2']
  },
  // Ensure proper handling of serverless functions
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, must-revalidate'
          }
        ]
      }
    ];
  }
};

export default nextConfig;
