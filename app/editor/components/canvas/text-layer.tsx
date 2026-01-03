"use client";

import React, { memo } from "react";
import { TextElement } from "../../types";

export const TextLayer = memo(
  ({
    element,
    isSelected,
    isDragging,
    onMouseDown,
  }: {
    element: TextElement;
    isSelected: boolean;
    isDragging: boolean;
    onMouseDown: (e: React.MouseEvent, id: string) => void;
  }) => {
    const getEffectStyles = () => {
      const effects = element.style.textEffect || [];
      const baseColor = element.style.color;

      const styles: React.CSSProperties = {};

      if (effects.includes("outline")) {
        styles.color = "transparent";
        styles.WebkitTextStroke = `1px ${baseColor}`;
      }

      const decorations = [];
      if (effects.includes("underline")) decorations.push("underline");
      if (effects.includes("line-through")) decorations.push("line-through");

      if (decorations.length > 0) {
        styles.textDecoration = decorations.join(" ");
      }

      if (effects.includes("italic")) {
        styles.fontStyle = "italic";
      }

      if (effects.includes("uppercase")) {
        styles.textTransform = "uppercase";
      }

      if (effects.includes("small-caps")) {
        styles.fontVariant = "small-caps";
      }

      if (effects.includes("blur")) {
        styles.filter = "blur(2px)";
      }

      return styles;
    };

    const has3DRotation =
      (element.style.rotateX || 0) !== 0 || (element.style.rotateY || 0) !== 0;

    return (
      <div
        className={`absolute cursor-move select-none hover:ring-1 hover:ring-white/50 transition-all ${
          isDragging ? "duration-0" : "duration-100"
        } ${isSelected ? "ring-2 ring-primary z-50" : "z-30"}`}
        onMouseDown={(e) => onMouseDown(e, element.id)}
        style={{
          left: element.position.x,
          top: element.position.y,
          willChange:
            isSelected || isDragging ? "transform, left, top" : undefined,
          transformStyle: "preserve-3d",
          transform: `
            perspective(${has3DRotation ? 1000 : 700}px)
            rotateX(${element.style.rotateX || 0}deg)
            rotateY(${element.style.rotateY || 0}deg)
            rotateZ(${element.style.rotate || 0}deg)
            translateZ(${isSelected ? 20 : 10}px)
          `,
          fontSize: element.style.fontSize,
          fontFamily: element.style.fontFamily,
          fontWeight: element.style.fontWeight,
          color: element.style.color,
          textShadow: element.style.textShadow,
          backgroundColor: element.style.showBackground
            ? element.style.backgroundColor
            : "transparent",
          borderRadius: `${element.style.borderRadius}px`,
          padding: `${element.style.padding}px`,
          lineHeight: 1.2,
          backfaceVisibility: "visible",
          contain: "layout style paint",
          filter: isSelected ? "brightness(1.03)" : "none",
          ...getEffectStyles(),
        }}
      >
        {element.content}
      </div>
    );
  },
  (prev, next) => {
    return (
      prev.element.id === next.element.id &&
      prev.element.position.x === next.element.position.x &&
      prev.element.position.y === next.element.position.y &&
      prev.element.style === next.element.style &&
      prev.element.content === next.element.content &&
      prev.isSelected === next.isSelected &&
      prev.isDragging === next.isDragging
    );
  }
);
TextLayer.displayName = "TextLayer";
