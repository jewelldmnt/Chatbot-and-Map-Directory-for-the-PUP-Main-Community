// next.config.mjs
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:5000/:path*", // Change port to Flask server's port
      },
    ];
  },
};

export default nextConfig;
