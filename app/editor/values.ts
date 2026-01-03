

export const ASPECT_RATIOS = [
  {
    name: "16:9",
    label: "Video",
    width: 900,
    height: 506,
    previewClass: "aspect-video",
  },
  {
    name: "1:1",
    label: "Square",
    width: 600,
    height: 600,
    previewClass: "aspect-square",
  },
  {
    name: "4:5",
    label: "Portrait",
    width: 500,
    height: 625,
    previewClass: "aspect-[4/5]",
  },
  {
    name: "4:3",
    label: "Standard",
    width: 800,
    height: 600,
    previewClass: "aspect-[4/3]",
  },
  {
    name: "2:1",
    label: "Header",
    width: 800,
    height: 400,
    previewClass: "aspect-[2/1]",
  },
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
  { name: "Uppercase", value: "uppercase" },
  { name: "Small Caps", value: "small-caps" },
  { name: "Blur", value: "blur" },
];

export const CLIP_PATHS = [
  { name: "None", value: "none" },
  { name: "Circle", value: "circle(50% at 50% 50%)" },
  { name: "Ellipse", value: "ellipse(50% 50% at 50% 50%)" },
  { name: "Triangle", value: "polygon(50% 0%, 0% 100%, 100% 100%)" },
  { name: "Diamond", value: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)" },
  {
    name: "Pentagon",
    value: "polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)",
  },
];

export const SHADOW_PRESETS = [
  { name: "None", value: "none" },
  { name: "Small", value: "0 1px 2px 0 rgb(0 0 0 / 0.15)" },
  {
    name: "Medium",
    value: "0 4px 6px -1px rgb(0 0 0 / 0.3), 0 2px 4px -1px rgb(0 0 0 / 0.1)",
  },
  {
    name: "Large",
    value:
      "0 10px 15px -3px rgb(0 0 0 / 0.5), 0 4px 6px -2px rgb(0 0 0 / 0.08)",
  },
  {
    name: "Left",
    value:
      "-8px 0 15px -3px rgb(0 0 0 / 0.5), -4px 0 6px -2px rgb(0 0 0 / 0.08)",
  },
  {
    name: "Right",
    value: "8px 0 15px -3px rgb(0 0 0 / 0.5), 4px 0 6px -2px rgb(0 0 0 / 0.08)",
  },
  {
    name: "X-Large",
    value:
      "0 20px 25px -5px rgb(0 0 0 / 0.7), 0 10px 10px -5px rgb(0 0 0 / 0.06)",
  },
  {
    name: "Left Bottom",
    value:
      "-12px 12px 25px -5px rgb(0 0 0 / 0.7), -6px 6px 10px -5px rgb(0 0 0 / 0.06)",
  },
  {
    name: "Right Bottom",
    value:
      "12px 12px 25px -5px rgb(0 0 0 / 0.7), 6px 6px 10px -5px rgb(0 0 0 / 0.06)",
  },
  { name: "2X-Large", value: "0 50px 50px -12px rgb(0 0 0 / 0.9)" },
];

export const COLOR_PALETTES = {
  sunset: ["#FF6B6B", "#FF8E53", "#FEE440", "#F72585", "#B5179E"],
  ocean: ["#0077B6", "#00B4D8", "#90E0EF", "#CAF0F8", "#023E8A"],
  forest: ["#2D6A4F", "#40916C", "#52B788", "#74C69D", "#95D5B2"],
  purple: ["#7209B7", "#9D4EDD", "#C77DFF", "#E0AAFF", "#F72585"],
  fire: ["#FF0000", "#FF6B35", "#F7931E", "#FDC500", "#FFFF3F"],
  candy: ["#FF006E", "#FB5607", "#FFBE0B", "#8338EC", "#3A86FF"],
  neon: ["#FF006E", "#FFBE0B", "#06FFA5", "#3A86FF", "#8338EC"],
  pastel: ["#FFD6E8", "#FFADD2", "#FFC6FF", "#E7C6FF", "#C8B6FF"],
  monochrome: ["#1a1a1a", "#2d2d2d", "#404040", "#595959", "#737373"],
  warm: ["#FF9E00", "#FF6B35", "#F7931E", "#FDC500", "#FFBE0B"],
  cool: ["#4361EE", "#3F37C9", "#4895EF", "#4CC9F0", "#7209B7"],
  earth: ["#606C38", "#283618", "#BC6C25", "#DDA15E", "#FEFAE0"],
  midnight: ["#0a0e27", "#1a1b41", "#240046", "#3c096c", "#10002b"],
  deepSpace: ["#020202", "#090909", "#0d0d0d", "#1a1a2e", "#16213e"],
  darkForest: ["#0b1d0e", "#1a2f1e", "#1e3a2a", "#234f3a", "#2d5f4a"],
  darkOcean: ["#001219", "#005f73", "#0a1628", "#001d3d", "#003566"],
  vampireBlack: ["#090909", "#131313", "#1a1a1a", "#202020", "#2b2b2b"],
  gothicPurple: ["#1a0033", "#2d004d", "#4a0080", "#6600cc", "#33006f"],
  bloodMoon: ["#1a0000", "#330000", "#4d0000", "#660000", "#800000"],
  deepTeal: ["#002b36", "#073642", "#0f4c5c", "#1b6378", "#2a7a8f"],
};

