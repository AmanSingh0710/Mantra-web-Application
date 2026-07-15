/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "res.cloudinary.com"
      },
    ],
  },
};

export default nextConfig;
