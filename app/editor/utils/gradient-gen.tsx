import { COLOR_PALETTES } from "../types";

export function generateRandomGradient(): string {
  const paletteNames = Object.keys(COLOR_PALETTES) as Array<
    keyof typeof COLOR_PALETTES
  >;

  const randomPalette =
    paletteNames[Math.floor(Math.random() * paletteNames.length)];
  const colors = COLOR_PALETTES[randomPalette];

  const numColors = 3 + Math.floor(Math.random() * 2);
  const selectedColors = [];

  for (let i = 0; i < numColors; i++) {
    selectedColors.push(colors[Math.floor(Math.random() * colors.length)]);
  }

  return createMeshGradient(selectedColors);
}

export function createMeshGradient(colors: string[]): string {
  const positions = [
    { x: 0, y: 0 },
    { x: 100, y: 0 },
    { x: 0, y: 100 },
    { x: 100, y: 100 },
  ];

  const gradientStops = colors.map((color, index) => {
    const pos = positions[index % positions.length];
    return `radial-gradient(at ${pos.x}% ${pos.y}%, ${color} 0px, transparent 70%)`;
  });

  return gradientStops.join(", ");
}

export function generatePaletteGradient(
  paletteName: keyof typeof COLOR_PALETTES,
): string {
  const colors = COLOR_PALETTES[paletteName];
  const numColors = 3 + Math.floor(Math.random() * 2);
  const selectedColors = colors.slice(0, numColors);
  return createMeshGradient(selectedColors);
}
