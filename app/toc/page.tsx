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
  },
  twitter: {
    card: "summary_large_image",
    title: "Terms and Conditions (TOC) | Plator",
    description:
      "Review the Terms and Conditions for Plator. Full commercial ownership of all exported designs, zero-knowledge browser execution, and open creative freedom.",
  },
};

export default function TOCPage() {
  return <TermsPage />;
}
