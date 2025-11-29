"use client";

import { forwardRef } from "react";
import { Card } from "@/components/ui/card";
import { Image as ImageIcon } from "lucide-react";
import { TextElement, ImageElement } from "./types";

interface EditorCanvasProps {
  width: number;
  height: number;
  canvasBackground: string;
  imageElements: ImageElement[];
  onEmptyClick: () => void;
  textElements: TextElement[];
  selectedElement: string | null;
  onElementMouseDown: (e: React.MouseEvent, elementId: string) => void;
  onMouseMove: (e: React.MouseEvent) => void;
  onMouseUp: () => void;
}

export const Canvas = forwardRef<HTMLDivElement, EditorCanvasProps>(
  (
    {
      width,
      height,
      canvasBackground,
      imageElements,
      onEmptyClick,
      textElements,
      selectedElement,
      onElementMouseDown,
      onMouseMove,
      onMouseUp,
    },
    ref,
  ) => {
    return (
      <Card className="p-0 bg-transparent border-none shadow-none overflow-visible relative group/canvas">
        <div
          ref={ref}
          className="relative overflow-hidden transition-all duration-300 ease-in-out flex items-center justify-center select-none"
          style={{
            width: width,
            height: height,
            background: canvasBackground,
          }}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
        >
          {/* Fallback if no images */}
          {imageElements.length === 0 && (
            <div 
              onClick={onEmptyClick}
              className="w-64 h-40 bg-background/20 backdrop-blur-sm border-2 border-dashed border-neutral-400 rounded-lg flex flex-col items-center justify-center text-neutral-500 cursor-pointer hover:bg-background/30 hover:border-neutral-400 transition-all z-10"
            >
              <ImageIcon className="w-8 h-8 mb-2 opacity-50 text-neutral-400" />
              <span className="text-xs text-neutral-400 font-medium">Click to Upload</span>
            </div>
          )}

          {/* User Image Layers */}
          {imageElements.map((img) => (
            <div
              key={img.id}
              className={`absolute cursor-move transition-transform duration-75 ease-linear hover:ring-1 hover:ring-white/30 ${
                selectedElement === img.id ? "ring-2 ring-primary z-20" : "z-10"
              }`}
              onMouseDown={(e) => onElementMouseDown(e, img.id)}
              style={{
                left: img.position.x,
                top: img.position.y,
                transform: `
                  perspective(1000px) 
                  rotateX(${img.style.rotateX}deg) 
                  rotateY(${img.style.rotateY}deg) 
                  rotateZ(${img.style.rotate}deg) 
                  scale(${img.style.scale / 100})
                  scaleX(${img.style.flipX ? -1 : 1})
                  scaleY(${img.style.flipY ? -1 : 1})
                `,
                borderRadius: `${img.style.borderRadius}px`,
                boxShadow: img.style.shadow === 'none' ? 'none' : img.style.shadow,
                opacity: img.style.opacity / 100,
                filter: `blur(${img.style.blur}px)`,
                clipPath: img.style.clipPath !== 'none' 
                  ? img.style.clipPath 
                  : `inset(${img.style.crop.top}% ${img.style.crop.right}% ${img.style.crop.bottom}% ${img.style.crop.left}%)`,
              }}
            >
              {/* Noise Overlay */}
              {img.style.noise > 0 && (
                  <div 
                      className="absolute inset-0 z-10 pointer-events-none rounded-[inherit]"
                      style={{
                          opacity: img.style.noise / 100,
                          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E")`
                      }}
                  />
              )}

              <img
                src={img.src}
                alt="Layer"
                draggable={false}
                className="block object-contain pointer-events-none"
                style={{
                  borderRadius: `${img.style.borderRadius}px`,
                  maxWidth: "none",
                  maxHeight: "none",
                  // Ensure clip path works on image if parent radius doesn't cut it
                  clipPath: img.style.clipPath !== 'none' 
                  ? img.style.clipPath 
                  : `inset(${img.style.crop.top}% ${img.style.crop.right}% ${img.style.crop.bottom}% ${img.style.crop.left}%)`,
                }}
              />
            </div>
          ))}

          {/* Text Elements Layer */}
          {textElements.map((element) => (
            <div
              key={element.id}
              className={`absolute cursor-move select-none hover:ring-1 hover:ring-white/50 transition-shadow ${
                selectedElement === element.id ? "ring-2 ring-primary z-50" : "z-30"
              }`}
              style={{
                left: element.position.x,
                top: element.position.y,
                fontSize: element.style.fontSize,
                fontFamily: element.style.fontFamily,
                fontWeight: element.style.fontWeight,
                color: element.style.color,
                textShadow: element.style.textShadow,
                backgroundColor: element.style.showBackground ? element.style.backgroundColor : "transparent",
                borderRadius: `${element.style.borderRadius}px`,
                padding: `${element.style.padding}px`,
                lineHeight: 1.2,
              }}
              onMouseDown={(e) => onElementMouseDown(e, element.id)}
            >
              {element.content}
            </div>
          ))}
        </div>
      </Card>
    );
  },
);

Canvas.displayName = "Canvas";