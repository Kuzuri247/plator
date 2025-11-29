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

// New Interface for Image Layers
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
}

export interface TextElement {
  id: string;
  content: string;
  position: { x: number; y: number };
  style: TextStyle;
}

export interface LeftPanelProps {
  selectedTextElement: TextElement | undefined;
  selectedImageElement: ImageElement | undefined; // Changed from just 'userImageStyle'
  
  // Text State (Keep these or refactor to use selectedTextElement directly, keeping simple for now)
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
  
  // Handlers
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
  onAddText: () => void;
  
  onImageStyleChange: (updates: Partial<ImageStyle>) => void;
  onImageUpload: (file: File) => void;
}


export const ASPECT_RATIOS = [
  { name: "16:9", label: "YouTube / Video", width: 900, height: 506, previewClass: "aspect-video" },
  { name: "1:1", label: "Instagram Square", width: 600, height: 600, previewClass: "aspect-square" },
  { name: "4:5", label: "Instagram Portrait", width: 500, height: 625, previewClass: "aspect-[4/5]" },
  { name: "4:3", label: "Standard", width: 800, height: 600, previewClass: "aspect-[4/3]" },
  { name: "2:1", label: "Twitter Header", width: 800, height: 400, previewClass: "aspect-[2/1]" },
];

export const FONT_FAMILIES = [
  "Inter",
  "Manrope",
  "Arial",
  "Helvetica",
  "Impact",
  "Courier New",
];

export const FONT_WEIGHTS = [
  { value: "100", label: "Thin" },
  { value: "200", label: "Extra Light" },
  { value: "300", label: "Light" },
  { value: "400", label: "Regular" },
  { value: "500", label: "Medium" },
  { value: "600", label: "Semi Bold" },
  { value: "bold", label: "Bold" },
  { value: "800", label: "Extra Bold" },
];

export const CLIP_PATHS = [
  { name: "None", value: "none" },
  { name: "Circle", value: "circle(50% at 50% 50%)" },
  { name: "Ellipse", value: "ellipse(50% 50% at 50% 50%)" },
  { name: "Triangle", value: "polygon(50% 0%, 0% 100%, 100% 100%)" },
  { name: "Diamond", value: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)" },
  { name: "Pentagon", value: "polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)" },
];

export const SHADOW_PRESETS = [
  { name: "None", value: "none" },
  { name: "Small", value: "0 1px 2px 0 rgb(0 0 0 / 0.05)" },
  { name: "Medium", value: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -1px rgb(0 0 0 / 0.06)" },
  { name: "Large", value: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -2px rgb(0 0 0 / 0.05)" },
  { name: "X-Large", value: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 10px 10px -5px rgb(0 0 0 / 0.04)" },
  { name: "2X-Large", value: "0 25px 50px -12px rgb(0 0 0 / 0.25)" },
];

export const BACKGROUND_OPTIONS = [
  { name: "Dark", value: "#1a1a1a" },
  { name: "Light", value: "#ffffff" },
  { name: "Blue", value: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" },
  { name: "Sunset", value: "linear-gradient(135deg, #ff0844 0%, #ffb199 100%)" },
  { name: "Forest", value: "linear-gradient(135deg, #0ba360 0%, #3cba92 100%)" },
  { name: "Midnight", value: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)" },
  { name: "Neon", value: "linear-gradient(135deg, #00c6ff, #0072ff)" },
  { name: "Peach", value: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 99%, #fecfef 100%)" },
  { name: "Cosmic", value: "linear-gradient(135deg, #1a0033 0%, #330066 50%, #660099 100%)" },
  { name: "Aurora", value: "linear-gradient(135deg, #00ff88 0%, #00ccff 50%, #0088ff 100%)" },
  { name: "Lava", value: "linear-gradient(135deg, #ff6b00 0%, #ff0000 50%, #660000 100%)" },
  { name: "Ocean", value: "linear-gradient(135deg, #0066cc 0%, #0099ff 50%, #00ccff 100%)" },
];

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
}