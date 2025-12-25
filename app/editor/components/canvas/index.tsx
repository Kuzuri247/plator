"use client";

import { forwardRef, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Image as ImageIcon } from "lucide-react";
import { TextElement, ImageElement } from "../../types";
import { ImageLayer } from "./image-layer";
import { TextLayer } from "./text-layer";

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
  isDragging: boolean;
  isCropping: boolean;
  onCropChange: (id: string, newCrop: any) => void;
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
      isDragging,
      isCropping,
      onCropChange,
    },
    ref
  ) => {
    const handleEmptyClick = useCallback(() => {
      onEmptyClick();
    }, [onEmptyClick]);

    const getBackgroundStyle = (
      bg: string,
      aspectWidth: number,
      aspectHeight: number
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

    return (
      <Card className="p-0 bg-white border-none shadow-none overflow-visible relative group/canvas">
        <div
          ref={ref}
          className="relative overflow-hidden transition-all duration-300 ease-in-out flex items-center justify-center select-none"
          style={{
            width: width,
            height: height,
            ...getBackgroundStyle(canvasBackground, width, height),
            transformStyle: "preserve-3d",
            perspective: "2500px",
            perspectiveOrigin: "center center",
            contain: "layout style",
          }}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
        >
          {imageElements.length === 0 && (
            <div
              onClick={handleEmptyClick}
              className="w-64 h-40 bg-background/20 backdrop-blur-sm border-2 border-dashed border-neutral-400 rounded-lg flex flex-col items-center justify-center text-neutral-500 cursor-pointer hover:bg-background/30 hover:border-neutral-400 transition-all z-10"
            >
              <ImageIcon className="w-8 h-8 mb-2 opacity-50 text-neutral-400" />
              <span className="text-xs text-neutral-400 font-medium">
                Click to Upload
              </span>
            </div>
          )}

          {imageElements.map((img) => (
            <ImageLayer
              key={img.id}
              img={img}
              isSelected={selectedElement === img.id}
              isDragging={isDragging && selectedElement === img.id}
              onMouseDown={onElementMouseDown}
              isCropping={isCropping && selectedElement === img.id}
              onCropChange={onCropChange}
            />
          ))}
          {textElements.map((element) => (
            <TextLayer
              key={element.id}
              element={element}
              isSelected={selectedElement === element.id}
              isDragging={isDragging && selectedElement === element.id}
              onMouseDown={onElementMouseDown}
            />
          ))}
        </div>
      </Card>
    );
  }
);

Canvas.displayName = "Canvas";
