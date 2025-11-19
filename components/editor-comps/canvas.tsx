import { useState, useRef, useEffect } from 'react';
import { MemeElement,GridConfig } from '@/app/editor/page';

interface MemeCanvasProps {
  elements: MemeElement[];
  selectedElement: string | null;
  onElementSelect: (id: string | null) => void;
  onElementUpdate: (id: string, updates: Partial<MemeElement>) => void;
  onTextAdd: (text: string, position: { x: number; y: number }) => void;
  gridConfig: GridConfig;
  canvasSize: { width: number; height: number };
}

export function Canvas({
  elements,
  selectedElement,
  onElementSelect,
  onElementUpdate,
  onTextAdd,
  gridConfig,
  canvasSize,
}: MemeCanvasProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent, elementId: string) => {
    e.preventDefault();
    const element = elements.find((el) => el.id === elementId);
    if (!element) return;

    const rect = e.currentTarget.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    setIsDragging(true);
    onElementSelect(elementId);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !selectedElement || !canvasRef.current) return;

    const canvasRect = canvasRef.current.getBoundingClientRect();
    const newPosition = {
      x: e.clientX - canvasRect.left - dragOffset.x,
      y: e.clientY - canvasRect.top - dragOffset.y,
    };

    // Boundary checking
    newPosition.x = Math.max(
      0,
      Math.min(newPosition.x, canvasSize.width - 100)
    );
    newPosition.y = Math.max(
      0,
      Math.min(newPosition.y, canvasSize.height - 50)
    );

    onElementUpdate(selectedElement, { position: newPosition });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    if (!canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const position = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };

    onTextAdd('Double click to edit', position);
  };

  const renderGridLines = () => {
    const lines = [];
    const cellWidth = canvasSize.width / gridConfig.cols;
    const cellHeight = canvasSize.height / gridConfig.rows;

    // Vertical lines
    for (let i = 1; i < gridConfig.cols; i++) {
      lines.push(
        <div
          key={`v-${i}`}
          className="absolute bg-white/20"
          style={{
            left: i * cellWidth,
            top: 0,
            width: 1,
            height: canvasSize.height,
          }}
        />
      );
    }

    // Horizontal lines
    for (let i = 1; i < gridConfig.rows; i++) {
      lines.push(
        <div
          key={`h-${i}`}
          className="absolute bg-white/20"
          style={{
            left: 0,
            top: i * cellHeight,
            width: canvasSize.width,
            height: 1,
          }}
        />
      );
    }

    return lines;
  };

  useEffect(() => {
    const handleGlobalMouseUp = () => setIsDragging(false);
    document.addEventListener('mouseup', handleGlobalMouseUp);
    return () => document.removeEventListener('mouseup', handleGlobalMouseUp);
  }, []);

  return (
    <div className="w-full">
      <div
        ref={canvasRef}
        className="relative border-2 border-white/30 rounded-lg overflow-hidden bg-white mx-auto cursor-crosshair"
        style={{
          width: canvasSize.width,
          height: canvasSize.height,
          maxWidth: '100%',
        }}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onDoubleClick={handleDoubleClick}
        onClick={() => onElementSelect(null)}
      >
        {/* Grid Lines */}
        {renderGridLines()}

        {/* Elements */}
        {elements.map((element) => (
          <div
            key={element.id}
            className={`absolute cursor-move select-none ${
              selectedElement === element.id ? 'ring-2 ring-primary' : ''
            }`}
            style={{
              left: element.position.x,
              top: element.position.y,
              width: element.size.width,
              height: element.size.height,
            }}
            onMouseDown={(e) => handleMouseDown(e, element.id)}
            onClick={(e) => e.stopPropagation()}
          >
            {element.type === 'image' ? (
              <img
                src={element.content}
                alt="Meme element"
                className="w-full h-full object-cover rounded"
                draggable={false}
              />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center text-center leading-tight break-words"
                style={{
                  fontSize: element.style?.fontSize || 24,
                  fontFamily: element.style?.fontFamily || 'Arial',
                  fontWeight: element.style?.fontWeight || 'bold',
                  color: element.style?.color || '#ffffff',
                  textShadow:
                    element.style?.textShadow || '2px 2px 4px rgba(0,0,0,0.8)',
                  textAlign: element.style?.textAlign || 'center',
                }}
              >
                {element.content}
              </div>
            )}
          </div>
        ))}

        {/* Grid Cell Numbers (for reference) */}
        {Array.from(
          { length: gridConfig.rows * gridConfig.cols },
          (_, index) => {
            const row = Math.floor(index / gridConfig.cols);
            const col = index % gridConfig.cols;
            const cellWidth = canvasSize.width / gridConfig.cols;
            const cellHeight = canvasSize.height / gridConfig.rows;

            return (
              <div
                key={`cell-${index}`}
                className="absolute text-gray-400 text-sm pointer-events-none"
                style={{
                  left: col * cellWidth + 4,
                  top: row * cellHeight + 4,
                }}
              >
                {index + 1}
              </div>
            );
          }
        )}
      </div>
    </div>
  );
}
