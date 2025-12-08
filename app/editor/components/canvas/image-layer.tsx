"use client";

import React, { memo, useRef } from "react";
import { ImageElement } from "../../types";

type CropPosition = "top" | "right" | "bottom" | "left" | "top-left" | "top-right" | "bottom-left" | "bottom-right";

// Helper for crop handles
const CropHandle = ({ 
  position, 
  onMouseDown 
}: { 
  position: CropPosition, 
  onMouseDown: (e: React.MouseEvent) => void 
}) => {
  let cursorClass = "";
  let positionClass = "";
  
  const baseClass = "absolute z-50 flex items-center justify-center pointer-events-auto";
  
  if (position === "top") {
    cursorClass = "cursor-ns-resize";
    positionClass = "top-0 left-0 right-0 h-1.5 -translate-y-1/2";
  } else if (position === "bottom") {
    cursorClass = "cursor-ns-resize";
    positionClass = "bottom-0 left-0 right-0 h-1.5 translate-y-1/2";
  } else if (position === "left") {
    cursorClass = "cursor-ew-resize";
    positionClass = "left-0 top-0 bottom-0 w-1.5 -translate-x-1/2";
  } else if (position === "right") {
    cursorClass = "cursor-ew-resize";
    positionClass = "right-0 top-0 bottom-0 w-1.5 translate-x-1/2";
  } else if (position === "top-left") {
    cursorClass = "cursor-nwse-resize";
    positionClass = "top-0 left-0 w-3 h-3 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white";
  } else if (position === "top-right") {
    cursorClass = "cursor-nesw-resize";
    positionClass = "top-0 right-0 w-3 h-3 translate-x-1/2 -translate-y-1/2 rounded-full border border-white";
  } else if (position === "bottom-left") {
    cursorClass = "cursor-nesw-resize";
    positionClass = "bottom-0 left-0 w-3 h-3 -translate-x-1/2 translate-y-1/2 rounded-full border border-white";
  } else if (position === "bottom-right") {
    cursorClass = "cursor-nwse-resize";
    positionClass = "bottom-0 right-0 w-3 h-3 translate-x-1/2 translate-y-1/2 rounded-full border border-white";
  }

  return (
    <div
      onMouseDown={(e) => { e.stopPropagation(); onMouseDown(e); }}
      className={`${baseClass} ${positionClass} ${cursorClass}`}
    />
  );
};

