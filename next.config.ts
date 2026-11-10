import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  experimental: {
    serverActions: {
      // Batas bawaan 1 MB terlalu kecil untuk gambar. Batas gambar yang sebenarnya (2 MB)
      // diperiksa di src/lib/uploads.ts. Angka ini sengaja sedikit di atasnya.
      bodySizeLimit: "3mb",
    },
  },
};

export default nextConfig;
