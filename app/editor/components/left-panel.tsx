"use client";

import { Type, Image as ImageIcon, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  TextElement,
  ImageStyle,
  FONT_FAMILIES,
  FONT_WEIGHTS,
  SHADOW_PRESETS,
} from "./types";

interface LeftPanelProps {
  selectedElement: TextElement | undefined;
  // Text State
  currentText: string;
  fontSize: number;
  fontFamily: string;
  fontWeight: string;
  color: string;
  textShadow: string;
  textBorderRadius: number;
  textBackgroundColor: string;
  textPadding: number;
  showTextBackground: boolean;
  // Image State
  userImageStyle: ImageStyle;
  
  // Handlers
  onTextChange: (value: string) => void;
  onFontFamilyChange: (value: string) => void;
  onFontSizeChange: (value: number) => void;
  onFontWeightChange: (value: string) => void;
  onColorChange: (value: string) => void;
  onTextShadowChange: (value: string) => void;
  onTextBorderRadiusChange: (value: number) => void;
  onTextBackgroundColorChange: (value: string) => void;
  onTextPaddingChange: (value: number) => void;
  onShowTextBackgroundChange: (value: boolean) => void;
  onAddText: () => void;
  
  onImageStyleChange: (updates: Partial<ImageStyle>) => void;
  onImageUpload: (file: File) => void;
}

