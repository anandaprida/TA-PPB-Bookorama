const withPWA = require("@ducanh2912/next-pwa").default({
  dest: "public",
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  swcMinify: true,
  disable: process.env.NODE_ENV === "development",
  workboxOptions: {
    disableDevLogs: true,
  },
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Pindahkan konfigurasi ini ke luar 'experimental'
  serverExternalPackages: ['@prisma/client', 'bcrypt'], 
  
  // Pastikan object experimental bersih dari key yang sudah usang
  experimental: {
    // serverActions: true, // HAPUS baris ini (sudah default)
  },
};

module.exports = withPWA(nextConfig);