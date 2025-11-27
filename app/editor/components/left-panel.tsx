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
        <TabsList className="w-full grid grid-cols-2 mb-4 bg-muted/50">
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
        <TabsContent value="image" className="flex-1 flex flex-col gap-6 data-[state=inactive]:hidden focus-visible:outline-none">
          <div className="space-y-5">
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Source</Label>
              <div className="relative">
                <Input 
                  type="file" 
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="image-upload"
                />
                <Button asChild variant="outline" size="sm" className="w-full border-dashed bg-transparent border-border/50 hover:bg-muted/50">
                  <label htmlFor="image-upload" className="cursor-pointer">
                    Upload Image
                  </label>
                </Button>
              </div>
            </div>

            <Separator className="bg-border/50" />

            <div className="space-y-4">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Properties</Label>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-medium">Scale</Label>
                  <span className="text-xs text-muted-foreground">{userImageStyle.scale}%</span>
                </div>
                <Slider
                  value={[userImageStyle.scale]}
                  onValueChange={([val]) => onImageStyleChange({ scale: val })}
                  min={10}
                  max={200}
                  step={1}
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-medium">Opacity</Label>
                  <span className="text-xs text-muted-foreground">{userImageStyle.opacity}%</span>
                </div>
                <Slider
                  value={[userImageStyle.opacity]}
                  onValueChange={([val]) => onImageStyleChange({ opacity: val })}
                  min={0}
                  max={100}
                  step={1}
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-medium">Blur</Label>
                  <span className="text-xs text-muted-foreground">{userImageStyle.blur}px</span>
                </div>
                <Slider
                  value={[userImageStyle.blur]}
                  onValueChange={([val]) => onImageStyleChange({ blur: val })}
                  min={0}
                  max={20}
                  step={1}
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-medium">Noise</Label>
                  <span className="text-xs text-muted-foreground">{userImageStyle.noise}%</span>
                </div>
                <Slider
                  value={[userImageStyle.noise]}
                  onValueChange={([val]) => onImageStyleChange({ noise: val })}
                  min={0}
                  max={50}
                  step={1}
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-medium">Roundness</Label>
                  <span className="text-xs text-muted-foreground">{userImageStyle.borderRadius}px</span>
                </div>
                <Slider
                  value={[userImageStyle.borderRadius]}
                  onValueChange={([val]) => onImageStyleChange({ borderRadius: val })}
                  min={0}
                  max={100}
                  step={1}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-medium">Shadow</Label>
                <Select 
                  value={userImageStyle.shadow} 
                  onValueChange={(val) => onImageStyleChange({ shadow: val })}
                >
                  <SelectTrigger className="h-8 bg-transparent border-border/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="font-manrope">
                    {SHADOW_PRESETS.map((shadow) => (
                      <SelectItem key={shadow.name} value={shadow.value}>
                        {shadow.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* === TEXT CONTROLS === */}
        <TabsContent value="text" className="flex-1 flex flex-col gap-4 data-[state=inactive]:hidden pr-1 focus-visible:outline-none">
          <div className="space-y-3">
             <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Content</Label>
            <Textarea
              value={activeText}
              onChange={(e) => onTextChange(e.target.value)}
              className="min-h-8 resize-none bg-transparent placeholder:font-manrope"
              placeholder="Type text here..."
            />
            <Button onClick={onAddText} variant="outline" size="sm" className="w-full bg-transparent border-dashed border hover:bg-muted/50">
              <Plus className="w-3.5 h-3.5 mr-2" /> Add Text Layer
            </Button>
          </div>

          <Separator className="bg-border/50" />

          <div className="space-y-4">
            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Typography</Label>
            
            <div className="grid grid-cols-2 gap-2">
                <Select value={activeFontFamily} onValueChange={onFontFamilyChange}>
                <SelectTrigger className="h-8 bg-transparent border-border/50"><SelectValue /></SelectTrigger>
                <SelectContent className="font-manrope">
                    {FONT_FAMILIES.map((f) => <SelectItem key={f} value={f}>{f}</SelectItem>)}
                </SelectContent>
                </Select>
                <Select value={activeFontWeight} onValueChange={onFontWeightChange}>
                <SelectTrigger className="h-8 bg-transparent border-border/50 "><SelectValue /></SelectTrigger>
                <SelectContent className="font-manrope">
                    {FONT_WEIGHTS.map((w) => <SelectItem key={w.value} value={w.value}>{w.label}</SelectItem>)}
                </SelectContent>
                </Select>
            </div>

            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <Label className="text-xs font-medium">Color & Size</Label>
                    <span className="text-xs text-muted-foreground">{activeFontSize}px</span>
                </div>
                
                <div className="flex items-center gap-3">
                    <div className="relative group cursor-pointer">
                    <div 
                        className="size-6 rounded-full border border-border shadow-sm flex items-center justify-center transition-transform hover:scale-105"
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
                    max={160} 
                    className="flex-1"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label className="text-xs font-medium">Text Shadow</Label>
                <Select value={activeTextShadow} onValueChange={onTextShadowChange}>
                <SelectTrigger className="h-8 bg-transparent border-border/50"><SelectValue placeholder="None" /></SelectTrigger>
                <SelectContent>
                    {SHADOW_PRESETS.map((s) => <SelectItem key={s.name} value={s.value}>{s.name}</SelectItem>)}
                </SelectContent>
                </Select>
            </div>
          </div>

          <Separator className="bg-border/50" />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Background Box</Label>
              <Switch 
                checked={activeShowTextBg}
                onCheckedChange={onShowTextBackgroundChange}
              />
            </div>

            {activeShowTextBg && (
              <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-200 pl-1">
                <div className="flex items-center justify-between">
                   <Label className="text-xs font-medium">Box Color</Label>
                   <div className="relative size-6 rounded-md border border-border overflow-hidden">
                      <div className="absolute inset-0" style={{ backgroundColor: activeTextBgColor }} />
                      <Input type="color" value={activeTextBgColor} onChange={(e) => onTextBackgroundColorChange(e.target.value)} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full p-0 border-0" />
                   </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between"><Label className="text-xs font-medium">Rounded</Label><span className="text-xs text-muted-foreground">{activeTextBorderRadius}px</span></div>
                  <Slider value={[activeTextBorderRadius]} onValueChange={([v]) => onTextBorderRadiusChange(v)} min={0} max={50} />
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between"><Label className="text-xs font-medium">Padding</Label><span className="text-xs text-muted-foreground">{activeTextPadding}px</span></div>
                  <Slider value={[activeTextPadding]} onValueChange={([v]) => onTextPaddingChange(v)} min={0} max={60} />
                </div>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}