export function LeftPanel({
  selectedElement,
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
  userImageStyle,
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
  
  const activeText = selectedElement?.content ?? currentText;
  const activeFontSize = selectedElement?.style.fontSize ?? fontSize;
  const activeFontFamily = selectedElement?.style.fontFamily ?? fontFamily;
  const activeFontWeight = selectedElement?.style.fontWeight ?? fontWeight;
  const activeColor = selectedElement?.style.color ?? color;
  const activeTextShadow = selectedElement?.style.textShadow ?? textShadow;
  const activeTextBorderRadius = selectedElement?.style.borderRadius ?? textBorderRadius;
  const activeTextBgColor = selectedElement?.style.backgroundColor ?? textBackgroundColor;
  const activeTextPadding = selectedElement?.style.padding ?? textPadding;
  const activeShowTextBg = selectedElement?.style.showBackground ?? showTextBackground;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onImageUpload(file);
  };

  return (
    <div className="flex flex-col h-full">
      <Tabs defaultValue="image" className="w-full flex-1 flex flex-col">
        <TabsList className="w-full grid grid-cols-2 mb-4">
          <TabsTrigger value="image">
            <ImageIcon className="w-4 h-4 mr-2" />
            Image
          </TabsTrigger>
          <TabsTrigger value="text">
            <Type className="w-4 h-4 mr-2" />
            Text
          </TabsTrigger>
        </TabsList>

        {/* === IMAGE CONTROLS === */}
        <TabsContent value="image" className="flex-1 flex flex-col gap-6 data-[state=inactive]:hidden">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground">Source</Label>
              <div className="relative">
                <Input 
                  type="file" 
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="image-upload"
                />
                <Button asChild variant="outline" className="w-full border-dashed">
                  <label htmlFor="image-upload" className="cursor-pointer">
                    Upload Screenshot
                  </label>
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-medium text-muted-foreground">Scale</Label>
                <span className="text-xs text-muted-foreground">{userImageStyle.scale}%</span>
              </div>
              <Slider
                value={[userImageStyle.scale]}
                onValueChange={([val]) => onImageStyleChange({ scale: val })}
                min={50}
                max={150}
                step={1}
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-medium text-muted-foreground">Roundness</Label>
                <span className="text-xs text-muted-foreground">{userImageStyle.borderRadius}px</span>
              </div>
              <Slider
                value={[userImageStyle.borderRadius]}
                onValueChange={([val]) => onImageStyleChange({ borderRadius: val })}
                min={0}
                max={40}
                step={1}
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">Shadow</Label>
              <Select 
                value={userImageStyle.shadow} 
                onValueChange={(val) => onImageStyleChange({ shadow: val })}
              >
                <SelectTrigger className="h-8 bg-background/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SHADOW_PRESETS.map((shadow) => (
                    <SelectItem key={shadow.name} value={shadow.value}>
                      {shadow.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </TabsContent>

        {/* === TEXT CONTROLS === */}
        <TabsContent value="text" className="flex-1 flex flex-col gap-5 data-[state=inactive]:hidden overflow-y-auto pr-1">
          <div className="space-y-3">
            <Label className="text-xs font-medium text-muted-foreground">Content</Label>
            <Textarea
              value={activeText}
              onChange={(e) => onTextChange(e.target.value)}
              className="min-h-[70px] resize-none bg-background/50"
              placeholder="Type text here..."
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Select value={activeFontFamily} onValueChange={onFontFamilyChange}>
              <SelectTrigger className="h-8 bg-background/50"><SelectValue /></SelectTrigger>
              <SelectContent>
                {FONT_FAMILIES.map((f) => <SelectItem key={f} value={f}>{f}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={activeFontWeight} onValueChange={onFontWeightChange}>
              <SelectTrigger className="h-8 bg-background/50"><SelectValue /></SelectTrigger>
              <SelectContent>
                {FONT_WEIGHTS.map((w) => <SelectItem key={w.value} value={w.value}>{w.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between"><Label className="text-xs text-muted-foreground">Size</Label><span className="text-xs text-muted-foreground">{activeFontSize}px</span></div>
            <Slider value={[activeFontSize]} onValueChange={([v]) => onFontSizeChange(v)} min={12} max={160} />
          </div>

          <div className="flex items-center gap-3">
             <div className="flex-1 space-y-1">
                <Label className="text-xs text-muted-foreground">Color</Label>
                <div className="flex items-center gap-2 h-8 border rounded-md px-2 bg-background/50 relative">
                  <div className="w-4 h-4 rounded-full border shrink-0" style={{ backgroundColor: activeColor }} />
                  <Input type="color" value={activeColor} onChange={(e) => onColorChange(e.target.value)} className="absolute inset-0 opacity-0 cursor-pointer" />
                </div>
             </div>
             <div className="flex-1 space-y-1">
                <Label className="text-xs text-muted-foreground">Shadow</Label>
                <Select value={activeTextShadow} onValueChange={onTextShadowChange}>
                  <SelectTrigger className="h-8 bg-background/50"><SelectValue placeholder="None" /></SelectTrigger>
                  <SelectContent>
                    {SHADOW_PRESETS.map((s) => <SelectItem key={s.name} value={s.value}>{s.name}</SelectItem>)}
                  </SelectContent>
                </Select>
             </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-semibold">Background</Label>
              <Switch 
                checked={activeShowTextBg}
                onCheckedChange={onShowTextBackgroundChange}
              />
            </div>

            {activeShowTextBg && (
              <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Bg Color</Label>
                  <div className="flex items-center gap-2 h-8 border rounded-md px-2 bg-background/50 relative">
                    <div className="w-4 h-4 rounded-full border shrink-0" style={{ backgroundColor: activeTextBgColor }} />
                    <Input type="color" value={activeTextBgColor} onChange={(e) => onTextBackgroundColorChange(e.target.value)} className="absolute inset-0 opacity-0 cursor-pointer" />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between"><Label className="text-xs text-muted-foreground">Rounded</Label><span className="text-xs text-muted-foreground">{activeTextBorderRadius}px</span></div>
                  <Slider value={[activeTextBorderRadius]} onValueChange={([v]) => onTextBorderRadiusChange(v)} min={0} max={50} />
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between"><Label className="text-xs text-muted-foreground">Padding</Label><span className="text-xs text-muted-foreground">{activeTextPadding}px</span></div>
                  <Slider value={[activeTextPadding]} onValueChange={([v]) => onTextPaddingChange(v)} min={0} max={60} />
                </div>
              </div>
            )}
          </div>

          <div className="mt-auto pt-4">
            <Button onClick={onAddText} variant="secondary" className="w-full">
              <Plus className="w-4 h-4 mr-2" /> Add Text
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}