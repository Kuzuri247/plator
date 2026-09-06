"use client";

import { useStore } from "../../store/use-store";
import {
  EyeIcon,
  EyeSlashIcon,
  LockSimpleIcon,
  LockSimpleOpenIcon,
  TrashIcon,
  ImageIcon,
  CodeIcon,
  DotsSixVerticalIcon,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Reorder, useDragControls } from "motion/react";
import { CanvasElement, ImageElement, TextElement, CodeElement } from "../../types";
import { useEffect, useState, useRef, useCallback, memo } from "react";

export function LayerPanel() {
  const { elements, setElements } = useStore();

  const [displayElements, setDisplayElements] = useState<CanvasElement[]>([]);

  const isDraggingRef = useRef(false);

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
    <div className="flex flex-col h-full w-full min-w-0 max-w-full overflow-hidden">
      <div className="p-4 pb-3 border-b dark:border-neutral-800 flex items-center justify-between shrink-0">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Layers
        </h3>
        <span className="text-[10px] font-semibold font-manrope text-muted-foreground bg-muted px-2 py-0.5 rounded-full border border-border/50">
          {elements.length} {elements.length === 1 ? "layer" : "layers"}
        </span>
      </div>

      <ScrollArea className="flex-1 w-full min-w-0 overflow-x-hidden">
        <div className="p-2 space-y-2 w-full min-w-0 max-w-full overflow-x-hidden box-border">
          {displayElements.length === 0 ? (
            <div className="text-center py-12 px-4 text-muted-foreground text-xs space-y-1">
              <p className="font-medium">No layers added yet</p>
              <p className="text-[11px] opacity-70">
                Add images or text layers from the sidebar to organize them here.
              </p>
            </div>
          ) : (
            <Reorder.Group
              axis="y"
              values={displayElements}
              onReorder={handleReorder}
              className="space-y-2 w-full min-w-0 max-w-full overflow-hidden"
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
  const isSelected = selectedElementId === element.id;

  // Metadata Extraction
  const isText = element.type === "text";
  const isCode = element.type === "code";
  const textEl = isText ? (element as TextElement) : null;
  const codeEl = isCode ? (element as CodeElement) : null;
  const imgEl = !isText && !isCode ? (element as ImageElement) : null;

  const has3D = isText
    ? Boolean(textEl?.style.rotate || textEl?.style.rotateX || textEl?.style.rotateY)
    : isCode
    ? Boolean(codeEl?.style.rotate || codeEl?.style.rotateX || codeEl?.style.rotateY)
    : Boolean(imgEl?.style.rotate || imgEl?.style.rotateX || imgEl?.style.rotateY);

  const rawText = textEl?.content?.trim() || "Text Layer";
  const rawCode = codeEl?.style?.windowTitle || codeEl?.name || "Code Snippet";
  const rawImageName = imgEl?.placeholderLabel || imgEl?.name || "Image Layer";

  const title = isText
    ? rawText.length > 14
      ? `${rawText.slice(0, 14)}...`
      : rawText
    : isCode
    ? rawCode.length > 14
      ? `${rawCode.slice(0, 14)}...`
      : rawCode
    : rawImageName.length > 14
      ? `${rawImageName.slice(0, 14)}...`
      : rawImageName;

  const subtitle = isText
    ? `${textEl?.style.fontFamily || "Inter"} • ${textEl?.style.fontSize}px`
    : isCode
    ? `${codeEl?.language === "python" ? "Python" : "TypeScript"} • ${codeEl?.style?.fontSize || 14}px`
    : `Scale ${imgEl?.style.scale}% • ${imgEl?.style.opacity}%`;

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
        boxShadow: "0 8px 20px -5px rgba(0,0,0,0.3)",
      }}
      className={cn(
        "group flex flex-col p-2 rounded-lg border transition-all relative bg-card select-none touch-none w-full min-w-0 max-w-full box-border overflow-hidden",
        isSelected
          ? "border-primary dark:border-primary/60 bg-primary/5 shadow-xs ring-1 ring-primary/20"
          : "border-neutral-300 dark:border-neutral-700/80 hover:bg-muted/40 hover:border-neutral-400 dark:hover:border-neutral-600 shadow-2xs",
        !element.isVisible && "opacity-50",
      )}
      onClick={() => selectElement(element.id)}
    >
      {/* Top Row: Thumbnail, Name/Specs, and Quick Actions */}
      <div className="flex items-center gap-2 w-full min-w-0">
        {/* Layer Thumbnail */}
        <div className="size-8 rounded-md overflow-hidden bg-muted/80 border border-neutral-300 dark:border-neutral-700 shrink-0 flex items-center justify-center relative shadow-2xs">
          {isText ? (
            <div
              className="size-full flex items-center justify-center font-bold text-xs"
              style={{
                background: textEl?.style.showBackground
                  ? textEl.style.backgroundType === "solid"
                    ? textEl.style.backgroundColor
                    : textEl.style.backgroundColorVia
                    ? `linear-gradient(${textEl.style.backgroundDirection || "to bottom"}, ${textEl.style.backgroundColor || "#18181b"}, ${textEl.style.backgroundColorVia || "#111113"}, ${textEl.style.backgroundColorEnd || "#09090b"})`
                    : `linear-gradient(${textEl.style.backgroundDirection || "to bottom"}, ${textEl.style.backgroundColor || "#18181b"}, ${textEl.style.backgroundColorEnd || "#09090b"})`
                  : undefined,
              }}
            >
              <span
                style={{
                  color: textEl?.style.color || "#ffffff",
                  fontFamily: textEl?.style.fontFamily,
                  fontWeight: textEl?.style.fontWeight,
                }}
                className="text-xs"
              >
                T
              </span>
            </div>
          ) : isCode ? (
            <div className="size-full flex items-center justify-center bg-neutral-900 border border-white/10 rounded-sm">
              <CodeIcon size={14} className="text-primary" weight="bold" />
            </div>
          ) : imgEl?.src ? (
            <img
              src={imgEl.src}
              alt=""
              className="size-full object-cover"
              draggable={false}
            />
          ) : (
            <ImageIcon size={14} className="text-muted-foreground" />
          )}
        </div>

        {/* Title and Specs */}
        <div className="flex-1 min-w-0 flex flex-col justify-center overflow-hidden pr-0.5">
          <span
            className="text-xs font-semibold truncate text-foreground leading-tight block max-w-full"
            title={isText ? textEl?.content || "Text Layer" : isCode ? codeEl?.style?.windowTitle || "Code Snippet" : imgEl?.name || "Image Layer"}
          >
            {title}
          </span>
          <span className="text-[10px] text-muted-foreground truncate font-medium font-manrope leading-tight mt-0.5 block max-w-full">
            {subtitle}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-0.5 shrink-0">
          {/* Lock Button */}
          <Button
            variant="ghost"
            size="icon"
            aria-label={element.isLocked ? "Unlock layer" : "Lock layer"}
            className={cn(
              "size-6 rounded-md cursor-pointer p-0 shrink-0",
              element.isLocked
                ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 hover:bg-amber-500/25"
                : "text-muted-foreground hover:text-foreground opacity-70 group-hover:opacity-100",
            )}
            title={element.isLocked ? "Unlock Layer" : "Lock Layer"}
            onClick={(e) => {
              e.stopPropagation();
              toggleLock(element.id);
            }}
          >
            {element.isLocked ? <LockSimpleIcon size={13} /> : <LockSimpleOpenIcon size={13} />}
          </Button>

          {/* Visibility Button */}
          <Button
            variant="ghost"
            size="icon"
            aria-label={element.isVisible ? "Hide layer" : "Show layer"}
            className={cn(
              "size-6 rounded-md cursor-pointer p-0 shrink-0",
              !element.isVisible
                ? "text-muted-foreground bg-muted hover:bg-muted/80"
                : "text-muted-foreground hover:text-foreground opacity-70 group-hover:opacity-100",
            )}
            title={element.isVisible ? "Hide Layer" : "Show Layer"}
            onClick={(e) => {
              e.stopPropagation();
              toggleVisibility(element.id);
            }}
          >
            {element.isVisible ? <EyeIcon size={13} /> : <EyeSlashIcon size={13} />}
          </Button>

          {/* Delete Button */}
          <Button
            variant="ghost"
            size="icon"
            aria-label="Delete layer"
            className="size-6 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 cursor-pointer p-0 shrink-0 opacity-70 group-hover:opacity-100"
            title="Delete Layer"
            onClick={(e) => {
              e.stopPropagation();
              removeElement(element.id);
            }}
          >
            <TrashIcon size={13} />
          </Button>

          {/* Drag Handle */}
          <div
            role="button"
            tabIndex={0}
            aria-label="Reorder layer"
            className="p-1 rounded-md text-muted-foreground/60 hover:text-foreground cursor-grab active:cursor-grabbing hover:bg-muted/50 transition-colors shrink-0 touch-none"
            onPointerDown={(e) => controls.start(e)}
            title="Reorder Layer"
          >
            <DotsSixVerticalIcon size={14} />
          </div>
        </div>
      </div>

      {/* Bottom Row: Metadata Badges & Coordinates */}
      <div className="flex items-center gap-1 mt-1.5 pt-1.5 border-t border-border/40 text-[9px] text-muted-foreground font-manrope min-w-0 max-w-full overflow-hidden flex-nowrap">
        {/* Coordinates */}
        <span className="text-[9px] bg-muted/70 dark:bg-muted/50 px-1.5 py-0.2 rounded-xs border border-border/50 shrink-0 truncate">
          X:{Math.round(element.position.x)} &nbsp; Y:{Math.round(element.position.y)}
        </span>

        {/* Feature Badges */}
        {has3D && (
          <span className="px-1 py-0.2 rounded-xs text-[9px] font-semibold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 shrink-0">
            3D
          </span>
        )}

        {isText && textEl?.style.showBackground && (
          <span className="px-1 py-0.2 rounded-xs text-[9px] font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 shrink-0">
            BG
          </span>
        )}

        {((isText && textEl?.style.glassmorphism) ||
          (isCode && codeEl?.style?.glassmorphism) ||
          (!isText && !isCode && imgEl?.style.glassmorphism)) && (
            <span className="px-1 py-0.2 rounded-xs text-[9px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shrink-0">
              Glass
            </span>
          )}

        {!isText && !isCode && imgEl?.dither?.enabled && (
          <span className="px-1 py-0.2 rounded-xs text-[9px] font-semibold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 shrink-0">
            Dither
          </span>
        )}

        {/* Status Indicators */}
        {element.isLocked && (
          <span className="inline-flex items-center gap-0.5 px-1 py-0.2 rounded-xs text-[9px] font-semibold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 shrink-0">
            <LockSimpleIcon size={9} /> Locked
          </span>
        )}

        {!element.isVisible && (
          <span className="inline-flex items-center gap-0.5 px-1 py-0.2 rounded-xs text-[9px] font-semibold bg-muted text-muted-foreground border border-border/60 shrink-0">
            <EyeSlashIcon size={9} /> Hidden
          </span>
        )}
      </div>
    </Reorder.Item>
  );
});

