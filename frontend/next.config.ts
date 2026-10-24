import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  devIndicators: false,
  cacheComponents: true,
  partialPrefetching: true,
<<<<<<< HEAD
=======
  allowedDevOrigins: ["http://localhost:8000", "http://127.0.0.1:8000"],
>>>>>>> 63593a4007dd16e7b77a955538c0b7b9eee0312f
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
