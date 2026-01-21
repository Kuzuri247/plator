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
  type: "image";
  name: string;
  src: string;
  position: { x: number; y: number };
  style: ImageStyle;
  isVisible: boolean;
  isLocked: boolean;
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
  backgroundShadow: string;
  textEffect: string[];
  rotate: number;
  rotateX: number;
  rotateY: number;
}

export interface TextElement {
  id: string;
  type: "text";
  name: string;
  content: string;
  position: { x: number; y: number };
  style: TextStyle;
  isVisible: boolean;
  isLocked: boolean;
}

export type CanvasElement = ImageElement | TextElement;

export interface EditorCanvasProps {
  width: number;
  height: number;
  canvasBackground: string;
  elements: CanvasElement[];
  selectedElementId: string | null;
  isDragging: boolean;
  isCropping: boolean;
  onElementMouseDown: (e: React.PointerEvent, elementId: string) => void;
  onEmptyClick: () => void;
  onMouseMove: (e: React.PointerEvent) => void;
  onMouseUp: (e: React.PointerEvent) => void;
  onCropChange: (id: string, newCrop: any) => void;
}

export interface LeftPanelProps {
  isCropping: boolean;
  onToggleCropping: () => void;
  onImageUpload: (file: File) => void;
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
  elements: CanvasElement[];
  canvasBackground: string;
}

export interface RightPanelProps {
  onDownload: () => void;
  onPreview: () => void;
}