export const PRESET_GRADIENTS = [
  {
    name: "Ocean",
    value:
      "radial-gradient(at 0% 0%, #0077b6 0px, transparent 70%), radial-gradient(at 100% 0%, #00b4d8 0px, transparent 70%), radial-gradient(at 100% 100%, #90e0ef 0px, transparent 70%), radial-gradient(at 0% 100%, #023e8a 0px, transparent 70%)",
  },
  {
    name: "Forest",
    value:
      "radial-gradient(at 0% 0%, #2d6a4f 0px, transparent 70%), radial-gradient(at 100% 0%, #40916c 0px, transparent 70%), radial-gradient(at 100% 100%, #74c69d 0px, transparent 70%), radial-gradient(at 0% 100%, #52b788 0px, transparent 70%)",
  },
  {
    name: "Purple Dream",
    value:
      "radial-gradient(at 0% 0%, #7209b7 0px, transparent 70%), radial-gradient(at 100% 0%, #9d4edd 0px, transparent 70%), radial-gradient(at 100% 100%, #e0aaff 0px, transparent 70%), radial-gradient(at 0% 100%, #c77dff 0px, transparent 70%)",
  },
  {
    name: "Fire",
    value:
      "radial-gradient(at 0% 0%, #ff0000 0px, transparent 70%), radial-gradient(at 100% 0%, #ff6b35 0px, transparent 70%), radial-gradient(at 100% 100%, #fdc500 0px, transparent 70%), radial-gradient(at 0% 100%, #f7931e 0px, transparent 70%)",
  },
  {
    name: "Candy",
    value:
      "radial-gradient(at 0% 0%, #ff006e 0px, transparent 70%), radial-gradient(at 100% 0%, #fb5607 0px, transparent 70%), radial-gradient(at 100% 100%, #ffbe0b 0px, transparent 70%), radial-gradient(at 0% 100%, #8338ec 0px, transparent 70%)",
  },
  {
    name: "Neon",
    value:
      "radial-gradient(at 0% 0%, #ff006e 0px, transparent 70%), radial-gradient(at 100% 0%, #06ffa5 0px, transparent 70%), radial-gradient(at 100% 100%, #3a86ff 0px, transparent 70%), radial-gradient(at 0% 100%, #ffbe0b 0px, transparent 70%)",
  },
  {
    name: "Mint Fresh",
    value:
      "radial-gradient(at 0% 0%, #06ffa5 0px, transparent 70%), radial-gradient(at 100% 0%, #4cc9f0 0px, transparent 70%), radial-gradient(at 100% 100%, #90e0ef 0px, transparent 70%), radial-gradient(at 0% 100%, #52b788 0px, transparent 70%)",
  },
  {
    name: "Rose Gold",
    value:
      "radial-gradient(at 0% 0%, #ff006e 0px, transparent 70%), radial-gradient(at 100% 0%, #ffbe0b 0px, transparent 70%), radial-gradient(at 100% 100%, #ffd6e8 0px, transparent 70%), radial-gradient(at 0% 100%, #ffc6ff 0px, transparent 70%)",
  },
  {
    name: "Midnight",
    value:
      "radial-gradient(at 0% 0%, #1a1a2e 0px, transparent 70%), radial-gradient(at 100% 0%, #16213e 0px, transparent 70%), radial-gradient(at 100% 100%, #0f3460 0px, transparent 70%), radial-gradient(at 0% 100%, #533483 0px, transparent 70%)",
  },
  {
    name: "Tropical",
    value:
      "radial-gradient(at 0% 0%, #06ffa5 0px, transparent 70%), radial-gradient(at 100% 0%, #ffbe0b 0px, transparent 70%), radial-gradient(at 100% 100%, #ff006e 0px, transparent 70%), radial-gradient(at 0% 100%, #3a86ff 0px, transparent 70%)",
  },
  {
    name: "Lavender",
    value:
      "radial-gradient(at 0% 0%, #9d4edd 0px, transparent 70%), radial-gradient(at 100% 0%, #c77dff 0px, transparent 70%), radial-gradient(at 100% 100%, #e0aaff 0px, transparent 70%), radial-gradient(at 0% 100%, #7209b7 0px, transparent 70%)",
  },
  {
    name: "Coral Reef",
    value:
      "radial-gradient(at 0% 0%, #ff6b6b 0px, transparent 70%), radial-gradient(at 100% 0%, #4ecdc4 0px, transparent 70%), radial-gradient(at 100% 100%, #ffe66d 0px, transparent 70%), radial-gradient(at 0% 100%, #ff006e 0px, transparent 70%)",
  },
  {
    name: "Peachy",
    value:
      "radial-gradient(at 0% 0%, #ffadad 0px, transparent 70%), radial-gradient(at 100% 0%, #ffd6a5 0px, transparent 70%), radial-gradient(at 100% 100%, #fdffb6 0px, transparent 70%), radial-gradient(at 0% 100%, #caffbf 0px, transparent 70%)",
  },
  {
    name: "Midnight Blue",
    value:
      "radial-gradient(at 0% 0%, #0a0e27 0px, transparent 70%), radial-gradient(at 100% 0%, #1a1b41 0px, transparent 70%), radial-gradient(at 100% 100%, #3c096c 0px, transparent 70%), radial-gradient(at 0% 100%, #240046 0px, transparent 70%)",
  },
  {
    name: "Deep Space",
    value:
      "radial-gradient(at 0% 0%, #020202 0px, transparent 70%), radial-gradient(at 100% 0%, #0d0d0d 0px, transparent 70%), radial-gradient(at 100% 100%, #1a1a2e 0px, transparent 70%), radial-gradient(at 0% 100%, #16213e 0px, transparent 70%)",
  },
  {
    name: "Gothic Purple",
    value:
      "radial-gradient(at 0% 0%, #1a0033 0px, transparent 70%), radial-gradient(at 100% 0%, #2d004d 0px, transparent 70%), radial-gradient(at 100% 100%, #6600cc 0px, transparent 70%), radial-gradient(at 0% 100%, #4a0080 0px, transparent 70%)",
  },
  {
    name: "Blood Moon",
    value:
      "radial-gradient(at 0% 0%, #1a0000 0px, transparent 70%), radial-gradient(at 100% 0%, #330000 0px, transparent 70%), radial-gradient(at 100% 100%, #660000 0px, transparent 70%), radial-gradient(at 0% 100%, #4d0000 0px, transparent 70%)",
  },
  {
    name: "Dark Forest",
    value:
      "radial-gradient(at 0% 0%, #0b1d0e 0px, transparent 70%), radial-gradient(at 100% 0%, #1a2f1e 0px, transparent 70%), radial-gradient(at 100% 100%, #234f3a 0px, transparent 70%), radial-gradient(at 0% 100%, #1e3a2a 0px, transparent 70%)",
  },
  {
    name: "Dark Ocean",
    value:
      "radial-gradient(at 0% 0%, #001219 0px, transparent 70%), radial-gradient(at 100% 0%, #0a1628 0px, transparent 70%), radial-gradient(at 100% 100%, #003566 0px, transparent 70%), radial-gradient(at 0% 100%, #001d3d 0px, transparent 70%)",
  },
  {
    name: "Vampire Night",
    value:
      "radial-gradient(at 0% 0%, #090909 0px, transparent 70%), radial-gradient(at 100% 0%, #131313 0px, transparent 70%), radial-gradient(at 100% 100%, #202020 0px, transparent 70%), radial-gradient(at 0% 100%, #1a1a1a 0px, transparent 70%)",
  },
  {
    name: "Deep Teal",
    value:
      "radial-gradient(at 0% 0%, #002b36 0px, transparent 70%), radial-gradient(at 100% 0%, #073642 0px, transparent 70%), radial-gradient(at 100% 100%, #1b6378 0px, transparent 70%), radial-gradient(at 0% 100%, #0f4c5c 0px, transparent 70%)",
  },
  {
    name: "Shadow Realm",
    value:
      "radial-gradient(at 0% 0%, #0f0c29 0px, transparent 70%), radial-gradient(at 100% 0%, #302b63 0px, transparent 70%), radial-gradient(at 100% 100%, #24243e 0px, transparent 70%), radial-gradient(at 0% 100%, #1a1a2e 0px, transparent 70%)",
  },
  {
    name: "Dark Matter",
    value:
      "radial-gradient(at 0% 0%, #10002b 0px, transparent 70%), radial-gradient(at 100% 0%, #240046 0px, transparent 70%), radial-gradient(at 100% 100%, #3c096c 0px, transparent 70%), radial-gradient(at 0% 100%, #5a189a 0px, transparent 70%)",
  },
  {
    name: "Obsidian",
    value:
      "radial-gradient(at 0% 0%, #000000 0px, transparent 70%), radial-gradient(at 100% 0%, #0d0d0d 0px, transparent 70%), radial-gradient(at 100% 100%, #1a1a1a 0px, transparent 70%), radial-gradient(at 0% 100%, #262626 0px, transparent 70%)",
  },
  {
    name: "Abyss",
    value:
      "radial-gradient(at 0% 0%, #001219 0px, transparent 70%), radial-gradient(at 100% 0%, #005f73 0px, transparent 70%), radial-gradient(at 100% 100%, #0a1628 0px, transparent 70%), radial-gradient(at 0% 100%, #003566 0px, transparent 70%)",
  },
];