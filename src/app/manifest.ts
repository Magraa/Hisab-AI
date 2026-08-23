import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Hisab — AI Expense and Income Tracker",
    short_name: "Hisab",
    description: "Just write what you spent. Hisab understands.",
    start_url: "/",
    id: "/",
    display: "standalone",
    background_color: "#faf6ec",
    theme_color: "#2f6b47",
    orientation: "portrait",
    icons: [
      {
        src: "/icons/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-maskable-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/icon-maskable-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    shortcuts: [
      {
        name: "New Entry",
        short_name: "Add",
        description: "Quickly record a new transaction",
        url: "/",
        icons: [{ src: "/icons/icon-192x192.png", sizes: "192x192" }],
      },
      {
        name: "Transactions",
        short_name: "Entries",
        description: "View recent transaction ledger",
        url: "/entries",
        icons: [{ src: "/icons/icon-192x192.png", sizes: "192x192" }],
      },
      {
        name: "Insights",
        short_name: "Insights",
        description: "View spending breakdowns and insights",
        url: "/insights",
        icons: [{ src: "/icons/icon-192x192.png", sizes: "192x192" }],
      },
    ],
  };
}
