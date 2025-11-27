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
import { BACKGROUND_OPTIONS } from "./types";
import { ScrollArea } from "@/components/ui/scroll-area";

interface RightPanelProps {
  canvasBackground: string;
  onCanvasBackgroundChange: (value: string) => void;
  onDownload: () => void;
}

export function RightPanel({
  canvasBackground,
  onCanvasBackgroundChange,
  onDownload,
}: RightPanelProps) {
  return (
    <div className="flex flex-col h-full gap-6">
      {/* Canvas Backgrounds */}
      <div className="space-y-4 flex-1">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <span className="text-foreground"> Background</span>
        </div>

        {/* Adjusted height for responsiveness */}
        <div className="grid grid-cols-2 gap-3 pb-2">
          {BACKGROUND_OPTIONS.map((bg) => (
            <button
              key={bg.name}
              onClick={() => onCanvasBackgroundChange(bg.value)}
              className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary ${
                canvasBackground === bg.value
                  ? "border-primary shadow-md"
                  : "border-transparent"
              }`}
            >
              <div
                className="absolute inset-0"
                style={{ background: bg.value }}
              />
              <div className="absolute bottom-0 left-0 right-0 p-1 bg-black/50 backdrop-blur-[2px] text-[10px] text-white text-center truncate">
                {bg.name}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Export Settings */}
      <div className="space-y-4 pt-4 border-t border-border">
        <div className="space-y-3">
          <Label className="text-xs font-medium text-muted-foreground">
            Export Format
          </Label>
          <div className="grid grid-cols-2 gap-3">
            <Select defaultValue="png">
              <SelectTrigger className="h-8 bg-transparent">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="png">PNG</SelectItem>
                <SelectItem value="jpg">JPG</SelectItem>
                <SelectItem value="svg">SVG</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="2x">
              <SelectTrigger className="h-8 bg-transparent">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1x">1x</SelectItem>
                <SelectItem value="2x">2x</SelectItem>
                <SelectItem value="4x">4x</SelectItem>
              </SelectContent>
            </Select>
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
