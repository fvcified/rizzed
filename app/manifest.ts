import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "rizzed",
    short_name: "rizzed",
    description: "A rizzed kid",
    start_url: "/",
    display: "standalone",
    background_color: "#efefef",
    theme_color: "#6E0F1A",
    icons: [
      {
        src: "/images/cook13.webp",
        sizes: "any",
        type: "image/webp",
      },
    ],
  };
}
