"use client";

import React, { memo, useRef, useMemo, useEffect, useState } from "react";
import { ImageElement } from "../../types";
import { applyDitherToCanvas } from "../../utils/dither-engine";

type CropPosition =
  | "top"
  | "right"
  | "bottom"
  | "left"
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right";

const CropHandle = ({
  position,
  onPointerDown,
}: {
  position: CropPosition;
  onPointerDown: (e: React.PointerEvent) => void;
}) => {
  let cursorClass = "";
  let positionClass = "";
  let indicator = null;

  const baseClass =
    "absolute z-50 flex items-center justify-center pointer-events-auto touch-none";

  if (position === "top") {
    cursorClass = "cursor-ns-resize";
    positionClass = "top-0 left-0 right-0 h-4 -translate-y-1/2";
    indicator = (
      <div className="w-6 h-1 rounded-full bg-primary border border-white/80 shadow-xs pointer-events-none" />
    );
  } else if (position === "bottom") {
    cursorClass = "cursor-ns-resize";
    positionClass = "bottom-0 left-0 right-0 h-4 translate-y-1/2";
    indicator = (
      <div className="w-6 h-1 rounded-full bg-primary border border-white/80 shadow-xs pointer-events-none" />
    );
  } else if (position === "left") {
    cursorClass = "cursor-ew-resize";
    positionClass = "left-0 top-0 bottom-0 w-4 -translate-x-1/2";
    indicator = (
      <div className="w-1 h-6 rounded-full bg-primary border border-white/80 shadow-xs pointer-events-none" />
    );
  } else if (position === "right") {
    cursorClass = "cursor-ew-resize";
    positionClass = "right-0 top-0 bottom-0 w-4 translate-x-1/2";
    indicator = (
      <div className="w-1 h-6 rounded-full bg-primary border border-white/80 shadow-xs pointer-events-none" />
    );
  } else if (position === "top-left") {
    cursorClass = "cursor-nwse-resize";
    positionClass = "top-0 left-0 w-6 h-6 -translate-x-1/2 -translate-y-1/2";
    indicator = (
      <div className="w-2.5 h-2.5 rounded-xs border-2 border-primary bg-background shadow-xs pointer-events-none" />
    );
  } else if (position === "top-right") {
    cursorClass = "cursor-nesw-resize";
    positionClass = "top-0 right-0 w-6 h-6 translate-x-1/2 -translate-y-1/2";
    indicator = (
      <div className="w-2.5 h-2.5 rounded-xs border-2 border-primary bg-background shadow-xs pointer-events-none" />
    );
  } else if (position === "bottom-left") {
    cursorClass = "cursor-nesw-resize";
    positionClass = "bottom-0 left-0 w-6 h-6 -translate-x-1/2 translate-y-1/2";
    indicator = (
      <div className="w-2.5 h-2.5 rounded-xs border-2 border-primary bg-background shadow-xs pointer-events-none" />
    );
  } else if (position === "bottom-right") {
    cursorClass = "cursor-nwse-resize";
    positionClass = "bottom-0 right-0 w-6 h-6 translate-x-1/2 translate-y-1/2";
    indicator = (
      <div className="w-2.5 h-2.5 rounded-xs border-2 border-primary bg-background shadow-xs pointer-events-none" />
    );
  }

  return (
    <div
      onPointerDown={(e) => {
        e.stopPropagation();
        onPointerDown(e);
      }}
      className={`${baseClass} ${positionClass} ${cursorClass}`}
    >
      {indicator}
    </div>
  );
};

function hexToRgbNormalized(hex: string): [number, number, number] {
  const num = parseInt(hex.replace("#", ""), 16);
  return [
    ((num >> 16) & 255) / 255,
    ((num >> 8) & 255) / 255,
    (num & 255) / 255,
  ];
}

