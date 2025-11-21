"use client";

import { useRef } from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

interface BackgroundPanelProps {
  backgroundImage: string | null;
  imageSize: number;
  onImageUpload: (file: File) => void;
  onImageSizeChange: (size: number) => void;
}

export function Background({
  backgroundImage,
  imageSize,
  onImageUpload,
  onImageSizeChange,
}: BackgroundPanelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onImageUpload(file);
  };

  return (
    <Card className="p-4 bg-surface border border-border">
      <h3 className="font-semibold mb-4">Background</h3>
      <div className="space-y-4">
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
          className="w-full"
        >
          <Upload className="w-4 h-4 mr-2" />
          Upload Image
        </Button>

        {backgroundImage && (
          <div>
            <Label className="text-sm text-muted-foreground">
              Image Size: {imageSize}%
            </Label>
            <Slider
              value={[imageSize]}
              onValueChange={([value]) => onImageSizeChange(value)}
              min={20}
              max={150}
              step={5}
              className="mt-2"
            />
          </div>
        )}
      </div>
    </Card>
  );
}
