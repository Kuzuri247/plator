"use client";

import { Download, LayoutTemplate } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BACKGROUND_OPTIONS, ASPECT_RATIOS } from "../../types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RightPanelProps } from "../../types";

export function RightPanel({
  canvasBackground,
  aspectRatio,
  exportFormat,
  exportQuality,
  onCanvasBackgroundChange,
  onAspectRatioChange,
  onExportFormatChange,
  onExportQualityChange,
  onDownload,
}: RightPanelProps) {
  return (
    <div className="flex flex-col h-full w-full">
      <div className="space-y-3 p-4 shrink-0 ">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <LayoutTemplate className="size-4" />
          <span className="text-foreground">Canvas Size</span>
        </div>
        <Select value={aspectRatio} onValueChange={onAspectRatioChange}>
          <SelectTrigger className="h-10 w-full bg-background/50 font-manrope">
            <SelectValue placeholder="Select Size" />
          </SelectTrigger>
          <SelectContent className="font-manrope">
            {ASPECT_RATIOS.map((ratio) => (
              <SelectItem key={ratio.name} value={ratio.name} className="py-3">
                <div className="flex items-center gap-3">
                  <div className={`w-8 bg-muted border border-foreground/20 rounded-sm ${ratio.previewClass}`} />
                  <div className="flex flex-col gap-0.5">
                    <span className="font-medium text-xs">{ratio.name}</span>
                    <span className="text-[10px] text-muted-foreground">{ratio.label}</span>
                  </div>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex-1 min-h-0 flex flex-col relative">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground px-5 shrink-0 mb-3">
          <span className="text-foreground">Background</span>
        </div>

        <div className="flex-1 relative">
          <ScrollArea className="h-80 w-full">
            <div className="px-5 pb-4">
              <div className="grid grid-cols-2 gap-3">
                {BACKGROUND_OPTIONS.map((bg) => (
                  <button
                    key={bg.name}
                    onClick={() => onCanvasBackgroundChange(bg.value)}
                    className={`relative aspect-video rounded-lg overflow-hidden border-neutral-500 transition-all hover:scale-103 focus:outline-none focus:ring-2 focus:ring-primary ${
                      canvasBackground === bg.value
                        ? "border-primary shadow-md"
                        : "border-transparent"
                    }`}
                  >
                    <div
                      className="absolute inset-0"
                      style={{ background: bg.value }}
                    />
                    <div className="absolute bottom-0 left-0 right-0 p-1 bg-black/50 backdrop-blur-sm text-sm text-white text-center truncate">
                      {bg.name}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* 3. Fixed Footer: Export Settings */}
      <div className="space-y-4 p-5 border-t border-border shrink-0 bg-card z-10">
        <div className="space-y-3">
          <Label className="text-xs font-medium text-muted-foreground">
            Export Format
          </Label>
          <div className="grid grid-cols-2 gap-3">
            <Select value={exportFormat} onValueChange={onExportFormatChange}>
              <SelectTrigger className="h-8 bg-transparent font-manrope">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="png">PNG</SelectItem>
                <SelectItem value="jpeg">JPG</SelectItem>
                <SelectItem value="svg">SVG</SelectItem>
              </SelectContent>
            </Select>
            {/* <Select value={exportQuality} onValueChange={onExportQualityChange}>
              <SelectTrigger className="h-8 bg-transparent font-manrope">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1x</SelectItem>
                <SelectItem value="2">2x</SelectItem>
                <SelectItem value="4">4x</SelectItem>
              </SelectContent>
            </Select> */}
          </div>
        </div>

        <Button onClick={onDownload} className="w-full font-semibold shadow-lg">
          <Download className="w-4 h-4 mr-2" />
          Export Image
        </Button>
      </div>
    </div>
  );
}