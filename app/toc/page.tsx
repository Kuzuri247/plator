import type { Metadata } from "next";
import TermsPage from "@/app/terms/page";

export const metadata: Metadata = {
  title: "Terms and Conditions (TOC)",
  description:
    "Terms of Service & Conditions for Plator. Enjoy full commercial rights, 100% creator ownership over your designs, and zero-latency client-side WebGL studio tooling.",
  alternates: {
    canonical: "/terms",
  },
  openGraph: {
    title: "Terms and Conditions (TOC) | Plator",
    description:
      "Review the Terms and Conditions for Plator. Full commercial ownership of all exported designs, zero-knowledge browser execution, and open creative freedom.",
    url: "https://plator.fun/terms",
    siteName: "Plator",
    type: "website",
    images: [
      {
        url: "https://plator.fun/landing.png",
        width: 1200,
        height: 630,
        type: "image/png",
        alt: "Plator - Terms and Conditions",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@kuzuri247",
    creator: "@kuzuri247",
    title: "Terms and Conditions (TOC) | Plator",
    description:
      "Review the Terms and Conditions for Plator. Full commercial ownership of all exported designs, zero-knowledge browser execution, and open creative freedom.",
    images: [
      {
        url: "https://plator.fun/landing.png",
        width: 1200,
        height: 630,
        type: "image/png",
        alt: "Plator - Terms and Conditions",
      },
    ],
  },
};

export default function TOCPage() {
  return <TermsPage />;
}
