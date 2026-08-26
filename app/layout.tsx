import type { Metadata } from "next";
import {
  Space_Grotesk as Space,
  Inter,
  Manrope,
  Roboto,
  Instrument_Serif,
  Poppins,
  Playfair_Display as Playfair,
  Oswald,
  Montserrat,
  Geist
} from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { Analytics } from "@vercel/analytics/next";
import { Provider } from "@/components/provider";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

const space = Space({
  variable: "--font-space",
  subsets: ["latin"],
});

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"],
});

const instrument = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-instrument",
});


const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const playfair = Playfair({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.plator.fun"),
  title: {
    default: "Plator - Visual Mockup & WebGL Studio for Creators",
    template: "%s | Plator",
  },
  description:
    "The ultimate visual studio for creators. Design stunning 3D device mockups, real-time WebGL fluid gradient shaders, retro Bayer dither art, and export broadcast-quality 60FPS MP4 videos and 4K snapshots.",
  keywords: [
    "Plator",
    "screenshot mockup generator",
    "3D device mockup",
    "WebGL shader studio",
    "fluid mesh gradient",
    "Bayer dithering generator",
    "dither art",
    "MP4 animation creator",
    "social media post designer",
    "GIF creator",
    "wallpaper studio",
    "creative design tool",
  ],
  authors: [{ name: "Kuzuri247" }, { name: "Plator", url: "https://www.plator.fun" }],
  creator: "Plator",
  publisher: "Plator",
  category: "Design & Creative Tools",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.plator.fun/",
    title: "Plator - Visual Mockup & WebGL Studio for Creators",
    description:
      "The ultimate visual studio for creators. Design stunning 3D device mockups, real-time WebGL fluid gradient shaders, retro Bayer dither art, and export broadcast-quality 60FPS MP4 videos and 4K snapshots.",
    siteName: "Plator",
    images: [
      {
        url: "/landing.png",
        width: 1917,
        height: 867,
        alt: "Plator - Visual Mockup & WebGL Studio for Creators",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Plator - Visual Mockup & WebGL Studio for Creators",
    description:
      "The ultimate free visual studio for creators. Design stunning 3D device mockups, real-time WebGL fluid gradient shaders, retro Bayer dither art, and export broadcast-quality 60FPS MP4 videos and stunning snapshots.",
    creator: "@kuzuri247",
    images: ["/landing.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  other: {
    "title": "Plator - Visual Mockup & WebGL Studio for Creators",
    "twitter:url": "https://www.plator.fun/",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "@id": "https://www.plator.fun/#webapp",
      "name": "Plator",
      "url": "https://www.plator.fun",
      "applicationCategory": "DesignApplication",
      "operatingSystem": "All",
      "description":
        "The ultimate visual studio for creators. Design stunning 3D device mockups, real-time WebGL fluid gradient shaders, retro Bayer dither art, and export broadcast-quality 60FPS MP4 videos and 4K snapshots.",
      "browserRequirements": "Requires WebGL support",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD",
      },
    },
    {
      "@type": "Organization",
      "@id": "https://www.plator.fun/#organization",
      "name": "Plator",
      "url": "https://www.plator.fun",
      "logo": "https://www.plator.fun/landing.png",
      "sameAs": ["https://twitter.com/kuzuri247"],
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className="scroll-smooth" lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`
          ${inter.variable} 
          ${geist.variable}
          ${manrope.variable} 
          ${space.variable} 
          ${roboto.variable}
          ${instrument.variable}
          ${poppins.variable}
          ${playfair.variable}
          ${oswald.variable}
          ${montserrat.variable}
          antialiased
        `}
      >
        <Provider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <main className="bg-background text-foreground font-geist">
            {children}
          </main>
          <Toaster position="top-center" swipeDirections={["right"]} />
          <Analytics />
        </Provider>
      </body>
    </html>
  );
}
