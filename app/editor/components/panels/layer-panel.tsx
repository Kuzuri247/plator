"use client";

import { useStore } from "../../store/use-store";
import {
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Trash2,
  ArrowUp,
  ArrowDown,
  Type,
  Image as ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export function LayerPanel() {
  const {
    elements,
    selectedElementId,
    selectElement,
    toggleVisibility,
    toggleLock,
    reorderElement,
    removeElement,
  } = useStore();

  const displayElements = [...elements].reverse();

  return (
    <div className="flex flex-col h-full w-full">
      <div className="px-4 py-3 border-b dark:border-neutral-800">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Layers ({elements.length})
        </h3>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2 space-y-2">
          {displayElements.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground text-xs">
              No layers added yet.
            </div>
          ) : (
            displayElements.map((element) => (
              <div
                key={element.id}
                className={cn(
                  "group flex items-center gap-2 p-2 rounded-md border transition-all hover:bg-muted/50 dark:hover:border-yellow-700 hover:border-yellow-400",
                  selectedElementId === element.id
                    ? "border-primary dark:border-primary/50 bg-primary/5 shadow-sm"
                    : "border-neutral-300 dark:border-neutral-700 bg-card",
                )}
                onClick={() => selectElement(element.id)}
              >
                <div className="p-2 rounded-md bg-muted text-muted-foreground border-neutral-300 dark:border-neutral-700">
                  {element.type === "text" ? (
                    <Type size={14} />
                  ) : (
                    <ImageIcon size={14} />
                  )}
                </div>

                <div className="flex-1 min-w-0 flex flex-col items-start">
                  <span className="text-sm font-medium truncate w-full">
                    {element.name ||
                      (element.type === "text" ? "Text Layer" : "Image Layer")}
                  </span>
                  <span className="text-[10px] text-muted-foreground truncate opacity-70">
                    {element.id.slice(0, 16)}...
                  </span>
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

                  <div className="flex flex-col gap-0.5">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-3 w-6"
                      onClick={(e) => {
                        e.stopPropagation();
                        reorderElement(element.id, "up");
                      }}
                    >
                      <ArrowUp size={8} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-3 w-6"
                      onClick={(e) => {
                        e.stopPropagation();
                        reorderElement(element.id, "down");
                      }}
                    >
                      <ArrowDown size={8} />
                    </Button>
                  </div>

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
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