export const ImageLayer = memo(
  ({
    img,
    isSelected,
    isDragging,
    isCropping,
    onMouseDown,
    onCropChange,
  }: {
    img: ImageElement;
    isSelected: boolean;
    isDragging: boolean;
    isCropping: boolean;
    onMouseDown: (e: React.MouseEvent, id: string) => void;
    onCropChange: (id: string, newCrop: { top: number; right: number; bottom: number; left: number }) => void;
  }) => {
    const layerRef = useRef<HTMLDivElement>(null);
    const ghostRef = useRef<HTMLImageElement>(null);
    
    const handleCropStart = (e: React.MouseEvent, side: CropPosition) => {
      e.preventDefault();
      e.stopPropagation();
      
      const startX = e.clientX;
      const startY = e.clientY;
      const startCrop = { ...img.style.crop };
      
      const rect = ghostRef.current?.getBoundingClientRect();
      if (!rect) return;

      const handleMove = (moveEvent: MouseEvent) => {
        const deltaX = moveEvent.clientX - startX;
        const deltaY = moveEvent.clientY - startY;
        
        const deltaPctX = (deltaX / rect.width) * 100;
        const deltaPctY = (deltaY / rect.height) * 100;

        const newCrop = { ...startCrop };

        if (side.includes("left")) {
          newCrop.left = Math.min(Math.max(0, startCrop.left + deltaPctX), 100 - newCrop.right - 5);
        }
        if (side.includes("right")) {
          newCrop.right = Math.min(Math.max(0, startCrop.right - deltaPctX), 100 - newCrop.left - 5);
        }
        if (side.includes("top")) {
          newCrop.top = Math.min(Math.max(0, startCrop.top + deltaPctY), 100 - newCrop.bottom - 5);
        }
        if (side.includes("bottom")) {
          newCrop.bottom = Math.min(Math.max(0, startCrop.bottom - deltaPctY), 100 - newCrop.top - 5);
        }

        onCropChange(img.id, newCrop);
      };

      const handleUp = () => {
        document.removeEventListener("mousemove", handleMove);
        document.removeEventListener("mouseup", handleUp);
      };

      document.addEventListener("mousemove", handleMove);
      document.addEventListener("mouseup", handleUp);
    };

    const has3DRotation = img.style.rotateX !== 0 || img.style.rotateY !== 0;

    const hasShapeClip = img.style.clipPath && img.style.clipPath !== "none";
    const clipStyle = hasShapeClip ? img.style.clipPath : undefined;

    const { top, right, bottom, left } = img.style.crop;    

    const widthFactor = 100 / Math.max(1, 100 - left - right);
    const heightFactor = 100 / Math.max(1, 100 - top - bottom);

    return (
      <div
        ref={layerRef}
        className={`absolute transition-transform ${isDragging ? "duration-0" : "duration-100"} ease-out`}
        style={{
          left: img.position.x,
          top: img.position.y,
          willChange: isSelected || isDragging ? "transform" : undefined,
          transformStyle: "preserve-3d",
          transform: `
            perspective(${has3DRotation ? 2000 : 1500}px) 
            rotateX(${img.style.rotateX}deg) 
            rotateY(${img.style.rotateY}deg) 
            rotateZ(${img.style.rotate}deg) 
            scale3d(${img.style.scale / 100}, ${img.style.scale / 100}, 1)
            scaleX(${img.style.flipX ? -1 : 1})
            scaleY(${img.style.flipY ? -1 : 1})
            translateZ(${isSelected ? 20 : 0}px)
          `,
          pointerEvents: "none",
        }}
      >
        <img
          ref={ghostRef}
          src={img.src}
          alt=""
          className="opacity-0 pointer-events-none block"
          style={{ maxWidth: "none" }}
          draggable={false}
        />

        <div
          className={`absolute pointer-events-auto cursor-move
            ${isSelected && !isCropping ? "ring-2 ring-primary z-20" : "z-10"} 
            ${isCropping ? "z-50 ring-1 ring-dashed ring-primary/50" : ""}
          `}
          onMouseDown={(e) => !isCropping && onMouseDown(e, img.id)}
          style={{
             inset: `${top}% ${right}% ${bottom}% ${left}%`,
             borderRadius: `${img.style.borderRadius}px`,
             boxShadow: img.style.shadow === "none" ? "none" : img.style.shadow,
             opacity: img.style.opacity / 100,
             filter: `blur(${img.style.blur}px) ${isSelected ? "brightness(1.03)" : ""}`,
             backfaceVisibility: has3DRotation ? "visible" : "hidden",
          }}
        >
            <div 
                className="absolute inset-0 overflow-hidden rounded-[inherit]"
                style={{ clipPath: clipStyle }}
            >
                <img
                    src={img.src}
                    alt="Layer"
                    draggable={false}
                    className="block object-contain pointer-events-none max-w-none max-h-none absolute"
                    style={{
                        width: `${widthFactor * 100}%`,
                        height: `${heightFactor * 100}%`,
                        left: `${-left * widthFactor}%`,
                        top: `${-top * heightFactor}%`,
                    }}
                />

                {/* noise  */}
                {img.style.noise > 0 && (
                    <div
                        className="absolute inset-0 z-10 pointer-events-none mix-blend-overlay"
                        style={{
                            opacity: img.style.noise / 100,
                            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.5' numOctaves='4' seed='15' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3CfeComponentTransfer%3E%3CfeFuncA type='discrete' tableValues='1 1'/%3E%3C/feComponentTransfer%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                            backgroundRepeat: "repeat",
                        }}
                    />
                )}
            </div>

            {isCropping && isSelected && (
            <>
                <div className="absolute inset-0 border-dashed border-4 border-primary pointer-events-none" />
                
                {/* Edge Handles */}
                <CropHandle position="top" onMouseDown={(e) => handleCropStart(e, "top")} />
                <CropHandle position="bottom" onMouseDown={(e) => handleCropStart(e, "bottom")} />
                <CropHandle position="left" onMouseDown={(e) => handleCropStart(e, "left")} />
                <CropHandle position="right" onMouseDown={(e) => handleCropStart(e, "right")} />
                
                {/* Corner Handles */}
                <CropHandle position="top-left" onMouseDown={(e) => handleCropStart(e, "top-left")} />
                <CropHandle position="top-right" onMouseDown={(e) => handleCropStart(e, "top-right")} />
                <CropHandle position="bottom-left" onMouseDown={(e) => handleCropStart(e, "bottom-left")} />
                <CropHandle position="bottom-right" onMouseDown={(e) => handleCropStart(e, "bottom-right")} />
                
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black/75 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap pointer-events-none backdrop-blur-sm z-50">
                   Drag edges or corners to crop
                </div>
            </>
            )}
        </div>
      </div>
    );
  },
  (prev, next) => {
    return (
      prev.img.id === next.img.id &&
      prev.img.position.x === next.img.position.x &&
      prev.img.position.y === next.img.position.y &&
      prev.img.style === next.img.style &&
      prev.isSelected === next.isSelected &&
      prev.isDragging === next.isDragging &&
      prev.isCropping === next.isCropping 
    );
  }
);
ImageLayer.displayName = "ImageLayer";