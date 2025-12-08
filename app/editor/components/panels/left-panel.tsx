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
import {
  FONT_FAMILIES,
  FONT_WEIGHTS,
  SHADOW_PRESETS,
  LeftPanelProps,
  CLIP_PATHS,
} from "../../types";
import { cn } from "@/lib/utils";

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
  isCropping,
  onToggleCropping,
  onTextStyleChange,
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

  const textRotate = selectedTextElement?.style.rotate || 0;
  const textRotateX = selectedTextElement?.style.rotateX || 0;
  const textRotateY = selectedTextElement?.style.rotateY || 0;

  const activeText = selectedTextElement?.content ?? currentText;
  const activeFontSize = selectedTextElement?.style.fontSize ?? fontSize;
  const activeFontFamily = selectedTextElement?.style.fontFamily ?? fontFamily;
  const activeFontWeight = selectedTextElement?.style.fontWeight ?? fontWeight;
  const activeColor = selectedTextElement?.style.color ?? color;
  const activeTextShadow = selectedTextElement?.style.textShadow ?? textShadow;
  const activeTextBorderRadius =
    selectedTextElement?.style.borderRadius ?? textBorderRadius;
  const activeTextBgColor =
    selectedTextElement?.style.backgroundColor ?? textBackgroundColor;
  const activeTextPadding = selectedTextElement?.style.padding ?? textPadding;
  const activeShowTextBg =
    selectedTextElement?.style.showBackground ?? showTextBackground;
  const activeTextEffect = selectedTextElement
    ? selectedTextElement.style.textEffect || []
    : textEffect || [];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onImageUpload(file);
  };

  return (
    <div className="flex flex-col h-full w-full">
      <Tabs defaultValue="image" className="w-full flex-1 flex flex-col h-full">
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

        <div className="flex-1 min-h-0 relative">
          <TabsContent
            value="image"
            className="absolute inset-0 data-[state=inactive]:hidden focus-visible:outline-none mt-0"
          >
            {/* Image Panel Content (omitted for brevity, unchanged) */}
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
                              <Rotate3d className="size-3" /> 3D Rotation
                            </Label>
                          </div>

                          <div className="space-y-2 pt-2">
                            <div className="flex justify-around px-2 items-center gap-2">
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

                            <div className="flex gap-4 px-2">
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
                        <div className="grid grid-cols-3 relative">
                          <div className="flex col-span-2 items-center justify-normal gap-3">
                            <Select
                              value={imgStyle.clipPath}
                              onValueChange={(val) =>
                                onImageStyleChange({ clipPath: val })
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
                  <Label className="text-sm font-semibold uppercase tracking-wider">
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
                  <Label className="text-sm font-semibold uppercase tracking-wider">
                    Typography
                  </Label>

                  <div className="grid grid-cols-6 w-fit">
                    <Select
                      value={activeFontFamily}
                      onValueChange={onFontFamilyChange}
                    >
                      <span className="text-[13px] font-medium text-muted-foreground col-start-1 flex items-center">
                        Family
                      </span>
                      <SelectTrigger className="h-8 bg-transparent border-border/50 font-manrope ">
                        <div className="flex items-center gap-2">
                          <SelectValue className="" />
                        </div>
                      </SelectTrigger>
                      <SelectContent className="font-manrope text-xs">
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
                      value={activeTextEffect}
                      onValueChange={(val) => onTextEffectChange(val)}
                      className={cn(
                        "flex-wrap justify-start gap-2 border-2 dark:border-neutral-800 rounded-md p-1 bg-muted/20",
                        "*:rounded-md *:transition-colors *:text-muted-foreground *:hover:bg-muted",
                        " *:size-8 *:data-[state=on]:bg-primary *:data-[state=on]:text-primary-foreground"
                      )}
                    >
                      <ToggleGroupItem value="outline" aria-label="Outline">
                        <Highlighter className="size-4" />
                      </ToggleGroupItem>
                      <ToggleGroupItem value="underline" aria-label="Underline">
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

                      {/* NEW BUTTONS */}
                      <ToggleGroupItem value="uppercase" aria-label="Uppercase">
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
                        {activeFontSize}px
                      </span>
                    </div>
                    <div className="flex items-center gap-4 px-2">
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
                  <Label className="text-sm font-semibold uppercase tracking-wider">
                    3D Transforms
                  </Label>
                  <div className="space-y-2 font-manrope">
                    <div className="flex justify-around px-2 items-center gap-2">
                      <Label className="text-[10px] text-muted-foreground">
                        X: {textRotateX}°
                      </Label>
                      <Label className="text-[10px] text-muted-foreground">
                        Y: {textRotateY}°
                      </Label>
                      <Label className="text-[10px] text-muted-foreground">
                        Z: {textRotate}°
                      </Label>
                    </div>
                    <div className="flex gap-4 px-2">
                      <Slider
                        value={[textRotateX]}
                        onValueChange={([val]) =>
                          onTextStyleChange({ rotateX: val })
                        }
                        min={-180}
                        max={180}
                        step={1}
                        className="py-1"
                      />
                      <Slider
                        value={[textRotateY]}
                        onValueChange={([val]) =>
                          onTextStyleChange({ rotateY: val })
                        }
                        min={-180}
                        max={180}
                        step={1}
                        className="py-1"
                      />
                      <Slider
                        value={[textRotate]}
                        onValueChange={([val]) =>
                          onTextStyleChange({ rotate: val })
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
                      checked={activeShowTextBg}
                      onCheckedChange={onShowTextBackgroundChange}
                    />
                  </div>

                  {activeShowTextBg && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-200 px-2 font-manrope">
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
                      <div className="space-y-3 grid grid-cols-2 gap-4 *:pr-2">
                        <div>
                          <div className="flex justify-between pb-3">
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
                        <div>
                          <div className="flex justify-between pb-3">
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
