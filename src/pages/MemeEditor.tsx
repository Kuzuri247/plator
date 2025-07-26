import { useState } from "react";
import { Header } from "@/components/header";
import { MemeCanvas } from "@/components/meme-editor/MemeCanvas";
import { ImageUploader } from "@/components/meme-editor/ImageUploader";
import { TextEditor } from "@/components/meme-editor/TextEditor";
import { GridControls } from "@/components/meme-editor/GridControls";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Download, Save, Undo, Redo } from "lucide-react";

export interface MemeElement {
  id: string;
  type: "image" | "text";
  content: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  style?: {
    fontSize?: number;
    fontFamily?: string;
    fontWeight?: string;
    color?: string;
    textShadow?: string;
    textAlign?: "left" | "center" | "right";
  };
}

export interface GridConfig {
  rows: number;
  cols: number;
  gap: number;
}

export default function MemeEditor() {
  const [elements, setElements] = useState<MemeElement[]>([]);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [gridConfig, setGridConfig] = useState<GridConfig>({
    rows: 2,
    cols: 2,
    gap: 8,
  });
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });

  const handleAddImage = (imageUrl: string, gridIndex: number) => {
    const newElement: MemeElement = {
      id: `img_${Date.now()}`,
      type: "image",
      content: imageUrl,
      position: getGridPosition(gridIndex),
      size: getGridSize(),
    };
    setElements([...elements, newElement]);
  };

  const handleAddText = (text: string, position: { x: number; y: number }) => {
    const newElement: MemeElement = {
      id: `text_${Date.now()}`,
      type: "text",
      content: text,
      position,
      size: { width: 200, height: 50 },
      style: {
        fontSize: 24,
        fontFamily: "Arial",
        fontWeight: "bold",
        color: "#ffffff",
        textShadow: "2px 2px 4px rgba(0,0,0,0.8)",
        textAlign: "center",
      },
    };
    setElements([...elements, newElement]);
    setSelectedElement(newElement.id);
  };

  const getGridPosition = (index: number) => {
    const cellWidth = canvasSize.width / gridConfig.cols;
    const cellHeight = canvasSize.height / gridConfig.rows;
    const row = Math.floor(index / gridConfig.cols);
    const col = index % gridConfig.cols;

    return {
      x: col * cellWidth + gridConfig.gap,
      y: row * cellHeight + gridConfig.gap,
    };
  };

  const getGridSize = () => {
    const cellWidth = canvasSize.width / gridConfig.cols - gridConfig.gap * 2;
    const cellHeight = canvasSize.height / gridConfig.rows - gridConfig.gap * 2;
    return { width: cellWidth, height: cellHeight };
  };

  const updateElement = (id: string, updates: Partial<MemeElement>) => {
    setElements(
      elements.map((el) => (el.id === id ? { ...el, ...updates } : el))
    );
  };

  const deleteElement = (id: string) => {
    setElements(elements.filter((el) => el.id !== id));
    if (selectedElement === id) {
      setSelectedElement(null);
    }
  };

  const downloadMeme = () => {
    // Implementation for downloading the meme
    console.log("Download meme functionality");
  };

  return (
    <div className="min-h-screen bg-gradient-primary">
      <Header />

      <div className="pt-20 px-4">
        <div className="container mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-white mb-2">
              Meme Template Maker
            </h1>
            <p className="text-white/80">
              Create stunning memes with customizable grids and text styling
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Left Sidebar - Controls */}
            <div className="lg:col-span-1 space-y-4">
              <Card className="p-4 bg-white/10 backdrop-blur-md border-white/20">
                <GridControls
                  config={gridConfig}
                  onChange={setGridConfig}
                  canvasSize={canvasSize}
                  onCanvasSizeChange={setCanvasSize}
                />
              </Card>

              <Card className="p-4 bg-white/10 backdrop-blur-md border-white/20">
                <h3 className="text-white font-semibold mb-4">Actions</h3>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="w-full border-white/30 text-white hover:bg-white/10"
                    >
                      <Undo className="w-2 h-4 mr-2" />
                      Undo
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full border-white/30 text-white hover:bg-white/10"
                    >
                      <Redo className="w-2 h-4 mr-2" />
                      Redo
                    </Button>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full border-white/30 text-white hover:bg-white/10"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Template
                  </Button>
                </div>
              </Card>

              {/* {selectedElement && (
                <Card className="p-4 bg-white/10 backdrop-blur-md border-white/20">
                  <TextEditor
                    element={elements.find((el) => el.id === selectedElement)}
                    onUpdate={(updates) =>
                      updateElement(selectedElement, updates)
                    }
                    onDelete={() => deleteElement(selectedElement)}
                  />
                </Card>
              )} */}
            </div>

            {/* Center - Canvas */}
            <div className="lg:col-span-2">
              <Card className="p-4 bg-white/5 backdrop-blur-md border-white/20">
                <MemeCanvas
                  elements={elements}
                  selectedElement={selectedElement}
                  onElementSelect={setSelectedElement}
                  onElementUpdate={updateElement}
                  onTextAdd={handleAddText}
                  gridConfig={gridConfig}
                  canvasSize={canvasSize}
                />
              </Card>
            </div>

            {/* Right Sidebar - Actions */}
            <div className="lg:col-span-1 space-y-4">
              <Card className="p-4 bg-white/10 backdrop-blur-md border-white/20">
                <ImageUploader
                  onImageAdd={handleAddImage}
                  gridConfig={gridConfig}
                />
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
