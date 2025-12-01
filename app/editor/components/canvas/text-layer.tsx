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
    return (
      <div
        className={`absolute cursor-move select-none hover:ring-1 hover:ring-white/50 transition-all ${
          isDragging ? "duration-0" : "duration-100"
        } ${isSelected ? "ring-2 ring-primary z-50" : "z-30"}`}
        onMouseDown={(e) => onMouseDown(e, element.id)}
        style={{
          left: element.position.x,
          top: element.position.y,
          willChange: isSelected || isDragging ? "transform, left, top" : undefined,
          transformStyle: "preserve-3d",
          transform: `translateZ(${isSelected ? 30 : 10}px)`,
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
          backfaceVisibility: "hidden",
          contain: "layout style paint",
          filter: isSelected ? "brightness(1.03)" : "none",
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