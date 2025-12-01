"use client";

import React, { memo } from "react";
import { ImageElement } from "../../types";

export const ImageLayer = memo(
  ({
    img,
    isSelected,
    isDragging,
    onMouseDown,
  }: {
    img: ImageElement;
    isSelected: boolean;
    isDragging: boolean;
    onMouseDown: (e: React.MouseEvent, id: string) => void;
  }) => {
    const hasCrop =
      img.style.crop.top > 0 ||
      img.style.crop.right > 0 ||
      img.style.crop.bottom > 0 ||
      img.style.crop.left > 0;
    const hasShapeClip = img.style.clipPath !== "none";

    let clipStyle = undefined;
    if (hasShapeClip) {
      clipStyle = img.style.clipPath;
    } else if (hasCrop) {
      clipStyle = `inset(${img.style.crop.top}% ${img.style.crop.right}% ${img.style.crop.bottom}% ${img.style.crop.left}%)`;
    }

    // Calculate if element has 3D rotation
    const has3DRotation = img.style.rotateX !== 0 || img.style.rotateY !== 0;

    return (
      <div
        className={`absolute cursor-move transition-transform ${
          isDragging ? "duration-0" : "duration-100"
        } ease-out hover:ring-1 hover:ring-white/30 ${
          isSelected ? "ring-2 ring-primary z-20" : "z-10"
        }`}
        onMouseDown={(e) => onMouseDown(e, img.id)}
        style={{
          left: img.position.x,
          top: img.position.y,
          willChange: isSelected || isDragging ? "transform" : undefined,
          // Enhanced 3D transform
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
          borderRadius: `${img.style.borderRadius}px`,
          boxShadow: img.style.shadow === "none" ? "none" : img.style.shadow,
          opacity: img.style.opacity / 100,
          filter: `blur(${img.style.blur}px) ${isSelected ? "brightness(1.03)" : ""}`,
          clipPath: clipStyle,
          backfaceVisibility: has3DRotation ? "visible" : "hidden",
          contain: "layout style paint",
        }}
      >
        {/* noise */}
        {img.style.noise > 0 && (
          <div
            className="absolute inset-0 z-10 pointer-events-none rounded-[inherit] mix-blend-overlay"
            style={{
              opacity: img.style.noise / 100,
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.5' numOctaves='4' seed='15' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3CfeComponentTransfer%3E%3CfeFuncA type='discrete' tableValues='1 1'/%3E%3C/feComponentTransfer%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
              backgroundRepeat: "repeat",
              contain: "strict",
            }}
          />
        )}

        <img
          src={img.src}
          alt="Layer"
          draggable={false}
          loading="lazy"
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
  },
  (prev, next) => {
    return (
      prev.img.id === next.img.id &&
      prev.img.position.x === next.img.position.x &&
      prev.img.position.y === next.img.position.y &&
      prev.img.style === next.img.style &&
      prev.isSelected === next.isSelected &&
      prev.isDragging === next.isDragging
    );
  }
);
ImageLayer.displayName = "ImageLayer";