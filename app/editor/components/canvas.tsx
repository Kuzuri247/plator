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
      <Card className="bg-transparent border-none shadow-none overflow-visible relative group/canvas">
        <div
          ref={ref}
          className="relative overflow-hidden transition-all duration-300 ease-in-out flex items-center justify-center select-none"
          style={{
            width: width,
            height: height,
            background: canvasBackground,
            transformStyle: "preserve-3d",
            perspective: "2000px",
          }}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
        >
          {/* Fallback if no images */}
          {imageElements.length === 0 && (
            <div 
              onClick={onEmptyClick}
              className="w-64 h-40 bg-transparent backdrop-blur-sm border-2 border-dashed border-neutral-400 rounded-lg flex flex-col items-center justify-center text-neutral-500 cursor-pointer hover:bg-background/30 hover:border-neutral-400 z-10"
              style={{
                transformStyle: "preserve-3d",
              }}
            >
              <ImageIcon className="w-8 h-8 mb-2 opacity-50 text-neutral-400" />
              <span className="text-xs text-neutral-400 font-medium">Click to Upload</span>
            </div>
          )}

          {/* User Image Layers */}
          {imageElements.map((img, index) => {
            const hasCrop = img.style.crop.top > 0 || img.style.crop.right > 0 || img.style.crop.bottom > 0 || img.style.crop.left > 0;
            const hasShapeClip = img.style.clipPath !== 'none';
            
            let clipStyle = undefined;
            if (hasShapeClip) {
                clipStyle = img.style.clipPath;
            } else if (hasCrop) {
                clipStyle = `inset(${img.style.crop.top}% ${img.style.crop.right}% ${img.style.crop.bottom}% ${img.style.crop.left}%)`;
            }
            
            // Calculate depth-based z-index and translateZ
            const depthZ = index * 10; 

            return (
              <div
                key={img.id}
                className={`absolute cursor-move transition-all duration-75 ease-linear hover:ring-1 hover:ring-white/30 ${
                  selectedElement === img.id ? "ring-2 ring-primary" : "ring-0"
                }`}
                onMouseDown={(e) => onElementMouseDown(e, img.id)}
                style={{
                  left: img.position.x,
                  top: img.position.y,
                  zIndex: selectedElement === img.id ? 100 : 10 + index ,
                  transformStyle: "preserve-3d",
                  transform: `
                    perspective(2000px)
                    translateZ(${selectedElement === img.id ? depthZ + 50 : depthZ}px)
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
                  filter: `blur(${img.style.blur}px) ${selectedElement === img.id ? 'brightness(1.05)' : ''}`,
                  clipPath: clipStyle,
                  backfaceVisibility: "visible",
                }}
              >
                {/* Noise Overlay */}
                {img.style.noise > 0 && (
                    <div 
                        className="absolute inset-0 z-10 pointer-events-none rounded-[inherit]"
                        style={{
                            opacity: img.style.noise / 100,
                            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E")`,
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
                    clipPath: clipStyle,
                  }}
                />
              </div>
            );
          })}

          {/* Text Elements Layer */}
          {textElements.map((element, index) => {
            const textDepthZ = (imageElements.length + index) * 10 + 20;
            
            return (
              <div
                key={element.id}
                className={`absolute cursor-move select-none hover:ring-1 hover:ring-white/50 transition-all ${
                  selectedElement === element.id ? "ring-2 ring-primary" : ""
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
                  lineHeight: 1.1,
                  zIndex: selectedElement === element.id ? 100 : 30 + index,
                  transformStyle: "preserve-3d",
                  transform: `translateZ(${selectedElement === element.id ? textDepthZ  : textDepthZ}px)`,
                  filter: selectedElement === element.id ? 'brightness(1.05)' : 'none',
                  backfaceVisibility: "visible",
                }}
                onMouseDown={(e) => onElementMouseDown(e, element.id)}
              >
                {element.content}
              </div>
            );
          })}
        </div>
      </Card>
    );
  },
);

Canvas.displayName = "Canvas";
