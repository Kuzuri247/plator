import { useState, useCallback, RefObject } from "react";
import { ImageElement, TextElement } from "../types";

export function useSelection(
  canvasRef: RefObject<HTMLDivElement | null>,
  currentAspectRatio: { width: number },
  imageElements: ImageElement[],
  textElements: TextElement[],
  setImageElements: React.Dispatch<React.SetStateAction<ImageElement[]>>,
  setTextElements: React.Dispatch<React.SetStateAction<TextElement[]>>,
  setSelectedElementId: (id: string | null) => void,
) {
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [dragTarget, setDragTarget] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const getCanvasScale = useCallback(() => {
    if (!canvasRef.current) return 1;
    const rect = canvasRef.current.getBoundingClientRect();
    return rect.width / currentAspectRatio.width;
  }, [canvasRef, currentAspectRatio.width]);

  const handleElementPointerDown = useCallback(
    (e: React.PointerEvent, elementId: string) => {
      e.preventDefault();
      e.stopPropagation();

      const scale = getCanvasScale();

      const element =
        imageElements.find((el) => el.id === elementId) ||
        textElements.find((el) => el.id === elementId);

      if (!element || !canvasRef.current) return;

      const canvasRect = canvasRef.current.getBoundingClientRect();

      const clientX = e.clientX;
      const clientY = e.clientY;

      const mouseXInCanvas = (clientX - canvasRect.left) / scale;
      const mouseYInCanvas = (clientY - canvasRect.top) / scale;

      setDragOffset({
        x: mouseXInCanvas - element.position.x,
        y: mouseYInCanvas - element.position.y,
      });

      setDragTarget(elementId);
      setSelectedElementId(elementId);
      setIsDragging(true);

      // Important: Capture the pointer so we keep receiving events even if we drag fast/outside
      (e.target as Element).setPointerCapture(e.pointerId);
    },
    [
      getCanvasScale,
      imageElements,
      textElements,
      canvasRef,
      setSelectedElementId,
    ],
  );

  const handleCanvasPointerMove = (e: React.PointerEvent) => {
    if (!dragTarget || !canvasRef.current) return;
    e.preventDefault();

    const scale = getCanvasScale();
    const canvasRect = canvasRef.current.getBoundingClientRect();

    const clientX = e.clientX;
    const clientY = e.clientY;

    const mouseXInCanvas = (clientX - canvasRect.left) / scale;
    const mouseYInCanvas = (clientY - canvasRect.top) / scale;

    const newX = mouseXInCanvas - dragOffset.x;
    const newY = mouseYInCanvas - dragOffset.y;

    if (dragTarget.startsWith("img")) {
      setImageElements((prev) =>
        prev.map((el) =>
          el.id === dragTarget ? { ...el, position: { x: newX, y: newY } } : el,
        ),
      );
    } else {
      setTextElements((prev) =>
        prev.map((el) =>
          el.id === dragTarget ? { ...el, position: { x: newX, y: newY } } : el,
        ),
      );
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setDragTarget(null);
    setIsDragging(false);
    if (e.target instanceof Element && e.target.hasPointerCapture(e.pointerId)) {
      e.target.releasePointerCapture(e.pointerId);
    }
  };

  return {
    dragOffset,
    dragTarget,
    isDragging,
    handleElementPointerDown,
    handleCanvasPointerMove,
    handlePointerUp,
  };
}