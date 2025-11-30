import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Bookorama",
    short_name: "Bookorama",
    description: "Bookorama - Toko buku online",
    start_url: "/",
    display: "standalone",
    background_color: "#f7f7f7",
    theme_color: "#ffffff",
    icons: [
      {
        src: "/icon/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}