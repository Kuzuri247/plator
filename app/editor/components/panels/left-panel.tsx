"use client";

import {
  Type,
  Image as ImageIcon,
  Plus,
  Rotate3d,
  Scissors,
  Highlighter,
  Underline,
  Strikethrough,
  Italic,
  CaseUpper,
  ALargeSmall,
  Ghost,
  Crop,
  Layers,
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
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Separator } from "@/components/ui/separator";
import { LeftPanelProps, ImageElement, TextElement } from "../../types";
import {
  FONT_FAMILIES,
  FONT_WEIGHTS,
  SHADOW_PRESETS,
  CLIP_PATHS,
} from "../../values";
import { cn } from "@/lib/utils";
import { useStore } from "../../store/use-store";
import { LayerPanel } from "./layer-panel";

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
  } = useStore();

  const selectedElement = elements.find((el) => el.id === selectedElementId);

  // const getStyle = (key: string, defaultVal: any) => {
  //   if (selectedElement && "style" in selectedElement) {
  //     return (selectedElement.style as any)[key] ?? defaultVal;
  //   }
  //   return defaultVal;
  // };

  const handleAddText = () => {
    addElement({
      id: `text_${Date.now()}`,
      type: "text",
      name: "New Text",
      content: "Sample Text",
      position: { x: 100, y: 100 },
      style: {
        fontSize: 48,
        fontFamily: "Inter",
        fontWeight: "400",
        color: "#ffffff",
        textShadow: "none",
        borderRadius: 0,
        backgroundColor: "#000000",
        padding: 4,
        showBackground: false,
        backgroundShadow: "none",
        textEffect: [],
        rotate: 0,
        rotateX: 0,
        rotateY: 0,
      },
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
        <div className="px-3 pt-4 shrink-0">
          <TabsList className="w-full grid grid-cols-3 dark:bg-neutral-800">
            <TabsTrigger value="image">
              <ImageIcon className="size-4" />
              Image
            </TabsTrigger>
            <TabsTrigger value="text">
              <Type className="size-4" />
              Text
            </TabsTrigger>
            <TabsTrigger value="layers">
              <Layers className="size-4" />
              Layers
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="flex-1 min-h-0 relative">
          <TabsContent
            value="layers"
            className="absolute inset-0 data-[state=inactive]:hidden mt-0"
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
                  <div className="space-y-2">
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
                        className="w-full border-dashed bg-transparent border-neutral-400 dark:border-neutral-600 hover:bg-muted/50"
                      >
                        <label
                          htmlFor="image-upload"
                          className="cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5 mr-2" /> Add Image
                        </label>
                      </Button>
                    </div>
                  </div>

                  {selectedElement?.type === "image" && imgStyle ? (
                    <>
                      <Separator />

                      <Label className="text-sm font-semibold uppercase tracking-wider">
                        Properties
                      </Label>
                      <div className="space-y-4 grid grid-cols-2 gap-2 px-2 font-manrope font-semibold *:pr-1">
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

                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Label className="text-xs font-medium text-muted-foreground">
                              Noise
                            </Label>
                            <span className="text-xs text-muted-foreground">
                              {imgStyle.noise}%
                            </span>
                          </div>
                          <Slider
                            value={[imgStyle.noise]}
                            onValueChange={([val]) =>
                              updateSelected({ noise: val })
                            }
                            min={0}
                            max={100}
                            step={1}
                          />
                        </div>

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

                      <div className="space-y-4">
                        <Label className="text-sm font-semibold uppercase tracking-wider">
                          Transforms & Clipping
                        </Label>

                        {/* 3D Rotation Controls */}
                        <div className="space-y-3 font-manrope">
                          <div className="flex items-center justify-between">
                            <Label className="text-xs font-medium flex items-center gap-2">
                              <Rotate3d className="size-3" /> 3D Rotation
                            </Label>
                          </div>

                          <div className="space-y-2 pt-2">
                            <div className="grid grid-cols-3 px-2 items-center gap-2 justify-center">
                              <Label className="text-[10px] text-muted-foreground flex justify-center">
                                X: {imgStyle.rotateX}°
                              </Label>
                              <Label className="text-[10px] text-muted-foreground flex justify-center">
                                Y: {imgStyle.rotateY}°
                              </Label>
                              <Label className="text-[10px] text-muted-foreground flex justify-center">
                                Z: {imgStyle.rotate}°
                              </Label>
                            </div>

                            <div className="flex gap-4 px-2">
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
                        </div>

                        <div className="grid grid-cols-3 relative">
                          <div className="flex col-span-2 items-center justify-normal gap-3">
                            <Select
                              value={imgStyle.clipPath}
                              onValueChange={(val) =>
                                updateSelected({ clipPath: val })
                              }
                            >
                              <span className="text-xs font-medium text-muted-foreground flex justify-center items-center">
                                <Scissors className="size-3 mr-1.5" />
                                Clip Path
                              </span>
                              <SelectTrigger className="h-8 bg-transparent ">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {CLIP_PATHS.map((clip) => (
                                  <SelectItem
                                    key={clip.name}
                                    value={clip.value}
                                  >
                                    {clip.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="relative col-span-1 text-muted-foreground">
                            <div className="flex items-center justify-end">
                              <button
                                onClick={onToggleCropping}
                                className={`h-8.5 w-22 mr-2 rounded-xs text-xs flex items-center justify-center border-2 transition-colors ${
                                  isCropping
                                    ? "bg-primary dark:bg-primary/90 text-primary-foreground border-dashed border-3 border-black"
                                    : "bg-transparent text-muted-foreground border-dashed border-neutral-300 dark:border-neutral-700"
                                }`}
                              >
                                <Crop className="size-3 mr-1.5" />
                                {isCropping ? "Done" : "Crop"}
                              </button>
                            </div>

                            {isCropping && (
                              <p className="absolute left-0 mt-1 text-[11px] text-muted-foreground font-inter">
                                Once done click the button again
                              </p>
                            )}
                          </div>
                        </div>
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
              <div className="p-4 flex flex-col gap-4 pb-20">
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
                    className="w-full bg-transparent border-dashed border-neutral-400 dark:border-neutral-600 hover:bg-muted/50"
                  >
                    <Plus className="w-3.5 h-3.5 mr-2" /> Add Text Layer
                  </Button>
                </div>

                <Separator />

                {selectedElement?.type === "text" && textStyle ? (
                  <>
                    <div className="space-y-4">
                      <Label className="text-sm font-semibold uppercase tracking-wider">
                        Typography
                      </Label>

                      <div className="grid grid-cols-6 w-fit">
                        <Select
                          value={textStyle.fontFamily}
                          onValueChange={(val) =>
                            updateSelected({ fontFamily: val })
                          }
                        >
                          <span className="text-[13px] font-medium text-muted-foreground col-start-1 flex items-center">
                            Family
                          </span>
                          <SelectTrigger className="h-8 bg-transparent border-border/50 font-manrope">
                            <div className="flex items-center gap-2">
                              <SelectValue className="" />
                            </div>
                          </SelectTrigger>
                          <SelectContent className="font-manrope text-xs max-h-50">
                            {FONT_FAMILIES.map((f) => (
                              <SelectItem key={f} value={f}>
                                {f === "Space Grotesk"
                                  ? "Space"
                                  : f === "Playfair Display"
                                    ? "Playfair"
                                    : f === "Montserrat"
                                      ? "Moserrat"
                                      : f === "Instrument Serif"
                                        ? "Ins Serif"
                                        : f}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <Select
                          value={textStyle.fontWeight}
                          onValueChange={(val) =>
                            updateSelected({ fontWeight: val })
                          }
                        >
                          <span className="text-[13px] font-medium text-muted-foreground w-fit col-start-4 flex items-center">
                            Weight
                          </span>
                          <SelectTrigger className="h-8 bg-transparent border-border/50 font-manrope">
                            <div className="flex items-center gap-2">
                              <SelectValue />
                            </div>
                          </SelectTrigger>
                          <SelectContent className="font-manrope">
                            {FONT_WEIGHTS.map((w) => (
                              <SelectItem key={w.value} value={w.value}>
                                {w.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-xs font-medium text-muted-foreground">
                          Text Effects
                        </Label>
                        <ToggleGroup
                          type="multiple"
                          value={textStyle.textEffect}
                          onValueChange={(val) =>
                            updateSelected({ textEffect: val })
                          }
                          className={cn(
                            "flex-wrap justify-start gap-2 border-2 dark:border-neutral-800 rounded-md p-1 bg-muted/20",
                            "*:rounded-md *:transition-colors *:text-muted-foreground *:hover:bg-muted",
                            " *:size-8 *:data-[state=on]:bg-primary *:data-[state=on]:text-primary-foreground",
                          )}
                        >
                          <ToggleGroupItem value="outline" aria-label="Outline">
                            <Highlighter className="size-4" />
                          </ToggleGroupItem>
                          <ToggleGroupItem
                            value="underline"
                            aria-label="Underline"
                          >
                            <Underline className="size-4" />
                          </ToggleGroupItem>
                          <ToggleGroupItem
                            value="line-through"
                            aria-label="Strikethrough"
                          >
                            <Strikethrough className="size-4" />
                          </ToggleGroupItem>
                          <ToggleGroupItem value="italic" aria-label="Italic">
                            <Italic className="size-4" />
                          </ToggleGroupItem>
                          <ToggleGroupItem
                            value="uppercase"
                            aria-label="Uppercase"
                          >
                            <CaseUpper className="size-4" />
                          </ToggleGroupItem>
                          <ToggleGroupItem
                            value="small-caps"
                            aria-label="Small Caps"
                          >
                            <ALargeSmall className="size-4" />
                          </ToggleGroupItem>
                          <ToggleGroupItem value="blur" aria-label="Blur">
                            <Ghost className="size-4" />
                          </ToggleGroupItem>
                        </ToggleGroup>
                      </div>

                      <div className="space-y-3 *:pr-4">
                        <div className="flex items-center justify-between">
                          <Label className="text-xs font-medium text-muted-foreground">
                            Color & Size
                          </Label>
                          <span className="text-xs text-muted-foreground font-manrope">
                            {textStyle.fontSize}px
                          </span>
                        </div>
                        <div className="flex items-center gap-4 px-2">
                          <div className="relative group cursor-pointer">
                            <div
                              className="size-6 rounded-full border-neutral-300 dark:border-neutral-500 border-2 shadow-sm flex items-center justify-center transition-transform hover:scale-105"
                              style={{ backgroundColor: textStyle.color }}
                            />
                            <Input
                              type="color"
                              value={textStyle.color}
                              onChange={(e) =>
                                updateSelected({ color: e.target.value })
                              }
                              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full p-0 border-0"
                            />
                          </div>
                          <Slider
                            value={[textStyle.fontSize]}
                            onValueChange={([v]) =>
                              updateSelected({ fontSize: v })
                            }
                            min={12}
                            max={80}
                            className="flex-1"
                          />
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <Label className="text-sm font-semibold uppercase tracking-wider">
                        3D Transforms
                      </Label>
                      <div className="space-y-2 font-manrope">
                        <div className="grid grid-cols-3 px-2 items-center gap-2 justify-center">
                          <Label className="text-[10px] text-muted-foreground flex justify-center">
                            X: {textStyle.rotateX}°
                          </Label>
                          <Label className="text-[10px] text-muted-foreground flex justify-center">
                            Y: {textStyle.rotateY}°
                          </Label>
                          <Label className="text-[10px] text-muted-foreground flex justify-center">
                            Z: {textStyle.rotate}°
                          </Label>
                        </div>
                        <div className="flex gap-4 px-2">
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
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
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
                        <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-200 px-2 font-manrope">
                          <div className="flex items-center justify-between">
                            <Label className="text-xs font-medium text-muted-foreground">
                              Box Color
                            </Label>
                            <div className="relative size-6 rounded-md overflow-hidden border-2 border-neutral-300 dark:border-neutral-500">
                              <div
                                className="absolute inset-0"
                                style={{
                                  backgroundColor: textStyle.backgroundColor,
                                }}
                              />
                              <Input
                                type="color"
                                value={textStyle.backgroundColor}
                                onChange={(e) =>
                                  updateSelected({
                                    backgroundColor: e.target.value,
                                  })
                                }
                                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full p-0 border-0"
                              />
                            </div>
                          </div>
                          <div className="space-y-3 grid grid-cols-2 gap-4 *:pr-2">
                            <div>
                              <div className="flex justify-between pb-3">
                                <Label className="text-xs font-medium text-muted-foreground">
                                  Rounded
                                </Label>
                                <span className="text-xs text-muted-foreground font-manrope">
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
                              />
                            </div>
                            <div>
                              <div className="flex justify-between pb-3">
                                <Label className="text-xs font-medium text-muted-foreground">
                                  Padding
                                </Label>
                                <span className="text-xs text-muted-foreground font-manrope">
                                  {textStyle.padding}px
                                </span>
                              </div>
                              <Slider
                                value={[textStyle.padding]}
                                onValueChange={([v]) =>
                                  updateSelected({ padding: v })
                                }
                                min={0}
                                max={30}
                              />
                            </div>
                            <div className="col-span-2">
                              <div className="flex justify-between">
                                <Label className="text-xs font-medium text-muted-foreground flex justify-center pb-3">
                                  Shadow
                                </Label>
                                <span className="text-xs text-muted-foreground font-manrope">
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
            </ScrollArea>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
