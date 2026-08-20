"use client";

import React, { useRef, useCallback, useState } from "react";
import {
  Download,
  Image as ImageIcon,
  Loader2,
  Sparkles,
  Laugh,
  Layers,
  Sliders,
  Palette,
  Film,
  Zap,
  Grid,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RightPanelProps, ExportFormat } from "../../types";
import {
  MESH_PALETTES,
  PRESET_GRADIENTS,
} from "../../values";
import { Wallpapers } from "../../hooks/wallpaper";
import { Memes } from "../../hooks/memes";
import { generateRandomMeshColors } from "../../utils/gradient-gen";
import { useStore } from "../../store/use-store";
import { VectorPatternType } from "../canvas/vector-overlay";
import { StudioTextureType } from "../canvas/studio-texture";

export function RightPanel({ onDownload }: RightPanelProps) {
  const {
    canvasBackground,
    meshConfig,
    overlayConfig,
    exportFormat,
    exportQuality,
    exportDuration,
    exportFps,
    setBackground,
    setCustomSize,
    setMeshConfig,
    setOverlayConfig,
    setExportFormat,
    setExportQuality,
    setExportDuration,
    setExportFps,
  } = useStore();

  const {
    wallpapers,
    loading: wallpapersLoading,
    hasMore: wallpapersHasMore,
    loadMore: loadMoreWallpapers,
  } = Wallpapers({ limit: 20 });

  const {
    memes,
    loading: memesLoading,
    hasMore: memesHasMore,
    loadMore: loadMoreMemes,
  } = Memes({ limit: 20 });

  const [pictureSubTab, setPictureSubTab] = useState<"wallpapers" | "memes">(
    "wallpapers"
  );

  const wallpaperScrollRef = useRef<HTMLDivElement>(null);
  const memeScrollRef = useRef<HTMLDivElement>(null);

  const handleRandomMesh = () => {
    const randomColors = generateRandomMeshColors();
    setBackground("mesh");
    setMeshConfig({ colors: randomColors });
  };

  const handleColorChange = (index: number, newColor: string) => {
    const updatedColors = [...meshConfig.colors];
    updatedColors[index] = newColor;
    setBackground("mesh");
    setMeshConfig({ colors: updatedColors });
  };

  const handleWallpaperScroll = useCallback(() => {
    const scrollArea = wallpaperScrollRef.current;
    if (!scrollArea || wallpapersLoading || !wallpapersHasMore) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollArea;
    if (scrollHeight - scrollTop <= clientHeight * 1.5) {
      loadMoreWallpapers();
    }
  }, [wallpapersLoading, wallpapersHasMore, loadMoreWallpapers]);

  const handleMemeScroll = useCallback(() => {
    const scrollArea = memeScrollRef.current;
    if (!scrollArea || memesLoading || !memesHasMore) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollArea;
    if (scrollHeight - scrollTop <= clientHeight * 1.5) {
      loadMoreMemes();
    }
  }, [memesLoading, memesHasMore, loadMoreMemes]);

  const isVideoFormat =
    exportFormat === "mp4" ||
    exportFormat === "gif" ||
    exportFormat === "webm";

  return (
    <div className="flex flex-col h-full w-full bg-card">
      <Tabs defaultValue="shaders" className="w-full flex-1 flex flex-col h-full">
        <div className="px-3 pt-3 pb-1 shrink-0">
          <TabsList className="w-full grid grid-cols-3 dark:bg-neutral-800">
            <TabsTrigger value="shaders">
              <Zap className="size-3.5" />
              Shaders
            </TabsTrigger>
            <TabsTrigger value="overlays">
              <Layers className="size-3.5" />
              Texture
            </TabsTrigger>
            <TabsTrigger value="pictures">
              <ImageIcon className="size-3.5" />
              Pictures
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="flex-1 min-h-0 relative">
          {/* TAB 1: WebGL Mesh Gradient & Shaders */}
          <TabsContent
            value="shaders"
            className="absolute inset-0 data-[state=inactive]:hidden focus-visible:outline-none mt-0"
          >
            <ScrollArea className="h-full w-full">
              <div className="p-4 flex flex-col gap-6 pb-6">
                {/* Section 1: Color Palettes */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-semibold uppercase tracking-wider">
                      Palette Combinations
                    </Label>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div className="relative group rounded-lg p-[1.5px] transition-transform hover:scale-[1.03] active:scale-[0.98]">
                      <div className="absolute -inset-0.75 rounded-xl google-rainbow-glow opacity-70 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                      <button
                        type="button"
                        onClick={handleRandomMesh}
                        className="relative z-10 w-full h-full rounded-[6.5px] p-1.5 transition-all text-center bg-card dark:bg-neutral-900 hover:bg-card/90 dark:hover:bg-neutral-900/90 cursor-pointer overflow-hidden flex flex-col justify-between"
                        title="Generate random mesh colors"
                      >
                        <div className="flex h-5 w-full rounded overflow-hidden mb-1 shadow-xs relative">
                          <div className="flex-1 h-full animate-circulate-1" />
                          <div className="flex-1 h-full animate-circulate-2" />
                          <div className="flex-1 h-full animate-circulate-3" />
                          <div className="flex-1 h-full animate-circulate-4" />
                          <div className="flex-1 h-full animate-circulate-5" />
                          <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity animate-palette-shimmer" />
                        </div>
                        <div className="flex items-center justify-center gap-1">
                          <span className="text-[10px] font-medium text-foreground truncate block text-center">
                            Randomize
                          </span>
                        </div>
                      </button>
                    </div>

                    {MESH_PALETTES.map((pal) => {
                      const isSelected =
                        canvasBackground === "mesh" &&
                        meshConfig.colors.length === pal.colors.length &&
                        meshConfig.colors.every(
                          (c, i) =>
                            c.toLowerCase() === pal.colors[i].toLowerCase()
                        );

                      return (
                        <button
                          key={pal.name}
                          type="button"
                          onClick={() => {
                            setBackground("mesh");
                            setMeshConfig({ colors: [...pal.colors] });
                          }}
                          className={`group relative rounded-lg p-1.5 border transition-all text-center bg-background/50 hover:scale-[1.03] hover:z-10 hover:shadow-md cursor-pointer ${isSelected
                              ? "border-primary ring-1 ring-primary/60 bg-primary/5 shadow-xs font-semibold"
                              : "border-border/70 hover:border-primary/80 hover:ring-1 hover:ring-primary/50"
                            }`}
                        >
                          <div className="flex h-5 w-full rounded overflow-hidden mb-1 shadow-xs">
                            {pal.colors.map((c, i) => (
                              <div
                                key={i}
                                className="flex-1 h-full"
                                style={{ backgroundColor: c }}
                              />
                            ))}
                          </div>
                          <span className="text-[10px] font-medium text-foreground truncate block text-center">
                            {pal.name}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <Separator />

                {/* Section 2: Custom Mesh Nodes */}
                <div className="space-y-3">
                  <Label className="text-sm font-semibold uppercase tracking-wider">
                    Color Palette
                  </Label>
                  <div className="flex items-center justify-between gap-1">
                    {meshConfig.colors.map((color, idx) => (
                      <div
                        key={idx}
                        className="flex flex-col items-center gap-1"
                      >
                        <div className="relative size-8 rounded-lg overflow-hidden border border-border/80 shadow-xs hover:scale-105 transition-transform">
                          <div
                            className="absolute inset-0"
                            style={{ backgroundColor: color }}
                          />
                          <input
                            type="color"
                            value={color}
                            onChange={(e) =>
                              handleColorChange(idx, e.target.value)
                            }
                            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full p-0 border-0"
                          />
                        </div>
                        <span className="text-[10px] font-manrope text-muted-foreground">
                          #{idx + 1}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Section 3: Fluid Motion */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-semibold uppercase tracking-wider flex items-center gap-1.5">
                      Fluid Motion
                    </Label>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-medium text-muted-foreground">
                        {meshConfig.isAnimating ? "Animated" : "Static"}
                      </span>
                      <Switch
                        checked={meshConfig.isAnimating}
                        onCheckedChange={(checked) =>
                          setMeshConfig({ isAnimating: checked })
                        }
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 font-semibold font-manrope *:pr-1">
                    <div
                      className={`space-y-3 ${!meshConfig.isAnimating
                        ? "opacity-40 pointer-events-none"
                        : ""
                        }`}
                    >
                      <div className="flex items-center justify-between">
                        <Label className="text-xs font-medium text-muted-foreground">
                          Flow Speed
                        </Label>
                        <span className="text-xs text-muted-foreground">
                          {meshConfig.speed.toFixed(1)}x
                        </span>
                      </div>
                      <Slider
                        value={[meshConfig.speed * 10]}
                        min={1}
                        max={30}
                        step={1}
                        disabled={!meshConfig.isAnimating}
                        onValueChange={([val]) =>
                          setMeshConfig({ speed: val / 10 })
                        }
                      />
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="text-xs font-medium text-muted-foreground">
                          Distortion
                        </Label>
                        <span className="text-xs text-muted-foreground">
                          {meshConfig.noiseIntensity}%
                        </span>
                      </div>
                      <Slider
                        value={[meshConfig.noiseIntensity]}
                        min={0}
                        max={100}
                        step={1}
                        onValueChange={([val]) =>
                          setMeshConfig({ noiseIntensity: val })
                        }
                      />
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="text-xs font-medium text-muted-foreground">
                          Mesh Scale
                        </Label>
                        <span className="text-xs text-muted-foreground">
                          {meshConfig.noiseScale.toFixed(1)}
                        </span>
                      </div>
                      <Slider
                        value={[meshConfig.noiseScale * 10]}
                        min={5}
                        max={40}
                        step={1}
                        onValueChange={([val]) =>
                          setMeshConfig({ noiseScale: val / 10 })
                        }
                      />
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="text-xs font-medium text-muted-foreground">
                          Noise Grain
                        </Label>
                        <span className="text-xs text-muted-foreground">
                          {meshConfig.noiseGrain || 0}%
                        </span>
                      </div>
                      <Slider
                        value={[meshConfig.noiseGrain || 0]}
                        min={0}
                        max={100}
                        step={1}
                        onValueChange={([val]) =>
                          setMeshConfig({ noiseGrain: val })
                        }
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Section 4: Real-time Dithering Module */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-semibold uppercase tracking-wider">
                      Background Dither
                    </Label>
                    <Switch
                      checked={meshConfig.ditherEnabled}
                      onCheckedChange={(checked) =>
                        setMeshConfig({ ditherEnabled: checked })
                      }
                    />
                  </div>

                  {meshConfig.ditherEnabled && (
                    <div className="space-y-4 font-manrope animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-2">
                          <Label className="text-xs font-medium text-muted-foreground">
                            Pattern
                          </Label>
                          <Select
                            value={String(meshConfig.ditherType)}
                            onValueChange={(v) =>
                              setMeshConfig({ ditherType: parseInt(v) })
                            }
                          >
                            <SelectTrigger className="h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="0">Bayer 2x2</SelectItem>
                              <SelectItem value="1">Bayer 4x4</SelectItem>
                              <SelectItem value="2">Bayer 8x8</SelectItem>
                              <SelectItem value="3">Random</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs font-medium text-muted-foreground">
                            Color Steps
                          </Label>
                          <Select
                            value={String(meshConfig.ditherColorSteps)}
                            onValueChange={(v) =>
                              setMeshConfig({ ditherColorSteps: parseInt(v) })
                            }
                          >
                            <SelectTrigger className="h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="2">2 (1-Bit)</SelectItem>
                              <SelectItem value="4">4 Steps</SelectItem>
                              <SelectItem value="6">6 Steps</SelectItem>
                              <SelectItem value="8">8 Steps</SelectItem>
                              <SelectItem value="16">16 Steps</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label className="text-xs font-medium text-muted-foreground">
                            Pixel Size
                          </Label>
                          <span className="text-xs font-manrope text-muted-foreground">
                            {meshConfig.ditherPixelSize}px
                          </span>
                        </div>
                        <Slider
                          value={[meshConfig.ditherPixelSize]}
                          min={1}
                          max={16}
                          step={1}
                          onValueChange={([val]) =>
                            setMeshConfig({ ditherPixelSize: val })
                          }
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </ScrollArea>
          </TabsContent>

          {/* TAB 2: Textures & Vector Patterns */}
          <TabsContent
            value="overlays"
            className="absolute inset-0 data-[state=inactive]:hidden focus-visible:outline-none mt-0"
          >
            <ScrollArea className="h-full w-full">
              <div className="p-4 flex flex-col gap-6 pb-6">
                {/* Vector Patterns */}
                <div className="space-y-3">
                  <Label className="text-sm font-semibold uppercase tracking-wider">
                    Patterns
                  </Label>
                  <div className="grid grid-cols-3 gap-2 font-manrope">
                    {(
                      [
                        { id: "none", name: "None" },
                        { id: "topographic", name: "Topographic" },
                        { id: "isometric", name: "Isometric" },
                        { id: "dotmatrix", name: "Dot Matrix" },
                        { id: "crosshair", name: "Crosshairs" },
                        { id: "blueprint", name: "Blueprint" },
                      ] as { id: VectorPatternType; name: string }[]
                    ).map((p) => (
                      <button
                        key={p.id}
                        onClick={() =>
                          setOverlayConfig({ pattern: p.id })
                        }
                        className={`p-2 rounded-lg border text-xs font-medium text-center transition-all cursor-pointer ${overlayConfig.pattern === p.id
                          ? "border-primary bg-primary/10 text-primary font-bold shadow-xs"
                          : "border-border/70 hover:border-border text-muted-foreground"
                          }`}
                      >
                        {p.name}
                      </button>
                    ))}
                  </div>

                  {overlayConfig.pattern !== "none" && (
                    <div className="space-y-3 pt-2 font-manrope">
                      <div className="flex items-center justify-between">
                        <Label className="text-xs font-medium text-muted-foreground">
                          Pattern Opacity
                        </Label>
                        <span className="text-xs text-muted-foreground">
                          {overlayConfig.patternOpacity}%
                        </span>
                      </div>
                      <Slider
                        value={[overlayConfig.patternOpacity]}
                        min={5}
                        max={100}
                        step={1}
                        onValueChange={([val]) =>
                          setOverlayConfig({ patternOpacity: val })
                        }
                      />
                    </div>
                  )}
                </div>

                <Separator />

                {/* Studio Textures */}
                <div className="space-y-3">
                  <Label className="text-sm font-semibold uppercase tracking-wider">
                    Texture Layer
                  </Label>
                  <div className="grid grid-cols-2 gap-2 font-manrope">
                    {(
                      [
                        { id: "none", name: "None" },
                        { id: "grain", name: "Film Grain" },
                        { id: "paper", name: "Crushed Paper" },
                        { id: "scratches", name: "Studio Scratches" },
                      ] as { id: StudioTextureType; name: string }[]
                    ).map((t) => (
                      <button
                        key={t.id}
                        onClick={() =>
                          setOverlayConfig({ texture: t.id })
                        }
                        className={`p-2.5 rounded-lg border text-xs font-medium text-center transition-all cursor-pointer ${overlayConfig.texture === t.id
                          ? "border-primary bg-primary/10 text-primary font-bold shadow-xs"
                          : "border-border/70 hover:border-border text-muted-foreground"
                          }`}
                      >
                        {t.name}
                      </button>
                    ))}
                  </div>

                  {overlayConfig.texture !== "none" && (
                    <div className="space-y-3 pt-2 font-manrope">
                      <div className="flex items-center justify-between">
                        <Label className="text-xs font-medium text-muted-foreground">
                          Texture Opacity
                        </Label>
                        <span className="text-xs text-muted-foreground">
                          {overlayConfig.textureOpacity}%
                        </span>
                      </div>
                      <Slider
                        value={[overlayConfig.textureOpacity]}
                        min={5}
                        max={100}
                        step={1}
                        onValueChange={([val]) =>
                          setOverlayConfig({ textureOpacity: val })
                        }
                      />
                    </div>
                  )}
                </div>
              </div>
            </ScrollArea>
          </TabsContent>

          {/* TAB 3: Pictures (Wallpapers & Memes) */}
          <TabsContent
            value="pictures"
            className="absolute inset-0 data-[state=inactive]:hidden focus-visible:outline-none mt-0 flex flex-col"
          >
            <div className="p-4 flex flex-col h-full min-h-0 gap-3">
              {/* Sub-tab Pill Switcher */}
              <div className="grid grid-cols-2 gap-1 bg-muted/60 p-1 rounded-lg shrink-0">
                <button
                  onClick={() => setPictureSubTab("wallpapers")}
                  className={`py-1.5 rounded text-xs font-medium transition-all flex items-center justify-center gap-1.5 cursor-pointer ${pictureSubTab === "wallpapers"
                    ? "bg-background text-foreground shadow-xs font-bold"
                    : "text-muted-foreground hover:text-foreground"
                    }`}
                >
                  <ImageIcon className="size-3.5" /> Wallpapers
                </button>
                <button
                  onClick={() => setPictureSubTab("memes")}
                  className={`py-1.5 rounded text-xs font-medium transition-all flex items-center justify-center gap-1.5 cursor-pointer ${pictureSubTab === "memes"
                    ? "bg-background text-foreground shadow-xs font-bold"
                    : "text-muted-foreground hover:text-foreground"
                    }`}
                >
                  <Laugh className="size-3.5" /> Memes
                </button>
              </div>

              <div className="flex-1 min-h-0 relative">
                {pictureSubTab === "wallpapers" ? (
                  <ScrollArea
                    className="h-full w-full"
                    onScroll={handleWallpaperScroll}
                  >
                    <div className="p-1 pb-4 grid grid-cols-2 gap-2.5">
                      {wallpapers.map((w) => (
                        <button
                          key={w.fileId}
                          onClick={() => setBackground(`url(${w.url})`)}
                          className="group relative aspect-video rounded-lg overflow-hidden border border-border/70 hover:border-primary hover:ring-2 hover:ring-primary/60 transition-all duration-200 hover:scale-[1.03] hover:z-20 hover:shadow-xl cursor-pointer bg-muted/30"
                        >
                          <img
                            src={w.thumbnailUrl}
                            alt={w.name}
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            loading="lazy"
                          />
                          <div className="absolute bottom-0 inset-x-0 bg-black/75 text-white text-[10px] py-1 px-1.5 truncate text-center backdrop-blur-xs font-manrope font-medium transition-colors group-hover:bg-black/90 group-hover:text-primary">
                            {w.name}
                          </div>
                        </button>
                      ))}
                      {wallpapersLoading && (
                        <div className="col-span-2 py-4 flex justify-center">
                          <Loader2 className="size-5 animate-spin text-primary" />
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                ) : (
                  <ScrollArea
                    className="h-full w-full"
                    onScroll={handleMemeScroll}
                  >
                    <div className="p-1 pb-4 grid grid-cols-2 gap-2.5">
                      {memes.map((meme) => (
                        <button
                          key={meme.fileId}
                          onClick={() => {
                            const img = new Image();
                            img.src = meme.url;
                            img.onload = () => {
                              setCustomSize(img.naturalWidth, img.naturalHeight);
                              setBackground(`url(${meme.url})`);
                            };
                          }}
                          className="group relative aspect-video rounded-lg overflow-hidden border border-border/70 hover:border-primary hover:ring-2 hover:ring-primary/60 transition-all duration-200 hover:scale-[1.03] hover:z-20 hover:shadow-xl cursor-pointer bg-muted/30"
                        >
                          <img
                            src={meme.thumbnailUrl}
                            alt={meme.name}
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            loading="lazy"
                          />
                          <div className="absolute bottom-0 inset-x-0 bg-black/75 text-white text-[10px] py-1 px-1.5 truncate text-center backdrop-blur-xs font-manrope font-medium transition-colors group-hover:bg-black/90 group-hover:text-primary">
                            {meme.name}
                          </div>
                        </button>
                      ))}
                      {memesLoading && (
                        <div className="col-span-2 py-4 flex justify-center">
                          <Loader2 className="size-5 animate-spin text-primary" />
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                )}
              </div>
            </div>
          </TabsContent>
        </div>
      </Tabs>

      {/* Export Studio Section */}
      <div className="p-4 border-t-2 dark:border-neutral-800 shrink-0 bg-card z-10 space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-semibold uppercase tracking-wider flex items-center gap-1.5">
            <Film className="size-3.5 text-primary" /> Export
          </Label>
          <span className="text-[10px] font-semibold text-primary uppercase tracking-wide">
            {isVideoFormat ? "WASM Video" : "Hi-Res Snapshot"}
          </span>
        </div>

        {/* Format Selector Pills */}
        <div className="grid grid-cols-6 gap-1 bg-muted/60 p-1 rounded-lg">
          {(["mp4", "gif", "webm", "png", "jpeg", "svg"] as ExportFormat[]).map(
            (fmt) => (
              <button
                key={fmt}
                onClick={() => setExportFormat(fmt)}
                className={`py-1 rounded text-[10px] font-bold uppercase transition-all cursor-pointer ${exportFormat === fmt
                  ? "bg-primary text-primary-foreground shadow-xs scale-102"
                  : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                {fmt}
              </button>
            )
          )}
        </div>

        {/* Video / Loop Settings */}
        {isVideoFormat ? (
          <div className="space-y-3 pt-1">
            <div className="grid grid-cols-2 gap-3 items-end">
              {/* Duration Dropdown */}
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground block">
                  Duration
                </Label>
                <Select
                  value={String(exportDuration)}
                  onValueChange={(val) => setExportDuration(Number(val))}
                >
                  <SelectTrigger className="h-8 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6].map((sec) => (
                      <SelectItem key={sec} value={String(sec)}>
                        {sec}s
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Framerate Toggle */}
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground block">
                  Framerate
                </Label>
                <div className="grid grid-cols-2 gap-1 bg-muted/60 p-1 rounded-lg h-8">
                  {[
                    { value: 30, label: "30 FPS" },
                    { value: 60, label: "60 FPS" },
                  ].map(({ value, label }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setExportFps(value)}
                      className={`rounded text-xs font-semibold transition-all cursor-pointer flex items-center justify-center ${
                        exportFps === value
                          ? "bg-primary text-primary-foreground shadow-xs font-bold"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-0.5">
              <Label className="text-xs text-muted-foreground">
                Resolution Scale
              </Label>
              <div className="flex gap-1.5">
                {[
                  { q: "1", label: "1x Standard" },
                  { q: "2", label: "2x 1080p HD" },
                  { q: "4", label: "4x 4K Ultra" },
                ].map(({ q, label }) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => setExportQuality(q)}
                    className={`px-2.5 py-0.5 rounded text-xs font-semibold border cursor-pointer ${
                      exportQuality === q
                        ? "border-primary bg-primary/10 text-primary font-bold shadow-xs"
                        : "border-border text-muted-foreground hover:text-foreground"
                    }`}
                    title={label}
                  >
                    {q}x
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between pt-1">
            <Label className="text-xs text-muted-foreground">
              Resolution Scale
            </Label>
            <div className="flex gap-1.5">
              {["1", "2", "4"].map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => setExportQuality(q)}
                  className={`px-2.5 py-0.5 rounded text-xs font-semibold border cursor-pointer ${
                    exportQuality === q
                      ? "border-primary bg-primary/10 text-primary font-bold shadow-xs"
                      : "border-border text-muted-foreground"
                  }`}
                >
                  {q}x
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Export Button */}
        <Button
          onClick={onDownload}
          variant="primary"
          className="w-full h-11 font-bold text-xs uppercase tracking-wider bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg cursor-pointer flex items-center justify-center gap-2"
        >
          <Download className="size-4" /> Download {exportFormat.toUpperCase()}
        </Button>
      </div>
    </div>
  );
}
