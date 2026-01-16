export interface ImageStyle {
  scale: number;
  borderRadius: number;
  shadow: string;
  blur: number;
  opacity: number;
  noise: number;
  rotate: number;
  rotateX: number;
  rotateY: number;
  clipPath: string;
  flipX: boolean;
  flipY: boolean;
  crop: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
}

export const DEFAULT_IMAGE_STYLE: ImageStyle = {
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

export interface ImageElement {
  id: string;
  src: string;
  position: { x: number; y: number };
  style: ImageStyle;
}

export interface TextStyle {
  fontSize: number;
  fontFamily: string;
  fontWeight: string;
  color: string;
  textShadow: string;
  borderRadius: number;
  backgroundColor: string;
  padding: number;
  showBackground: boolean;
  textEffect: string[];
  rotate: number;
  rotateX: number;
  rotateY: number;
}

export interface TextElement {
  id: string;
  content: string;
  position: { x: number; y: number };
  style: TextStyle;
}

export interface EditorCanvasProps {
  width: number;
  height: number;
  canvasBackground: string;
  imageElements: ImageElement[];
  textElements: TextElement[];
  selectedElement: string | null;
  isDragging: boolean;
  isCropping: boolean;
  onElementMouseDown: (e: React.PointerEvent, elementId: string) => void;
  onEmptyClick: () => void;
  onMouseMove: (e: React.PointerEvent) => void;
  onMouseUp: (e: React.PointerEvent) => void;
  onCropChange: (id: string, newCrop: any) => void;
}

export interface LeftPanelProps {
  selectedTextElement: TextElement | undefined;
  selectedImageElement: ImageElement | undefined;
  currentText: string;
  fontSize: number;
  fontFamily: string;
  fontWeight: string;
  color: string;
  textShadow: string;
  textBorderRadius: number;
  textBackgroundColor: string;
  textPadding: number;
  showTextBackground: boolean;
  textEffect: string[];
  isCropping: boolean;
  onTextChange: (value: string) => void;
  onFontFamilyChange: (value: string) => void;
  onFontSizeChange: (value: number) => void;
  onFontWeightChange: (value: string) => void;
  onColorChange: (value: string) => void;
  onTextShadowChange: (value: string) => void;
  onTextBorderRadiusChange: (value: number) => void;
  onTextBackgroundColorChange: (value: string) => void;
  onTextPaddingChange: (value: number) => void;
  onShowTextBackgroundChange: (value: boolean) => void;
  onTextEffectChange: (value: string[]) => void;
  onAddText: () => void;
  onImageStyleChange: (updates: Partial<ImageStyle>) => void;
  onImageUpload: (file: File) => void;
  onToggleCropping: () => void;
  onTextStyleChange: (updates: Partial<TextStyle>) => void;
}

export interface Wallpaper {
  fileId: string;
  name: string;
  url: string;
  thumbnailUrl: string;
}

export interface Meme {
  fileId: string;
  name: string;
  url: string;
  thumbnailUrl: string;
}

export interface MemesOptions {
  limit?: number;
  enableCache?: boolean;
  cacheTime?: number;
}

export interface GradientColor {
  color: string;
  position: { x: number; y: number };
}

export interface HistoryState {
  textElements: Omit<TextElement, "position">[];
  imageElements: Omit<ImageElement, "position">[];
  canvasBackground: string;
}

export interface RightPanelProps {
  canvasBackground: string;
  aspectRatio: string;
  exportFormat: string;
  exportQuality: string;
  onCanvasBackgroundChange: (value: string) => void;
  onAspectRatioChange: (value: string) => void;
  onExportFormatChange: (value: string) => void;
  onExportQualityChange: (value: string) => void;
  onDownload: () => void;
  onPreview: () => void;
}