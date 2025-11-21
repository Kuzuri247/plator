"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface ActionsPanelProps {
  onDownload: () => void;
}

export function ActionsPanel({ onDownload }: ActionsPanelProps) {
  return (
    <Card className="p-4 bg-surface border border-border">
      <h3 className="font-semibold mb-4">Actions</h3>
      <Button onClick={onDownload} variant="outline" className="w-full">
        <Download className="w-4 h-4 mr-2" />
        Download
      </Button>
    </Card>
  );
}
