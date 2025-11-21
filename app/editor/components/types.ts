export interface TextStyle {
    fontSize: number;
    fontFamily: string;
    fontWeight: string;
    color: string;
    textShadow: string;
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
];

export const FONT_WEIGHTS = [
    { value: "normal", label: "Normal" },
    { value: "bold", label: "Bold" },
    { value: "700", label: "Semi Bold" },
    { value: "900", label: "Black" },
];

export const SHADOW_PRESETS = [
    { name: "None", value: "none" },
    { name: "Light", value: "1px 1px 2px rgba(0,0,0,0.5)" },
    { name: "Medium", value: "2px 2px 4px rgba(0,0,0,0.8)" },
    { name: "Heavy", value: "3px 3px 6px rgba(0,0,0,0.9)" },
    { name: "Glow", value: "0 0 10px rgba(255,255,255,0.8)" },
];
