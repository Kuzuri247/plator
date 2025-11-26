"use client";

import { forwardRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Undo2, Redo2, Image as ImageIcon } from "lucide-react";
import { TextElement, ImageStyle, CANVAS_SIZE } from "./types";

interface EditorCanvasProps {
  canvasBackground: string;
  userImage: string | null;
  userImageStyle: ImageStyle;
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
      canvasBackground,
      userImage,
      userImageStyle,
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
    ref,
  ) => {
    return (
      <Card className="p-0 bg-transparent border-none shadow-none overflow-visible relative group/canvas">
        <div
          ref={ref}
          className="relative overflow-hidden shadow-2xl transition-all duration-200 ease-in-out flex items-center justify-center"
          style={{
            width: CANVAS_SIZE.width,
            height: CANVAS_SIZE.height,
            background: canvasBackground,
            borderRadius: "8px",
          }}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
        >
          {/* User Image / Screenshot Layer */}
          <div
            className="relative transition-all duration-200 ease-out"
            style={{
              transform: `scale(${userImageStyle.scale / 100}) rotate(${userImageStyle.rotate}deg)`,
              borderRadius: `${userImageStyle.borderRadius}px`,
              boxShadow: userImageStyle.shadow === 'none' ? 'none' : userImageStyle.shadow,
              maxWidth: "90%",
              maxHeight: "90%",
            }}
          >
            {userImage ? (
              <img
                src={userImage}
                alt="User upload"
                className="block w-full h-full object-contain"
                style={{
                  borderRadius: `${userImageStyle.borderRadius}px`,
                }}
              />
            ) : (
              <div 
                className="w-64 h-40 bg-background/20 backdrop-blur-sm border-2 border-dashed border-white/30 rounded-lg flex flex-col items-center justify-center text-white/50"
              >
                <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
                <span className="text-xs font-medium">No Image</span>
              </div>
            )}
          </div>

          {/* Text Elements Layer */}
          {textElements.map((element) => (
            <div
              key={element.id}
              className={`absolute cursor-move select-none hover:ring-1 hover:ring-white/50 transition-shadow ${
                selectedElement === element.id ? "ring-2 ring-primary z-50" : "z-10"
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

        {/* Floating Canvas Controls */}
        <div className="absolute -bottom-14 left-1/2 -translate-x-1/2 flex gap-2 opacity-0 group-hover/canvas:opacity-100 transition-opacity duration-300">
          <Button
            onClick={onUndo}
            disabled={!canUndo}
            variant="secondary"
            size="icon"
            className="rounded-full shadow-lg bg-background/80 backdrop-blur hover:bg-background"
          >
            <Undo2 className="w-4 h-4" />
          </Button>
          <Button
            onClick={onRedo}
            disabled={!canRedo}
            variant="secondary"
            size="icon"
            className="rounded-full shadow-lg bg-background/80 backdrop-blur hover:bg-background"
          >
            <Redo2 className="w-4 h-4" />
          </Button>
        </div>
      </Card>
    );
  },
);

Canvas.displayName = "Canvas";