"use client";

import React from "react";

export type VectorPatternType =
  | "none"
  | "topographic"
  | "isometric"
  | "dotmatrix"
  | "blueprint"
  | "crosshair";

export interface VectorOverlayProps {
  type: VectorPatternType;
  opacity: number; // 0 to 100
  color?: string;
  blendMode?: "overlay" | "soft-light" | "screen" | "multiply" | "normal";
}

export const VectorOverlay: React.FC<VectorOverlayProps> = ({
  type,
  opacity,
  color = "#ffffff",
  blendMode = "overlay",
}) => {
  if (type === "none" || opacity <= 0) return null;

  const alpha = opacity / 100;

  return (
    <div
      className="absolute inset-0 pointer-events-none z-10 transition-opacity duration-300"
      style={{
        opacity: alpha,
        mixBlendMode: blendMode,
      }}
    >
      {type === "topographic" && (
        <svg
          className="w-full h-full object-cover"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1000 1000"
          preserveAspectRatio="none"
        >
          <defs>
            <pattern
              id="topographic-pattern"
              width="400"
              height="400"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M0,50 Q100,0 200,50 T400,50 M0,100 Q100,60 200,100 T400,100 M0,150 Q100,120 200,150 T400,150 M0,200 Q100,180 200,200 T400,200 M0,250 Q100,220 200,250 T400,250 M0,300 Q100,280 200,300 T400,300 M0,350 Q100,340 200,350 T400,350"
                fill="none"
                stroke={color}
                strokeWidth="1.5"
                strokeOpacity="0.75"
              />
              <path
                d="M50,0 Q0,100 50,200 T50,400 M120,0 Q80,100 120,200 T120,400 M220,0 Q180,100 220,200 T220,400 M320,0 Q280,100 320,200 T320,400"
                fill="none"
                stroke={color}
                strokeWidth="1"
                strokeDasharray="4 6"
                strokeOpacity="0.4"
              />
              <circle cx="200" cy="200" r="40" fill="none" stroke={color} strokeWidth="1" strokeOpacity="0.6" />
              <circle cx="200" cy="200" r="80" fill="none" stroke={color} strokeWidth="1.2" strokeOpacity="0.5" />
              <circle cx="200" cy="200" r="130" fill="none" stroke={color} strokeWidth="1" strokeOpacity="0.4" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#topographic-pattern)" />
        </svg>
      )}

      {type === "isometric" && (
        <svg
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="isometric-grid"
              width="60"
              height="103.923"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M30,0 L60,17.32 L60,51.96 L30,69.28 L0,51.96 L0,17.32 Z M30,103.92 L60,86.6 L60,51.96 L30,69.28 L0,51.96 L0,86.6 Z"
                fill="none"
                stroke={color}
                strokeWidth="1"
                strokeOpacity="0.6"
              />
              <line x1="30" y1="0" x2="30" y2="69.28" stroke={color} strokeWidth="0.8" strokeOpacity="0.4" />
              <line x1="0" y1="51.96" x2="60" y2="51.96" stroke={color} strokeWidth="0.8" strokeOpacity="0.4" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#isometric-grid)" />
        </svg>
      )}

      {type === "dotmatrix" && (
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `radial-gradient(${color} 1.5px, transparent 1.5px)`,
            backgroundSize: "24px 24px",
            backgroundPosition: "0 0",
          }}
        />
      )}

      {type === "crosshair" && (
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="crosshair-grid"
              width="48"
              height="48"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M24,18 L24,30 M18,24 L30,24"
                stroke={color}
                strokeWidth="1.2"
                strokeOpacity="0.8"
              />
              <circle cx="24" cy="24" r="1.5" fill={color} fillOpacity="0.9" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#crosshair-grid)" />
        </svg>
      )}

      {type === "blueprint" && (
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(to right, ${color} 1px, transparent 1px),
              linear-gradient(to bottom, ${color} 1px, transparent 1px),
              linear-gradient(to right, ${color} 1px, transparent 1px),
              linear-gradient(to bottom, ${color} 1px, transparent 1px)
            `,
            backgroundSize: "80px 80px, 80px 80px, 16px 16px, 16px 16px",
            backgroundPosition: "-1px -1px",
            opacity: 0.75,
          }}
        />
      )}
    </div>
  );
};
