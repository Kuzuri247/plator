import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Studio Editor",
  description:
    "Design high-resolution mockups, interactive 3D device angles, fluid WebGL mesh gradient shaders, retro Bayer dither art, and export 60FPS MP4 videos and 4K graphics.",
  keywords: [
    "Plator Editor",
    "WebGL Canvas Studio",
    "3D Mockup Generator",
    "Fluid Gradient Animation",
    "MP4 Video Export",
    "Bayer Dither Generator",
    "Design Studio",
  ],
  alternates: {
    canonical: "/editor",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://plator.fun/editor",
    title: "Plator Studio Editor - Visual Mockups & WebGL Shaders",
    description:
      "Design high-resolution mockups, interactive 3D device angles, fluid WebGL mesh gradient shaders, retro Bayer dither art, and export 60FPS MP4 videos.",
    siteName: "Plator",
    images: [
      {
        url: "/editor.png",
        width: 1200,
        height: 630,
        alt: "Plator Studio Editor",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Plator Studio Editor - Visual Mockups & WebGL Shaders",
    description:
      "Design high-resolution mockups, interactive 3D device angles, fluid WebGL mesh gradient shaders, retro Bayer dither art, and export 60FPS MP4 videos.",
    creator: "@kuzuri247",
    images: ["/editor.png"],
  },
};

export default function EditorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
