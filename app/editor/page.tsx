"use client";

import { useRef } from "react";
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
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { useEditorState } from "./hooks/editor-state";
import { useSelection } from "./hooks/selection";
import { useExport } from "./hooks/export";

export default function EditorPage() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const hiddenInputRef = useRef<HTMLInputElement>(null);

  const {
    aspectRatioName,
    setAspectRatioName,
    currentAspectRatio,
    canvasBackground,
    imageElements,
    setImageElements,
    textElements,
    setTextElements,
    isCropping,
    setIsCropping,
    selectedElementId,
    setSelectedElementId,
    currentText,
    fontSize,
    fontFamily,
    fontWeight,
    color,
    textShadow,
    textBorderRadius,
    textBackgroundColor,
    textPadding,
    textEffect,
    handleTextEffect,
    showTextBackground,
    history,
    historyIndex,
    resetCanvas,
    deleteSelectedElement,
    addTextElement,
    updateSelectedText,
    handleImageUpload,
    updateSelectedImage,
    handleTextChange,
    handleFontSize,
    handleFontFamily,
    handleFontWeight,
    handleColor,
    handleShadow,
    handleTextRadius,
    handleTextBgColor,
    handleTextPadding,
    handleShowTextBg,
    handleCanvasBackgroundChange,
    undo,
    redo,
  } = useEditorState();

  const {
    isDragging,
    handleElementMouseDown,
    handleCanvasMouseMove,
    handleMouseUp,
  } = useSelection(
    canvasRef,
    currentAspectRatio,
    imageElements,
    textElements,
    setImageElements,
    setTextElements,
    setSelectedElementId
  );

  const {
    exportFormat,
    setExportFormat,
    exportQuality,
    setExportQuality,
    handleDownload,
    handleDownloadAndPreview,
  } = useExport(
    canvasRef,
    setSelectedElementId,
    currentAspectRatio,
    canvasBackground
  );

  const selectedTextElement = textElements.find(
    (t) => t.id === selectedElementId
  );
  const selectedImageElement = imageElements.find(
    (i) => i.id === selectedElementId
  );

  const handleToggleCropping = () => {
    setIsCropping(!isCropping);
  };

  const handleCropChange = (id: string, newCrop: any) => {
    updateSelectedImage({ crop: newCrop });
  };

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      {/* --- LEFT PANEL --- */}
      <div className="w-80 shrink-0 border-r-2 dark:border-neutral-800 bg-card flex flex-col z-20 h-full">
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
            selectedTextElement={selectedTextElement}
            selectedImageElement={selectedImageElement}
            currentText={currentText}
            fontSize={fontSize}
            fontFamily={fontFamily}
            fontWeight={fontWeight}
            color={color}
            textShadow={textShadow}
            textBorderRadius={textBorderRadius}
            textBackgroundColor={textBackgroundColor}
            textEffect={textEffect}
            onTextEffectChange={handleTextEffect}
            textPadding={textPadding}
            showTextBackground={showTextBackground}
            onTextChange={handleTextChange}
            onFontFamilyChange={handleFontFamily}
            onFontSizeChange={handleFontSize}
            onFontWeightChange={handleFontWeight}
            onColorChange={handleColor}
            onTextShadowChange={handleShadow}
            onTextBorderRadiusChange={handleTextRadius}
            onTextBackgroundColorChange={handleTextBgColor}
            onTextPaddingChange={handleTextPadding}
            onShowTextBackgroundChange={handleShowTextBg}
            onAddText={addTextElement}
            onImageStyleChange={updateSelectedImage}
            onImageUpload={handleImageUpload}
            isCropping={isCropping}
            onToggleCropping={handleToggleCropping}
            onTextStyleChange={updateSelectedText}
          />
          <input
            ref={hiddenInputRef}
            type="file"
            accept="image/*"
            onChange={(e) =>
              e.target.files?.[0] && handleImageUpload(e.target.files[0])
            }
            className="hidden"
          />
        </div>
      </div>

      {/* --- CENTER CANVAS --- */}
      <div className="flex-1 relative bg-muted/20 flex flex-col min-w-0 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none bg-[radial-gradient(#ababab_2px,transparent_1px)] bg-size-[20px_20px]" />
        <div className="flex-1 flex items-center justify-center p-8 overflow-hidden z-10">
          <div className="transition-transform duration-200 ease-out scale-[0.5] sm:scale-[0.6] md:scale-[0.75] lg:scale-[0.85] xl:scale-100 origin-center">
            <Canvas
              ref={canvasRef}
              width={currentAspectRatio.width}
              height={currentAspectRatio.height}
              canvasBackground={canvasBackground}
              imageElements={imageElements}
              onEmptyClick={() => hiddenInputRef.current?.click()}
              textElements={textElements}
              selectedElement={selectedElementId}
              onElementMouseDown={handleElementMouseDown}
              onMouseMove={handleCanvasMouseMove}
              onMouseUp={handleMouseUp}
              isDragging={isDragging}
              isCropping={isCropping}
              onCropChange={handleCropChange}
            />
          </div>
        </div>

        {/* Canvas Actions */}
        <div className="absolute bottom-6 left-6 flex items-center gap-2 z-100">
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
              onClick={deleteSelectedElement}
              disabled={!selectedElementId}
              variant="ghost"
              size="icon"
              className="rounded-full w-8 h-8 hover:bg-neutral-300 dark:hover:bg-neutral-700 text-muted-foreground hover:text-destructive"
            >
              <Trash2 size={18} />
            </Button>
            <Button
              onClick={resetCanvas}
              variant="ghost"
              size="icon"
              className="rounded-full w-8 h-8 hover:bg-neutral-300 dark:hover:bg-neutral-700 text-destructive hover:text-red-500"
            >
              <RotateCcw />
            </Button>
          </div>
        </div>
      </div>

      {/* --- RIGHT PANEL --- */}
      <div className="w-80 shrink-0 border-2 dark:border-neutral-800 bg-card flex flex-col z-20 h-full">
        <div className="h-12 border-b-2 dark:border-neutral-800 flex items-center px-4 shrink-0 bg-transparent">
          <span className="font-semibold text-md uppercase tracking-wider">
            Canvas & Export
          </span>
        </div>

        <div className="flex-1 min-h-0 w-full relative">
          <RightPanel
            canvasBackground={canvasBackground}
            aspectRatio={aspectRatioName}
            exportFormat={exportFormat}
            exportQuality={exportQuality}
            onCanvasBackgroundChange={handleCanvasBackgroundChange}
            onAspectRatioChange={setAspectRatioName}
            onExportFormatChange={setExportFormat}
            onExportQualityChange={setExportQuality}
            onDownload={handleDownload}
            onPreview={handleDownloadAndPreview}
          />
        </div>
      </div>
    </div>
  );
}