export const ImageLayer = memo(
  ({
    img,
    isSelected,
    isDragging,
    isCropping,
    onPointerDown,
    onCropChange,
    isLocked,
  }: {
    img: ImageElement;
    isSelected: boolean;
    isDragging: boolean;
    isCropping: boolean;
    onPointerDown?: (e: React.PointerEvent, id: string) => void;
    onCropChange: (
      id: string,
      newCrop: { top: number; right: number; bottom: number; left: number }
    ) => void;
    isLocked: boolean;
  }) => {
    const layerRef = useRef<HTMLDivElement>(null);
    const ghostRef = useRef<HTMLImageElement>(null);
    const [processedImage, setProcessedImage] = useState<string | null>(null);

    useEffect(() => {
      if (!img.dither?.enabled) {
        setProcessedImage(null);
        return;
      }

      const ditherConfig = {
        ditherType: img.dither.ditherType ?? 1,
        pixelSize: img.dither.pixelSize ?? 4,
        colorSteps: img.dither.colorSteps ?? 4,
        colorFront: img.dither.colorFront || "#ffffff",
        colorBack: img.dither.colorBack || "#000000",
      };

      const processImage = async () => {
        const originalImage = new Image();
        originalImage.crossOrigin = "anonymous";
        originalImage.src = img.src;

        originalImage.onload = () => {
          try {
            const processedCanvas = applyDitherToCanvas(originalImage, {
              ditherType: ditherConfig.ditherType,
              pixelSize: ditherConfig.pixelSize,
              colorSteps: ditherConfig.colorSteps,
              colorFront: hexToRgbNormalized(ditherConfig.colorFront),
              colorBack: hexToRgbNormalized(ditherConfig.colorBack),
            });
            setProcessedImage(processedCanvas.toDataURL());
          } catch (error) {
            console.error("Dither processing failed:", error);
            setProcessedImage(null);
          }
        };

        originalImage.onerror = () => {
          console.error("Failed to load image for dithering");
          setProcessedImage(null);
        };
      };

      processImage();
    }, [img.src, img.dither]);

    const handleCropStart = (e: React.PointerEvent, side: CropPosition) => {
      e.preventDefault();
      e.stopPropagation();
      (e.target as Element).setPointerCapture(e.pointerId);

      const startX = e.clientX;
      const startY = e.clientY;
      const startCrop = { ...img.style.crop };

      const rect = ghostRef.current?.getBoundingClientRect();
      if (!rect) return;

      const handleMove = (moveEvent: PointerEvent) => {
        const deltaX = moveEvent.clientX - startX;
        const deltaY = moveEvent.clientY - startY;

        const deltaPctX = (deltaX / rect.width) * 100;
        const deltaPctY = (deltaY / rect.height) * 100;

        const newCrop = { ...startCrop };

        if (side.includes("left")) {
          newCrop.left = Math.min(
            Math.max(0, startCrop.left + deltaPctX),
            100 - newCrop.right - 5
          );
        }
        if (side.includes("right")) {
          newCrop.right = Math.min(
            Math.max(0, startCrop.right - deltaPctX),
            100 - newCrop.left - 5
          );
        }
        if (side.includes("top")) {
          newCrop.top = Math.min(
            Math.max(0, startCrop.top + deltaPctY),
            100 - newCrop.bottom - 5
          );
        }
        if (side.includes("bottom")) {
          newCrop.bottom = Math.min(
            Math.max(0, startCrop.bottom - deltaPctY),
            100 - newCrop.top - 5
          );
        }

        onCropChange(img.id, newCrop);
      };

      const handleUp = (upEvent: PointerEvent) => {
        (upEvent.target as Element).releasePointerCapture(upEvent.pointerId);
        document.removeEventListener("pointermove", handleMove);
        document.removeEventListener("pointerup", handleUp);
      };

      document.addEventListener("pointermove", handleMove);
      document.addEventListener("pointerup", handleUp);
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
        className={`absolute transition-transform ${
          isDragging ? "duration-0" : "duration-100"
        } ease-out touch-none`}
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
          className={`absolute pointer-events-auto touch-none
            ${
              isLocked ? "cursor-default" : "cursor-move"
            } ${
              isSelected ? "ring-2 ring-primary" : ""
            }
          `}
          onPointerDown={(e) => !isLocked && onPointerDown?.(e, img.id)}
          style={{
            pointerEvents: isLocked ? "none" : "auto",
            inset: `${top}% ${right}% ${bottom}% ${left}%`,
            borderRadius: `${img.style.borderRadius}px`,
            boxShadow: img.style.glassmorphism
              ? "0 8px 32px 0 rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.3)"
              : img.style.shadow === "none"
              ? "none"
              : img.style.shadow,
            border: img.style.glassmorphism
              ? "1px solid rgba(255, 255, 255, 0.35)"
              : undefined,
            backdropFilter: img.style.glassmorphism
              ? `blur(${img.style.glassBlur || 16}px) saturate(180%)`
              : undefined,
            WebkitBackdropFilter: img.style.glassmorphism
              ? `blur(${img.style.glassBlur || 16}px) saturate(180%)`
              : undefined,
            opacity: img.style.opacity / 100,
            filter: `blur(${img.style.blur || 0}px) brightness(${
              (img.style.brightness ?? 100) / 100
            }) contrast(${(img.style.contrast ?? 100) / 100}) saturate(${
              (img.style.saturate ?? 100) / 100
            })`,
            backfaceVisibility: has3DRotation ? "visible" : "hidden",
          }}
        >
          <div
            className="absolute inset-0 overflow-hidden rounded-[inherit]"
            style={{ clipPath: clipStyle }}
          >
            <img
              src={processedImage || img.src}
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
          </div>

          {isSelected && (
            <>
              <div className="absolute inset-0 border border-dashed border-primary/80 pointer-events-none rounded-[inherit]" />
              {/* Handles using Pointer Events */}
              <CropHandle
                position="top"
                onPointerDown={(e) => handleCropStart(e, "top")}
              />
              <CropHandle
                position="bottom"
                onPointerDown={(e) => handleCropStart(e, "bottom")}
              />
              <CropHandle
                position="left"
                onPointerDown={(e) => handleCropStart(e, "left")}
              />
              <CropHandle
                position="right"
                onPointerDown={(e) => handleCropStart(e, "right")}
              />
              <CropHandle
                position="top-left"
                onPointerDown={(e) => handleCropStart(e, "top-left")}
              />
              <CropHandle
                position="top-right"
                onPointerDown={(e) => handleCropStart(e, "top-right")}
              />
              <CropHandle
                position="bottom-left"
                onPointerDown={(e) => handleCropStart(e, "bottom-left")}
              />
              <CropHandle
                position="bottom-right"
                onPointerDown={(e) => handleCropStart(e, "bottom-right")}
              />
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
      JSON.stringify(prev.img.dither) === JSON.stringify(next.img.dither) &&
      prev.isSelected === next.isSelected &&
      prev.isDragging === next.isDragging &&
      prev.isLocked === next.isLocked
    );
  }
);
ImageLayer.displayName = "ImageLayer";
