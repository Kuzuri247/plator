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
  textEffect: string[]; 
}

export interface TextElement {
  id: string;
  content: string;
  position: { x: number; y: number };
  style: TextStyle;
}

export interface LeftPanelProps {
  selectedTextElement: TextElement | undefined;
  selectedImageElement: ImageElement | undefined;

  // Text State
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
  textEffect: string[]; // Changed to array

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
  onTextEffectChange: (value: string[]) => void; // Changed to array
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
  "Courier",
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

export const TEXT_EFFECTS = [
  { name: "Outline", value: "outline" },
  { name: "Underline", value: "underline" },
  { name: "Strikethrough", value: "line-through" },
  { name: "Italic", value: "italic" },
  { name: "Uppercase", value: "uppercase" },   // Added
  { name: "Small Caps", value: "small-caps" }, // Added
  { name: "Blur", value: "blur" },
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
  { name: "Small", value: "0 1px 2px 0 rgb(0 0 0 / 0.15)" },
  { name: "Medium", value: "0 4px 6px -1px rgb(0 0 0 / 0.3), 0 2px 4px -1px rgb(0 0 0 / 0.1)" },
  { name: "Large", value: "0 10px 15px -3px rgb(0 0 0 / 0.5), 0 4px 6px -2px rgb(0 0 0 / 0.08)" },
  { name: "Left", value: "-8px 0 15px -3px rgb(0 0 0 / 0.5), -4px 0 6px -2px rgb(0 0 0 / 0.08)" },
  { name: "Right", value: "8px 0 15px -3px rgb(0 0 0 / 0.5), 4px 0 6px -2px rgb(0 0 0 / 0.08)" },
  { name: "X-Large", value: "0 20px 25px -5px rgb(0 0 0 / 0.7), 0 10px 10px -5px rgb(0 0 0 / 0.06)" },
  { name: "Left Bottom", value: "-12px 12px 25px -5px rgb(0 0 0 / 0.7), -6px 6px 10px -5px rgb(0 0 0 / 0.06)" },
  { name: "Right Bottom", value: "12px 12px 25px -5px rgb(0 0 0 / 0.7), 6px 6px 10px -5px rgb(0 0 0 / 0.06)" },
  { name: "2X-Large", value: "0 50px 50px -12px rgb(0 0 0 / 0.9)" },
];


export const BACKGROUND_OPTIONS = [
  { name: "Dark", value: "#1a1a1a" },
  { name: "Light", value: "#ffffff" },
  { name: "Sunset", value: "linear-gradient(135deg, #ff0844 0%, #ffb199 100%)" },
  { name: "Forest", value: "linear-gradient(135deg, #0ba360 0%, #3cba92 100%)" },
  { name: "Midnight", value: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)" },
  { name: "Neon", value: "linear-gradient(135deg, #00c6ff, #0072ff)" },
  { name: "Peach", value: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 99%, #fecfef 100%)" },
  { name: "Cosmic", value: "linear-gradient(135deg, #1a0033 0%, #330066 50%, #660099 100%)" },
  { name: "Aurora", value: "linear-gradient(135deg, #00ff88 0%, #00ccff 50%, #0088ff 100%)" },
  { name: "Lava", value: "linear-gradient(135deg, #ff6b00 0%, #ff0000 50%, #660000 100%)" },
  { name: "Ocean", value: "linear-gradient(135deg, #0066cc 0%, #0099ff 50%, #00ccff 100%)" },
  { name: "Purple Haze", value: "linear-gradient(135deg, #360033 0%, #0b8793 100%)" },
  { name: "Miami", value: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)" },
  { name: "Fire", value: "linear-gradient(135deg, #f83600 0%, #f9d423 100%)" },
  { name: "Emerald", value: "linear-gradient(135deg, #348f50 0%, #56b4d3 100%)" },
  { name: "Rose", value: "linear-gradient(135deg, #ed4264 0%, #ffedbc 100%)" },
  { name: "Twilight", value: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)" },
  { name: "Ice", value: "linear-gradient(135deg, #c9ffbf 0%, #ffafbd 100%)" },
  { name: "Candy", value: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)" },
  { name: "Berry", value: "linear-gradient(135deg, #8e2de2 0%, #4a00e0 100%)" },
  { name: "Tropical", value: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)" },
  { name: "Cyber", value: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)" },
  { name: "Deep Ocean", value: "linear-gradient(135deg, #2e3192 0%, #1bffff 100%)" },
  { name: "Mint", value: "linear-gradient(135deg, #00b09b 0%, #96c93d 100%)" },
  { name: "Purple Dream", value: "linear-gradient(135deg, #c471f5 0%, #fa71cd 100%)" },
  { name: "Warm Flame", value: "linear-gradient(135deg, #ff9a56 0%, #ff6a88 100%)" },
  { name: "Royal", value: "linear-gradient(135deg, #141e30 0%, #243b55 100%)" },
  { name: "Citrus", value: "linear-gradient(135deg, #fdbb2d 0%, #22c1c3 100%)" },
];

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