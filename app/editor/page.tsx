"use client";

import { useRef, useState, useEffect } from "react";
import { Canvas } from "./components/canvas";
import { LeftPanel } from "./components/panels/left-panel";
import { RightPanel } from "./components/panels/right-panel";
import {
  ArrowLeft,
  Undo2,
  Redo2,
  RotateCcw,
  Trash2,
  Menu,
  Settings2,
  X,
  Loader2,
  Download,
  Film,
  ChevronDown,
} from "lucide-react";
import { XIcon } from "@/components/icons/x-icon";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { useStore } from "./store/use-store";
import { useSelection } from "./hooks/selection";
import { useExport } from "./hooks/export";
import { DEFAULT_IMAGE_STYLE, ImageElement, ExportFormat } from "./types";
import { ASPECT_RATIOS } from "./values";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";

export default function EditorPage() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hiddenInputRef = useRef<HTMLInputElement>(null);

  const [showLeftPanel, setShowLeftPanel] = useState(false);
  const [showRightPanel, setShowRightPanel] = useState(false);
  const [canvasScale, setCanvasScale] = useState(1);

  const {
    aspectRatio,
    setAspectRatio,
    canvasBackground,
    meshConfig,
    overlayConfig,
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
    exportFormat,
    exportQuality,
    exportDuration,
    exportFps,
    setExportFormat,
    setExportQuality,
    setExportDuration,
    setExportFps,
  } = useStore();

  const isVideoFormat = ["mp4", "gif"].includes(exportFormat);

  const {
    isDragging,
    snapGuides,
    handleElementPointerDown,
    handleCanvasPointerMove,
    handlePointerUp,
  } = useSelection(
    canvasRef,
    aspectRatio,
    elements,
    updateElement,
    selectElement
  );

  const { handleDownload, isExporting, exportProgress, exportStatus } =
    useExport(canvasRef, selectElement);

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
          name: file.name || "Image Layer",
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
      {/* Mobile Top Header */}
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
        <span className="font-semibold text-sm">Plator WebGL Studio</span>
        <Button
          variant="ghost"
          size="icon"
          className="size-8"
          onClick={() => setShowRightPanel(true)}
        >
          <Settings2 size={20} />
        </Button>
      </div>

      {/* Mobile Left Drawer */}
      {showLeftPanel && (
        <div className="fixed inset-0 z-40 bg-background flex flex-col md:hidden animate-in slide-in-from-left duration-200">
          <div className="h-14 border-b dark:border-neutral-800 flex items-center justify-between px-4 shrink-0">
            <span className="font-semibold text-md uppercase tracking-wider">
              Layer Tools
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

      {/* Mobile Right Drawer */}
      {showRightPanel && (
        <div className="fixed inset-0 z-40 bg-background flex flex-col md:hidden animate-in slide-in-from-right duration-200">
          <div className="h-14 border-b dark:border-neutral-800 flex items-center justify-between px-4 shrink-0">
            <span className="font-semibold text-md uppercase tracking-wider">
              Studio & Export
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
            <RightPanel onDownload={handleDownload} />
          </div>
        </div>
      )}

      {/* Desktop Left Sidebar */}
      <div className="hidden md:flex w-72 shrink-0 border-r-2 dark:border-neutral-800 bg-card flex-col z-20 h-full">
        <div className="h-12 border-b-2 dark:border-neutral-800 flex items-center justify-between px-3 shrink-0">
          <Link href="/">
            <Button
              variant="ghost"
              size="icon"
              className="size-8 text-muted-foreground hover:text-foreground rounded-md"
            >
              <ArrowLeft size={20} />
            </Button>
          </Link>
          <span className="text-sm uppercase font-bold pt-0.5 tracking-wider font-display">
            Plator Studio
          </span>
          <div className="flex items-center gap-1">
            <Link
              href="https://x.com/kuzuri247"
              target="_blank"
              className="text-muted-foreground hover:text-foreground transition-colors p-1"
            >
              <XIcon className="size-4" />
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

      {/* Main Workspace Area */}
      <div className="flex-1 relative bg-muted/20 flex flex-col min-w-0 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none bg-[radial-gradient(#ababab_2px,transparent_1px)] bg-size-[20px_20px]" />

        {/* Floating Canvas Resolution Dropdown (Top-Left) */}
        <div className="absolute top-3 left-3 z-40 animate-in fade-in slide-in-from-top-2 duration-300">
          <Select value={aspectRatio.name} onValueChange={setAspectRatio}>
            <SelectTrigger className="h-8 px-2.5 gap-2 bg-background/85 dark:bg-card/90 backdrop-blur-md border border-border/80 shadow-md hover:border-primary/60 hover:bg-background/95 rounded-lg text-xs font-manrope font-semibold transition-all">
              <div className="flex items-center gap-2">
                <div
                  className={`w-3.5 h-3 bg-muted border border-foreground/30 rounded-2xs ${aspectRatio.previewClass}`}
                />
                <span className="font-bold text-xs text-foreground">
                  {aspectRatio.name}
                </span>
                <span className="text-[11px] font-medium text-muted-foreground">
                  {aspectRatio.label}
                </span>
                <span className="text-[10px] font-manrope text-muted-foreground/80 hidden sm:inline">
                  ({aspectRatio.width}×{aspectRatio.height})
                </span>
              </div>
            </SelectTrigger>
            <SelectContent className="w-68 font-manrope max-h-80 shadow-2xl border-border/80 backdrop-blur-xl bg-background/95 p-1">
              <div className="px-2 py-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Canvas Resolution & Aspect Ratio
              </div>
              {ASPECT_RATIOS.map((ratio) => (
                <SelectItem
                  key={ratio.name}
                  value={ratio.name}
                  className="py-2 px-2 rounded-md cursor-pointer focus:bg-accent/80 transition-colors"
                >
                  <div className="flex items-center gap-3 w-full">
                    <div
                      className={`w-6.5 shrink-0 bg-muted border border-foreground/20 rounded-xs ${ratio.previewClass}`}
                    />
                    <div className="flex flex-col min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-semibold text-xs text-foreground">
                          {ratio.name}
                        </span>
                        <span className="text-[10px] font-bold text-primary uppercase tracking-wide">
                          {ratio.label}
                        </span>
                      </div>
                      <span className="text-[10px] font-manrope text-muted-foreground">
                        {ratio.width} × {ratio.height}
                      </span>
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Floating Export Control (Top-Right) */}
        <div className="absolute top-3 right-3 z-40 animate-in fade-in slide-in-from-top-2 duration-300">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                disabled={isExporting}
                className="h-8 px-3 gap-1.5 font-bold text-xs uppercase tracking-wider bg-primary hover:bg-primary/90 text-primary-foreground shadow-md hover:shadow-lg rounded-lg cursor-pointer transition-all flex items-center"
              >
                {isExporting ? (
                  <>
                    <Loader2 className="size-3.5 animate-spin" />
                    <span>{exportProgress > 0 ? `${exportProgress}%` : "Exporting..."}</span>
                  </>
                ) : (
                  <>
                    <Download className="size-3.5" />
                    <span>Export</span>
                    <span className="text-[10px] px-1.5 py-0.5 bg-primary-foreground/20 rounded uppercase font-extrabold">
                      {exportFormat}
                    </span>
                    <ChevronDown className="size-3 opacity-70" />
                  </>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent
              align="end"
              sideOffset={8}
              className="w-72 p-4 font-manrope bg-card/95 backdrop-blur-xl border border-border/80 shadow-2xl rounded-xl space-y-3 z-50"
            >
              {/* Export Header */}
              <div className="flex items-center justify-between">
                <Label className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 text-foreground">
                  <Film className="size-3.5 text-primary" /> Export Media
                </Label>
                <span className="text-[10px] font-bold text-primary uppercase tracking-wide bg-primary/10 px-1.5 py-0.5 rounded">
                  {isVideoFormat ? "Video" : "Image"}
                </span>
              </div>

              {/* Format Selector Pills */}
              <div className="grid grid-cols-5 gap-1 bg-muted/60 p-1 rounded-lg">
                {(["mp4", "gif", "png", "jpeg", "svg"] as ExportFormat[]).map(
                  (fmt) => (
                    <button
                      key={fmt}
                      onClick={() => setExportFormat(fmt)}
                      className={`py-1 rounded text-[10px] font-bold uppercase transition-all cursor-pointer ${
                        exportFormat === fmt
                          ? "bg-primary text-primary-foreground shadow-xs scale-102"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {fmt}
                    </button>
                  )
                )}
              </div>

              {/* Video / Loop Settings */}
              {isVideoFormat ? (
                <div className="space-y-3 pt-1">
                  <div className="grid grid-cols-2 gap-3 items-end">
                    {/* Duration Dropdown */}
                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium text-muted-foreground block">
                        Duration
                      </Label>
                      <Select
                        value={String(exportDuration)}
                        onValueChange={(val) => setExportDuration(Number(val))}
                      >
                        <SelectTrigger className="h-8 w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[1, 2, 3, 4, 5, 6].map((sec) => (
                            <SelectItem key={sec} value={String(sec)}>
                              {sec}s
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Framerate Toggle */}
                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium text-muted-foreground block">
                        Framerate
                      </Label>
                      <div className="grid grid-cols-2 gap-1 bg-muted/60 p-1 rounded-lg h-8">
                        {[
                          { value: 30, label: "30 FPS", disabled: false },
                          { value: 60, label: "60 FPS", disabled: exportFormat === "gif" },
                        ].map(({ value, label, disabled }) => (
                          <button
                            key={value}
                            type="button"
                            disabled={disabled}
                            onClick={() => !disabled && setExportFps(value)}
                            title={disabled ? "60 FPS is not available for GIF" : undefined}
                            className={`rounded text-xs font-semibold transition-all flex items-center justify-center ${
                              disabled
                                ? "opacity-35 cursor-not-allowed text-muted-foreground"
                                : exportFps === value
                                ? "bg-primary text-primary-foreground shadow-xs font-bold cursor-pointer"
                                : "text-muted-foreground hover:text-foreground cursor-pointer"
                            }`}
                          >
                            {label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-0.5">
                    <Label className="text-xs text-muted-foreground">
                      Resolution Scale
                    </Label>
                    <div className="flex gap-1.5">
                      {[
                        { q: "1", label: "1x Standard" },
                        { q: "2", label: "2x 1080p HD" },
                        { q: "4", label: "4x 4K Ultra" },
                      ].map(({ q, label }) => (
                        <button
                          key={q}
                          type="button"
                          onClick={() => setExportQuality(q)}
                          className={`px-2.5 py-0.5 rounded text-xs font-semibold border cursor-pointer ${
                            exportQuality === q
                              ? "border-primary bg-primary/10 text-primary font-bold shadow-xs"
                              : "border-border text-muted-foreground hover:text-foreground"
                          }`}
                          title={label}
                        >
                          {q}x
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between pt-1">
                  <Label className="text-xs text-muted-foreground">
                    Resolution Scale
                  </Label>
                  <div className="flex gap-1.5">
                    {["1", "2", "4"].map((q) => (
                      <button
                        key={q}
                        type="button"
                        onClick={() => setExportQuality(q)}
                        className={`px-2.5 py-0.5 rounded text-xs font-semibold border cursor-pointer ${
                          exportQuality === q
                            ? "border-primary bg-primary/10 text-primary font-bold shadow-xs"
                            : "border-border text-muted-foreground"
                        }`}
                      >
                        {q}x
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Download Action Button */}
              <Button
                onClick={handleDownload}
                disabled={isExporting}
                className="w-full h-9 font-bold text-xs uppercase tracking-wider bg-primary hover:bg-primary/90 text-primary-foreground shadow-md cursor-pointer flex items-center justify-center gap-2 rounded-lg"
              >
                {isExporting ? (
                  <>
                    <Loader2 className="size-3.5 animate-spin" />
                    <span>{exportStatus || `Exporting ${exportProgress}%`}</span>
                  </>
                ) : (
                  <>
                    <Download className="size-3.5" />
                    <span>Download {exportFormat.toUpperCase()}</span>
                  </>
                )}
              </Button>
            </PopoverContent>
          </Popover>
        </div>

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
            className="origin-center shadow-2xl relative rounded-lg overflow-visible"
          >
            <Canvas
              ref={canvasRef}
              width={aspectRatio.width}
              height={aspectRatio.height}
              canvasBackground={canvasBackground}
              meshConfig={meshConfig}
              overlayConfig={overlayConfig}
              elements={elements}
              onEmptyClick={() => {
                if (elements.length === 0) {
                  hiddenInputRef.current?.click();
                } else {
                  selectElement(null);
                }
              }}
              selectedElementId={selectedElementId}
              onElementMouseDown={handleElementPointerDown}
              onMouseMove={handleCanvasPointerMove}
              onMouseUp={handlePointerUp}
              isDragging={isDragging}
              isCropping={isCropping}
              snapGuides={snapGuides}
              onCropChange={handleCropChange}
            />
          </div>
        </div>

        {/* Floating Quick Action Toolbar */}
        {!showLeftPanel && !showRightPanel && (
          <div className="absolute bottom-3 left-3 flex items-center gap-2 z-50 animate-in fade-in zoom-in duration-300">
            <div className="bg-background/85 backdrop-blur-md border-2 border-border rounded-lg p-1 shadow-xl flex items-center gap-1">
              <Button
                onClick={undo}
                disabled={historyIndex <= 0}
                variant="ghost"
                size="icon"
                title="Undo"
                className="rounded-full w-8 h-8 hover:bg-muted"
              >
                <Undo2 size={16} />
              </Button>
              <Button
                onClick={redo}
                disabled={historyIndex >= history.length - 1}
                variant="ghost"
                size="icon"
                title="Redo"
                className="rounded-full w-8 h-8 hover:bg-muted"
              >
                <Redo2 size={16} />
              </Button>
              <div className="w-px h-5 bg-border mx-1" />
              <Button
                onClick={() =>
                  selectedElementId && removeElement(selectedElementId)
                }
                disabled={!selectedElementId}
                variant="ghost"
                size="icon"
                title="Delete Element"
                className="rounded-full w-8 h-8 hover:bg-muted text-muted-foreground hover:text-destructive"
              >
                <Trash2 size={16} />
              </Button>
              <Button
                onClick={reset}
                variant="ghost"
                size="icon"
                title="Reset All"
                className="rounded-full w-8 h-8 hover:bg-muted text-destructive hover:text-red-500"
              >
                <RotateCcw size={16} />
              </Button>
            </div>
          </div>
        )}

        {/* Export Progress Modal Overlay */}
        {isExporting && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="bg-card border-2 border-border shadow-2xl rounded-2xl p-6 max-w-sm w-full space-y-4 text-center animate-in zoom-in-95 duration-200">
              <div className="flex justify-center">
                <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Loader2 className="size-6 animate-spin" />
                </div>
              </div>

              <div className="space-y-1">
                <h3 className="font-bold text-base uppercase tracking-wide">
                  Exporting Asset
                </h3>
                <p className="text-xs text-muted-foreground">{exportStatus}</p>
              </div>

              {exportProgress > 0 && (
                <div className="space-y-1.5">
                  <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-primary h-full transition-all duration-200"
                      style={{ width: `${exportProgress}%` }}
                    />
                  </div>
                  <div className="text-right text-[10px] font-manrope text-muted-foreground">
                    {exportProgress}%
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Desktop Right Sidebar */}
      <div className="hidden md:flex w-76 shrink-0 border-l-2 dark:border-neutral-800 bg-card flex-col z-20 h-full">
        <div className="flex justify-center h-12 border-b-2 dark:border-neutral-800 items-center px-4 shrink-0 bg-transparent">
          <span className="text-sm uppercase font-bold pt-0.5 tracking-wider font-display">
            Canvas & Shaders
          </span>
        </div>
        <div className="flex-1 min-h-0 w-full relative">
          <RightPanel onDownload={handleDownload} />
        </div>
      </div>
    </div>
  );
}
