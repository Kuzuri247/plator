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
  variable: "--font-instrument-serif",
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
  title: {
    default: "Plator - Content Creation & Scheduling MicroSaaS",
    template: "%s | Plator",
  },
  description: "The ultimate tool for creators. Design beautiful templates, preview across platforms, and schedule posts seamlessly.",
  keywords: ["content creation", "social media", "scheduling", "design", "twitter", "linkedin"],
  authors: [{ name: "Kuzuri247" }],
  creator: "Plator",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://plator.vercel.app",
    title: "Plator - Content Creation & Scheduling",
    description: "Design beautiful templates, preview across platforms, and schedule your social media posts seamlessly.",
    siteName: "Plator",
    images: [
      {
        url: "/og-image.png", // Ensure you add this image to public folder
        width: 1200,
        height: 630,
        alt: "Plator - Content Creation & Scheduling",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Plator - Content Creation & Scheduling",
    description: "Design beautiful templates, preview across platforms, and schedule your social media posts seamlessly.",
    creator: "@kuzuri247",
    images: ["/og-image.png"],
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className="scroll-smooth" lang="en" suppressHydrationWarning>
      <body
        className={`
          ${inter.variable} 
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
          <main className="bg-background text-foreground font-space">
            {children}
          </main>
          <Toaster position="top-center" swipeDirections={["right"]} />
          <Analytics />
        </Provider>
      </body>
    </html>
  );
}
