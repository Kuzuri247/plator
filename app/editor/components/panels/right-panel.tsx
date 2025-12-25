"use client";

import { Download, LayoutTemplate, Share, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BACKGROUND_OPTIONS, ASPECT_RATIOS } from "../../types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RightPanelProps } from "../../types";

// Sample wallpapers - you can replace these with your actual wallpaper URLs
const WALLPAPER_OPTIONS = [
  {
    name: "Gradient Sunset",
    url: "https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=800&q=80",
  },
  {
    name: "Ocean Waves",
    url: "https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=800&q=80",
  },
  {
    name: "Mountain Peak",
    url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
  },
  {
    name: "Forest Path",
    url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80",
  },
  {
    name: "City Lights",
    url: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=800&q=80",
  },
  {
    name: "Desert Dunes",
    url: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=800&q=80",
  },
];

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
  onPreview,
}: RightPanelProps) {
  return (
    <div className="flex flex-col h-full w-full">
      {/* Canvas Size Section */}
      <div className="space-y-3 p-4 shrink-0">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <LayoutTemplate className="size-4" />
          <span className="text-foreground">Canvas Size</span>
        </div>
        <Select value={aspectRatio} onValueChange={onAspectRatioChange}>
          <SelectTrigger
            data-size="md"
            className="h-14 py-2 h-lg w-full bg-background/50 font-manrope"
          >
            <SelectValue placeholder="Select Size" />
          </SelectTrigger>
          <SelectContent className="font-manrope">
            {ASPECT_RATIOS.map((ratio) => (
              <SelectItem key={ratio.name} value={ratio.name} className="py-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 bg-muted border border-foreground/20 rounded-sm ${ratio.previewClass}`}
                  />
                  <div className="flex flex-col gap-0.5">
                    <span className="font-medium text-xs">{ratio.name}</span>
                    <span className="text-[10px] text-muted-foreground">
                      {ratio.label}
                    </span>
                  </div>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Backgrounds & Wallpapers Tabs Section */}
      <div className="flex-1 min-h-0 flex flex-col relative px-4">
        <Tabs defaultValue="backgrounds" className="w-full h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-2 mb-3">
            <TabsTrigger value="backgrounds">Backgrounds</TabsTrigger>
            <TabsTrigger value="wallpapers">
              <ImageIcon className="size-3 mr-1.5" />
              Wallpapers
            </TabsTrigger>
          </TabsList>

          {/* Backgrounds Tab */}
          <TabsContent value="backgrounds" className="flex-1 relative mt-0">
            <ScrollArea className="h-[400px] w-full">
              <div className="pr-4 pb-4">
                <div className="grid grid-cols-2 gap-3">
                  {BACKGROUND_OPTIONS.map((bg) => (
                    <button
                      key={bg.name}
                      onClick={() => onCanvasBackgroundChange(bg.value)}
                      className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-all hover:scale-103 focus:outline-none focus:ring-2 focus:ring-primary ${
                        canvasBackground === bg.value
                          ? "border-primary shadow-md"
                          : "border-transparent"
                      }`}
                    >
                      <div
                        className="absolute inset-0"
                        style={{ background: bg.value }}
                      />
                      <div className="absolute bottom-0 left-0 right-0 p-1 bg-black/50 backdrop-blur-sm text-xs text-white text-center truncate">
                        {bg.name}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </ScrollArea>
          </TabsContent>

          {/* Wallpapers Tab */}
          <TabsContent value="wallpapers" className="flex-1 relative mt-0">
            <ScrollArea className="h-[400px] w-full">
              <div className="pr-4 pb-4">
                <div className="grid grid-cols-2 gap-3">
                  {WALLPAPER_OPTIONS.map((wallpaper) => (
                    <button
                      key={wallpaper.name}
                      onClick={() =>
                        onCanvasBackgroundChange(`url(${wallpaper.url})`)
                      }
                      className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-all hover:scale-103 focus:outline-none focus:ring-2 focus:ring-primary ${
                        canvasBackground === `url(${wallpaper.url})`
                          ? "border-primary shadow-md"
                          : "border-transparent"
                      }`}
                    >
                      <img
                        src={wallpaper.url}
                        alt={wallpaper.name}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 p-1 bg-black/50 backdrop-blur-sm text-xs text-white text-center truncate">
                        {wallpaper.name}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>

      {/* Export Settings Section */}
      <div className="space-y-4 p-4 border-t-2 dark:border-neutral-800 shrink-0 bg-card z-10">
        <Label className="text-sm font-medium">Export Settings</Label>
        <div className="flex flex-row justify-between mx-2 items-center">
          <div className="flex flex-row space-y-3 gap-4">
            <Label className="text-[13px] font-medium text-muted-foreground pt-2">
              Format
            </Label>
            <div className="flex gap-3">
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
            </div>
          </div>
          <div className="flex flex-row space-y-3 gap-4">
            <Label className="text-[13px] font-medium text-muted-foreground pt-2">
              Quality
            </Label>
            <div className="flex gap-3">
              <Select
                value={exportQuality}
                onValueChange={onExportQualityChange}
              >
                <SelectTrigger className="h-8 bg-transparent font-manrope">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1x</SelectItem>
                  <SelectItem value="2">2x</SelectItem>
                  <SelectItem value="4">4x</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <Button
            onClick={onDownload}
            variant="outline"
            className="w-full h-9 font-semibold text-xs shadow-sm truncate border-neutral-300 dark:border-neutral-700/95"
          >
            <Download className="w-3.5 h-3.5 mr-2 shrink-0" />
            Download
          </Button>
          <Button
            onClick={onPreview}
            className="w-full h-9 font-semibold text-xs shadow-sm bg-primary text-primary-foreground hover:bg-primary/90 truncate"
          >
            <Share className="w-3.5 h-3.5 mr-2 shrink-0" />
            Preview
          </Button>
        </div>
      </div>
    </div>
  );
}
