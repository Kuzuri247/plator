"use client";

import { useState, useRef } from "react";
import { Canvas } from "./components/canvas";
import { TextStylePanel } from "./components/text-panel";
import { ActionsPanel } from "./components/action-panel";
import { Background } from "./components/background";
import { TextElement, CANVAS_SIZE } from "./components/types";

export default function EditorPage() {
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [backgroundImageSize, setBackgroundImageSize] = useState(70);
  const [textElements, setTextElements] = useState<TextElement[]>([]);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const canvasRef = useRef<HTMLDivElement>(null);

  // Current style state
  const [currentText, setCurrentText] = useState("Your Text Here");
  const [fontSize, setFontSize] = useState(32);
  const [fontFamily, setFontFamily] = useState("Inter");
  const [fontWeight, setFontWeight] = useState("bold");
  const [color, setColor] = useState("#ffffff");
  const [textShadow, setTextShadow] = useState("2px 2px 4px rgba(0,0,0,0.8)");

  // History - ONLY for text content and styles, NOT position
  const [history, setHistory] = useState<TextElement[][]>([[]]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const saveHistory = (state: TextElement[]) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(JSON.parse(JSON.stringify(state)));
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => setBackgroundImage(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const addTextElement = () => {
    const newElement: TextElement = {
      id: `text_${Date.now()}`,
      content: currentText || "New Text",
      position: { x: CANVAS_SIZE.width / 2 - 100, y: CANVAS_SIZE.height / 2 - 25 },
      style: { fontSize, fontFamily, fontWeight, color, textShadow },
    };
    const updated = [...textElements, newElement];
    setTextElements(updated);
    setSelectedElement(newElement.id);
    saveHistory(updated);
  };

  // Update position - NO HISTORY
  const updateElementPosition = (elementId: string, position: { x: number; y: number }) => {
    setTextElements((prev) =>
      prev.map((el) => (el.id === elementId ? { ...el, position } : el))
    );
  };

  // Update content/style - SAVE HISTORY
  const updateSelectedElement = (updates: Partial<TextElement>) => {
    if (!selectedElement) return;
    const updated = textElements.map((el) =>
      el.id === selectedElement ? { ...el, ...updates } : el
    );
    setTextElements(updated);
    saveHistory(updated);
  };

  const handleTextChange = (value: string) => {
    if (selectedElement) {
      updateSelectedElement({ content: value });
    } else {
      setCurrentText(value);
    }
  };

  const handleStyleChange = (property: keyof TextElement["style"], value: any) => {
    const selectedElementData = textElements.find((el) => el.id === selectedElement);
    if (selectedElementData) {
      updateSelectedElement({
        style: { ...selectedElementData.style, [property]: value },
      });
    } else {
      if (property === "fontSize") setFontSize(value);
      if (property === "fontFamily") setFontFamily(value);
      if (property === "fontWeight") setFontWeight(value);
      if (property === "color") setColor(value);
      if (property === "textShadow") setTextShadow(value);
    }
  };

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setTextElements(history[historyIndex - 1]);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setTextElements(history[historyIndex + 1]);
    }
  };

  const handleElementMouseDown = (e: React.MouseEvent, elementId: string) => {
    e.preventDefault();
    const element = textElements.find((el) => el.id === elementId);
    if (!element) return;

    const rect = e.currentTarget.getBoundingClientRect();
    setDragOffset({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    setIsDragging(true);
    setSelectedElement(elementId);
  };

  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !selectedElement || !canvasRef.current) return;

    const canvasRect = canvasRef.current.getBoundingClientRect();
    let newPosition = {
      x: e.clientX - canvasRect.left - dragOffset.x,
      y: e.clientY - canvasRect.top - dragOffset.y,
    };

    newPosition.x = Math.max(0, Math.min(newPosition.x, CANVAS_SIZE.width - 200));
    newPosition.y = Math.max(0, Math.min(newPosition.y, CANVAS_SIZE.height - 50));

    // Update position - NO HISTORY SAVED
    updateElementPosition(selectedElement, newPosition);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    // NO HISTORY SAVED ON MOUSE UP
  };

  const downloadImage = () => {
    if (!canvasRef.current) return;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = CANVAS_SIZE.width;
    canvas.height = CANVAS_SIZE.height;

    const drawText = () => {
      textElements.forEach((element) => {
        ctx.font = `${element.style.fontWeight} ${element.style.fontSize}px ${element.style.fontFamily}`;
        ctx.fillStyle = element.style.color;
        ctx.textBaseline = "top";

        if (element.style.textShadow !== "none") {
          ctx.shadowColor = "rgba(0,0,0,0.8)";
          ctx.shadowBlur = 4;
          ctx.shadowOffsetX = 2;
          ctx.shadowOffsetY = 2;
        }

        ctx.fillText(element.content, element.position.x, element.position.y);
        ctx.shadowColor = "transparent";
      });

      const link = document.createElement("a");
      link.download = "plater-export.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    };

    ctx.fillStyle = "#f0f0f0";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (backgroundImage) {
      const img = new Image();
      img.src = backgroundImage;
      img.onload = () => {
        const targetWidth = (canvas.width * backgroundImageSize) / 100;
        const scale = targetWidth / img.width;
        const scaledWidth = img.width * scale;
        const scaledHeight = img.height * scale;

        const x = (canvas.width - scaledWidth) / 2;
        const y = (canvas.height - scaledHeight) / 2;

        ctx.drawImage(img, x, y, scaledWidth, scaledHeight);
        drawText();
      };
    } else {
      drawText();
    }
  };

  const selectedElementData = textElements.find((el) => el.id === selectedElement);

  return (
    <div className="h-screen bg-background overflow-hidden">
      <div className="h-full px-4 py-6 overflow-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 max-w-[1600px] mx-auto">
          {/* Left Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <TextStylePanel
              selectedElement={selectedElementData}
              currentText={currentText}
              fontSize={fontSize}
              fontFamily={fontFamily}
              fontWeight={fontWeight}
              color={color}
              textShadow={textShadow}
              onTextChange={handleTextChange}
              onFontFamilyChange={(v) => handleStyleChange("fontFamily", v)}
              onFontSizeChange={(v) => handleStyleChange("fontSize", v)}
              onFontWeightChange={(v) => handleStyleChange("fontWeight", v)}
              onColorChange={(v) => handleStyleChange("color", v)}
              onTextShadowChange={(v) => handleStyleChange("textShadow", v)}
              onAddText={addTextElement}
            />
            <ActionsPanel onDownload={downloadImage} />
          </div>

          {/* Center - Canvas */}
          <div className="lg:col-span-2">
            <Canvas
              ref={canvasRef}
              backgroundImage={backgroundImage}
              backgroundImageSize={backgroundImageSize}
              textElements={textElements}
              selectedElement={selectedElement}
              onElementMouseDown={handleElementMouseDown}
              onMouseMove={handleCanvasMouseMove}
              onMouseUp={handleMouseUp}
              onUndo={undo}
              onRedo={redo}
              canUndo={historyIndex > 0}
              canRedo={historyIndex < history.length - 1}
            />
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1">
            <Background
              backgroundImage={backgroundImage}
              imageSize={backgroundImageSize}
              onImageUpload={handleImageUpload}
              onImageSizeChange={setBackgroundImageSize}
            />
          </div>
        </div>
      </div>
    </div>
  );
}