"use client";

import {
  Type,
  Image as ImageIcon,
  Plus,
  Highlighter,
  Underline,
  Strikethrough,
  Italic,
  CaseUpper,
  ALargeSmall,
  Layers,
  ArrowLeftRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  LeftPanelProps,
  ImageElement,
  TextElement,
  DEFAULT_TEXT_STYLE,
} from "../../types";
import {
  FONT_FAMILIES,
  FONT_WEIGHTS,
  SHADOW_PRESETS,
  CLIP_PATHS,
  TRANSFORM_3D_PRESETS,
  GRADIENT_DIRECTIONS,
  TEXT_GRADIENT_PRESETS,
  BACKGROUND_GRADIENT_PRESETS,
} from "../../values";
import { cn } from "@/lib/utils";
import { useStore } from "../../store/use-store";
import { LayerPanel } from "./layer-panel";

const getFontFamilyStyle = (font: string) => {
  switch (font) {
    case "Inter":
      return "var(--font-inter), Inter, sans-serif";
    case "Manrope":
      return "var(--font-manrope), Manrope, sans-serif";
    case "Space Grotesk":
      return "var(--font-space), 'Space Grotesk', sans-serif";
    case "Roboto":
      return "var(--font-roboto), Roboto, sans-serif";
    case "Instrument Serif":
      return "var(--font-instrument-serif), var(--font-instrument), 'Instrument Serif', serif";
    case "Poppins":
      return "var(--font-poppins), Poppins, sans-serif";
    case "Playfair Display":
      return "var(--font-playfair), 'Playfair Display', serif";
    case "Oswald":
      return "var(--font-oswald), Oswald, sans-serif";
    case "Montserrat":
      return "var(--font-montserrat), Montserrat, sans-serif";
    case "Arial":
      return "Arial, Helvetica, sans-serif";
    case "Impact":
      return "Impact, 'Arial Black', sans-serif";
    case "Courier":
      return "'Courier New', Courier, monospace";
    default:
      return font;
  }
};

