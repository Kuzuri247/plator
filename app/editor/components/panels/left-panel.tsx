"use client";

import {
  Type,
  Image as ImageIcon,
  Plus,
  BoxSelect,
  Rotate3d,
  FlipHorizontal,
  FlipVertical,
  Scissors,
  RotateCcw,
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
  FONT_FAMILIES,
  FONT_WEIGHTS,
  SHADOW_PRESETS,
  LeftPanelProps,
  CLIP_PATHS,
  TEXT_EFFECTS,
} from "../../types";

export function LeftPanel({
  selectedTextElement,
  selectedImageElement,
  currentText,
  fontSize,
  fontFamily,
  fontWeight,
  color,
  textShadow,
  textBorderRadius,
  textBackgroundColor,
  textPadding,
  showTextBackground,
  textEffect,
  onTextEffectChange,
  onTextChange,
  onFontFamilyChange,
  onFontSizeChange,
  onFontWeightChange,
  onColorChange,
  onTextShadowChange,
  onTextBorderRadiusChange,
  onTextBackgroundColorChange,
  onTextPaddingChange,
  onShowTextBackgroundChange,
  onAddText,
  onImageStyleChange,
  onImageUpload,
}: LeftPanelProps) {
  const imgStyle = selectedImageElement?.style || {
    scale: 100,
    opacity: 100,
    blur: 0,
    noise: 0,
    borderRadius: 0,
    shadow: "none",
    rotate: 0,
    rotateX: 0,
    rotateY: 0,
    clipPath: "none",
    flipX: false,
    flipY: false,
    crop: { top: 0, right: 0, bottom: 0, left: 0 },
  };

  const resetCrop = () =>
    onImageStyleChange({ crop: { top: 0, right: 0, bottom: 0, left: 0 } });

  const activeText = selectedTextElement?.content ?? currentText;
  const activeFontSize = selectedTextElement?.style.fontSize ?? fontSize;
  const activeFontFamily = selectedTextElement?.style.fontFamily ?? fontFamily;
  const activeFontWeight = selectedTextElement?.style.fontWeight ?? fontWeight;
  const activeColor = selectedTextElement?.style.color ?? color;
  const activeTextShadow = selectedTextElement?.style.textShadow ?? textShadow;
  const activeTextEffect = selectedTextElement?.style.textEffect ?? textEffect;
  const activeTextBorderRadius =
    selectedTextElement?.style.borderRadius ?? textBorderRadius;
  const activeTextBgColor =
    selectedTextElement?.style.backgroundColor ?? textBackgroundColor;
  const activeTextPadding = selectedTextElement?.style.padding ?? textPadding;
  const activeShowTextBg =
    selectedTextElement?.style.showBackground ?? showTextBackground;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onImageUpload(file);
  };

  return (
    <div className="flex flex-col h-full w-full">
      <Tabs defaultValue="image" className="w-full flex-1 flex flex-col h-full">
        {/* Fixed Tabs Header */}
        <div className="px-4 pt-4 shrink-0">
          <TabsList className="w-full grid grid-cols-2 dark:bg-neutral-800">
            <TabsTrigger value="image">
              <ImageIcon className="size-4 mr-2 " />
              Images
            </TabsTrigger>
            <TabsTrigger value="text">
              <Type className="size-4 mr-2 " />
              Text
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Scrollable Content Container */}
        <div className="flex-1 min-h-0 relative">
          <TabsContent
            value="image"
            className="absolute inset-0 data-[state=inactive]:hidden focus-visible:outline-none mt-0"
          >
            <ScrollArea className="h-full w-full">
              <div className="p-4 flex flex-col gap-6 pb-20">
                <div className="space-y-5">
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold uppercase tracking-wider">
                      Layers
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
                        className="w-full border-dashed  bg-transparent border-neutral-400 dark:border-neutral-600 hover:bg-muted/50"
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

                  {selectedImageElement ? (
                    <>
                      <Separator />

                      <Label className="text-sm font-semibold uppercase tracking-wider">
                        Properties
                      </Label>
                      <div className="space-y-4 grid grid-cols-2 gap-2 font-manrope font-semibold">
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
                              onImageStyleChange({ scale: val })
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
                              onImageStyleChange({ opacity: val })
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
                              onImageStyleChange({ blur: val })
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
                              onImageStyleChange({ noise: val })
                            }
                            min={0}
                            max={50}
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
                              onImageStyleChange({ borderRadius: val })
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
                                (s) => s.value === imgStyle.shadow
                              )?.name || "None"}
                            </span>
                          </div>
                          <Slider
                            defaultValue={[0]}
                            value={[
                              SHADOW_PRESETS.findIndex(
                                (s) => s.value === imgStyle.shadow
                              ) !== -1
                                ? SHADOW_PRESETS.findIndex(
                                    (s) => s.value === imgStyle.shadow
                                  )
                                : 0,
                            ]}
                            onValueChange={([val]) => {
                              const preset = SHADOW_PRESETS[val];
                              if (preset)
                                onImageStyleChange({ shadow: preset.value });
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
                              <Rotate3d className="w-3 h-3" /> 3D Rotation
                            </Label>
                          </div>

                          <div className="space-y-2 pt-2">
                            <div className="grid grid-cols-3 items-center gap-2">
                              <Label className="text-[10px] text-muted-foreground">
                                X: {imgStyle.rotateX}°
                              </Label>
                              <Label className="text-[10px] text-muted-foreground">
                                Y: {imgStyle.rotateY}°
                              </Label>
                              <Label className="text-[10px] text-muted-foreground">
                                Z: {imgStyle.rotate}°
                              </Label>
                            </div>

                            <div className="flex gap-2">
                              <Slider
                                value={[imgStyle.rotateX]}
                                onValueChange={([val]) =>
                                  onImageStyleChange({ rotateX: val })
                                }
                                min={-180}
                                max={180}
                                step={1}
                                className="py-1"
                              />
                              <Slider
                                value={[imgStyle.rotateY]}
                                onValueChange={([val]) =>
                                  onImageStyleChange({ rotateY: val })
                                }
                                min={-180}
                                max={180}
                                step={1}
                                className="py-1"
                              />
                              <Slider
                                value={[imgStyle.rotate]}
                                onValueChange={([val]) =>
                                  onImageStyleChange({ rotate: val })
                                }
                                min={-180}
                                max={180}
                                step={1}
                                className="py-1"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Flip & Crop */}
                        <div className="space-y-4">
                          <div className="space-y-3 pt-2 font-manrope">
                            <div className="flex items-center justify-between">
                              <Label className="text-xs font-medium flex items-center gap-2">
                                <Scissors className="size-3" /> Manual Crop (%)
                              </Label>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-5 w-5"
                                onClick={resetCrop}
                                title="Reset Crop"
                              >
                                <RotateCcw className="size-3" />
                              </Button>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-1.5">
                                <Label className="text-[10px] text-muted-foreground">
                                  Top
                                </Label>
                                <Slider
                                  value={[imgStyle.crop.top]}
                                  onValueChange={([v]) =>
                                    onImageStyleChange({
                                      crop: { ...imgStyle.crop, top: v },
                                    })
                                  }
                                  max={100}
                                />
                              </div>
                              <div className="space-y-1.5">
                                <Label className="text-[10px] text-muted-foreground">
                                  Right
                                </Label>
                                <Slider
                                  value={[imgStyle.crop.right]}
                                  onValueChange={([v]) =>
                                    onImageStyleChange({
                                      crop: { ...imgStyle.crop, right: v },
                                    })
                                  }
                                  max={100}
                                />
                              </div>
                              <div className="space-y-1.5">
                                <Label className="text-[10px] text-muted-foreground">
                                  Bottom
                                </Label>
                                <Slider
                                  value={[imgStyle.crop.bottom]}
                                  onValueChange={([v]) =>
                                    onImageStyleChange({
                                      crop: { ...imgStyle.crop, bottom: v },
                                    })
                                  }
                                  max={100}
                                />
                              </div>
                              <div className="space-y-1.5">
                                <Label className="text-[10px] text-muted-foreground">
                                  Left
                                </Label>
                                <Slider
                                  value={[imgStyle.crop.left]}
                                  onValueChange={([v]) =>
                                    onImageStyleChange({
                                      crop: { ...imgStyle.crop, left: v },
                                    })
                                  }
                                  max={100}
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Clipping Controls */}
                        <div className="space-y-2 font-manrope pt-2">
                          <Label className="text-xs font-medium flex items-center gap-2 font-manrope">
                            <BoxSelect className="size-3" /> Shape Clip
                          </Label>
                          <Select
                            value={imgStyle.clipPath}
                            onValueChange={(val) =>
                              onImageStyleChange({ clipPath: val })
                            }
                          >
                            <SelectTrigger className="h-8 bg-transparent border-border/50 ">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="">
                              {CLIP_PATHS.map((clip) => (
                                <SelectItem key={clip.name} value={clip.value}>
                                  {clip.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center p-8 text-muted-foreground text-xs border-2 border-dashed rounded-lg">
                      Select an image on the canvas to edit its properties.
                    </div>
                  )}
                </div>
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent
            value="text"
            className="absolute inset-0 data-[state=inactive]:hidden focus-visible:outline-none mt-0"
          >
            <ScrollArea className="h-full w-full">
              <div className="p-4 flex flex-col gap-4 pb-20">
                <div className="space-y-3">
                  <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Content
                  </Label>
                  <Textarea
                    value={activeText}
                    onChange={(e) => onTextChange(e.target.value)}
                    className="min-h-8 resize-none bg-transparent placeholder:font-inter"
                    placeholder="Type text here..."
                  />
                  <Button
                    onClick={onAddText}
                    variant="outline"
                    size="sm"
                    className="w-full bg-transparent border-dashed border-neutral-400 dark:border-neutral-600 hover:bg-muted/50"
                  >
                    <Plus className="w-3.5 h-3.5 mr-2" /> Add Text Layer
                  </Button>
                </div>

                <Separator />

                <div className="space-y-4">
                  <Label className="text-xs font-semibold uppercase tracking-wider">
                    Typography
                  </Label>

                  <div className="grid grid-cols-2 gap-2">
                    <Select
                      value={activeFontFamily}
                      onValueChange={onFontFamilyChange}
                    >
                      <SelectTrigger className="h-8 bg-transparent border-border/50 font-manrope">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="font-manrope">
                        {FONT_FAMILIES.map((f) => (
                          <SelectItem key={f} value={f}>
                            {f}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select
                      value={activeFontWeight}
                      onValueChange={onFontWeightChange}
                    >
                      <SelectTrigger className="h-8 bg-transparent border-border/50 font-manrope">
                        <SelectValue />
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

               
                <Select
                  value={activeTextEffect}
                  onValueChange={onTextEffectChange}
                >
                  <SelectTrigger className="h-8 bg-transparent border-border/50 font-manrope">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="font-manrope">
                    {TEXT_EFFECTS.map((e) => (
                      <SelectItem key={e.value} value={e.value}>
                        {e.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs font-medium text-muted-foreground">
                        Color & Size
                      </Label>
                      <span className="text-xs text-muted-foreground font-manrope">
                        {activeFontSize}px
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="relative group cursor-pointer">
                        <div
                          className="size-6 rounded-full border-neutral-300 dark:border-neutral-500 border-2 shadow-sm flex items-center justify-center transition-transform hover:scale-105"
                          style={{ backgroundColor: activeColor }}
                        />
                        <Input
                          type="color"
                          value={activeColor}
                          onChange={(e) => onColorChange(e.target.value)}
                          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full p-0 border-0"
                        />
                      </div>
                      <Slider
                        value={[activeFontSize]}
                        onValueChange={([v]) => onFontSizeChange(v)}
                        min={12}
                        max={80}
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-semibold uppercase tracking-wider">
                      Background Box
                    </Label>
                    <Switch
                      checked={activeShowTextBg}
                      onCheckedChange={onShowTextBackgroundChange}
                    />
                  </div>

                  {activeShowTextBg && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-200 pl-1 font-manrope">
                      <div className="flex items-center justify-between">
                        <Label className="text-xs font-medium text-muted-foreground">
                          Box Color
                        </Label>
                        <div className="relative size-6 rounded-md overflow-hidden border-2 border-neutral-300 dark:border-neutral-500">
                          <div
                            className="absolute inset-0"
                            style={{ backgroundColor: activeTextBgColor }}
                          />
                          <Input
                            type="color"
                            value={activeTextBgColor}
                            onChange={(e) =>
                              onTextBackgroundColorChange(e.target.value)
                            }
                            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full p-0 border-0"
                          />
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <Label className="text-xs font-medium text-muted-foreground">
                            Rounded
                          </Label>
                          <span className="text-xs text-muted-foreground font-manrope">
                            {activeTextBorderRadius}px
                          </span>
                        </div>
                        <Slider
                          value={[activeTextBorderRadius]}
                          onValueChange={([v]) => onTextBorderRadiusChange(v)}
                          min={0}
                          max={50}
                        />
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <Label className="text-xs font-medium text-muted-foreground">
                            Padding
                          </Label>
                          <span className="text-xs text-muted-foreground font-manrope">
                            {activeTextPadding}px
                          </span>
                        </div>
                        <Slider
                          value={[activeTextPadding]}
                          onValueChange={([v]) => onTextPaddingChange(v)}
                          min={0}
                          max={30}
                        />
                      </div>
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