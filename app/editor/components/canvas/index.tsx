"use client";

import { forwardRef, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Image as ImageIcon } from "lucide-react";
import { ImageLayer } from "./image-layer";
import { TextLayer } from "./text-layer";
import { EditorCanvasProps } from "../../types";

export const Canvas = forwardRef<HTMLDivElement, EditorCanvasProps>(
  (
    {
      width,
      height,
      canvasBackground,
      elements,
      onEmptyClick,
      selectedElementId,
      onElementMouseDown,
      onMouseMove,
      onMouseUp,
      isDragging,
      isCropping,
      onCropChange,
    },
    ref,
  ) => {
    const handleEmptyClick = useCallback(() => {
      onEmptyClick();
    }, [onEmptyClick]);

    const getBackgroundStyle = (
      bg: string,
      aspectWidth: number,
      aspectHeight: number,
    ) => {
      if (bg.startsWith("url(")) {
        const isTallCanvas = aspectHeight >= aspectWidth;

        return {
          backgroundImage: bg,
          backgroundSize: isTallCanvas ? "cover" : "contain",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        };
      }
      return {
        background: bg,
      };
    };

    const visibleElements = elements.filter((el) => el.isVisible);

    return (
      <Card className="p-0 bg-white border-none shadow-none overflow-visible relative group/canvas touch-none">
        <div
          ref={ref}
          data-canvas="true"
          className="relative overflow-hidden transition-all duration-300 ease-in-out flex items-center justify-center select-none touch-none"
          style={{
            width: width,
            height: height,
            ...getBackgroundStyle(canvasBackground, width, height),
            transformStyle: "preserve-3d",
            perspective: "2500px",
            perspectiveOrigin: "center center",
            contain: "layout style paint",
          }}
          onPointerMove={onMouseMove as any}
          onPointerUp={onMouseUp as any}
          onPointerLeave={onMouseUp as any}
        >
          {/* Show placeholder if no elements AND background is not an image */}
          {elements.length === 0 && !canvasBackground.includes("url(") && (
            <div
              onClick={handleEmptyClick}
              className="group w-52 h-32 border-2 border-dashed border-white hover:border-white/70 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:backdrop-blur-xs transition-all z-10"
            >
              <ImageIcon className="size-8 mb-2 text-white group-hover:text-white/70" />
              <span className="text-sm text-white font-medium font-inter group-hover:text-white/70">
                Click to Upload
              </span>
            </div>
          )}

          {visibleElements.map((el, index) => {
            const isSelected = selectedElementId === el.id;
            const zIndex = index + 1;
            const wrapperStyle = {
              zIndex,
            };

            if (el.type === "image") {
              return (
                <div key={el.id} style={wrapperStyle}>
                  <ImageLayer
                    img={el}
                    isSelected={isSelected}
                    isDragging={isDragging && isSelected}
                    onPointerDown={el.isLocked ? undefined : (onElementMouseDown as any)}
                    isCropping={isCropping && isSelected}
                    onCropChange={onCropChange}
                    isLocked={el.isLocked}
                  />
                </div>
              );
            } else if (el.type === "text") {
              return (
                <div key={el.id} style={wrapperStyle}>
                  <TextLayer
                    element={el}
                    isSelected={isSelected}
                    isDragging={isDragging && isSelected}
                    onPointerDown={el.isLocked ? undefined : (onElementMouseDown as any)}
                    isLocked={el.isLocked}
                  />
                </div>
              );
            }
            return null;
          })}
        </div>
      </Card>
    );
  },
);

Canvas.displayName = "Canvas";
