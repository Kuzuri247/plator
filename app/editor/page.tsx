"use client";

import { useRef, useState, useEffect } from "react";
import { Canvas } from "./components/canvas";
import { LeftPanel } from "./components/panels/left-panel";
import { RightPanel } from "./components/panels/right-panel";
import {
  ArrowLeft,
  Twitter,
  Undo2,
  Redo2,
  RotateCcw,
  Trash2,
  Menu,
  Settings2,
  X,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { useStore } from "./store/use-store";
import { useSelection } from "./hooks/selection";
import { useExport } from "./hooks/export";
import { DEFAULT_IMAGE_STYLE, ImageElement } from "./types";

export default function EditorPage() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hiddenInputRef = useRef<HTMLInputElement>(null);

  const [showLeftPanel, setShowLeftPanel] = useState(false);
  const [showRightPanel, setShowRightPanel] = useState(false);

  const [canvasScale, setCanvasScale] = useState(1);

  const {
    aspectRatio,
    canvasBackground,
    elements,
    selectedElementId,
    selectElement,
    updateElement,
    addElement,
    removeElement,
    isCropping,
    setCropping,
    undo,
    redo,
    reset,
    historyIndex,
    history,
  } = useStore();

  const {
    isDragging,
    handleElementPointerDown,
    handleCanvasPointerMove,
    handlePointerUp,
  } = useSelection(
    canvasRef,
    aspectRatio,
    elements,
    updateElement,
    selectElement,
  );

  const { handleDownload, handleDownloadAndPreview } = useExport(
    canvasRef,
    selectElement,
  );

  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      const img = new Image();
      img.onload = () => {
        const id = `img_${Date.now()}`;
        const canvasW = aspectRatio.width;
        const canvasH = aspectRatio.height;
        const imgW = img.naturalWidth;
        const imgH = img.naturalHeight;
        const scaleX = canvasW / imgW;
        const scaleY = canvasH / imgH;
        const scale = Math.min(scaleX, scaleY, 1) * 90;
        const x = (canvasW - imgW) / 2;
        const y = (canvasH - imgH) / 2;

        const newImage: ImageElement = {
          id,
          type: "image",
          name: "Image Layer",
          src: result,
          position: { x, y },
          style: { ...DEFAULT_IMAGE_STYLE, scale: Math.round(scale) },
          isVisible: true,
          isLocked: false,
        };
        addElement(newImage);
      };
      img.src = result;
    };
    reader.readAsDataURL(file);
  };

  const handleCropChange = (id: string, newCrop: any) => {
    updateElement(id, { crop: newCrop });
  };

  useEffect(() => {
    const calculateScale = () => {
      if (!containerRef.current) return;
      const containerWidth = containerRef.current.clientWidth;
      const containerHeight = containerRef.current.clientHeight;
      const padding = 32;
      const availableWidth = containerWidth - padding;
      const availableHeight = containerHeight - padding;
      const scaleX = availableWidth / aspectRatio.width;
      const scaleY = availableHeight / aspectRatio.height;
      const newScale = Math.min(scaleX, scaleY, 1);
      setCanvasScale(newScale);
    };
    calculateScale();
    window.addEventListener("resize", calculateScale);
    return () => window.removeEventListener("resize", calculateScale);
  }, [aspectRatio]);

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden flex-col md:flex-row">
      <div className="md:hidden h-14 border-b dark:border-neutral-800 bg-card flex items-center justify-between px-4 shrink-0 z-30 relative">
        <div className="flex items-center gap-2">
          <Link href="/">
            <Button variant="ghost" size="icon" className="size-8">
              <ArrowLeft size={20} />
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="size-8"
            onClick={() => setShowLeftPanel(true)}
          >
            <Menu size={20} />
          </Button>
        </div>
        <span className="font-semibold text-sm">Plator Editor</span>
        <Button
          variant="ghost"
          size="icon"
          className="size-8"
          onClick={() => setShowRightPanel(true)}
        >
          <Settings2 size={20} />
        </Button>
      </div>

      {showLeftPanel && (
        <div className="fixed inset-0 z-40 bg-background flex flex-col md:hidden animate-in slide-in-from-left duration-200">
          <div className="h-14 border-b dark:border-neutral-800 flex items-center justify-between px-4 shrink-0">
            <span className="font-semibold text-md uppercase tracking-wider">
              Editor
            </span>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowLeftPanel(false)}
              >
                <X size={20} />
              </Button>
            </div>
          </div>
          <div className="flex-1 min-h-0 relative">
            <LeftPanel
              onImageUpload={handleImageUpload}
              isCropping={isCropping}
              onToggleCropping={() => setCropping(!isCropping)}
            />
          </div>
        </div>
      )}

      {showRightPanel && (
        <div className="fixed inset-0 z-40 bg-background flex flex-col md:hidden animate-in slide-in-from-right duration-200">
          <div className="h-14 border-b dark:border-neutral-800 flex items-center justify-between px-4 shrink-0">
            <span className="font-semibold text-md uppercase tracking-wider">
              Canvas & Export
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowRightPanel(false)}
            >
              <X size={20} />
            </Button>
          </div>
          <div className="flex-1 min-h-0 relative">
            <RightPanel
              onDownload={handleDownload}
              onPreview={handleDownloadAndPreview}
            />
          </div>
        </div>
      )}

      <div className="hidden md:flex w-80 shrink-0 border-r-2 dark:border-neutral-800 bg-card flex-col z-20 h-full">
        <div className="h-12 border-b-2 dark:border-neutral-800 flex items-center justify-between px-4 shrink-0">
          <Link href="/">
            <Button
              variant="ghost"
              size="icon"
              className="size-8 text-muted-foreground hover:text-foreground rounded-md"
            >
              <ArrowLeft size={20} />
            </Button>
          </Link>
          <span className="text-md uppercase font-semibold pt-0.75 tracking-wider">
            Editor
          </span>
          <div className="flex items-center gap-2">
            <Link
              href="https://x.com/kuzuri247"
              target="_blank"
              className="text-muted-foreground"
            >
              <Twitter size={18} />
            </Link>
            <ThemeToggle />
          </div>
        </div>
        <div className="flex-1 min-h-0 w-full relative">
          <LeftPanel
            onImageUpload={handleImageUpload}
            isCropping={isCropping}
            onToggleCropping={() => setCropping(!isCropping)}
          />
        </div>
      </div>

      <input
        ref={hiddenInputRef}
        type="file"
        accept="image/*"
        onChange={(e) =>
          e.target.files?.[0] && handleImageUpload(e.target.files[0])
        }
        className="hidden"
      />

      <div className="flex-1 relative bg-muted/20 flex flex-col min-w-0 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none bg-[radial-gradient(#ababab_2px,transparent_1px)] bg-size-[20px_20px]" />

        <div
          ref={containerRef}
          className="flex-1 flex items-center justify-center p-4 md:p-8 overflow-hidden z-10 w-full h-full relative"
        >
          <div
            style={{
              transform: `scale(${canvasScale})`,
              width: aspectRatio.width,
              height: aspectRatio.height,
              transition: "transform 0.1s ease-out",
              touchAction: "none",
            }}
            className="origin-center shadow-2xl relative"
          >
            <Canvas
              ref={canvasRef}
              width={aspectRatio.width}
              height={aspectRatio.height}
              canvasBackground={canvasBackground}
              elements={elements}
              onEmptyClick={() => hiddenInputRef.current?.click()}
              selectedElementId={selectedElementId}
              onElementMouseDown={handleElementPointerDown}
              onMouseMove={handleCanvasPointerMove}
              onMouseUp={handlePointerUp}
              isDragging={isDragging}
              isCropping={isCropping}
              onCropChange={handleCropChange}
            />
          </div>
        </div>

        {!showLeftPanel && !showRightPanel && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 md:translate-x-0 md:left-6 flex items-center gap-2 z-50 animate-in fade-in zoom-in duration-300">
            <div className="bg-background/80 backdrop-blur border-2 rounded-full p-1 shadow-lg flex items-center gap-1">
              <Button
                onClick={undo}
                disabled={historyIndex <= 0}
                variant="ghost"
                size="icon"
                className="rounded-full w-8 h-8 hover:bg-neutral-300 dark:hover:bg-neutral-700"
              >
                <Undo2 />
              </Button>
              <Button
                onClick={redo}
                disabled={historyIndex >= history.length - 1}
                variant="ghost"
                size="icon"
                className="rounded-full w-8 h-8 hover:bg-neutral-300 dark:hover:bg-neutral-700"
              >
                <Redo2 />
              </Button>
              <div className="w-px h-6 bg-neutral-400 dark:bg-neutral-700 mx-1" />
              <Button
                onClick={() =>
                  selectedElementId && removeElement(selectedElementId)
                }
                disabled={!selectedElementId}
                variant="ghost"
                size="icon"
                className="rounded-full w-8 h-8 hover:bg-neutral-300 dark:hover:bg-neutral-700 text-muted-foreground hover:text-destructive"
              >
                <Trash2 size={18} />
              </Button>
              <Button
                onClick={reset}
                variant="ghost"
                size="icon"
                className="rounded-full w-8 h-8 hover:bg-neutral-300 dark:hover:bg-neutral-700 text-destructive hover:text-red-500"
              >
                <RotateCcw />
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="hidden md:flex w-80 shrink-0 border-l-2 dark:border-neutral-800 bg-card flex-col z-20 h-full">
        <div className="h-12 border-b-2 dark:border-neutral-800 flex items-center px-4 shrink-0 bg-transparent">
          <span className="font-semibold text-md uppercase tracking-wider">
            Canvas & Export
          </span>
        </div>
        <div className="flex-1 min-h-0 w-full relative">
          <RightPanel
            onDownload={handleDownload}
            onPreview={handleDownloadAndPreview}
          />
        </div>
      </div>
    </div>
  );
}
