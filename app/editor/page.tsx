"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Canvas } from "./components/canvas";
import { LeftPanel } from "./components/left-panel";
import { RightPanel } from "./components/right-panel";
import {
  TextElement,
  ImageElement,
  ImageStyle,
  ASPECT_RATIOS,
} from "./components/types";
import { ArrowLeft, Twitter, Undo2, Redo2, RotateCcw } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { toast } from "sonner";
import { toPng, toJpeg, toSvg } from "html-to-image";

interface HistoryState {
  textElements: Omit<TextElement, "position">[];
  imageElements: Omit<ImageElement, "position">[];
  canvasBackground: string;
}

const DEFAULT_IMAGE_STYLE: ImageStyle = {
  scale: 100,
  borderRadius: 0,
  shadow: "none",
  rotate: 0,
  rotateX: 0,
  rotateY: 0,
  blur: 0,
  opacity: 100,
  noise: 0,
  clipPath: "none",
  flipX: false,
  flipY: false,
  crop: { top: 0, right: 0, bottom: 0, left: 0 },
};

export default function EditorPage() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const hiddenInputRef = useRef<HTMLInputElement>(null);
  const historyTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [aspectRatioName, setAspectRatioName] = useState("4:3");
  const currentAspectRatio =
    ASPECT_RATIOS.find((r) => r.name === aspectRatioName) || ASPECT_RATIOS[4];
  const [canvasBackground, setCanvasBackground] = useState(
    "linear-gradient(135deg, #0f0c29, #302b63, #24243e)"
  );

  const [imageElements, setImageElements] = useState<ImageElement[]>([]);
  const [textElements, setTextElements] = useState<TextElement[]>([]);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(
    null
  );

  // Default Text Styles
  const [currentText, setCurrentText] = useState("Sample Text");
  const [fontSize, setFontSize] = useState(48);
  const [fontFamily, setFontFamily] = useState("Inter");
  const [fontWeight, setFontWeight] = useState("400");
  const [color, setColor] = useState("#ffffff");
  const [textShadow, setTextShadow] = useState("none");
  const [textBorderRadius, setTextBorderRadius] = useState(12);
  const [textBackgroundColor, setTextBackgroundColor] = useState("#000000");
  const [textPadding, setTextPadding] = useState(4);
  const [showTextBackground, setShowTextBackground] = useState(true);

  const [exportFormat, setExportFormat] = useState("png");
  const [exportQuality, setExportQuality] = useState("2");

  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [dragTarget, setDragTarget] = useState<string | null>(null);

  const [history, setHistory] = useState<HistoryState[]>([
    {
      textElements: [],
      imageElements: [],
      canvasBackground: "",
    },
  ]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // --- Helper to get current visual scale of the canvas ---
  const getCanvasScale = useCallback(() => {
    if (!canvasRef.current) return 1;
    const rect = canvasRef.current.getBoundingClientRect();
    // The scale is the Visual Width / Actual Internal Width
    return rect.width / currentAspectRatio.width;
  }, [currentAspectRatio.width]);

  const queueHistorySave = useCallback(() => {
    if (historyTimeoutRef.current) {
      clearTimeout(historyTimeoutRef.current);
    }
    historyTimeoutRef.current = setTimeout(() => {
      const currentState: HistoryState = {
        textElements: textElements.map(({ position, ...rest }) => rest),
        imageElements: imageElements.map(({ position, ...rest }) => rest),
        canvasBackground,
      };
      setHistory((prev) => {
        const newHistory = prev.slice(0, historyIndex + 1);
        newHistory.push(currentState);
        return newHistory;
      });
      setHistoryIndex((prev) => prev + 1);
    }, 2000);
  }, [textElements, imageElements, canvasBackground, historyIndex]);

  const saveHistoryImmediate = () => {
    if (historyTimeoutRef.current) clearTimeout(historyTimeoutRef.current);
    const currentState: HistoryState = {
      textElements: textElements.map(({ position, ...rest }) => rest),
      imageElements: imageElements.map(({ position, ...rest }) => rest),
      canvasBackground,
    };
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(currentState);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const resetCanvas = () => {
    setImageElements([]);
    setTextElements([]);
    setCanvasBackground("linear-gradient(135deg, #0f0c29, #302b63, #24243e)");
    const initialState: HistoryState = {
      textElements: [],
      imageElements: [],
      canvasBackground: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)",
    };
    setHistory([initialState]);
    setHistoryIndex(0);
    toast.success("Canvas reset!");
  };

  const addTextElement = () => {
    const newElement: TextElement = {
      id: `text_${Date.now()}`,
      content: "Sample Text",
      position: {
        x: currentAspectRatio.width / 2 - 100,
        y: currentAspectRatio.height / 2,
      },
      style: {
        fontSize,
        fontFamily,
        fontWeight,
        color,
        textShadow,
        borderRadius: textBorderRadius,
        backgroundColor: textBackgroundColor,
        padding: textPadding,
        showBackground: showTextBackground,
      },
    };
    setTextElements((prev) => [...prev, newElement]);
    setSelectedElementId(newElement.id);
    saveHistoryImmediate();
  };

  const updateSelectedText = (
    updates: Partial<TextElement["style"]> | { content: string }
  ) => {
    if (!selectedElementId) return;
    setTextElements((prev) =>
      prev.map((el) => {
        if (el.id === selectedElementId) {
          if ("content" in updates) return { ...el, content: updates.content! };
          return { ...el, style: { ...el.style, ...updates } };
        }
        return el;
      })
    );
    queueHistorySave();
  };

  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      const img = new Image();
      img.onload = () => {
        const id = `img_${Date.now()}`;

        // --- 3. CONTAIN LOGIC ---
        const canvasW = currentAspectRatio.width;
        const canvasH = currentAspectRatio.height;
        const imgW = img.naturalWidth;
        const imgH = img.naturalHeight;

        // Calculate scale to fit "contain"
        const scaleX = canvasW / imgW;
        const scaleY = canvasH / imgH;
        // Use 90% of the container to leave a little breathing room initially
        const scale = Math.min(scaleX, scaleY, 1) * 90;

        // Center based on the top-left 0,0 anchor
        const x = (canvasW - imgW) / 2;
        const y = (canvasH - imgH) / 2;

        const newImage: ImageElement = {
          id,
          src: result,
          position: { x, y },
          style: { ...DEFAULT_IMAGE_STYLE, scale: Math.round(scale) }, // Apply calculated scale
        };
        setImageElements((prev) => [...prev, newImage]);
        setSelectedElementId(id);
        saveHistoryImmediate();
      };
      img.src = result;
    };
    reader.readAsDataURL(file);
  };

  const updateSelectedImage = (updates: Partial<ImageStyle>) => {
    if (!selectedElementId) return;
    setImageElements((prev) =>
      prev.map((img) => {
        if (img.id === selectedElementId) {
          return { ...img, style: { ...img.style, ...updates } };
        }
        return img;
      })
    );
    queueHistorySave();
  };

  const handleTextChange = (val: string) =>
    selectedElementId?.startsWith("text")
      ? updateSelectedText({ content: val })
      : setCurrentText(val);
  const handleFontSize = (val: number) =>
    selectedElementId?.startsWith("text")
      ? updateSelectedText({ fontSize: val })
      : setFontSize(val);
  const handleFontFamily = (val: string) =>
    selectedElementId?.startsWith("text")
      ? updateSelectedText({ fontFamily: val })
      : setFontFamily(val);
  const handleFontWeight = (val: string) =>
    selectedElementId?.startsWith("text")
      ? updateSelectedText({ fontWeight: val })
      : setFontWeight(val);
  const handleColor = (val: string) =>
    selectedElementId?.startsWith("text")
      ? updateSelectedText({ color: val })
      : setColor(val);
  const handleShadow = (val: string) =>
    selectedElementId?.startsWith("text")
      ? updateSelectedText({ textShadow: val })
      : setTextShadow(val);
  const handleTextRadius = (val: number) =>
    selectedElementId?.startsWith("text")
      ? updateSelectedText({ borderRadius: val })
      : setTextBorderRadius(val);
  const handleTextBgColor = (val: string) =>
    selectedElementId?.startsWith("text")
      ? updateSelectedText({ backgroundColor: val })
      : setTextBackgroundColor(val);
  const handleTextPadding = (val: number) =>
    selectedElementId?.startsWith("text")
      ? updateSelectedText({ padding: val })
      : setTextPadding(val);
  const handleShowTextBg = (val: boolean) =>
    selectedElementId?.startsWith("text")
      ? updateSelectedText({ showBackground: val })
      : setShowTextBackground(val);
  const handleCanvasBackgroundChange = (val: string) => {
    setCanvasBackground(val);
    queueHistorySave();
  };

  // --- UPDATED DRAG START ---
  const handleElementMouseDown = (e: React.MouseEvent, elementId: string) => {
    e.preventDefault();
    e.stopPropagation();

    // Get the current visual scale factor of the canvas
    const scale = getCanvasScale();
    const element =
      imageElements.find((el) => el.id === elementId) ||
      textElements.find((el) => el.id === elementId);

    if (!element || !canvasRef.current) return;

    const canvasRect = canvasRef.current.getBoundingClientRect();

    // Calculate position in Canvas Units (Visual Pixels / Scale Factor)
    const mouseXInCanvas = (e.clientX - canvasRect.left) / scale;
    const mouseYInCanvas = (e.clientY - canvasRect.top) / scale;

    setDragOffset({
      x: mouseXInCanvas - element.position.x,
      y: mouseYInCanvas - element.position.y,
    });

    setDragTarget(elementId);
    setSelectedElementId(elementId);
  };

  // --- UPDATED DRAG MOVE ---
  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    if (!dragTarget || !canvasRef.current) return;

    const scale = getCanvasScale();
    const canvasRect = canvasRef.current.getBoundingClientRect();

    // Convert screen coordinates to canvas coordinates using scale factor
    const mouseXInCanvas = (e.clientX - canvasRect.left) / scale;
    const mouseYInCanvas = (e.clientY - canvasRect.top) / scale;

    const newX = mouseXInCanvas - dragOffset.x;
    const newY = mouseYInCanvas - dragOffset.y;

    if (dragTarget.startsWith("img")) {
      setImageElements((prev) =>
        prev.map((el) =>
          el.id === dragTarget ? { ...el, position: { x: newX, y: newY } } : el
        )
      );
    } else {
      setTextElements((prev) =>
        prev.map((el) =>
          el.id === dragTarget ? { ...el, position: { x: newX, y: newY } } : el
        )
      );
    }
  };

  const handleMouseUp = () => setDragTarget(null);

  const undo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      applyHistoryState(history[newIndex]);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      applyHistoryState(history[newIndex]);
    }
  };

  const applyHistoryState = (state: HistoryState) => {
    if (historyTimeoutRef.current) clearTimeout(historyTimeoutRef.current);
    setCanvasBackground(state.canvasBackground);
    setImageElements((current) =>
      state.imageElements.map((histImg) => ({
        ...histImg,
        position: current.find((c) => c.id === histImg.id)?.position || {
          x: 0,
          y: 0,
        },
      }))
    );
    setTextElements((current) =>
      state.textElements.map((histEl) => ({
        ...histEl,
        position: current.find((el) => el.id === histEl.id)?.position || {
          x: 0,
          y: 0,
        },
      }))
    );
  };

  const handleDownload = async () => {
    if (!canvasRef.current) return;
    // De-select elements to remove selection rings/borders before capturing
    const prevSelection = selectedElementId;
    setSelectedElementId(null);

    try {
      const pixelRatio = parseInt(exportQuality) || 2;
      const options = {
        quality: 1.0,
        pixelRatio: pixelRatio,
        width: currentAspectRatio.width,
        height: currentAspectRatio.height,
        backgroundColor: canvasBackground.startsWith("#")
          ? canvasBackground
          : undefined,
      };

      let dataUrl;
      if (exportFormat === "svg") {
        dataUrl = await toSvg(canvasRef.current, options);
      } else if (exportFormat === "jpeg") {
        dataUrl = await toJpeg(canvasRef.current, options);
      } else {
        dataUrl = await toPng(canvasRef.current, options);
      }

      const link = document.createElement("a");
      link.download = `plator-export.${exportFormat}`;
      link.href = dataUrl;
      link.click();
      toast.success("Exported successfully!");
    } catch (error) {
      console.error("Export failed:", error);
      toast.error("Failed to export. Please try again.");
    } finally {
      setSelectedElementId(prevSelection);
    }
  };

  const selectedTextElement = textElements.find(
    (t) => t.id === selectedElementId
  );
  const selectedImageElement = imageElements.find(
    (i) => i.id === selectedElementId
  );

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      {/* --- LEFT PANEL --- */}
      <div className="w-80 shrink-0 border-r-2 dark:border-neutral-800 bg-card flex flex-col z-20 h-full">
        <div className="h-12 border-b-2 dark:border-neutral-800 flex items-center justify-between px-3 shrink-0">
          <Link href="/">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground rounded-md"
            >
              <ArrowLeft size={16} />
            </Button>
          </Link>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground rounded-md"
              asChild
            >
              <Link href="https://x.com/kuzuri247" target="_blank">
                <Twitter size={16} />
              </Link>
            </Button>
            <ThemeToggle />
          </div>
        </div>

        {/* Content Container - No scroll area here, delegated to LeftPanel */}
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
            <div className="w-px h-4 bg-border mx-1" />
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
          <span className="font-bold text-xs uppercase tracking-widest text-muted-foreground">
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
          />
        </div>
      </div>
    </div>
  );
}
