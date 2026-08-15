"use client";

import React, { useMemo } from "react";

export type StudioTextureType = "none" | "grain" | "paper" | "scratches";

export interface StudioTextureProps {
  type: StudioTextureType;
  opacity: number; // 0 to 100
  blendMode?: "overlay" | "soft-light" | "screen" | "multiply";
}

// Generate procedural noise data URL once
function generateFilmGrainDataUrl(): string {
  if (typeof window === "undefined") return "";
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  const imgData = ctx.createImageData(256, 256);
  const data = imgData.data;

  for (let i = 0; i < data.length; i += 4) {
    const val = Math.floor(Math.random() * 255);
    data[i] = val;
    data[i + 1] = val;
    data[i + 2] = val;
    data[i + 3] = 40; // subtle alpha
  }

  ctx.putImageData(imgData, 0, 0);
  return canvas.toDataURL("image/png");
}

export const StudioTexture: React.FC<StudioTextureProps> = ({
  type,
  opacity,
  blendMode = "overlay",
}) => {
  const grainDataUrl = useMemo(() => generateFilmGrainDataUrl(), []);

  if (type === "none" || opacity <= 0) return null;

  const alpha = opacity / 100;

  return (
    <div
      className="absolute inset-0 pointer-events-none z-15 select-none"
      style={{
        opacity: alpha,
        mixBlendMode: blendMode,
      }}
    >
      {type === "grain" && (
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `url("${grainDataUrl}")`,
            backgroundRepeat: "repeat",
            backgroundSize: "180px 180px",
          }}
        />
      )}

      {type === "paper" && (
        <svg
          className="w-full h-full object-cover"
          xmlns="http://www.w3.org/2000/svg"
        >
          <filter id="paper-texture-filter">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.04"
              numOctaves="5"
              result="noise"
            />
            <feDiffuseLighting
              in="noise"
              lightingColor="#fff"
              surfaceScale="2"
              result="light"
            >
              <feDistantLight azimuth="45" elevation="60" />
            </feDiffuseLighting>
            <feBlend mode="multiply" in="SourceGraphic" in2="light" />
          </filter>
          <rect
            width="100%"
            height="100%"
            fill="#eae6df"
            filter="url(#paper-texture-filter)"
          />
        </svg>
      )}

      {type === "scratches" && (
        <div
          className="w-full h-full opacity-60"
          style={{
            backgroundImage: `
              repeating-linear-gradient(45deg, transparent, transparent 15px, rgba(255,255,255,0.06) 15px, rgba(255,255,255,0.06) 16px),
              repeating-linear-gradient(-35deg, transparent, transparent 28px, rgba(0,0,0,0.08) 28px, rgba(0,0,0,0.08) 29px)
            `,
          }}
        />
      )}
    </div>
  );
};
