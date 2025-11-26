import { Plus, Type, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
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
  FONT_FAMILIES,
  FONT_WEIGHTS,
  SHADOW_PRESETS,
} from "./types";

interface TextStylePanelProps {
  selectedElement: TextElement | undefined;
  currentText: string;
  fontSize: number;
  fontFamily: string;
  fontWeight: string;
  color: string;
  textShadow: string;
  borderRadius: number;
  backgroundColor: string;
  padding: number;
  onTextChange: (value: string) => void;
  onFontFamilyChange: (value: string) => void;
  onFontSizeChange: (value: number) => void;
  onFontWeightChange: (value: string) => void;
  onColorChange: (value: string) => void;
  onTextShadowChange: (value: string) => void;
  onBorderRadiusChange: (value: number) => void;
  onBackgroundColorChange: (value: string) => void;
  onPaddingChange: (value: number) => void;
  onAddText: () => void;
}

export function TextStylePanel({
  selectedElement,
  currentText,
  fontSize,
  fontFamily,
  fontWeight,
  color,
  textShadow,
  borderRadius,
  backgroundColor,
  padding,
  onTextChange,
  onFontFamilyChange,
  onFontSizeChange,
  onFontWeightChange,
  onColorChange,
  onTextShadowChange,
  onBorderRadiusChange,
  onBackgroundColorChange,
  onPaddingChange,
  onAddText,
}: TextStylePanelProps) {
  const activeText = selectedElement?.content ?? currentText;
  const activeFontSize = selectedElement?.style.fontSize ?? fontSize;
  const activeFontFamily = selectedElement?.style.fontFamily ?? fontFamily;
  const activeFontWeight = selectedElement?.style.fontWeight ?? fontWeight;
  const activeColor = selectedElement?.style.color ?? color;
  const activeTextShadow = selectedElement?.style.textShadow ?? textShadow;
  const activeBorderRadius =
    selectedElement?.style.borderRadius ?? borderRadius;
  const activeBackgroundColor =
    selectedElement?.style.backgroundColor ?? backgroundColor;
  const activePadding = selectedElement?.style.padding ?? padding;

  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <span>Typography</span>
        </div>

        <div className="space-y-2">
          <Textarea
            value={activeText}
            onChange={(e) => onTextChange(e.target.value)}
            className="min-h-[80px] resize-none bg-background/50 font-medium"
            placeholder="Type something..."
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Select value={activeFontFamily} onValueChange={onFontFamilyChange}>
            <SelectTrigger className="h-8 bg-background/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {FONT_FAMILIES.map((font) => (
                <SelectItem key={font} value={font}>
                  {font}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={activeFontWeight} onValueChange={onFontWeightChange}>
            <SelectTrigger className="h-8 bg-background/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {FONT_WEIGHTS.map((weight) => (
                <SelectItem key={weight.value} value={weight.value}>
                  {weight.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs text-muted-foreground">Size</Label>
            <span className="text-xs font-mono text-muted-foreground">
              {activeFontSize}px
            </span>
          </div>
          <Slider
            value={[activeFontSize]}
            onValueChange={([value]) => onFontSizeChange(value)}
            min={12}
            max={200}
            step={1}
          />
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <span>Appearance</span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Text Color</Label>
            {/* FIXED: Added 'relative' class here to contain the absolute input */}
            <div className="flex items-center gap-2 h-8 border rounded-md px-2 bg-background/50 relative">
              <div
                className="w-4 h-4 rounded-full border shadow-sm shrink-0"
                style={{ backgroundColor: activeColor }}
              />
              <Input
                type="color"
                value={activeColor}
                onChange={(e) => onColorChange(e.target.value)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer p-0 border-0"
              />
              <span className="text-xs font-mono opacity-70 uppercase truncate">
                {activeColor}
              </span>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Background</Label>
            <div className="flex items-center gap-2 h-8 border rounded-md px-2 bg-background/50 relative">
              <div
                className="w-4 h-4 rounded-full border shadow-sm shrink-0"
                style={{ backgroundColor: activeBackgroundColor }}
              />
              <Input
                type="color"
                value={
                  activeBackgroundColor === "transparent"
                    ? "#ffffff"
                    : activeBackgroundColor
                }
                onChange={(e) => onBackgroundColorChange(e.target.value)}
                className="absolute inset-0 opacity-0 w-full h-full cursor-pointer p-0 border-0"
              />
              <span className="text-xs font-mono opacity-70 uppercase truncate">
                {activeBackgroundColor === "transparent"
                  ? "None"
                  : activeBackgroundColor}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs text-muted-foreground">Rounded</Label>
            <span className="text-xs font-mono text-muted-foreground">
              {activeBorderRadius}px
            </span>
          </div>
          <Slider
            value={[activeBorderRadius]}
            onValueChange={([value]) => onBorderRadiusChange(value)}
            min={0}
            max={50}
            step={1}
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-xs text-muted-foreground">Padding</Label>
            <span className="text-xs font-mono text-muted-foreground">
              {activePadding}px
            </span>
          </div>
          <Slider
            value={[activePadding]}
            onValueChange={([value]) => onPaddingChange(value)}
            min={0}
            max={100}
            step={2}
          />
        </div>

        <div className="space-y-1.5 pt-2">
          <Label className="text-xs text-muted-foreground">Effect</Label>
          <Select value={activeTextShadow} onValueChange={onTextShadowChange}>
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

      <div className="mt-auto pt-4">
        <Button
          onClick={onAddText}
          className="w-full border-dashed"
          variant="outline"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Text
        </Button>
      </div>
    </div>
  );
}
