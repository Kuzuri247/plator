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

export interface ImageStyle {
  scale: number;
  borderRadius: number;
  shadow: string;
  rotate: number;
  blur: number;
  opacity: number;
  noise: number;
}

export interface TextElement {
  id: string;
  content: string;
  position: { x: number; y: number };
  style: TextStyle;
}

export const ASPECT_RATIOS = [
  { name: "16:9", label: "YouTube / Video", width: 900, height: 506, previewClass: "aspect-video" },
  { name: "9:16", label: "TikTok / Story", width: 400, height: 711, previewClass: "aspect-[9/16]" },
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
  { value: "normal", label: "Normal" },
  { value: "100", label: "Thin" },
  { value: "200", label: "Extra Light" },
  { value: "300", label: "Light" },
  { value: "400", label: "Regular" },
  { value: "500", label: "Medium" },
  { value: "600", label: "Semi Bold" },
  { value: "bold", label: "Bold" },
  { value: "800", label: "Extra Bold" },
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
];