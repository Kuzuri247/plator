"use client";

import {
  Download,
  LayoutTemplate,
  Share,
  Image as ImageIcon,
  Loader2,
  Sparkles,
} from "lucide-react";
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
import { PRESET_GRADIENTS, ASPECT_RATIOS } from "../../types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RightPanelProps } from "../../types";
import { Wallpapers } from "../../hooks/wallpaper";
import { generateRandomGradient } from "../../utils/gradient-gen";

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
  const { wallpapers, loading } = Wallpapers();

  const handleRandomGradient = () => {
    const randomGradient = generateRandomGradient();
    onCanvasBackgroundChange(randomGradient);
  };

  return (
    <div className="flex flex-col h-full w-full">
      <div className="space-y-3 p-4 shrink-0">
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
                  <div className="flex flex-row gap-2">
                    <span className="font-medium text-sm">{ratio.name}</span>
                    <span className="text-sm font-semibold  text-muted-foreground">
                      {ratio.label}
                    </span>
                  </div>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex-1 min-h-0 flex flex-col relative mx-4 pb-2">
        <Tabs
          defaultValue="backgrounds"
          className="w-full h-full flex flex-col"
        >
          <TabsList className="grid w-full grid-cols-2 mb-3 shrink-0">
            <TabsTrigger value="backgrounds">Gradients</TabsTrigger>
            <TabsTrigger value="wallpapers">Wallpapers</TabsTrigger>
          </TabsList>

          <TabsContent value="backgrounds" className="flex-1 mt-0 min-h-0">
            <div className="mb-3 flex items-center justify-center">
              <Button
                onClick={handleRandomGradient}
                variant="outline"
                className="w-fit h-8 font-medium text-xs text-neutral-800 hover:text-neutral-600 dark:text-neutral-400 dark:hover:text-neutral-300 border-2 dark:border-neutral-800 hover:shadow-2xl dark:hover:shadow-white/25 hover:bg-primary/5"
              >
                <Sparkles className="size-3" />
                Generate Gradient
              </Button>
            </div>

            <ScrollArea className="h-full max-h-[calc(42vh)]">
              <div className="pr-3 pl-1 pb-4">
                <div className="grid grid-cols-2 gap-3">
                  {PRESET_GRADIENTS.map((bg) => (
                    <button
                      key={bg.name}
                      onClick={() => onCanvasBackgroundChange(bg.value)}
                      className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-all hover:scale-103 focus:outline-none focus:ring-2 focus:ring-primary ${
                        canvasBackground === bg.value
                          ? "border-primary shadow-md ring-2 ring-primary/30"
                          : "border-transparent hover:border-primary/50"
                      }`}
                    >
                      <div
                        className="absolute inset-0"
                        style={{ background: bg.value }}
                      />
                      <div className="absolute bottom-0 left-0 right-0 p-px bg-black/50 text-white backdrop-blur-[2px] text-[11px]  text-center truncate">
                        {bg.name}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="wallpapers" className="flex-1 mt-0 min-h-0">
            <ScrollArea className="h-full max-h-[calc(80vh)]">
              <div className="pr-3 pl-1 pb-4">
                {loading ? (
                  <div className="flex justify-center items-center h-40">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : wallpapers.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-40 text-center text-muted-foreground">
                    <ImageIcon className="h-12 w-12 mb-3 opacity-50" />
                    <p className="text-sm font-medium">No wallpapers found</p>
                    <p className="text-xs mt-1">Contact me on Socials</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    {wallpapers.map((wallpaper) => (
                      <button
                        key={wallpaper.fileId}
                        onClick={() =>
                          onCanvasBackgroundChange(`url(${wallpaper.url})`)
                        }
                        className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-all hover:scale-103 focus:outline-none focus:ring-2 focus:ring-primary ${
                          canvasBackground === `url(${wallpaper.url})`
                            ? "border-primary shadow-md ring-2 ring-primary/30"
                            : "border-transparent hover:border-primary/50"
                        }`}
                      >
                        <img
                          src={wallpaper.thumbnailUrl}
                          alt={wallpaper.name}
                          className="absolute inset-0 w-full h-full object-cover"
                          loading="lazy"
                        />
                        <div className="absolute bottom-0 left-0 right-0 p-px bg-black/50 text-white backdrop-blur-[2px] text-[11px]  text-center truncate">
                          {wallpaper.name}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>

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