export function LeftPanel({
  onImageUpload,
  isCropping,
  onToggleCropping,
}: LeftPanelProps) {
  const {
    elements,
    selectedElementId,
    addElement,
    updateElement,
    activeTab,
    setActiveTab,
    setDitherConfig,
  } = useStore();

  const selectedElement = elements.find((el) => el.id === selectedElementId);

  const handleAddText = () => {
    addElement({
      id: `text_${Date.now()}`,
      type: "text",
      name: "Sample Text",
      content: "Sample Text",
      position: { x: 100, y: 100 },
      style: { ...DEFAULT_TEXT_STYLE },
      isVisible: true,
      isLocked: false,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onImageUpload(file);
  };

  const updateSelected = (updates: any) => {
    if (selectedElementId) {
      updateElement(selectedElementId, updates);
    }
  };

  const imgStyle =
    selectedElement?.type === "image"
      ? (selectedElement as ImageElement).style
      : null;
  const imgElement =
    selectedElement?.type === "image"
      ? (selectedElement as ImageElement)
      : null;
  const textStyle =
    selectedElement?.type === "text"
      ? (selectedElement as TextElement).style
      : null;

  return (
    <div className="flex flex-col h-full w-full">
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full flex-1 flex flex-col h-full"
      >
        <div className="px-3 pt-3 pb-1 shrink-0">
          <TabsList className="w-full grid grid-cols-3 dark:bg-neutral-800">
            <TabsTrigger value="image">
              <ImageIcon className="size-3.5" />
              Image
            </TabsTrigger>
            <TabsTrigger value="text">
              <Type className="size-3.5" />
              Text
            </TabsTrigger>
            <TabsTrigger value="layers">
              <Layers className="size-3.5" />
              Layers
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="flex-1 min-h-0 relative">
          <TabsContent
            value="layers"
            className="absolute inset-0 data-[state=inactive]:hidden mt-0 overflow-hidden w-full max-w-full"
          >
            <LayerPanel />
          </TabsContent>

          <TabsContent
            value="image"
            className="absolute inset-0 data-[state=inactive]:hidden focus-visible:outline-none mt-0"
          >
            <ScrollArea className="h-full w-full">
              <div className="p-4 flex flex-col gap-6 pb-20">
                <div className="space-y-5">
                  <div className="space-y-3">
                    <Label className="text-sm font-semibold uppercase tracking-wider">
                      Upload
                    </Label>
                    <div className="relative">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                        id="image-upload"
                      />
                      <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="w-full rounded-sm border-dashed bg-transparent border-neutral-400 dark:border-neutral-600 hover:bg-muted/50"
                      >
                        <label
                          htmlFor="image-upload"
                          className="cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5 mr-2" /> Add Image Layer
                        </label>
                      </Button>
                    </div>
                  </div>

                  {selectedElement?.type === "image" && imgStyle ? (
                    <>
                      <Separator />

                      <Label className="text-sm font-semibold uppercase tracking-wider">
                        Image Properties
                      </Label>
                      <div className="space-y-5 grid grid-cols-2 gap-2 font-manrope font-semibold *:pr-1">
                        {/* Scale */}
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Label className="text-xs font-medium text-muted-foreground">
                              Scale
                            </Label>
                            <span className="text-xs text-muted-foreground">
                              {imgStyle.scale}%
                            </span>
                          </div>
                          <Slider
                            value={[imgStyle.scale]}
                            onValueChange={([val]) =>
                              updateSelected({ scale: val })
                            }
                            min={10}
                            max={200}
                            step={1}
                          />
                        </div>

                        {/* Opacity */}
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Label className="text-xs font-medium text-muted-foreground">
                              Opacity
                            </Label>
                            <span className="text-xs text-muted-foreground">
                              {imgStyle.opacity}%
                            </span>
                          </div>
                          <Slider
                            value={[imgStyle.opacity]}
                            onValueChange={([val]) =>
                              updateSelected({ opacity: val })
                            }
                            min={0}
                            max={100}
                            step={1}
                          />
                        </div>

                        {/* Brightness */}
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Label className="text-xs font-medium text-muted-foreground">
                              Brightness
                            </Label>
                            <span className="text-xs text-muted-foreground">
                              {imgStyle.brightness ?? 100}%
                            </span>
                          </div>
                          <Slider
                            value={[imgStyle.brightness ?? 100]}
                            onValueChange={([val]) =>
                              updateSelected({ brightness: val })
                            }
                            min={20}
                            max={180}
                            step={1}
                          />
                        </div>

                        {/* Contrast */}
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Label className="text-xs font-medium text-muted-foreground">
                              Contrast
                            </Label>
                            <span className="text-xs text-muted-foreground">
                              {imgStyle.contrast ?? 100}%
                            </span>
                          </div>
                          <Slider
                            value={[imgStyle.contrast ?? 100]}
                            onValueChange={([val]) =>
                              updateSelected({ contrast: val })
                            }
                            min={20}
                            max={180}
                            step={1}
                          />
                        </div>

                        {/* Saturation */}
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Label className="text-xs font-medium text-muted-foreground">
                              Saturation
                            </Label>
                            <span className="text-xs text-muted-foreground">
                              {imgStyle.saturate ?? 100}%
                            </span>
                          </div>
                          <Slider
                            value={[imgStyle.saturate ?? 100]}
                            onValueChange={([val]) =>
                              updateSelected({ saturate: val })
                            }
                            min={0}
                            max={200}
                            step={1}
                          />
                        </div>

                        {/* Blur */}
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Label className="text-xs font-medium text-muted-foreground">
                              Blur
                            </Label>
                            <span className="text-xs text-muted-foreground">
                              {imgStyle.blur}px
                            </span>
                          </div>
                          <Slider
                            value={[imgStyle.blur]}
                            onValueChange={([val]) =>
                              updateSelected({ blur: val })
                            }
                            min={0}
                            max={20}
                            step={1}
                          />
                        </div>

                        {/* Roundness */}
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Label className="text-xs font-medium text-muted-foreground">
                              Roundness
                            </Label>
                            <span className="text-xs text-muted-foreground">
                              {imgStyle.borderRadius}px
                            </span>
                          </div>
                          <Slider
                            value={[imgStyle.borderRadius]}
                            onValueChange={([val]) =>
                              updateSelected({ borderRadius: val })
                            }
                            min={0}
                            max={100}
                            step={1}
                          />
                        </div>

                        {/* Shadow */}
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Label className="text-xs font-medium text-muted-foreground">
                              Shadow
                            </Label>
                            <span className="text-xs text-muted-foreground">
                              {SHADOW_PRESETS.find(
                                (s) => s.value === imgStyle.shadow,
                              )?.name || "None"}
                            </span>
                          </div>
                          <Slider
                            defaultValue={[0]}
                            value={[
                              SHADOW_PRESETS.findIndex(
                                (s) => s.value === imgStyle.shadow,
                              ) !== -1
                                ? SHADOW_PRESETS.findIndex(
                                  (s) => s.value === imgStyle.shadow,
                                )
                                : 0,
                            ]}
                            onValueChange={([val]) => {
                              const preset = SHADOW_PRESETS[val];
                              if (preset)
                                updateSelected({ shadow: preset.value });
                            }}
                            min={0}
                            max={SHADOW_PRESETS.length - 1}
                            step={1}
                          />
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-5">
                        <Label className="text-sm font-semibold uppercase tracking-wider">
                          Orientation & Clipping
                        </Label>

                        {/* 3D Rotation Controls */}


                        <div className="space-y-2 font-manrope">
                          <div className="grid grid-cols-3 gap-3 items-center justify-center">
                            <Label className="text-xs text-muted-foreground flex justify-center">
                              X-Axis: {imgStyle.rotateX}°
                            </Label>
                            <Label className="text-xs text-muted-foreground flex justify-center">
                              Y-Axis: {imgStyle.rotateY}°
                            </Label>
                            <Label className="text-xs text-muted-foreground flex justify-center">
                              Z-Axis: {imgStyle.rotate}°
                            </Label>
                          </div>

                          <div className="grid grid-cols-3 gap-4">
                            <Slider
                              value={[imgStyle.rotateX]}
                              onValueChange={([val]) =>
                                updateSelected({ rotateX: val })
                              }
                              min={-180}
                              max={180}
                              step={1}
                              className="py-1"
                            />
                            <Slider
                              value={[imgStyle.rotateY]}
                              onValueChange={([val]) =>
                                updateSelected({ rotateY: val })
                              }
                              min={-180}
                              max={180}
                              step={1}
                              className="py-1"
                            />
                            <Slider
                              value={[imgStyle.rotate]}
                              onValueChange={([val]) =>
                                updateSelected({ rotate: val })
                              }
                              min={-180}
                              max={180}
                              step={1}
                              className="py-1"
                            />
                          </div>

                        </div>

                        {/* Row: Clip Path & 3D Preset Dropdowns */}
                        <div className="grid grid-cols-2 gap-6 font-manrope font-semibold pr-2">
                          {/* 1. Clip Path */}
                          <div className="space-y-1.5 min-w-0">
                            <Label className="text-xs font-medium text-muted-foreground truncate block">
                              Clip Path
                            </Label>
                            <Select
                              value={imgStyle.clipPath || "none"}
                              onValueChange={(val) =>
                                updateSelected({ clipPath: val })
                              }
                            >
                              <SelectTrigger className="h-8 w-full text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="text-xs max-h-56">
                                {CLIP_PATHS.map((clip) => (
                                  <SelectItem
                                    key={clip.name}
                                    value={clip.value}
                                    className="text-xs py-1.5 cursor-pointer"
                                  >
                                    {clip.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          {/* 2. 3D Preset */}
                          <div className="space-y-1.5 min-w-0">
                            <Label className="text-xs font-medium text-muted-foreground truncate block">
                              3D Preset
                            </Label>
                            <Select
                              value={
                                TRANSFORM_3D_PRESETS.find(
                                  (p) =>
                                    p.id !== "custom" &&
                                    p.rotateX === imgStyle.rotateX &&
                                    p.rotateY === imgStyle.rotateY &&
                                    p.rotate === imgStyle.rotate
                                )?.id || "custom"
                              }
                              onValueChange={(presetId) => {
                                const preset = TRANSFORM_3D_PRESETS.find(
                                  (p) => p.id === presetId
                                );
                                if (preset && preset.id !== "custom") {
                                  updateSelected({
                                    rotateX: preset.rotateX,
                                    rotateY: preset.rotateY,
                                    rotate: preset.rotate,
                                  });
                                }
                              }}
                            >
                              <SelectTrigger className="h-8 w-full text-xs">
                                <SelectValue placeholder="Custom" />
                              </SelectTrigger>
                              <SelectContent className="text-xs max-h-56">
                                <SelectItem
                                  value="custom"
                                  className="text-xs py-1.5 cursor-pointer text-muted-foreground"
                                  disabled
                                >
                                  Custom
                                </SelectItem>
                                {TRANSFORM_3D_PRESETS.map((preset) => (
                                  <SelectItem
                                    key={preset.id}
                                    value={preset.id}
                                    className="text-xs py-1.5 cursor-pointer"
                                  >
                                    {preset.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-5">
                        <div className="flex items-center justify-between">
                          <Label className="text-sm font-semibold uppercase tracking-wider">
                            Dither Effect
                          </Label>
                          <Switch
                            checked={imgElement?.dither?.enabled || false}
                            onCheckedChange={(enabled) =>
                              setDitherConfig(selectedElementId!, { enabled })
                            }
                          />
                        </div>

                        {imgElement?.dither?.enabled && (
                          <div className="space-y-5 font-manrope animate-in fade-in slide-in-from-top-2 duration-200">
                            {/* Row 1: Pattern Dropdown (Left) + Swatches & Swap (Right) */}
                            <div className="grid grid-cols-12 gap-2 items-end">
                              <div className="col-span-5 pr-1 space-y-2 min-w-0">
                                <Label className="text-xs font-medium text-muted-foreground mb-2">
                                  Pattern Type
                                </Label>
                                <Select
                                  value={String(imgElement?.dither?.ditherType ?? 1)}
                                  onValueChange={(val) =>
                                    setDitherConfig(selectedElementId!, { ditherType: Number(val) })
                                  }
                                >
                                  <SelectTrigger className="h-8 w-full">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="0">Bayer 2x2</SelectItem>
                                    <SelectItem value="1">Bayer 4x4</SelectItem>
                                    <SelectItem value="2">Bayer 8x8</SelectItem>
                                    <SelectItem value="3">Noise</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>

                              <div className="col-span-7 flex items-center justify-end gap-1.5 pb-px">
                                {/* Foreground Color */}
                                <div className="flex flex-col items-center">
                                  <Label className="text-xs mb-2 font-medium text-muted-foreground">
                                    BG color
                                  </Label>
                                  <div className="relative size-7.5 -mb-px rounded-md overflow-hidden border border-neutral-300 dark:border-neutral-700 shrink-0 hover:scale-105 transition-transform shadow-xs">
                                    <div
                                      className="absolute inset-0"
                                      style={{
                                        backgroundColor: imgElement?.dither?.colorFront || "#ffffff",
                                      }}
                                    />
                                    <input
                                      type="color"
                                      value={imgElement?.dither?.colorFront || "#ffffff"}
                                      onChange={(e) =>
                                        setDitherConfig(selectedElementId!, { colorFront: e.target.value })
                                      }
                                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full p-0 border-0"
                                      title="Foreground Color"
                                    />
                                  </div>
                                </div>

                                {/* Invert / Swap Button */}
                                <button
                                  type="button"
                                  onClick={() => {
                                    const currentFront = imgElement?.dither?.colorFront || "#ffffff";
                                    const currentBack = imgElement?.dither?.colorBack || "#000000";
                                    setDitherConfig(selectedElementId!, {
                                      colorFront: currentBack,
                                      colorBack: currentFront,
                                    });
                                  }}
                                  className="size-7 flex items-center justify-center rounded-md border border-border/70 hover:border-primary text-muted-foreground hover:text-foreground mt-6 transition-colors cursor-pointer bg-background/50 hover:bg-muted/50 shadow-xs"
                                  title="Swap Foreground & Background Colors"
                                >
                                  <ArrowLeftRight className="size-3" />
                                </button>

                                {/* Background Color */}
                                <div className="flex flex-col items-center">
                                  <Label className="text-xs mb-2 font-medium text-muted-foreground">
                                    FG color
                                  </Label>
                                  <div className="relative size-7.5 rounded-md overflow-hidden border border-neutral-300 dark:border-neutral-700 shrink-0 hover:scale-105 transition-transform shadow-xs">
                                    <div
                                      className="absolute inset-0"
                                      style={{
                                        backgroundColor: imgElement?.dither?.colorBack || "#000000",
                                      }}
                                    />
                                    <input
                                      type="color"
                                      value={imgElement?.dither?.colorBack || "#000000"}
                                      onChange={(e) =>
                                        setDitherConfig(selectedElementId!, { colorBack: e.target.value })
                                      }
                                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full p-0 border-0"
                                      title="Background Color"
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Row 2: Quick Palette Presets */}
                            <div className="space-y-1.5 pt-0.5">
                              <Label className="text-xs font-medium text-muted-foreground">
                                Color Presets
                              </Label>
                              <div className="grid grid-cols-3 gap-1.5 ">
                                {[
                                  { name: "Mono", front: "#ffffff", back: "#000000" },
                                  { name: "GameBoy", front: "#9bbc0f", back: "#0f380f" },
                                  { name: "Cyber", front: "#00dfd8", back: "#ff007f" },
                                  { name: "Matrix", front: "#00ff66", back: "#0a1a0f" },
                                  { name: "Amber", front: "#ffb000", back: "#1a0f00" },
                                  { name: "Sepia", front: "#f4ecd8", back: "#3d2b1f" },
                                ].map((pal) => (
                                  <button
                                    key={pal.name}
                                    type="button"
                                    onClick={() =>
                                      setDitherConfig(selectedElementId!, {
                                        colorFront: pal.front,
                                        colorBack: pal.back,
                                      })
                                    }
                                    className="group relative flex flex-col items-center p-1 rounded-md border border-border/70 hover:border-primary/80 transition-all hover:scale-105 bg-background/50 cursor-pointer shadow-xs"
                                    title={pal.name}
                                  >
                                    <div className="flex h-3.5 w-full rounded-xs overflow-hidden mb-1 shadow-2xs">
                                      <div className="flex-1 h-full" style={{ backgroundColor: pal.front }} />
                                      <div className="flex-1 h-full" style={{ backgroundColor: pal.back }} />
                                    </div>
                                    <span className="text-[11px] font-medium text-muted-foreground group-hover:text-foreground truncate block">
                                      {pal.name}
                                    </span>
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* Row 3: Pixel Size & Color Steps Sliders */}
                            <div className="grid grid-cols-2 gap-2 *:pr-1 pt-0.5">
                              <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                  <Label className="text-xs font-medium text-muted-foreground">
                                    Pixel Size
                                  </Label>
                                  <span className="text-xs font-manrope text-muted-foreground">
                                    {imgElement?.dither?.pixelSize ?? 4}px
                                  </span>
                                </div>
                                <Slider
                                  value={[imgElement?.dither?.pixelSize ?? 4]}
                                  onValueChange={([pixelSize]) =>
                                    setDitherConfig(selectedElementId!, { pixelSize })
                                  }
                                  min={1}
                                  max={16}
                                  step={1}
                                />
                              </div>

                              <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                  <Label className="text-xs font-medium text-muted-foreground">
                                    Color Steps
                                  </Label>
                                  <span className="text-xs font-manrope text-muted-foreground">
                                    {imgElement?.dither?.colorSteps ?? 4}
                                  </span>
                                </div>
                                <Slider
                                  value={[imgElement?.dither?.colorSteps ?? 4]}
                                  onValueChange={([colorSteps]) =>
                                    setDitherConfig(selectedElementId!, { colorSteps })
                                  }
                                  min={2}
                                  max={16}
                                  step={1}
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="text-center p-8 text-muted-foreground font-inter text-xs border-2 border-dashed rounded-lg">
                      {activeTab === "image" &&
                        selectedElement?.type !== "image" &&
                        elements.some((e) => e.type === "image")
                        ? "An image layer was previously selected. Select it again from Layers to edit."
                        : "Select an image layer to edit properties."}
                    </div>
                  )}
                </div>
              </div>
            </ScrollArea>
          </TabsContent>

          {/* --- TEXT TAB --- */}
          <TabsContent
            value="text"
            className="absolute inset-0 data-[state=inactive]:hidden focus-visible:outline-none mt-0"
          >
            <ScrollArea className="h-full w-full">
              <div className="p-4 flex flex-col gap-6 pb-20">
                <div className="space-y-5">
                  <div className="space-y-3">
                    <Label className="text-sm font-semibold uppercase tracking-wider">
                      Content
                    </Label>
                    {selectedElement?.type === "text" && textStyle ? (
                      <Textarea
                        value={(selectedElement as TextElement).content}
                        onChange={(e) =>
                          updateSelected({ content: e.target.value })
                        }
                        className="min-h-8 resize-none bg-transparent placeholder:font-inter"
                        placeholder="Type text here..."
                      />
                    ) : null}

                    <Button
                      onClick={handleAddText}
                      variant="outline"
                      size="sm"
                      className="w-full bg-transparent border-dashed rounded-sm border-neutral-400 dark:border-neutral-600 hover:bg-muted/50"
                    >
                      <Plus className="w-3.5 h-3.5 mr-2" /> Add Text Layer
                    </Button>
                  </div>

                  {selectedElement?.type === "text" && textStyle ? (
                    <>
                      <Separator />

                      <div className="space-y-5">
                        <Label className="text-sm font-semibold uppercase tracking-wider">
                          Typography
                        </Label>

                        {/* Font Family & Weight */}
                        <div className="grid grid-cols-2 gap-2 font-manrope *font-semibold">
                          <div className="space-y-1.5 min-w-0">
                            <Label className="text-xs font-medium text-muted-foreground">
                              Font Family
                            </Label>
                            <Select
                              value={textStyle.fontFamily}
                              onValueChange={(val) =>
                                updateSelected({ fontFamily: val })
                              }
                            >
                              <SelectTrigger
                                className="h-8 w-full text-xs"
                                style={{ fontFamily: getFontFamilyStyle(textStyle.fontFamily) }}
                              >
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="text-xs max-h-60">
                                {FONT_FAMILIES.map((f) => (
                                  <SelectItem
                                    key={f}
                                    value={f}
                                    style={{ fontFamily: getFontFamilyStyle(f) }}
                                    className="text-xs py-1.5 cursor-pointer"
                                  >
                                    {f}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-1.5 min-w-0">
                            <Label className="text-xs font-medium text-muted-foreground">
                              Font Weight
                            </Label>
                            <Select
                              value={textStyle.fontWeight}
                              onValueChange={(val) =>
                                updateSelected({ fontWeight: val })
                              }
                            >
                              <SelectTrigger className="h-8 w-full font-manrope text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="font-manrope text-xs">
                                {FONT_WEIGHTS.map((w) => (
                                  <SelectItem
                                    key={w.value}
                                    value={w.value}
                                    className="text-xs py-1.5 cursor-pointer"
                                  >
                                    {w.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        {/* Text Effects (Individual square cards evenly distributed in a row) */}
                        <div className="space-y-1.5">
                          <Label className="text-xs font-manrope text-muted-foreground">
                            Text Effects
                          </Label>
                          <div className="grid grid-cols-6 gap-2">
                            {[
                              {
                                id: "outline",
                                icon: Highlighter,
                                title: "Outline Text",
                              },
                              {
                                id: "underline",
                                icon: Underline,
                                title: "Underline",
                              },
                              {
                                id: "line-through",
                                icon: Strikethrough,
                                title: "Strikethrough",
                              },
                              {
                                id: "italic",
                                icon: Italic,
                                title: "Italic",
                              },
                              {
                                id: "uppercase",
                                icon: CaseUpper,
                                title: "Uppercase",
                              },
                              {
                                id: "small-caps",
                                icon: ALargeSmall,
                                title: "Small Caps",
                              },
                            ].map((eff) => {
                              const isActive = (textStyle.textEffect || []).includes(eff.id);
                              const Icon = eff.icon;
                              return (
                                <button
                                  key={eff.id}
                                  type="button"
                                  onClick={() => {
                                    const current = textStyle.textEffect || [];
                                    const next = isActive
                                      ? current.filter((x) => x !== eff.id)
                                      : [...current, eff.id];
                                    updateSelected({ textEffect: next });
                                  }}
                                  className={`aspect-square w-full rounded-md border flex items-center justify-center transition-all cursor-pointer shadow-2xs hover:scale-105 ${isActive
                                    ? "bg-primary text-primary-foreground border-primary font-bold shadow-xs scale-102"
                                    : "bg-background/60 hover:bg-muted/60 border-neutral-300 dark:border-neutral-700 text-muted-foreground hover:text-foreground"
                                    }`}
                                  title={eff.title}
                                >
                                  <Icon className="size-4" />
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Font Size */}
                        <div className="space-y-3 font-manrope font-semibold">
                          <div className="flex items-center justify-between">
                            <Label className="text-xs font-medium text-muted-foreground">
                              Font Size
                            </Label>
                            <span className="text-xs text-muted-foreground">
                              {textStyle.fontSize}px
                            </span>
                          </div>
                          <Slider
                            value={[textStyle.fontSize]}
                            onValueChange={([v]) =>
                              updateSelected({ fontSize: v })
                            }
                            min={12}
                            max={120}
                            step={1}
                            className="w-full"
                          />
                        </div>

                        {/* Text Color & Gradient Section */}
                        <div className="space-y-3 font-manrope font-semibold">
                          <div className="flex items-center justify-between">
                            <Label className="text-xs text-muted-foreground">
                              Color Gradient
                            </Label>
                            {/* Mode Tabs */}
                            <div className="flex items-center bg-muted/60 p-0.5 rounded-md border border-neutral-300 dark:border-neutral-700">
                              {[
                                { id: "gradient", label: "Gradient" },
                                { id: "solid", label: "Solid" },
                              ].map((mode) => (
                                <button
                                  key={mode.id}
                                  type="button"
                                  onClick={() =>
                                    updateSelected({ colorType: mode.id as "gradient" | "solid" })
                                  }
                                  className={`px-2.5 py-0.5 text-[10px] font-medium rounded-xs transition-all cursor-pointer ${
                                    (textStyle.colorType || "gradient") === mode.id
                                      ? "bg-background text-foreground shadow-xs font-semibold"
                                      : "text-muted-foreground hover:text-foreground"
                                  }`}
                                >
                                  {mode.label}
                                </button>
                              ))}
                            </div>
                          </div>

                          {(textStyle.colorType || "gradient") === "gradient" ? (
                            <div className="space-y-5">
                              {/* 3 Color Pickers: From - Via - To */}
                              <div className="grid grid-cols-3 gap-1.25 ">
                                {/* From Color */}
                                <div className="flex items-center gap-1.5 min-w-0">
                                  <div className="relative size-7 rounded-md overflow-hidden border border-neutral-300 dark:border-neutral-700 shrink-0 hover:scale-105 transition-transform shadow-xs">
                                    <div
                                      className="absolute inset-0"
                                      style={{ backgroundColor: textStyle.color || "#ffffff" }}
                                    />
                                    <input
                                      type="color"
                                      value={textStyle.color || "#ffffff"}
                                      onChange={(e) =>
                                        updateSelected({ color: e.target.value })
                                      }
                                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full p-0 border-0"
                                      title="From Color"
                                    />
                                  </div>
                                  <div className="flex flex-col min-w-0">
                                    <span className="text-[9px] text-muted-foreground uppercase font-medium leading-tight">From</span>
                                    <span className="text-[10px] font-semibold uppercase truncate leading-tight">
                                      {textStyle.color || "#ffffff"}
                                    </span>
                                  </div>
                                </div>

                                {/* Via Color */}
                                <div className="flex items-center gap-1.5 min-w-0">
                                  <div className="relative size-7 rounded-md overflow-hidden border border-neutral-300 dark:border-neutral-700 shrink-0 hover:scale-105 transition-transform shadow-xs">
                                    <div
                                      className="absolute inset-0"
                                      style={{ backgroundColor: textStyle.colorVia || "#cbd5e1" }}
                                    />
                                    <input
                                      type="color"
                                      value={textStyle.colorVia || "#cbd5e1"}
                                      onChange={(e) =>
                                        updateSelected({ colorVia: e.target.value })
                                      }
                                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full p-0 border-0"
                                      title="Via Color"
                                    />
                                  </div>
                                  <div className="flex flex-col min-w-0">
                                    <span className="text-[9px] text-muted-foreground uppercase font-medium leading-tight">Via</span>
                                    <span className="text-[10px] font-semibold uppercase truncate leading-tight">
                                      {textStyle.colorVia || "#cbd5e1"}
                                    </span>
                                  </div>
                                </div>

                                {/* To Color */}
                                <div className="flex items-center gap-1.5 min-w-0">
                                  <div className="relative size-7 rounded-md overflow-hidden border border-neutral-300 dark:border-neutral-700 shrink-0 hover:scale-105 transition-transform shadow-xs">
                                    <div
                                      className="absolute inset-0"
                                      style={{ backgroundColor: textStyle.colorEnd || "#64748b" }}
                                    />
                                    <input
                                      type="color"
                                      value={textStyle.colorEnd || "#64748b"}
                                      onChange={(e) =>
                                        updateSelected({ colorEnd: e.target.value })
                                      }
                                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full p-0 border-0"
                                      title="To Color"
                                    />
                                  </div>
                                  <div className="flex flex-col min-w-0">
                                    <span className="text-[9px] text-muted-foreground uppercase font-medium leading-tight">To</span>
                                    <span className="text-[10px] font-semibold uppercase truncate leading-tight">
                                      {textStyle.colorEnd || "#64748b"}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* Row: Direction & Presets Dropdowns */}
                              <div className="grid grid-cols-2 gap-2 font-manrope font-semibold">
                                {/* Direction Dropdown */}
                                <div className="space-y-1.5 min-w-0">
                                  <Label className="text-xs font-medium text-muted-foreground truncate block">
                                    Direction
                                  </Label>
                                  <Select
                                    value={textStyle.colorDirection || "to bottom"}
                                    onValueChange={(val) =>
                                      updateSelected({ colorDirection: val })
                                    }
                                  >
                                    <SelectTrigger className="h-8 w-full text-xs">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="text-xs max-h-56">
                                      {GRADIENT_DIRECTIONS.map((dir) => (
                                        <SelectItem
                                          key={dir.id}
                                          value={dir.css}
                                          className="text-xs py-1.5 cursor-pointer"
                                        >
                                          <span className="font-mono mr-1.5">{dir.arrow}</span>
                                          <span>{dir.name}</span>
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>

                                {/* Presets Dropdown */}
                                <div className="space-y-1.5 min-w-0">
                                  <Label className="text-xs font-medium text-muted-foreground truncate block">
                                    Preset
                                  </Label>
                                  <Select
                                    value={
                                      TEXT_GRADIENT_PRESETS.find(
                                        (p) =>
                                          p.from.toLowerCase() === textStyle.color?.toLowerCase() &&
                                          p.via.toLowerCase() === textStyle.colorVia?.toLowerCase() &&
                                          p.to.toLowerCase() === textStyle.colorEnd?.toLowerCase()
                                      )?.name || "custom"
                                    }
                                    onValueChange={(presetName) => {
                                      const preset = TEXT_GRADIENT_PRESETS.find(
                                        (p) => p.name === presetName
                                      );
                                      if (preset) {
                                        updateSelected({
                                          color: preset.from,
                                          colorVia: preset.via,
                                          colorEnd: preset.to,
                                          colorType: "gradient",
                                        });
                                      }
                                    }}
                                  >
                                    <SelectTrigger className="h-8 w-full text-xs">
                                      <SelectValue placeholder="Preset" />
                                    </SelectTrigger>
                                    <SelectContent className="text-xs max-h-56">
                                      <SelectItem
                                        value="custom"
                                        className="text-xs py-1.5 cursor-pointer"
                                        disabled
                                      >
                                        Custom
                                      </SelectItem>
                                      {TEXT_GRADIENT_PRESETS.map((preset) => (
                                        <SelectItem
                                          key={preset.name}
                                          value={preset.name}
                                          className="text-xs py-1.5 cursor-pointer"
                                        >
                                          <div className="flex items-center gap-2">
                                            <div
                                              className="size-3 rounded-xs shrink-0 border border-neutral-300 dark:border-neutral-700 shadow-2xs"
                                              style={{
                                                background: `linear-gradient(to right, ${preset.from}, ${preset.via}, ${preset.to})`,
                                              }}
                                            />
                                            <span>{preset.name}</span>
                                          </div>
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                            </div>
                          ) : (
                            /* Solid Mode */
                            <div className="flex items-center gap-1.5 min-w-0">
                              <div className="relative size-7 rounded-md overflow-hidden border border-neutral-300 dark:border-neutral-700 shrink-0 hover:scale-105 transition-transform shadow-xs">
                                <div
                                  className="absolute inset-0"
                                  style={{ backgroundColor: textStyle.color || "#ffffff" }}
                                />
                                <input
                                  type="color"
                                  value={textStyle.color || "#ffffff"}
                                  onChange={(e) =>
                                    updateSelected({ color: e.target.value })
                                  }
                                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full p-0 border-0"
                                  title="Solid Text Color"
                                />
                              </div>
                              <div className="flex flex-col min-w-0">
                                <span className="text-[9px] text-muted-foreground uppercase font-medium leading-tight">Solid Color</span>
                                <span className="text-[10px] font-semibold uppercase truncate leading-tight">
                                  {textStyle.color || "#ffffff"}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-5">
                        <Label className="text-sm font-semibold uppercase tracking-wider">
                          Orientation
                        </Label>
                        <div className="space-y-3 font-manrope font-semibold">
                          <div className="grid grid-cols-3 gap-3 items-center justify-center">
                            <Label className="text-xs text-muted-foreground flex justify-center">
                              X-Axis: {textStyle.rotateX}°
                            </Label>
                            <Label className="text-xs text-muted-foreground flex justify-center">
                              Y-Axis: {textStyle.rotateY}°
                            </Label>
                            <Label className="text-xs text-muted-foreground flex justify-center">
                              Z-Axis: {textStyle.rotate}°
                            </Label>
                          </div>
                          <div className="grid grid-cols-3 gap-4">
                            <Slider
                              value={[textStyle.rotateX]}
                              onValueChange={([val]) =>
                                updateSelected({ rotateX: val })
                              }
                              min={-180}
                              max={180}
                              step={1}
                              className="py-1"
                            />
                            <Slider
                              value={[textStyle.rotateY]}
                              onValueChange={([val]) =>
                                updateSelected({ rotateY: val })
                              }
                              min={-180}
                              max={180}
                              step={1}
                              className="py-1"
                            />
                            <Slider
                              value={[textStyle.rotate]}
                              onValueChange={([val]) =>
                                updateSelected({ rotate: val })
                              }
                              min={-180}
                              max={180}
                              step={1}
                              className="py-1"
                            />
                          </div>

                          {/* 3D Preset for Text */}
                          <div className="space-y-1.5 min-w-0 pt-1">
                            <Label className="text-xs font-medium text-muted-foreground">
                              3D Preset
                            </Label>
                            <Select
                              value={
                                TRANSFORM_3D_PRESETS.find(
                                  (p) =>
                                    p.id !== "custom" &&
                                    p.rotateX === textStyle.rotateX &&
                                    p.rotateY === textStyle.rotateY &&
                                    p.rotate === textStyle.rotate
                                )?.id || "custom"
                              }
                              onValueChange={(presetId) => {
                                const preset = TRANSFORM_3D_PRESETS.find(
                                  (p) => p.id === presetId
                                );
                                if (preset && preset.id !== "custom") {
                                  updateSelected({
                                    rotateX: preset.rotateX,
                                    rotateY: preset.rotateY,
                                    rotate: preset.rotate,
                                  });
                                }
                              }}
                            >
                              <SelectTrigger className="h-8 w-full text-xs">
                                <SelectValue placeholder="Custom" />
                              </SelectTrigger>
                              <SelectContent className="text-xs max-h-56">
                                <SelectItem
                                  value="custom"
                                  className="text-xs py-1.5 cursor-pointer text-muted-foreground"
                                  disabled
                                >
                                  Custom
                                </SelectItem>
                                {TRANSFORM_3D_PRESETS.map((preset) => (
                                  <SelectItem
                                    key={preset.id}
                                    value={preset.id}
                                    className="text-xs py-1.5 cursor-pointer"
                                  >
                                    {preset.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-5">
                        <div className="flex items-center justify-between">
                          <Label className="text-sm font-semibold uppercase tracking-wider">
                            Text Background
                          </Label>
                          <Switch
                            checked={textStyle.showBackground}
                            onCheckedChange={(val) =>
                              updateSelected({ showBackground: val })
                            }
                          />
                        </div>

                        {textStyle.showBackground && (
                          <div className="space-y-5 font-manrope animate-in fade-in slide-in-from-top-2 duration-200">
                            {/* Background Style Mode Tabs */}
                            <div className="flex items-center justify-between">
                              <Label className="text-xs text-muted-foreground">
                                Background Gradient
                              </Label>
                              <div className="flex items-center bg-muted/60 p-0.5 rounded-md border border-neutral-300 dark:border-neutral-700">
                                {[
                                  { id: "gradient", label: "Gradient" },
                                  { id: "solid", label: "Solid" },
                                ].map((mode) => (
                                  <button
                                    key={mode.id}
                                    type="button"
                                    onClick={() =>
                                      updateSelected({ backgroundType: mode.id as "gradient" | "solid" })
                                    }
                                    className={`px-2.5 py-0.5 text-[10px] font-medium rounded-xs transition-all cursor-pointer ${
                                      (textStyle.backgroundType || "gradient") === mode.id
                                        ? "bg-background text-foreground shadow-xs font-semibold"
                                        : "text-muted-foreground hover:text-foreground"
                                    }`}
                                  >
                                    {mode.label}
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* Background Colors */}
                            {(textStyle.backgroundType || "gradient") === "gradient" ? (
                              <div className="space-y-3">
                                {/* 3 Color Pickers: From - Via - To */}
                                <div className="grid grid-cols-3 gap-1.25 ">
                                  {/* From Color */}
                                  <div className="flex items-center gap-1.5 min-w-0">
                                    <div className="relative size-7 rounded-md overflow-hidden border border-neutral-300 dark:border-neutral-700 shrink-0 hover:scale-105 transition-transform shadow-xs">
                                      <div
                                        className="absolute inset-0"
                                        style={{
                                          backgroundColor: textStyle.backgroundColor || "#18181b",
                                        }}
                                      />
                                      <input
                                        type="color"
                                        value={textStyle.backgroundColor || "#18181b"}
                                        onChange={(e) =>
                                          updateSelected({
                                            backgroundColor: e.target.value,
                                          })
                                        }
                                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full p-0 border-0"
                                        title="From Background Color"
                                      />
                                    </div>
                                    <div className="flex flex-col min-w-0">
                                      <span className="text-[9px] text-muted-foreground uppercase font-medium leading-tight">From</span>
                                      <span className="text-[10px] font-semibold uppercase truncate leading-tight">
                                        {textStyle.backgroundColor || "#18181b"}
                                      </span>
                                    </div>
                                  </div>

                                  {/* Via Color */}
                                  <div className="flex items-center gap-1.5 min-w-0">
                                    <div className="relative size-7 rounded-md overflow-hidden border border-neutral-300 dark:border-neutral-700 shrink-0 hover:scale-105 transition-transform shadow-xs">
                                      <div
                                        className="absolute inset-0"
                                        style={{
                                          backgroundColor: textStyle.backgroundColorVia || "#111113",
                                        }}
                                      />
                                      <input
                                        type="color"
                                        value={textStyle.backgroundColorVia || "#111113"}
                                        onChange={(e) =>
                                          updateSelected({
                                            backgroundColorVia: e.target.value,
                                          })
                                        }
                                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full p-0 border-0"
                                        title="Via Background Color"
                                      />
                                    </div>
                                    <div className="flex flex-col min-w-0">
                                      <span className="text-[9px] text-muted-foreground uppercase font-medium leading-tight">Via</span>
                                      <span className="text-[10px] font-semibold uppercase truncate leading-tight">
                                        {textStyle.backgroundColorVia || "#111113"}
                                      </span>
                                    </div>
                                  </div>

                                  {/* To Color */}
                                  <div className="flex items-center gap-1.5 min-w-0">
                                    <div className="relative size-7 rounded-md overflow-hidden border border-neutral-300 dark:border-neutral-700 shrink-0 hover:scale-105 transition-transform shadow-xs">
                                      <div
                                        className="absolute inset-0"
                                        style={{
                                          backgroundColor: textStyle.backgroundColorEnd || "#09090b",
                                        }}
                                      />
                                      <input
                                        type="color"
                                        value={textStyle.backgroundColorEnd || "#09090b"}
                                        onChange={(e) =>
                                          updateSelected({
                                            backgroundColorEnd: e.target.value,
                                          })
                                        }
                                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full p-0 border-0"
                                        title="To Background Color"
                                      />
                                    </div>
                                    <div className="flex flex-col min-w-0">
                                      <span className="text-[9px] text-muted-foreground uppercase font-medium leading-tight">To</span>
                                      <span className="text-[10px] font-semibold uppercase truncate leading-tight">
                                        {textStyle.backgroundColorEnd || "#09090b"}
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                {/* Row: Direction & Presets Dropdowns */}
                                <div className="grid grid-cols-2 gap-2 font-manrope font-semibold">
                                  {/* 1. Direction Dropdown */}
                                  <div className="space-y-1.5 min-w-0">
                                    <Label className="text-xs font-medium text-muted-foreground truncate block">
                                      Direction
                                    </Label>
                                    <Select
                                      value={textStyle.backgroundDirection || "to bottom"}
                                      onValueChange={(val) =>
                                        updateSelected({ backgroundDirection: val })
                                      }
                                    >
                                      <SelectTrigger className="h-8 w-full text-xs">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent className="text-xs max-h-56">
                                        {GRADIENT_DIRECTIONS.map((dir) => (
                                          <SelectItem
                                            key={dir.id}
                                            value={dir.css}
                                            className="text-xs py-1.5 cursor-pointer"
                                          >
                                            <span className="font-mono mr-1.5">{dir.arrow}</span>
                                            <span>{dir.name}</span>
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>

                                  {/* 2. Presets Dropdown */}
                                  <div className="space-y-1.5 min-w-0">
                                    <Label className="text-xs font-medium text-muted-foreground truncate block">
                                      Preset
                                    </Label>
                                    <Select
                                      value={
                                        BACKGROUND_GRADIENT_PRESETS.find(
                                          (p) =>
                                            p.from.toLowerCase() === textStyle.backgroundColor?.toLowerCase() &&
                                            p.via.toLowerCase() === textStyle.backgroundColorVia?.toLowerCase() &&
                                            p.to.toLowerCase() === textStyle.backgroundColorEnd?.toLowerCase()
                                        )?.name || "custom"
                                      }
                                      onValueChange={(presetName) => {
                                        const preset = BACKGROUND_GRADIENT_PRESETS.find(
                                          (p) => p.name === presetName
                                        );
                                        if (preset) {
                                          updateSelected({
                                            backgroundColor: preset.from,
                                            backgroundColorVia: preset.via,
                                            backgroundColorEnd: preset.to,
                                            backgroundType: "gradient",
                                          });
                                        }
                                      }}
                                    >
                                      <SelectTrigger className="h-8 w-full text-xs">
                                        <SelectValue placeholder="Preset" />
                                      </SelectTrigger>
                                      <SelectContent className="text-xs max-h-56">
                                        <SelectItem
                                          value="custom"
                                          className="text-xs py-1.5 cursor-pointer"
                                          disabled
                                        >
                                          Custom
                                        </SelectItem>
                                        {BACKGROUND_GRADIENT_PRESETS.map((preset) => (
                                          <SelectItem
                                            key={preset.name}
                                            value={preset.name}
                                            className="text-xs py-1.5 cursor-pointer"
                                          >
                                            <div className="flex items-center gap-2">
                                              <div
                                                className="size-3 rounded-xs shrink-0 border border-neutral-300 dark:border-neutral-700 shadow-2xs"
                                                style={{
                                                  background: `linear-gradient(to right, ${preset.from}, ${preset.via}, ${preset.to})`,
                                                }}
                                              />
                                              <span className="truncate">{preset.name}</span>
                                            </div>
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              /* Solid Mode */
                              <div className="flex items-center gap-1.5 min-w-0">
                                <div className="relative size-7 rounded-md overflow-hidden border border-neutral-300 dark:border-neutral-700 shrink-0 hover:scale-105 transition-transform shadow-xs">
                                  <div
                                    className="absolute inset-0"
                                    style={{
                                      backgroundColor: textStyle.backgroundColor || "#18181b",
                                    }}
                                  />
                                  <input
                                    type="color"
                                    value={textStyle.backgroundColor || "#18181b"}
                                    onChange={(e) =>
                                      updateSelected({
                                        backgroundColor: e.target.value,
                                      })
                                    }
                                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full p-0 border-0"
                                    title="Solid Background Color"
                                  />
                                </div>
                                <div className="flex flex-col min-w-0">
                                  <span className="text-[9px] text-muted-foreground uppercase font-medium leading-tight">Solid Color</span>
                                  <span className="text-[10px] font-semibold uppercase truncate leading-tight">
                                    {textStyle.backgroundColor || "#18181b"}
                                  </span>
                                </div>
                              </div>
                            )}

                            {/* 2x2 Grid of Sliders: Shadow, Border, Padding, Roundness */}
                            <div className="grid grid-cols-2 gap-3 font-semibold *:pr-1">
                              {/* 1. Shadow Preset Slider */}
                              <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                  <Label className="text-xs font-medium text-muted-foreground">
                                    Shadow
                                  </Label>
                                  <span className="text-xs text-muted-foreground">
                                    {SHADOW_PRESETS.find(
                                      (s) =>
                                        s.value === textStyle.backgroundShadow,
                                    )?.name || "None"}
                                  </span>
                                </div>
                                <Slider
                                  defaultValue={[0]}
                                  value={[
                                    SHADOW_PRESETS.findIndex(
                                      (s) =>
                                        s.value === textStyle.backgroundShadow,
                                    ) !== -1
                                      ? SHADOW_PRESETS.findIndex(
                                        (s) =>
                                          s.value ===
                                          textStyle.backgroundShadow,
                                      )
                                      : 0,
                                  ]}
                                  onValueChange={([val]) => {
                                    const preset = SHADOW_PRESETS[val];
                                    if (preset)
                                      updateSelected({
                                        backgroundShadow: preset.value,
                                      });
                                  }}
                                  min={0}
                                  max={SHADOW_PRESETS.length - 1}
                                  step={1}
                                />
                              </div>

                              {/* 2. Border Width Slider */}
                              <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                  <Label className="text-xs font-medium text-muted-foreground">
                                    Border
                                  </Label>
                                  <span className="text-xs text-muted-foreground">
                                    {textStyle.borderWidth ?? 0}px
                                  </span>
                                </div>
                                <Slider
                                  value={[textStyle.borderWidth ?? 0]}
                                  onValueChange={([v]) =>
                                    updateSelected({ borderWidth: v })
                                  }
                                  min={0}
                                  max={20}
                                  step={1}
                                />
                              </div>

                              {/* 3. Padding Slider */}
                              <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                  <Label className="text-xs font-medium text-muted-foreground">
                                    Padding
                                  </Label>
                                  <span className="text-xs text-muted-foreground">
                                    {textStyle.padding}px
                                  </span>
                                </div>
                                <Slider
                                  value={[textStyle.padding]}
                                  onValueChange={([v]) =>
                                    updateSelected({ padding: v })
                                  }
                                  min={0}
                                  max={40}
                                  step={1}
                                />
                              </div>

                              {/* 4. Roundness Slider */}
                              <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                  <Label className="text-xs font-medium text-muted-foreground">
                                    Roundness
                                  </Label>
                                  <span className="text-xs text-muted-foreground">
                                    {textStyle.borderRadius}px
                                  </span>
                                </div>
                                <Slider
                                  value={[textStyle.borderRadius]}
                                  onValueChange={([v]) =>
                                    updateSelected({ borderRadius: v })
                                  }
                                  min={0}
                                  max={50}
                                  step={1}
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="text-center p-8 text-muted-foreground font-inter text-xs border-2 border-dashed rounded-lg">
                      {activeTab === "text" &&
                        selectedElement?.type !== "text" &&
                        elements.some((e) => e.type === "text")
                        ? "A text layer was previously selected. Select it again from Layers to edit."
                        : "Select a text layer to edit properties."}
                    </div>
                  )}
                </div>
              </div>
            </ScrollArea>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
