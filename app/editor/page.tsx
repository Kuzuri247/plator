"use client";

import { useState, useRef } from "react";
import { Canvas } from "./components/canvas";
import { LeftPanel } from "./components/left-panel";
import { RightPanel } from "./components/right-panel";
import { TextElement, CANVAS_SIZE, ImageStyle } from "./components/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface HistoryState {
  textElements: TextElement[];
  canvasBackground: string;
  userImage: string | null;
  userImageStyle: ImageStyle;
}

export default function EditorPage() {
  // Canvas State
  const [canvasBackground, setCanvasBackground] = useState("linear-gradient(135deg, #667eea 0%, #764ba2 100%)");
  
  // User Image State
  const [userImage, setUserImage] = useState<string | null>(null);
  const [userImageStyle, setUserImageStyle] = useState<ImageStyle>({
    scale: 90,
    borderRadius: 12,
    shadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    rotate: 0,
  });

  // Text State
  const [textElements, setTextElements] = useState<TextElement[]>([]);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  
  // Default Text Styles
  const [currentText, setCurrentText] = useState("Click to Edit");
  const [fontSize, setFontSize] = useState(48);
  const [fontFamily, setFontFamily] = useState("Inter");
  const [fontWeight, setFontWeight] = useState("800");
  const [color, setColor] = useState("#ffffff");
  const [textShadow, setTextShadow] = useState("0 4px 6px rgba(0,0,0,0.1)");
  const [textBorderRadius, setTextBorderRadius] = useState(12);
  const [textBackgroundColor, setTextBackgroundColor] = useState("#000000");
  const [textPadding, setTextPadding] = useState(24);
  const [showTextBackground, setShowTextBackground] = useState(true);

  // Interaction State
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  // History
  const [history, setHistory] = useState<HistoryState[]>([
    { 
      textElements: [], 
      canvasBackground: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      userImage: null,
      userImageStyle: { scale: 80, borderRadius: 12, shadow: "none", rotate: 0 }
    },
  ]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const saveHistory = (newElements: TextElement[]) => {
    // Implementation simplified for brevity - ideally deep copy everything
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push({
      textElements: JSON.parse(JSON.stringify(newElements)),
      canvasBackground,
      userImage,
      userImageStyle: {...userImageStyle},
    });
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  // Handlers
  const addTextElement = () => {
    const newElement: TextElement = {
      id: `text_${Date.now()}`,
      content: "Double Click to Edit",
      position: { x: CANVAS_SIZE.width / 2 - 150, y: CANVAS_SIZE.height / 2 },
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
    const updated = [...textElements, newElement];
    setTextElements(updated);
    setSelectedElement(newElement.id);
    saveHistory(updated);
  };

  const updateSelectedText = (updates: Partial<TextElement["style"]> | { content: string }) => {
    if (!selectedElement) return;
    const updated = textElements.map(el => {
      if (el.id === selectedElement) {
        if ('content' in updates) return { ...el, content: updates.content! };
        return { ...el, style: { ...el.style, ...updates } };
      }
      return el;
    });
    setTextElements(updated);
  };

  // Text Handlers
  const handleTextChange = (val: string) => selectedElement ? updateSelectedText({ content: val }) : setCurrentText(val);
  const handleFontSize = (val: number) => selectedElement ? updateSelectedText({ fontSize: val }) : setFontSize(val);
  const handleFontFamily = (val: string) => selectedElement ? updateSelectedText({ fontFamily: val }) : setFontFamily(val);
  const handleFontWeight = (val: string) => selectedElement ? updateSelectedText({ fontWeight: val }) : setFontWeight(val);
  const handleColor = (val: string) => selectedElement ? updateSelectedText({ color: val }) : setColor(val);
  const handleShadow = (val: string) => selectedElement ? updateSelectedText({ textShadow: val }) : setTextShadow(val);
  const handleTextRadius = (val: number) => selectedElement ? updateSelectedText({ borderRadius: val }) : setTextBorderRadius(val);
  const handleTextBgColor = (val: string) => selectedElement ? updateSelectedText({ backgroundColor: val }) : setTextBackgroundColor(val);
  const handleTextPadding = (val: number) => selectedElement ? updateSelectedText({ padding: val }) : setTextPadding(val);
  const handleShowTextBg = (val: boolean) => selectedElement ? updateSelectedText({ showBackground: val }) : setShowTextBackground(val);

  // Image Handlers
  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => setUserImage(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleImageStyleChange = (updates: Partial<ImageStyle>) => {
    setUserImageStyle(prev => ({ ...prev, ...updates }));
  };

  // Canvas Interaction
  const handleElementMouseDown = (e: React.MouseEvent, elementId: string) => {
    e.preventDefault();
    e.stopPropagation();
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
    const x = e.clientX - canvasRect.left - dragOffset.x;
    const y = e.clientY - canvasRect.top - dragOffset.y;
    setTextElements(prev => prev.map(el => el.id === selectedElement ? { ...el, position: { x, y } } : el));
  };

  const handleMouseUp = () => setIsDragging(false);

  // Undo/Redo (simplified)
  const undo = () => {}; 
  const redo = () => {}; 

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      {/* Left Panel - Tools */}
      <div className="w-80 shrink-0 border-r bg-card flex flex-col z-20 shadow-xl h-full">
        <div className="p-3 border-b flex items-center gap-2">
          <Link href="/">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
              <ArrowLeft size={16} />
            </Button>
          </Link>
          <span className="font-semibold text-sm">Editor</span>
        </div>
        
        <ScrollArea className="flex-1">
          <div className="p-5">
            <LeftPanel
              selectedElement={textElements.find(el => el.id === selectedElement)}
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
          </div>
        </ScrollArea>
      </div>

      {/* Center - Canvas Workspace */}
      <div className="flex-1 relative bg-muted/20 flex flex-col min-w-0 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none"
             style={{ backgroundImage: "radial-gradient(#000000 1px, transparent 1px)", backgroundSize: "20px 20px" }}
        />
        
        <div className="flex-1 flex items-center justify-center p-8 overflow-hidden z-10">
           <div className="scale-[0.65] md:scale-[0.75] lg:scale-[0.85] transition-transform">
              <Canvas
                ref={canvasRef}
                canvasBackground={canvasBackground}
                userImage={userImage}
                userImageStyle={userImageStyle}
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
        </div>
      </div>

      {/* Right Panel - Global Settings */}
      <div className="w-80 shrink-0 border-l bg-card flex flex-col z-20 shadow-xl h-full">
        <div className="h-12 border-b flex items-center px-4 shrink-0 bg-card">
           <span className="font-bold text-xs uppercase tracking-widest text-muted-foreground">Canvas & Export</span>
        </div>
        <div className="flex-1 p-5">
          <RightPanel 
            canvasBackground={canvasBackground}
            onCanvasBackgroundChange={setCanvasBackground}
            onDownload={() => alert("Download")}
          />
        </div>
      </div>
    </div>
  );
}