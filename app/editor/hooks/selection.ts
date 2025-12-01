import { useState, useCallback, RefObject } from "react";
import { ImageElement, TextElement } from "../types";

export function useSelection(
  canvasRef: RefObject<HTMLDivElement | null>,
  currentAspectRatio: { width: number },
  imageElements: ImageElement[],
  textElements: TextElement[],
  setImageElements: React.Dispatch<React.SetStateAction<ImageElement[]>>,
  setTextElements: React.Dispatch<React.SetStateAction<TextElement[]>>,
  setSelectedElementId: (id: string | null) => void
) {
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [dragTarget, setDragTarget] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const getCanvasScale = useCallback(() => {
    if (!canvasRef.current) return 1;
    const rect = canvasRef.current.getBoundingClientRect();
    return rect.width / currentAspectRatio.width;
  }, [canvasRef, currentAspectRatio.width]);

  const handleElementMouseDown = useCallback(
    (e: React.MouseEvent, elementId: string) => {
      e.preventDefault();
      e.stopPropagation();

      const scale = getCanvasScale();

      const element =
        imageElements.find((el) => el.id === elementId) ||
        textElements.find((el) => el.id === elementId);

      if (!element || !canvasRef.current) return;

      const canvasRect = canvasRef.current.getBoundingClientRect();

      const mouseXInCanvas = (e.clientX - canvasRect.left) / scale;
      const mouseYInCanvas = (e.clientY - canvasRect.top) / scale;

      setDragOffset({
        x: mouseXInCanvas - element.position.x,
        y: mouseYInCanvas - element.position.y,
      });

      setDragTarget(elementId);
      setSelectedElementId(elementId);
      setIsDragging(true);
    },
    [getCanvasScale, imageElements, textElements, canvasRef, setSelectedElementId]
  );

  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    if (!dragTarget || !canvasRef.current) return;

    const scale = getCanvasScale();
    const canvasRect = canvasRef.current.getBoundingClientRect();

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

  const handleMouseUp = () => {
    setDragTarget(null);
    setIsDragging(false);
  };

  return {
    dragOffset,
    dragTarget,
    isDragging,
    handleElementMouseDown,
    handleCanvasMouseMove,
    handleMouseUp,
  };
}