import { useState, useRef, useCallback } from "react";
import { ImageElement, TextElement, ImageStyle, ASPECT_RATIOS, DEFAULT_IMAGE_STYLE } from "../types";
import { toast } from "sonner";

interface HistoryState {
  textElements: Omit<TextElement, "position">[];
  imageElements: Omit<ImageElement, "position">[];
  canvasBackground: string;
}

export function useEditorState() {
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
  const [textEffect, setTextEffect] = useState("None");

  const [history, setHistory] = useState<HistoryState[]>([
    {
      textElements: [],
      imageElements: [],
      canvasBackground: "",
    },
  ]);
  const [historyIndex, setHistoryIndex] = useState(0);

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
        textEffect,
      },
    };
    setTextElements((prev) => [...prev, newElement]);
    setSelectedElementId(newElement.id);
    saveHistoryImmediate();
  };

  const handleTextEffect = (val: string) =>
    selectedElementId?.startsWith("text")
      ? updateSelectedText({ textEffect: val })
      : setTextEffect(val);

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

        const canvasW = currentAspectRatio.width;
        const canvasH = currentAspectRatio.height;
        const imgW = img.naturalWidth;
        const imgH = img.naturalHeight;

        const scaleX = canvasW / imgW;
        const scaleY = canvasH / imgH;
        const scale = Math.min(scaleX, scaleY, 1) * 90;

        const x = (canvasW - imgW) / 2;
        const y = (canvasH - imgH) / 2;

        const newImage: ImageElement = {
          id,
          src: result,
          position: { x, y },
          style: { ...DEFAULT_IMAGE_STYLE, scale: Math.round(scale) },
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

  return {
    aspectRatioName,
    setAspectRatioName,
    currentAspectRatio,
    canvasBackground,
    imageElements,
    setImageElements,
    textElements,
    setTextElements,
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
    textEffect,
    handleTextEffect,
    textPadding,
    showTextBackground,
    history,
    historyIndex,
    resetCanvas,
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
  };
}