export interface TextStyle {
  fontSize: number;
  fontFamily: string;
  fontWeight: string;
  color: string;
  textShadow: string;
  borderRadius: number;
  backgroundColor: string;
  padding: number;
  showBackground: boolean; // Added toggle
}

export interface ImageStyle {
  scale: number;
  borderRadius: number;
  shadow: string;
  rotate: number;
}

export interface TextElement {
  id: string;
  content: string;
  position: { x: number; y: number };
  style: TextStyle;
}

export const CANVAS_SIZE = { width: 800, height: 600 };

export const FONT_FAMILIES = [
  "Inter",
  "Manrope",
  "Arial",
  "Helvetica",
  "Impact",
  "Courier New",
];

export const FONT_WEIGHTS = [
  { value: "normal", label: "Normal" },
  { value: "bold", label: "Bold" },
  { value: "800", label: "Extra Bold" },
];

export const SHADOW_PRESETS = [
  { name: "None", value: "none" },
  { name: "Soft", value: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)" },
  { name: "Medium", value: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" },
  { name: "Hard", value: "8px 8px 0px rgba(0,0,0,1)" },
  { name: "Float", value: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" },
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
];