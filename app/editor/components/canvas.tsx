"use client";

import { forwardRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Undo2, Redo2 } from "lucide-react";
import { TextElement, CANVAS_SIZE } from "./types";

interface EditorCanvasProps {
  backgroundImage: string | null;
  backgroundImageSize: number;
  textElements: TextElement[];
  selectedElement: string | null;
  onElementMouseDown: (e: React.MouseEvent, elementId: string) => void;
  onMouseMove: (e: React.MouseEvent) => void;
  onMouseUp: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

export const Canvas = forwardRef<HTMLDivElement, EditorCanvasProps>(
  (
    {
      backgroundImage,
      backgroundImageSize,
      textElements,
      selectedElement,
      onElementMouseDown,
      onMouseMove,
      onMouseUp,
      onUndo,
      onRedo,
      canUndo,
      canRedo,
    },
    ref
  ) => {
    return (
      <Card className="p-4 bg-surface border border-border">
        <div
          ref={ref}
          className="relative border-2 border-dashed border-border rounded-lg mx-auto"
          style={{
            width: CANVAS_SIZE.width,
            height: CANVAS_SIZE.height,
            backgroundColor: "var(--color-muted)",
            overflow: "hidden", // Prevent overflow
          }}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
        >
          {/* Background Image - Properly Constrained */}
          {backgroundImage && (
            <div 
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
              style={{
                width: "100%",
                height: "100%",
              }}
            >
              <img
                src={backgroundImage}
                alt="Background"
                style={{
                  maxWidth: `${backgroundImageSize}%`,
                  maxHeight: "100%",
                  width: "auto",
                  height: "auto",
                  objectFit: "contain",
                }}
              />
            </div>
          )}

          {/* Text Elements */}
          {textElements.map((element) => (
            <div
              key={element.id}
              className={`absolute cursor-move select-none transition-all ${
                selectedElement === element.id ? "ring-2 ring-primary rounded px-1" : ""
              }`}
              style={{
                left: element.position.x,
                top: element.position.y,
                fontSize: element.style.fontSize,
                fontFamily: element.style.fontFamily,
                fontWeight: element.style.fontWeight,
                color: element.style.color,
                textShadow: element.style.textShadow,
                zIndex: 10,
              }}
              onMouseDown={(e) => onElementMouseDown(e, element.id)}
            >
              {element.content}
            </div>
          ))}

          {/* Undo/Redo - Bottom Left */}
          <div className="absolute left-3 bottom-3 flex gap-2 z-20">
            <Button
              onClick={onUndo}
              disabled={!canUndo}
              variant="outline"
              size="icon"
              className="h-8 w-8 bg-surface"
            >
              <Undo2 className="w-4 h-4" />
            </Button>
            <Button
              onClick={onRedo}
              disabled={!canRedo}
              variant="outline"
              size="icon"
              className="h-8 w-8 bg-surface"
            >
              <Redo2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>
    );
  }
);

Canvas.displayName = "Canvas";
