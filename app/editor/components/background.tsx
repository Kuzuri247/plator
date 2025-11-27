"use client";

import { useRef } from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Undo2, Redo2 ,RefreshCcw} from "lucide-react";

interface BackgroundPanelProps {
  backgroundImage: string | null;
  imageSize: number;
  onImageUpload: (file: File) => void;
  onImageSizeChange: (size: number) => void;
  onUndo: () => void;
  onRedo: () => void;
  onRefresh: () => void;
  canUndo: boolean;
  canRedo: boolean;
  canRefresh: boolean;
}

export function Background({
  backgroundImage,
  imageSize,
  onImageUpload,
  onImageSizeChange,
  onUndo,
  onRedo,
  onRefresh,
  canUndo,
  canRedo,
  canRefresh,
}: BackgroundPanelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onImageUpload(file);
  };

  return (
    <div className="space-y-4 py-2">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      <Button
        onClick={() => fileInputRef.current?.click()}
        variant="outline"
        className="w-full border-dashed"
      >
        <Upload className="w-4 h-4 mr-2" />
        {backgroundImage ? "Change Image" : "Upload Image"}
      </Button>

      {backgroundImage && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-medium text-muted-foreground">
              Scale
            </Label>
            <span className="text-xs text-muted-foreground">{imageSize}%</span>
          </div>
          <Slider
            value={[imageSize]}
            onValueChange={([value]) => onImageSizeChange(value)}
            min={20}
            max={150}
            step={1}
          />
        </div>
      )}
      <div className="absolute z-50 bottom-4 center flex gap-2 opacity-0 group-hover/canvas:opacity-100 transition-opacity duration-300">
        <Button
          onClick={onUndo}
          disabled={!canUndo}
          variant="secondary"
          size="icon"
          className="rounded-full shadow-lg bg-background/80 backdrop-blur hover:bg-background"
        >
          <Undo2 className="w-4 h-4" />
        </Button>
        <Button
          onClick={onRedo}
          disabled={!canRedo}
          variant="secondary"
          size="icon"
          className="rounded-full shadow-lg bg-background/80 backdrop-blur hover:bg-background"
        >
          <Redo2 className="w-4 h-4" />
        </Button>
        <Button
          onClick={onRefresh}
          disabled={!canRefresh}
          variant="secondary"
          size="icon"
          className="rounded-full shadow-lg bg-background/80 backdrop-blur hover:bg-background"
        >
          <RefreshCcw className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
