"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQS = [
  {
    question: "How does the hardware-accelerated WebGL dither engine work?",
    answer:
      "Plator compiles a custom GLSL fragment shader directly onto your GPU. The source canvas is uploaded as a texture, and per-pixel luminance is mapped through Bayer threshold matrices (2x2, 4x4, 8x8) or pseudo-random noise functions. Quantization and palette interpolation happen at 60fps in WebGL.",
  },
  {
    question: "Are there any server-side dependencies or data tracking?",
    answer:
      "No. All image processing, shader passes, layer composition, and exports are executed entirely client-side in your browser. Your images and graphic assets never leave your device.",
  },
  {
    question: "How does the lossless 4K export work without compression blur?",
    answer:
      "When you trigger an export, Plator renders your stage onto an isolated offscreen canvas scaled by your selected resolution multiplier (1x, 2x Retina, or 4x UHD). Textures and glyphs are rasterized at native pixel density, ensuring razor-sharp edges.",
  },
  {
    question: "Can I customize typography background fills and border rounding?",
    answer:
      "Yes. Selecting any text layer allows you to toggle background badges, adjust fill colors, configure opacity percentages, customize padding, and set corner roundness radii.",
  },
  {
    question: "Which browsers and devices are supported?",
    answer:
      "Plator supports any modern browser with WebGL enabled, including Google Chrome, Mozilla Firefox, Apple Safari, Microsoft Edge, and mobile browsers on iOS and Android.",
  },
];

export function FAQ() {
  return (
    <section id="faq" className="py-20 px-4 max-w-4xl mx-auto">
      <div className="text-center max-w-xl mx-auto mb-12">
        <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2">
          Documentation & FAQ
        </div>
        <h2 className="text-3xl font-semibold tracking-[-0.02em] text-foreground mb-3">
          Frequently asked questions.
        </h2>
        <p className="text-sm text-muted-foreground font-normal leading-relaxed">
          Everything you need to know about the WebGL dither shader studio and layer workflows.
        </p>
      </div>

      <Accordion type="single" collapsible className="space-y-3">
        {FAQS.map((faq, index) => (
          <AccordionItem
            key={index}
            value={`faq-${index}`}
            className="border border-border/80 rounded-xl px-5 bg-card/60 shadow-xs"
          >
            <AccordionTrigger className="text-sm font-semibold text-foreground py-4 hover:no-underline text-left">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-4 pt-1">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
