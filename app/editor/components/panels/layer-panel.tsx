"use client";

import { useStore } from "../../store/use-store";
import {
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Trash2,
  Type,
  Image as ImageIcon,
  GripVertical,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Reorder, useDragControls } from "motion/react";
import { CanvasElement } from "../../types";
import { useEffect, useState, useRef, useCallback, memo } from "react";

export function LayerPanel() {
  const { elements, setElements } = useStore();

  const [displayElements, setDisplayElements] = useState<CanvasElement[]>([]);

  const isDraggingRef = useRef(false);

  // Capture latest values in refs to avoid recreating callbacks
  // This pattern is updated during render (not in useEffect) to ensure synchronous access
  const latestDisplayElements = useRef<CanvasElement[]>([]);
  latestDisplayElements.current = displayElements;

  const setElementsRef = useRef(setElements);
  setElementsRef.current = setElements;

  useEffect(() => {
    if (!isDraggingRef.current) {
      setDisplayElements([...elements].reverse());
    }
  }, [elements]);

  const handleReorder = useCallback((newOrder: CanvasElement[]) => {
    setDisplayElements(newOrder);
  }, []);

  const handleDragStart = useCallback(() => {
    isDraggingRef.current = true;
  }, []);

  const handleDragEnd = useCallback(() => {
    isDraggingRef.current = false;
    setElementsRef.current([...latestDisplayElements.current].reverse());
  }, []);

  return (
    <div className="flex flex-col h-full w-full">
      <div className="px-4 py-3 border-b dark:border-neutral-800">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Layers ({elements.length})
        </h3>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2">
          {displayElements.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground text-xs">
              No layers added yet.
            </div>
          ) : (
            <Reorder.Group
              axis="y"
              values={displayElements}
              onReorder={handleReorder}
              className="space-y-2"
              layoutScroll
            >
              {displayElements.map((element) => (
                <SortableLayer
                  key={element.id}
                  element={element}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                />
              ))}
            </Reorder.Group>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

const SortableLayer = memo(function SortableLayer({
  element,
  onDragStart,
  onDragEnd,
}: {
  element: CanvasElement;
  onDragStart: () => void;
  onDragEnd: () => void;
}) {
  const {
    selectedElementId,
    selectElement,
    toggleVisibility,
    toggleLock,
    removeElement,
  } = useStore();

  const controls = useDragControls();

  return (
    <Reorder.Item
      value={element}
      dragListener={false}
      dragControls={controls}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      whileDrag={{
        scale: 1.02,
        zIndex: 50,
        boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
      }}
      className={cn(
        "group flex items-center p-2 rounded-md border transition-colors relative bg-card touch-none select-none",
        selectedElementId === element.id
          ? "border-primary dark:border-primary/50 bg-primary/5 shadow-sm"
          : "border-neutral-300 dark:border-neutral-700 hover:bg-muted/50 dark:hover:border-yellow-700 hover:border-yellow-400",
      )}
      onClick={() => selectElement(element.id)}
    >
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <div className="p-2 rounded-md bg-muted text-muted-foreground border-neutral-300 dark:border-neutral-700">
          {element.type === "text" ? (
            <Type size={14} />
          ) : (
            <ImageIcon size={14} />
          )}
        </div>

        <div className="flex-1 min-w-0 flex flex-col items-start select-none">
          <span className="text-sm font-medium truncate w-full">
            {element.name ||
              (element.type === "text" ? "Text Layer" : "Image Layer")}
          </span>
          <span className="text-[10px] text-muted-foreground truncate opacity-70">
            {element.id.slice(0, 16)}...
          </span>
        </div>
      </div>

      <div
        className={cn(
          "flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity",
          selectedElementId === element.id && "opacity-100",
        )}
      >
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={(e) => {
            e.stopPropagation();
            toggleLock(element.id);
          }}
        >
          {element.isLocked ? (
            <Lock size={12} className="text-orange-500" />
          ) : (
            <Unlock size={12} />
          )}
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={(e) => {
            e.stopPropagation();
            toggleVisibility(element.id);
          }}
        >
          {element.isVisible ? (
            <Eye size={12} />
          ) : (
            <EyeOff size={12} className="text-muted-foreground" />
          )}
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={(e) => {
            e.stopPropagation();
            removeElement(element.id);
          }}
        >
          <Trash2 size={12} />
        </Button>
      </div>

      <div
        className="p-1.5 rounded-md text-muted-foreground cursor-grab active:cursor-grabbing hover:bg-muted/50 transition-colors ml-1 touch-none"
        onPointerDown={(e) => controls.start(e)}
      >
        <GripVertical size={16} />
      </div>
    </Reorder.Item>
  );
});
