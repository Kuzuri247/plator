"use client";

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
import { TextElement, FONT_FAMILIES, FONT_WEIGHTS, SHADOW_PRESETS } from "./types";

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
    <Card className="p-4 bg-surface border border-border">
      <h3 className="font-semibold mb-4 flex items-center gap-2">
        <Type className="w-4 h-4" />
        Text Styling
      </h3>

      <div className="space-y-4">
        <div>
          <Label className="text-sm text-muted-foreground">Text Content</Label>
          <Textarea
            value={activeText}
            onChange={(e) => onTextChange(e.target.value)}
            className="mt-2"
            placeholder="Enter your text..."
            rows={3}
          />
        </div>

        <div>
          <Label className="text-sm text-muted-foreground">Font Family</Label>
          <Select value={activeFontFamily} onValueChange={onFontFamilyChange}>
            <SelectTrigger className="mt-2">
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

        <div>
          <Label className="text-sm text-muted-foreground">
            Font Size: {activeFontSize}px
          </Label>
          <Slider
            value={[activeFontSize]}
            onValueChange={([value]) => onFontSizeChange(value)}
            min={12}
            max={120}
            step={1}
            className="mt-2"
          />
        </div>

        <div>
          <Label className="text-sm text-muted-foreground">Font Weight</Label>
          <Select value={activeFontWeight} onValueChange={onFontWeightChange}>
            <SelectTrigger className="mt-2">
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

        <div>
          <Label className="text-sm text-muted-foreground">Text Color</Label>
          <Input
            type="color"
            value={activeColor}
            onChange={(e) => onColorChange(e.target.value)}
            className="mt-2 h-10"
          />
        </div>

        <div>
          <Label className="text-sm text-muted-foreground">Text Shadow</Label>
          <Select value={activeTextShadow} onValueChange={onTextShadowChange}>
            <SelectTrigger className="mt-2">
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

        <Button onClick={onAddText} className="w-full" variant="default">
          <Sparkles className="w-4 h-4 mr-2" />
          Add Text to Canvas
        </Button>
      </div>
    </Card>
  );
}
