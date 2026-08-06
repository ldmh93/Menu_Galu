import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    // Formatos modernos: menor peso en pantallas 4K sin perder nitidez.
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
