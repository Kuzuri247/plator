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
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  display: "swap",
});

const space = Space({
  variable: "--font-space",
  subsets: ["latin"],
  display: "swap",
});

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"],
  display: "swap",
});

const instrument = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-instrument",
  display: "swap",
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const playfair = Playfair({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  display: "swap",
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://plator.fun"),
  title: {
    default: "Plator - 3D Screenshot Mockups & WebGL Studio for Developers",
    template: "%s | Plator",
  },
  description:
    "The premier visual studio for developers and creators. Create 3D isometric screenshot mockups, real-time WebGL fluid mesh gradients, terminal code highlights, and retro Bayer dither art.",
  keywords: [
    "screenshot mockup generator",
    "3D device mockup",
    "github readme banner generator",
    "code snippet mockup",
    "terminal beautifier",
    "ray so alternative",
    "bayer dithering generator",
    "webgl mesh gradient",
    "product hunt launch mockup",
    "dither art generator",
    "MP4 animation creator",
    "developer portfolio mockup",
  ],
  authors: [{ name: "Kuzuri247" }, { name: "Plator", url: "https://plator.fun" }],
  creator: "Plator",
  publisher: "Plator",
  category: "Design & Developer Tools",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://plator.fun/",
    title: "Plator - 3D Screenshot Mockups & WebGL Studio for Developers",
    description:
      "The premier visual studio for developers and creators. Create 3D isometric screenshot mockups, real-time WebGL fluid mesh gradients, and retro Bayer dither art.",
    siteName: "Plator",
    images: [
      {
        url: "https://plator.fun/landing.png",
        secureUrl: "https://plator.fun/landing.png",
        width: 1200,
        height: 630,
        type: "image/png",
        alt: "Plator - 3D Screenshot Mockups & WebGL Studio for Developers",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@kuzuri247",
    creator: "@kuzuri247",
    title: "Plator - 3D Screenshot Mockups & WebGL Studio for Developers",
    description:
      "The premier visual studio for developers and creators. Create 3D isometric screenshot mockups, real-time WebGL fluid mesh gradients, and retro Bayer dither art.",
    images: [
      {
        url: "https://plator.fun/landing.png",
        width: 1200,
        height: 630,
        type: "image/png",
        alt: "Plator - 3D Screenshot Mockups & WebGL Studio for Developers",
      },
    ],
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
    "twitter:card": "summary_large_image",
    "twitter:site": "@kuzuri247",
    "twitter:creator": "@kuzuri247",
    "twitter:url": "https://plator.fun/",
    "twitter:image": "https://plator.fun/landing.png",
    "twitter:image:alt": "Plator - 3D Screenshot Mockups & WebGL Studio for Developers",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "@id": "https://plator.fun/#webapp",
      "name": "Plator",
      "url": "https://plator.fun",
      "applicationCategory": "DesignApplication",
      "operatingSystem": "All",
      "description":
        "The premier visual studio for developers and creators. Create 3D isometric screenshot mockups, real-time WebGL fluid mesh gradients, terminal code highlights, and retro Bayer dither art.",
      "browserRequirements": "Requires WebGL support",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD",
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "reviewCount": "142",
      },
      "featureList": [
        "3D Device Mockup Generation",
        "Syntax Highlighted Code & Terminal Layers",
        "Real-Time WebGL Fluid Mesh Shaders",
        "Retro Bayer Matrix Dithering",
        "Client-Side WASM 60 FPS MP4 & GIF Rendering",
        "Curated Ready-to-Use Templates",
      ],
    },
    {
      "@type": "Organization",
      "@id": "https://plator.fun/#organization",
      "name": "Plator",
      "url": "https://plator.fun",
      "logo": "https://plator.fun/landing.png",
      "sameAs": ["https://twitter.com/kuzuri247", "https://github.com/Kuzuri247/plator"],
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
