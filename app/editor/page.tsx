"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Canvas } from "./components/canvas";
import { LeftPanel } from "./components/left-panel";
import { RightPanel } from "./components/right-panel";
import { TextElement, ImageStyle, ASPECT_RATIOS } from "./components/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeft, Twitter, Undo2, Redo2, RotateCcw } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { toast } from "sonner";

// History excludes positioning to allow free movement without filling history stack
interface HistoryState {
  textElements: Omit<TextElement, "position">[];
  canvasBackground: string;
  userImage: string | null;
  userImageStyle: ImageStyle;
}

export default function EditorPage() {
  // --- Refs & Utils ---
  const canvasRef = useRef<HTMLDivElement>(null);
  const hiddenInputRef = useRef<HTMLInputElement>(null);
  const historyTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // --- Canvas State ---
  const [aspectRatioName, setAspectRatioName] = useState("4:3");
  const currentAspectRatio =
    ASPECT_RATIOS.find((r) => r.name === aspectRatioName) || ASPECT_RATIOS[4];
  const [canvasBackground, setCanvasBackground] = useState(
    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
  );

  // --- Image State ---
  const [userImage, setUserImage] = useState<string | null>(null);
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
  const [userImageStyle, setUserImageStyle] = useState<ImageStyle>({
    scale: 90,
    borderRadius: 12,
    shadow: "none",
    rotate: 0,
    blur: 0,
    opacity: 100,
    noise: 0,
  });

  // --- Text State ---
  const [textElements, setTextElements] = useState<TextElement[]>([]);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);

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

  // --- Interaction State ---
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [dragTarget, setDragTarget] = useState<string | "image" | null>(null);

  // --- History System ---
  const [history, setHistory] = useState<HistoryState[]>([
    {
      textElements: [],
      canvasBackground: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      userImage: null,
      userImageStyle: {
        scale: 90,
        borderRadius: 12,
        shadow: "none",
        rotate: 0,
        blur: 0,
        opacity: 100,
        noise: 0,
      },
    },
  ]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // Debounced Save
  const queueHistorySave = useCallback(() => {
    if (historyTimeoutRef.current) {
      clearTimeout(historyTimeoutRef.current);
    }

    historyTimeoutRef.current = setTimeout(() => {
      const currentState: HistoryState = {
        textElements: textElements.map(({ position, ...rest }) => rest), // Exclude position
        canvasBackground,
        userImage,
        userImageStyle: { ...userImageStyle },
      };

      setHistory((prev) => {
        const newHistory = prev.slice(0, historyIndex + 1);
        newHistory.push(currentState);
        return newHistory;
      });
      setHistoryIndex((prev) => prev + 1);
    }, 2000);
  }, [textElements, canvasBackground, userImage, userImageStyle, historyIndex]);

  // Immediate save for discrete actions (Add/Delete)
  const saveHistoryImmediate = () => {
    if (historyTimeoutRef.current) clearTimeout(historyTimeoutRef.current);
    const currentState: HistoryState = {
      textElements: textElements.map(({ position, ...rest }) => rest),
      canvasBackground,
      userImage,
      userImageStyle: { ...userImageStyle },
    };
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(currentState);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const resetCanvas = () => {
    setUserImage(null);
    setTextElements([]);
    setCanvasBackground("linear-gradient(135deg, #667eea 0%, #764ba2 100%)");
    setUserImageStyle({
      scale: 90,
      borderRadius: 12,
      shadow: "none",
      rotate: 0,
      blur: 0,
      opacity: 100,
      noise: 0,
    });

    const initialState: HistoryState = {
      textElements: [],
      canvasBackground: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      userImage: null,
      userImageStyle: {
        scale: 90,
        borderRadius: 12,
        shadow: "none",
        rotate: 0,
        blur: 0,
        opacity: 100,
        noise: 0,
      },
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
    setSelectedElement(newElement.id);
    saveHistoryImmediate();
  };

  const updateSelectedText = (
    updates: Partial<TextElement["style"]> | { content: string }
  ) => {
    if (!selectedElement) return;
    setTextElements((prev) =>
      prev.map((el) => {
        if (el.id === selectedElement) {
          if ("content" in updates) return { ...el, content: updates.content! };
          return { ...el, style: { ...el.style, ...updates } };
        }
        return el;
      })
    );
    queueHistorySave();
  };

  // Wrappers
  const handleTextChange = (val: string) =>
    selectedElement
      ? updateSelectedText({ content: val })
      : setCurrentText(val);
  const handleFontSize = (val: number) =>
    selectedElement ? updateSelectedText({ fontSize: val }) : setFontSize(val);
  const handleFontFamily = (val: string) =>
    selectedElement
      ? updateSelectedText({ fontFamily: val })
      : setFontFamily(val);
  const handleFontWeight = (val: string) =>
    selectedElement
      ? updateSelectedText({ fontWeight: val })
      : setFontWeight(val);
  const handleColor = (val: string) =>
    selectedElement ? updateSelectedText({ color: val }) : setColor(val);
  const handleShadow = (val: string) =>
    selectedElement
      ? updateSelectedText({ textShadow: val })
      : setTextShadow(val);
  const handleTextRadius = (val: number) =>
    selectedElement
      ? updateSelectedText({ borderRadius: val })
      : setTextBorderRadius(val);
  const handleTextBgColor = (val: string) =>
    selectedElement
      ? updateSelectedText({ backgroundColor: val })
      : setTextBackgroundColor(val);
  const handleTextPadding = (val: number) =>
    selectedElement
      ? updateSelectedText({ padding: val })
      : setTextPadding(val);
  const handleShowTextBg = (val: boolean) =>
    selectedElement
      ? updateSelectedText({ showBackground: val })
      : setShowTextBackground(val);

  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;

      // Load image to determine natural size for centering
      const img = new Image();
      img.onload = () => {
        const x = (currentAspectRatio.width - img.naturalWidth) / 2;
        const y = (currentAspectRatio.height - img.naturalHeight) / 2;

        setImagePosition({ x, y });
        setUserImage(result);
        saveHistoryImmediate();
      };
      img.src = result;
    };
    reader.readAsDataURL(file);
  };

  const handleImageStyleChange = (updates: Partial<ImageStyle>) => {
    setUserImageStyle((prev) => ({ ...prev, ...updates }));
    queueHistorySave();
  };

  const handleCanvasBackgroundChange = (val: string) => {
    setCanvasBackground(val);
    queueHistorySave();
  };

  const handleElementMouseDown = (e: React.MouseEvent, elementId: string) => {
    e.preventDefault();
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    setDragOffset({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    setDragTarget(elementId);
    setSelectedElement(elementId);
  };

  const handleImageMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!userImage) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setDragOffset({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    setDragTarget("image");
    setSelectedElement(null);
  };

  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    if (!dragTarget || !canvasRef.current) return;
    const canvasRect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - canvasRect.left - dragOffset.x;
    const y = e.clientY - canvasRect.top - dragOffset.y;

    if (dragTarget === "image") {
      setImagePosition({ x, y });
    } else {
      setTextElements((prev) =>
        prev.map((el) =>
          el.id === dragTarget ? { ...el, position: { x, y } } : el
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
    setUserImage(state.userImage);
    setUserImageStyle(state.userImageStyle);

    // Merge history (content/style) with current positions
    setTextElements((currentElements) => {
      return state.textElements.map((histEl) => {
        const existing = currentElements.find((el) => el.id === histEl.id);
        return {
          ...histEl,
          position: existing
            ? existing.position
            : {
                x: currentAspectRatio.width / 2,
                y: currentAspectRatio.height / 2,
              },
        };
      });
    });
  };

  // canvas export////////////////////////////////////////////////////////////////////////////////////

  const handleDownload = async () => {
    if (!canvasRef.current) return;

    try {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const scale = parseInt(exportQuality) || 2;
      canvas.width = currentAspectRatio.width * scale;
      canvas.height = currentAspectRatio.height * scale;

      // Setup High Quality Scaling
      ctx.scale(scale, scale);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      // 1. Draw Background
      if (canvasBackground.startsWith("#")) {
        ctx.fillStyle = canvasBackground;
        ctx.fillRect(0, 0, currentAspectRatio.width, currentAspectRatio.height);
      } else if (canvasBackground.startsWith("linear-gradient")) {
        const gradient = ctx.createLinearGradient(
          0,
          0,
          currentAspectRatio.width,
          currentAspectRatio.height
        );
        const colorMatches = canvasBackground.match(
          /(#[0-9a-fA-F]{6}|rgba?\(.*?\))/g
        );

        if (colorMatches && colorMatches.length >= 2) {
          gradient.addColorStop(0, colorMatches[0]);
          gradient.addColorStop(1, colorMatches[1]);
          if (colorMatches.length > 2) {
            for (let i = 1; i < colorMatches.length - 1; i++) {
              gradient.addColorStop(
                i / (colorMatches.length - 1),
                colorMatches[i]
              );
            }
          }
          ctx.fillStyle = gradient;
          ctx.fillRect(
            0,
            0,
            currentAspectRatio.width,
            currentAspectRatio.height
          );
        } else {
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(
            0,
            0,
            currentAspectRatio.width,
            currentAspectRatio.height
          );
        }
      }

      // 2. Draw User Image
      if (userImage) {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = userImage;
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
        });

        ctx.save();

        const w = img.naturalWidth;
        const h = img.naturalHeight;
        const x = imagePosition.x;
        const y = imagePosition.y;

        ctx.translate(x + w / 2, y + h / 2);

        ctx.rotate((userImageStyle.rotate * Math.PI) / 180);
        ctx.scale(userImageStyle.scale / 100, userImageStyle.scale / 100);

        ctx.translate(-(w / 2), -(h / 2));

        ctx.globalAlpha = userImageStyle.opacity / 100;
        if (userImageStyle.blur > 0) {
          ctx.filter = `blur(${userImageStyle.blur}px)`;
        }

        if (userImageStyle.shadow !== "none") {
          ctx.shadowColor = "rgba(0,0,0,0.2)";
          if (userImageStyle.shadow.includes("10px")) ctx.shadowBlur = 15;
          else if (userImageStyle.shadow.includes("20px")) ctx.shadowBlur = 25;
          else ctx.shadowBlur = 5;
          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = 4;
        }

        if (userImageStyle.borderRadius > 0) {
          ctx.beginPath();
          if (ctx.roundRect) {
            ctx.roundRect(0, 0, w, h, userImageStyle.borderRadius);
          } else {
            ctx.rect(0, 0, w, h);
          }
          ctx.clip();
        }

        // Draw at 0,0 relative to the translated context (which is effectively x,y unrotated)
        ctx.drawImage(img, 0, 0, w, h);
        ctx.restore();
      }

      // 3. Draw Text Elements
      textElements.forEach((el) => {
        ctx.save();
        const fontSizeVal = el.style.fontSize;
        ctx.font = `${el.style.fontWeight} ${fontSizeVal}px ${el.style.fontFamily}, sans-serif`;
        ctx.textBaseline = "top";

        const lines = el.content.split("\n");
        const lineHeight = fontSizeVal * 1.2;

        let maxWidth = 0;
        lines.forEach((line) => {
          const m = ctx.measureText(line);
          if (m.width > maxWidth) maxWidth = m.width;
        });
        const totalHeight = lines.length * lineHeight;
        const padding = el.style.padding;

        if (el.style.showBackground) {
          ctx.fillStyle = el.style.backgroundColor;
          const bgX = el.position.x;
          const bgY = el.position.y;
          const bgW = maxWidth + padding * 2;
          const bgH = totalHeight + padding * 2 - (lineHeight - fontSizeVal);

          ctx.beginPath();
          if (ctx.roundRect) {
            ctx.roundRect(bgX, bgY, bgW, bgH, el.style.borderRadius);
          } else {
            ctx.rect(bgX, bgY, bgW, bgH);
          }
          ctx.fill();
        }

        ctx.fillStyle = el.style.color;

        if (el.style.textShadow !== "none") {
          ctx.shadowColor = "rgba(0,0,0,0.3)";
          ctx.shadowBlur = 4;
          ctx.shadowOffsetX = 2;
          ctx.shadowOffsetY = 2;
        }

        let textY = el.position.y + (el.style.showBackground ? padding : 0);
        const textX = el.position.x + (el.style.showBackground ? padding : 0);

        lines.forEach((line) => {
          ctx.fillText(line, textX, textY);
          textY += lineHeight;
        });

        ctx.restore();
      });

      // 4. Download
      const mimeType = exportFormat === "jpeg" ? "image/jpeg" : "image/png";
      const dataUrl = canvas.toDataURL(mimeType, 1);

      const link = document.createElement("a");
      link.download = `plator-export.${exportFormat}`;
      link.href = dataUrl;
      link.click();

      toast.success("Exported successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to export. Please try again.");
    }
  };

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      {/* Left Panel */}
      <div className="w-80 shrink-0 border-r-2 dark:border-neutral-800 bg-card flex flex-col z-20 shadow-xl h-full">
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

        <ScrollArea className="flex-1">
          <div className="p-4">
            <LeftPanel
              selectedElement={textElements.find(
                (el) => el.id === selectedElement
              )}
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
              userImageStyle={userImageStyle}
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
              onImageStyleChange={handleImageStyleChange}
              onImageUpload={handleImageUpload}
            />
            {/* Hidden Input for Canvas Click Upload */}
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
        </ScrollArea>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 relative bg-muted/20 flex flex-col min-w-0 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none bg-[radial-gradient(#ababab_2px,transparent_1px)] bg-size-[20px_20px]" />
        <div className="flex-1 flex items-center justify-center p-8 overflow-hidden z-10">
          <div className="transition-transform duration-200 ease-out scale-[0.5] sm:scale-[0.6] md:scale-[0.75] lg:scale-[0.85] xl:scale-100 origin-center">
            <Canvas
              ref={canvasRef}
              width={currentAspectRatio.width}
              height={currentAspectRatio.height}
              canvasBackground={canvasBackground}
              userImage={userImage}
              userImageStyle={userImageStyle}
              imagePosition={imagePosition}
              onImageMouseDown={handleImageMouseDown}
              onEmptyClick={() => hiddenInputRef.current?.click()}
              textElements={textElements}
              selectedElement={selectedElement}
              onElementMouseDown={handleElementMouseDown}
              onMouseMove={handleCanvasMouseMove}
              onMouseUp={handleMouseUp}
            />
          </div>
        </div>

        {/* absolute actions  */}
        <div className="absolute bottom-6 left-6 flex items-center gap-2 z-50">
          <div className="bg-background/80 backdrop-blur border-2 rounded-full p-1 shadow-lg flex items-center gap-1">
            <Button
              onClick={undo}
              disabled={historyIndex <= 0}
              variant="ghost"
              size="icon"
              className="rounded-full w-8 h-8 hover:bg-neutral-300 dark:hover:bg-neutral-700"
              title="Undo"
            >
              <Undo2 />
            </Button>
            <Button
              onClick={redo}
              disabled={historyIndex >= history.length - 1}
              variant="ghost"
              size="icon"
              className="rounded-full w-8 h-8 hover:bg-neutral-300 dark:hover:bg-neutral-700"
              title="Redo"
            >
              <Redo2 />
            </Button>

            <div className="w-px h-4 bg-border mx-1" />
            <Button
              onClick={resetCanvas}
              variant="ghost"
              size="icon"
              className="rounded-full w-8 h-8 hover:bg-neutral-300 dark:hover:bg-neutral-700 text-destructive hover:text-red-500"
              title="Reset Canvas"
            >
              <RotateCcw />
            </Button>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-80 shrink-0 border-2 dark:border-neutral-800 bg-card flex flex-col z-20 shadow-xl h-full">
        <div className="h-12 border-b-2 dark:border-neutral-800 flex items-center px-4 shrink-0 bg-transparent">
          <span className="font-bold text-xs uppercase tracking-widest text-muted-foreground">
            Canvas & Export
          </span>
        </div>
        <div className="flex-1 min-h-0">
          <div className="p-5 h-full">
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
    </div>
  );
}
