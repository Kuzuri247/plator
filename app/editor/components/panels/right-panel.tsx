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
  ASPECT_RATIOS,
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
    aspectRatio,
    canvasBackground,
    meshConfig,
    overlayConfig,
    exportFormat,
    exportQuality,
    exportDuration,
    exportFps,
    setAspectRatio,
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
      {/* Canvas Aspect Ratio */}
      <div className="p-4 pb-2 shrink-0">
        <Select value={aspectRatio.name} onValueChange={setAspectRatio}>
          <SelectTrigger
            data-size="md"
            className="h-12 w-full bg-background/60 font-manrope border-border/80"
          >
            <SelectValue placeholder="Select Canvas Size" />
          </SelectTrigger>
          <SelectContent className="font-manrope max-h-66">
            {ASPECT_RATIOS.map((ratio) => (
              <SelectItem key={ratio.name} value={ratio.name} className="py-2.5">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-7 bg-muted border border-foreground/20 rounded-xs ${ratio.previewClass}`}
                  />
                  <div className="flex flex-row gap-2">
                    <span className="font-medium text-sm">{ratio.name}</span>
                    <span className="text-xs font-semibold text-muted-foreground pt-0.5">
                      {ratio.label} ({ratio.width}x{ratio.height})
                    </span>
                  </div>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Main Studio Tabs */}
      <div className="flex-1 min-h-0 flex flex-col relative px-4 pb-2">
        <Tabs defaultValue="shaders" className="w-full h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-3 mb-3 shrink-0 gap-1 bg-muted/60">
            <TabsTrigger value="shaders" className="text-[11px] px-1">
              <Zap className="size-3 mr-1" /> Mesh
            </TabsTrigger>
            <TabsTrigger value="overlays" className="text-[11px] px-1">
              <Layers className="size-3 mr-1" /> Texture
            </TabsTrigger>
            <TabsTrigger value="pictures" className="text-[11px] px-1">
              <ImageIcon className="size-3 mr-1" /> Pictures
            </TabsTrigger>
          </TabsList>

          {/* TAB 1: WebGL Mesh Gradient & Shaders */}
          <TabsContent value="shaders" className="flex-1 mt-0 min-h-0">
            <ScrollArea className="h-full max-h-[calc(55vh)] pr-2">
              <div className="space-y-4 pb-4">
                {/* Random Generator Button */}
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Color Palettes
                  </Label>
                  <Button
                    onClick={handleRandomMesh}
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs gap-1 border-primary/40 hover:border-primary text-primary"
                  >
                    <Sparkles className="size-3" /> Randomize
                  </Button>
                </div>

                {/* Preset Palettes Grid */}
                <div className="grid grid-cols-3 gap-2">
                  {MESH_PALETTES.map((pal) => (
                    <button
                      key={pal.name}
                      onClick={() => {
                        setBackground("mesh");
                        setMeshConfig({ colors: [...pal.colors] });
                      }}
                      className="group relative rounded-lg p-1.5 border border-border/70 hover:border-primary/80 transition-all text-center bg-background/50 hover:scale-[1.02]"
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
                  ))}
                </div>

                {/* Individual Mesh Node Color Pickers */}
                <div className="space-y-2 pt-2 border-t border-border/50">
                  <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Custom Mesh Nodes (5 Colors)
                  </Label>
                  <div className="flex items-center justify-between gap-1">
                    {meshConfig.colors.map((color, idx) => (
                      <div
                        key={idx}
                        className="flex flex-col items-center gap-1"
                      >
                        <input
                          type="color"
                          value={color}
                          onChange={(e) =>
                            handleColorChange(idx, e.target.value)
                          }
                          className="size-8 rounded-lg border border-border cursor-pointer bg-transparent p-0 overflow-hidden shadow-xs hover:scale-105 transition-transform"
                        />
                        <span className="text-[9px] font-mono text-muted-foreground">
                          #{idx + 1}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3 pt-2 border-t border-border/50">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                      <Sliders className="size-3.5" /> Fluid Motion
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

                  <div className="grid grid-cols-2 gap-3">
                    <div
                      className={`space-y-2 ${
                        !meshConfig.isAnimating
                          ? "opacity-40 pointer-events-none"
                          : ""
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <Label className="text-xs font-medium text-muted-foreground">
                          Flow Speed
                        </Label>
                        <span className="text-xs font-mono text-muted-foreground">
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

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-xs font-medium text-muted-foreground">
                          Distortion
                        </Label>
                        <span className="text-xs font-mono text-muted-foreground">
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

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-xs font-medium text-muted-foreground">
                          Mesh Scale
                        </Label>
                        <span className="text-xs font-mono text-muted-foreground">
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

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-xs font-medium text-muted-foreground">
                          Noise Grain
                        </Label>
                        <span className="text-xs font-mono text-muted-foreground">
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

                {/* Real-time Dithering Module */}
                <div className="space-y-2.5 pt-2 border-t border-border/50">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Real-Time Dither Shader
                    </Label>
                    <Switch
                      checked={meshConfig.ditherEnabled}
                      onCheckedChange={(checked) =>
                        setMeshConfig({ ditherEnabled: checked })
                      }
                    />
                  </div>

                  {meshConfig.ditherEnabled && (
                    <div className="space-y-3 bg-muted/30 p-2.5 rounded-lg border border-border/60">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label className="text-[10px] text-muted-foreground">
                            Algorithm
                          </Label>
                          <Select
                            value={String(meshConfig.ditherType)}
                            onValueChange={(v) =>
                              setMeshConfig({ ditherType: parseInt(v) })
                            }
                          >
                            <SelectTrigger className="h-7 text-xs bg-background">
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
                        <div>
                          <Label className="text-[10px] text-muted-foreground">
                            Color Steps
                          </Label>
                          <Select
                            value={String(meshConfig.ditherColorSteps)}
                            onValueChange={(v) =>
                              setMeshConfig({ ditherColorSteps: parseInt(v) })
                            }
                          >
                            <SelectTrigger className="h-7 text-xs bg-background">
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

                      <div className="space-y-1">
                        <div className="flex justify-between text-[11px]">
                          <span>Pixel Size</span>
                          <span className="font-mono text-muted-foreground">
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
          <TabsContent value="overlays" className="flex-1 mt-0 min-h-0">
            <ScrollArea className="h-full max-h-[calc(55vh)] pr-2">
              <div className="space-y-4 pb-4">
                {/* Vector Patterns */}
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Vector Patterns (SVG)
                  </Label>
                  <div className="grid grid-cols-3 gap-2">
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
                        className={`p-2 rounded-lg border text-xs font-medium text-center transition-all ${
                          overlayConfig.pattern === p.id
                            ? "border-primary bg-primary/10 text-primary font-bold shadow-xs"
                            : "border-border/70 hover:border-border text-muted-foreground"
                        }`}
                      >
                        {p.name}
                      </button>
                    ))}
                  </div>

                  {overlayConfig.pattern !== "none" && (
                    <div className="space-y-2 pt-2">
                      <div className="flex justify-between text-xs font-medium">
                        <span>Pattern Opacity</span>
                        <span className="font-mono text-muted-foreground">
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

                {/* Studio Textures */}
                <div className="space-y-2 pt-2 border-t border-border/50">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Studio Texture Layer
                  </Label>
                  <div className="grid grid-cols-2 gap-2">
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
                        className={`p-2.5 rounded-lg border text-xs font-medium text-center transition-all ${
                          overlayConfig.texture === t.id
                            ? "border-primary bg-primary/10 text-primary font-bold shadow-xs"
                            : "border-border/70 hover:border-border text-muted-foreground"
                        }`}
                      >
                        {t.name}
                      </button>
                    ))}
                  </div>

                  {overlayConfig.texture !== "none" && (
                    <div className="space-y-2 pt-2">
                      <div className="flex justify-between text-xs font-medium">
                        <span>Texture Opacity</span>
                        <span className="font-mono text-muted-foreground">
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
          <TabsContent value="pictures" className="flex-1 mt-0 min-h-0 flex flex-col">
            {/* Sub-tab Pill Switcher */}
            <div className="grid grid-cols-2 gap-1 bg-muted/60 p-1 rounded-lg mb-2.5 shrink-0">
              <button
                onClick={() => setPictureSubTab("wallpapers")}
                className={`py-1 rounded text-xs font-medium transition-all flex items-center justify-center gap-1.5 ${
                  pictureSubTab === "wallpapers"
                    ? "bg-background text-foreground shadow-xs font-bold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <ImageIcon className="size-3" /> Wallpapers
              </button>
              <button
                onClick={() => setPictureSubTab("memes")}
                className={`py-1 rounded text-xs font-medium transition-all flex items-center justify-center gap-1.5 ${
                  pictureSubTab === "memes"
                    ? "bg-background text-foreground shadow-xs font-bold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Laugh className="size-3" /> Memes
              </button>
            </div>

            {pictureSubTab === "wallpapers" ? (
              <ScrollArea
                className="h-full max-h-[calc(55vh)] pr-2"
                onScroll={handleWallpaperScroll}
              >
                <div className="grid grid-cols-2 gap-2 pb-4">
                  {wallpapers.map((w) => (
                    <button
                      key={w.fileId}
                      onClick={() => setBackground(`url(${w.url})`)}
                      className="relative aspect-video rounded-lg overflow-hidden border border-border/60 hover:border-primary transition-all hover:scale-102"
                    >
                      <img
                        src={w.thumbnailUrl}
                        alt={w.name}
                        className="absolute inset-0 w-full h-full object-cover"
                        loading="lazy"
                      />
                      <div className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[10px] p-1 truncate text-center backdrop-blur-xs">
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
                className="h-full max-h-[calc(55vh)] pr-2"
                onScroll={handleMemeScroll}
              >
                <div className="grid grid-cols-2 gap-2 pb-4">
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
                      className="relative aspect-video rounded-lg overflow-hidden border border-border/60 hover:border-primary transition-all hover:scale-102"
                    >
                      <img
                        src={meme.thumbnailUrl}
                        alt={meme.name}
                        className="absolute inset-0 w-full h-full object-cover"
                        loading="lazy"
                      />
                      <div className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[10px] p-1 truncate text-center backdrop-blur-xs">
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
          </TabsContent>
        </Tabs>
      </div>

      {/* Export Studio Section */}
      <div className="p-4 border-t-2 dark:border-neutral-800 shrink-0 bg-card z-10 space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
            <Film className="size-3.5 text-primary" /> Export Studio
          </Label>
          <span className="text-[10px] font-semibold text-primary uppercase tracking-wide">
            {isVideoFormat ? "WASM Video" : "Hi-Res Snapshot"}
          </span>
        </div>

        {/* Format Selector Pills */}
        <div className="grid grid-cols-5 gap-1 bg-muted/60 p-1 rounded-lg">
          {(["mp4", "gif", "webm", "png", "jpeg"] as ExportFormat[]).map(
            (fmt) => (
              <button
                key={fmt}
                onClick={() => setExportFormat(fmt)}
                className={`py-1 rounded text-[11px] font-bold uppercase transition-all ${
                  exportFormat === fmt
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
          <div className="grid grid-cols-2 gap-2 pt-1">
            <div>
              <div className="flex justify-between text-[11px] font-medium mb-1">
                <span>Duration</span>
                <span className="font-mono text-primary font-bold">
                  {exportDuration}s
                </span>
              </div>
              <Slider
                value={[exportDuration]}
                min={1}
                max={6}
                step={1}
                onValueChange={([val]) => setExportDuration(val)}
              />
            </div>

            <div>
              <div className="flex justify-between text-[11px] font-medium mb-1">
                <span>Framerate</span>
                <span className="font-mono text-primary font-bold">
                  {exportFps} FPS
                </span>
              </div>
              <Select
                value={String(exportFps)}
                onValueChange={(v) => setExportFps(parseInt(v))}
              >
                <SelectTrigger className="h-7 text-xs bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 FPS</SelectItem>
                  <SelectItem value="60">60 FPS (Fluid)</SelectItem>
                </SelectContent>
              </Select>
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
                  onClick={() => setExportQuality(q)}
                  className={`px-2.5 py-0.5 rounded text-xs font-semibold border ${
                    exportQuality === q
                      ? "border-primary bg-primary/10 text-primary"
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
