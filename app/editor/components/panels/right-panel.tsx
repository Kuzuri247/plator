"use client";

import { useRef, useCallback, useState } from "react";
import {
  Image as ImageIcon,
  Loader2,
  Laugh,
  Layers,
  Zap,
  Ban,
} from "lucide-react";
import { toast } from "sonner";
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
import { RightPanelProps } from "../../types";
import {
  MESH_PALETTES,
  DEFAULT_MESH_CONFIG,
} from "../../values";
import { Wallpapers } from "../../hooks/wallpaper";
import { Memes } from "../../hooks/memes";
import { generateRandomMeshColors } from "../../utils/gradient-gen";
import { useStore } from "../../store/use-store";
import {
  VectorOverlay,
  VectorPatternType,
  PATTERN_LIST,
} from "../canvas/vector-overlay";
import {
  StudioTexture,
  StudioTextureType,
  TEXTURE_LIST,
} from "../canvas/studio-texture";

export function RightPanel({ onDownload }: RightPanelProps) {
  const {
    canvasBackground,
    meshConfig,
    overlayConfig,
    setBackground,
    setCustomSize,
    setMeshConfig,
    setOverlayConfig,
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
  const [colorMode, setColorMode] = useState<"multiple" | "mono">("multiple");
  const [monoColor, setMonoColor] = useState<string>(
    () => meshConfig.colors[0] || "#18181b"
  );
  const [prevMultiColors, setPrevMultiColors] = useState<string[]>(
    () => meshConfig.colors
  );

  const wallpaperScrollRef = useRef<HTMLDivElement>(null);
  const memeScrollRef = useRef<HTMLDivElement>(null);

  const handleRandomMesh = () => {
    const randomColors = generateRandomMeshColors();
    setPrevMultiColors(randomColors);
    setColorMode("multiple");
    setBackground("mesh");
    setMeshConfig({ colors: randomColors });
  };

  const handleColorChange = (index: number, newColor: string) => {
    const updatedColors = [...meshConfig.colors];
    updatedColors[index] = newColor;
    setPrevMultiColors(updatedColors);
    setBackground("mesh");
    setMeshConfig({ colors: updatedColors });
  };

  const handleModeChange = (mode: "multiple" | "mono") => {
    setColorMode(mode);
    if (mode === "mono") {
      const isAlreadyMono = meshConfig.colors.every(
        (c) => c.toLowerCase() === meshConfig.colors[0].toLowerCase()
      );
      if (!isAlreadyMono) {
        setPrevMultiColors(meshConfig.colors);
      }
      const targetColor = monoColor || meshConfig.colors[0] || "#18181b";
      setBackground("mesh");
      setMeshConfig({
        colors: [targetColor, targetColor, targetColor, targetColor, targetColor],
      });
    } else {
      const colorsToRestore =
        prevMultiColors.length === 5 &&
        prevMultiColors.some(
          (c) => c.toLowerCase() !== prevMultiColors[0].toLowerCase()
        )
          ? prevMultiColors
          : DEFAULT_MESH_CONFIG.colors;
      setBackground("mesh");
      setMeshConfig({ colors: [...colorsToRestore] });
    }
  };

  const handleMonoColorChange = (newColor: string) => {
    setMonoColor(newColor);
    setBackground("mesh");
    setMeshConfig({
      colors: [newColor, newColor, newColor, newColor, newColor],
    });
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
                            setPrevMultiColors([...pal.colors]);
                            setColorMode("multiple");
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

                {/* Section 2: Custom Mesh Nodes / Single Color Palette */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-semibold uppercase tracking-wider">
                      Color Palette
                    </Label>
                    <div className="flex items-center bg-muted/60 p-0.5 rounded-lg shrink-0">
                      <button
                        type="button"
                        onClick={() => handleModeChange("multiple")}
                        className={`px-2.5 py-1 rounded-md text-[11px] font-medium font-manrope transition-all cursor-pointer ${
                          colorMode === "multiple"
                            ? "bg-background text-foreground shadow-xs font-semibold"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        Multiple
                      </button>
                      <button
                        type="button"
                        onClick={() => handleModeChange("mono")}
                        className={`px-2.5 py-1 rounded-md text-[11px] font-medium font-manrope transition-all cursor-pointer ${
                          colorMode === "mono"
                            ? "bg-background text-foreground shadow-xs font-semibold"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        Mono
                      </button>
                    </div>
                  </div>

                  {colorMode === "multiple" ? (
                    <div className="flex items-center justify-between gap-1 pl-1 pr-2">
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
                  ) : (
                    <div className="flex items-center justify-between gap-1 pl-1 pr-2">
                      {/* Slot 1: Custom color picker */}
                      <div className="flex flex-col items-center gap-1">
                        <div
                          className={`relative size-8 rounded-lg overflow-hidden border shadow-xs hover:scale-105 transition-transform ${
                            !["#09090b", "#64748b", "#bae6fd", "#f8fafc"].includes(
                              monoColor.toLowerCase()
                            )
                              ? "border-primary ring-2 ring-primary/80"
                              : "border-border/80"
                          }`}
                        >
                          <div
                            className="absolute inset-0"
                            style={{ backgroundColor: monoColor }}
                          />
                          <input
                            type="color"
                            value={monoColor}
                            onChange={(e) =>
                              handleMonoColorChange(e.target.value)
                            }
                            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full p-0 border-0"
                          />
                        </div>
                        <span className="text-[10px] font-manrope text-muted-foreground">
                          Custom
                        </span>
                      </div>

                      {/* Slots 2-5: 1 Dark + Cool and Light presets */}
                      {[
                        { name: "Dark", color: "#09090b" },
                        { name: "Steel", color: "#64748b" },
                        { name: "Ice", color: "#bae6fd" },
                        { name: "Snow", color: "#f8fafc" },
                      ].map((item) => {
                        const isSelected =
                          monoColor.toLowerCase() === item.color.toLowerCase();
                        return (
                          <button
                            key={item.color}
                            type="button"
                            onClick={() => handleMonoColorChange(item.color)}
                            className="flex flex-col items-center gap-1 cursor-pointer group"
                          >
                            <div
                              className={`size-8 rounded-lg overflow-hidden border shadow-xs transition-transform group-hover:scale-105 ${
                                isSelected
                                  ? "border-primary ring-2 ring-primary/80"
                                  : "border-border/80"
                              }`}
                              style={{ backgroundColor: item.color }}
                            />
                            <span
                              className={`text-[10px] font-manrope transition-colors ${
                                isSelected
                                  ? "text-primary font-semibold"
                                  : "text-muted-foreground group-hover:text-foreground"
                              }`}
                            >
                              {item.name}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
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
                      <div className="grid grid-cols-2 gap-4 pr-2">
                        <div className="space-y-2 min-w-0">
                          <Label className="text-xs font-medium text-muted-foreground">
                            Matrix&nbsp; Pattern
                          </Label>
                          <Select
                            value={String(meshConfig.ditherType)}
                            onValueChange={(v) =>
                              setMeshConfig({ ditherType: parseInt(v) })
                            }
                          >
                            <SelectTrigger className="h-8 w-full">
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
                        <div className="space-y-2 min-w-0">
                          <Label className="text-xs font-medium text-muted-foreground">
                            Color Levels
                          </Label>
                          <Select
                            value={String(meshConfig.ditherColorSteps)}
                            onValueChange={(v) =>
                              setMeshConfig({ ditherColorSteps: parseInt(v) })
                            }
                          >
                            <SelectTrigger className="h-8 w-full">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="2">2 (1-Bit)</SelectItem>
                              <SelectItem value="4">4 Levels</SelectItem>
                              <SelectItem value="6">6 Levels</SelectItem>
                              <SelectItem value="8">8 Levels</SelectItem>
                              <SelectItem value="16">16 Levels</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* Row 2: Pixel Size & Dither Strength Sliders */}
                      <div className="grid grid-cols-2 gap-3 *:pr-1">
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

                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Label className="text-xs font-medium text-muted-foreground">
                              Strength
                            </Label>
                            <span className="text-xs font-manrope text-muted-foreground">
                              {meshConfig.ditherStrength ?? 100}%
                            </span>
                          </div>
                          <Slider
                            value={[meshConfig.ditherStrength ?? 100]}
                            min={0}
                            max={100}
                            step={1}
                            onValueChange={([val]) =>
                              setMeshConfig({ ditherStrength: val })
                            }
                          />
                        </div>
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
                  <div className="grid grid-cols-2 gap-2.5 items-center font-manrope">
                    <Label className="text-xs font-bold uppercase tracking-wider text-foreground">
                      Patterns
                    </Label>
                    <div
                      className={`flex items-center gap-0.5 transition-all duration-200 ${overlayConfig.pattern === "none"
                          ? "opacity-30 pointer-events-none"
                          : "opacity-100"
                        }`}
                    >
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground shrink-0 pr-1">
                        Opacity
                      </span>
                      <Slider
                        value={[overlayConfig.patternOpacity]}
                        min={5}
                        max={100}
                        step={1}
                        disabled={overlayConfig.pattern === "none"}
                        onValueChange={([val]) =>
                          setOverlayConfig({ patternOpacity: val })
                        }
                        className="flex-1 cursor-pointer"
                      />
                      <span className="text-[10px] font-bold text-primary w-7 text-right shrink-0">
                        {overlayConfig.patternOpacity}%
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5 font-manrope">
                    {PATTERN_LIST.map((p) => {
                      const isSelected = overlayConfig.pattern === p.id;
                      return (
                        <button
                          key={p.id}
                          onClick={() => setOverlayConfig({ pattern: p.id })}
                          className={`group relative aspect-video rounded-lg overflow-hidden border transition-all duration-200 hover:scale-[1.03] hover:z-20 hover:shadow-xl cursor-pointer bg-muted/30 ${isSelected
                              ? "border-primary ring-2 ring-primary/80 shadow-lg"
                              : "border-border/70 hover:border-primary hover:ring-2 hover:ring-primary/60"
                            }`}
                        >
                          <div className="absolute inset-0 w-full h-full">
                            {p.id === "none" ? (
                              <div className="w-full h-full flex flex-col items-center justify-center bg-neutral-900/90 text-neutral-500 group-hover:text-neutral-300 transition-colors pb-3">
                                <Ban className="size-5 mb-0.5 opacity-60 group-hover:opacity-100" />
                                <span className="text-[9px] uppercase tracking-wider font-semibold opacity-60">
                                  Off
                                </span>
                              </div>
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 relative overflow-hidden">
                                <VectorOverlay
                                  type={p.id}
                                  opacity={85}
                                  color="#ffffff"
                                  blendMode="normal"
                                  idPrefix={`preview_${p.id}`}
                                />
                              </div>
                            )}
                          </div>
                          <div className="absolute z-50 bottom-0 inset-x-0 bg-black/75 text-white text-[10px] py-1 px-1.5 truncate text-center backdrop-blur-xs font-manrope font-medium transition-colors group-hover:bg-black/90 group-hover:text-primary">
                            {p.name}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <Separator />

                {/* Studio Textures */}
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2.5 items-center font-manrope">
                    <Label className="text-xs font-bold uppercase tracking-wider text-foreground">
                      Texture Layer
                    </Label>
                    <div
                      className={`flex items-center gap-0.5 transition-all duration-200 ${overlayConfig.texture === "none"
                          ? "opacity-30 pointer-events-none"
                          : "opacity-100"
                        }`}
                    >
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground shrink-0 pr-1">
                        Opacity
                      </span>
                      <Slider
                        value={[overlayConfig.textureOpacity]}
                        min={5}
                        max={100}
                        step={1}
                        disabled={overlayConfig.texture === "none"}
                        onValueChange={([val]) =>
                          setOverlayConfig({ textureOpacity: val })
                        }
                        className="flex-1 cursor-pointer"
                      />
                      <span className="text-[10px] font-bold text-primary w-7 text-right shrink-0">
                        {overlayConfig.textureOpacity}%
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5 font-manrope">
                    {TEXTURE_LIST.map((t) => {
                      const isSelected = overlayConfig.texture === t.id;
                      return (
                        <button
                          key={t.id}
                          onClick={() => setOverlayConfig({ texture: t.id })}
                          className={`group relative aspect-video rounded-lg overflow-hidden border transition-all duration-200 hover:scale-[1.03] hover:z-20 hover:shadow-xl cursor-pointer bg-muted/30 ${isSelected
                              ? "border-primary ring-2 ring-primary/80 shadow-lg"
                              : "border-border/70 hover:border-primary hover:ring-2 hover:ring-primary/60"
                            }`}
                        >
                          <div className="absolute inset-0 w-full h-full">
                            {t.id === "none" ? (
                              <div className="w-full h-full flex flex-col items-center justify-center bg-neutral-900/90 text-neutral-500 group-hover:text-neutral-300 transition-colors pb-3">
                                <Ban className="size-5 mb-0.5 opacity-60 group-hover:opacity-100" />
                                <span className="text-[9px] uppercase tracking-wider font-semibold opacity-60">
                                  Off
                                </span>
                              </div>
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 relative overflow-hidden">
                                <StudioTexture
                                  type={t.id}
                                  opacity={85}
                                  blendMode="normal"
                                  idPrefix={`preview_tex_${t.id}`}
                                />
                              </div>
                            )}
                          </div>
                          <div className="absolute z-50 bottom-0 inset-x-0 bg-black/75 text-white text-[10px] py-1 px-1.5 truncate text-center backdrop-blur-xs font-manrope font-medium transition-colors group-hover:bg-black/90 group-hover:text-primary">
                            {t.name}
                          </div>
                        </button>
                      );
                    })}
                  </div>
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
                            img.onerror = () => {
                              toast.error("Failed to load meme template image.");
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
    </div>
  );
}
