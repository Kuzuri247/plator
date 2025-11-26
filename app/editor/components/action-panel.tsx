"use client";

import { Download, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ActionsPanelProps {
  onDownload: () => void;
}

export function ActionsPanel({ onDownload }: ActionsPanelProps) {
  return (
    <div className="space-y-4 py-2">
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Settings2 className="w-4 h-4" />
          <span>Export Settings</span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Format</Label>
            <Select defaultValue="png">
              <SelectTrigger className="h-8 bg-background/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="png">PNG</SelectItem>
                <SelectItem value="jpg">JPG</SelectItem>
                <SelectItem value="svg">SVG</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Quality</Label>
            <Select defaultValue="2x">
              <SelectTrigger className="h-8 bg-background/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1x">1x</SelectItem>
                <SelectItem value="2x">2x (Retina)</SelectItem>
                <SelectItem value="4x">4x (Ultra)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <Button
        onClick={onDownload}
        className="w-full bg-primary hover:bg-primary/90 font-semibold shadow-lg"
      >
        <Download className="w-4 h-4 mr-2" />
        Export Image
      </Button>
    </div>
  );
}
