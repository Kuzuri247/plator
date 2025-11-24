import { Type, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
  onTextChange: (value: string) => void;
  onFontFamilyChange: (value: string) => void;
  onFontSizeChange: (value: number) => void;
  onFontWeightChange: (value: string) => void;
  onColorChange: (value: string) => void;
  onTextShadowChange: (value: string) => void;
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
  onTextChange,
  onFontFamilyChange,
  onFontSizeChange,
  onFontWeightChange,
  onColorChange,
  onTextShadowChange,
  onAddText,
}: TextStylePanelProps) {
  const activeText = selectedElement?.content ?? currentText;
  const activeFontSize = selectedElement?.style.fontSize ?? fontSize;
  const activeFontFamily = selectedElement?.style.fontFamily ?? fontFamily;
  const activeFontWeight = selectedElement?.style.fontWeight ?? fontWeight;
  const activeColor = selectedElement?.style.color ?? color;
  const activeTextShadow = selectedElement?.style.textShadow ?? textShadow;

  return (
    <Card className="p-4 bg-surface border border-border h-full flex flex-col gap-4 overflow-y-auto">
      {" "}
      <h3 className="font-semibold flex items-center gap-2 shrink-0">
        {" "}
        <Type className="w-4 h-4" /> Text Styling{" "}
      </h3>
      <div className="space-y-4 flex-1">
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
            Content
          </Label>
          <Textarea
            value={activeText}
            onChange={(e) => onTextChange(e.target.value)}
            className="min-h-[80px] resize-none"
            placeholder="Enter your text..."
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Font Family</Label>
            <Select value={activeFontFamily} onValueChange={onFontFamilyChange}>
              <SelectTrigger className="h-8">
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
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Weight</Label>
            <Select value={activeFontWeight} onValueChange={onFontWeightChange}>
              <SelectTrigger className="h-8">
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
        </div>

        <div className="grid grid-cols-[1fr_auto] gap-3 items-end">
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">
              Size: {activeFontSize}px
            </Label>
            <Slider
              value={[activeFontSize]}
              onValueChange={([value]) => onFontSizeChange(value)}
              min={12}
              max={120}
              step={1}
              className="py-2"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Color</Label>
            <div className="h-8 w-12 relative rounded-md overflow-hidden border border-input">
              <Input
                type="color"
                value={activeColor}
                onChange={(e) => onColorChange(e.target.value)}
                className="absolute inset-0 w-[150%] h-[150%] -top-[25%] -left-[25%] p-0 border-0 cursor-pointer"
              />
            </div>
          </div>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Shadow</Label>
          <Select value={activeTextShadow} onValueChange={onTextShadowChange}>
            <SelectTrigger className="h-8">
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

        <Button onClick={onAddText} className="w-full mt-2" variant="default">
          <Sparkles className="w-4 h-4 mr-2" />
          Add Text
        </Button>
      </div>
    </Card>
  );
}
