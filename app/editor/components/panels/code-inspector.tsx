"use client";

import { PlusIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { StudioSlider } from "@/components/ui/studio-slider";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useStore } from "../../store/use-store";
import { CodeElement, DEFAULT_CODE_STYLE } from "../../types";
import { CODE_THEMES, TRANSFORM_3D_PRESETS } from "../../values";

export function CodeInspector() {
  const {
    elements,
    selectedElementId,
    updateElement,
    addElement,
    selectElement,
  } = useStore();

  const selectedElement = elements.find((el) => el.id === selectedElementId);
  const isCode = selectedElement?.type === "code";
  const codeEl = isCode ? (selectedElement as CodeElement) : null;
  const style = codeEl?.style || DEFAULT_CODE_STYLE;

  const handleAddCode = () => {
    const newId = `code_${Date.now()}`;
    addElement({
      id: newId,
      type: "code",
      name: "Code Snippet",
      code: `// Sample TypeScript\nimport { Studio } from "@plator/core";\n\nexport async function showcase() {\n  return Studio.render3D({\n    theme: "cyberpunk",\n    fps: 60,\n  });\n}`,
      language: "typescript",
      position: { x: 80, y: 120 },
      style: { ...DEFAULT_CODE_STYLE },
      isVisible: true,
      isLocked: false,
    });
    selectElement(newId);
  };

  return (
    <div className="space-y-4 w-full min-w-0 max-w-full overflow-hidden box-border">
      {/* Header Row: Clean title with Add button */}
      <div className="flex items-center justify-between">
        <Label className="text-sm font-semibold uppercase tracking-wider">
          Code Snippet
        </Label>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleAddCode}
          className="text-xs rounded-md"
        >
          <PlusIcon className="size-3" />
        </Button>
      </div>

      {isCode && codeEl ? (
        <div className="space-y-4 w-full min-w-0 max-w-full">
          {/* Code Input with Fixed Width */}
          <div className="space-y-1.5 w-full min-w-0 max-w-full">
            <Label className="text-xs font-medium text-muted-foreground">
              Code Content
            </Label>
            <div className="w-full min-w-0 max-w-full overflow-hidden">
              <Textarea
                value={codeEl.code}
                onChange={(e) => updateElement(codeEl.id, { code: e.target.value })}
                rows={5}
                className="w-full max-w-full min-w-0 box-border [field-sizing:fixed] font-mono text-xs leading-relaxed bg-neutral-300 dark:bg-neutral-900 resize-y rounded-md border-2 border-neutral-300 dark:border-neutral-700 whitespace-pre-wrap break-words [overflow-wrap:anywhere] overflow-y-auto overflow-x-hidden"
                placeholder="Paste or type code here..."
              />
            </div>
          </div>

          {/* Language & Theme Selectors */}
          <div className="grid grid-cols-2 gap-4 font-manrope font-semibold *:pr-1">
            <div className="space-y-1.5 min-w-0">
              <Label className="text-xs font-medium text-muted-foreground">
                Language
              </Label>
              <Select
                value={codeEl.language === "python" || codeEl.language === "py" ? "python" : "typescript"}
                onValueChange={(val) => updateElement(codeEl.id, { language: val })}
              >
                <SelectTrigger className="h-8 w-full text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="text-xs">
                  <SelectItem value="typescript" className="text-xs py-1.5 cursor-pointer">
                    TypeScript
                  </SelectItem>
                  <SelectItem value="python" className="text-xs py-1.5 cursor-pointer">
                    Python
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5 min-w-0">
              <Label className="text-xs font-medium text-muted-foreground">
                Color Theme
              </Label>
              <Select
                value={style.theme}
                onValueChange={(val: any) => updateElement(codeEl.id, { theme: val })}
              >
                <SelectTrigger className="h-8 w-full text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="text-xs">
                  {CODE_THEMES.map((theme) => (
                    <SelectItem key={theme.id} value={theme.id} className="text-xs py-1.5 cursor-pointer">
                      <div className="flex">
                        <div
                          style={{ backgroundColor: theme.bg }}
                        />
                        {theme.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Window Title */}
          <div className="space-y-1.5 min-w-0">
            <Label className="text-xs font-medium text-muted-foreground">
              Window Title
            </Label>
            <Input
              value={style.windowTitle || ""}
              onChange={(e) => updateElement(codeEl.id, { windowTitle: e.target.value })}
              placeholder="e.g. index.ts"
              className="h-8 text-xs rounded-md"
            />
          </div>

          {/* Geometry Sliders */}
          <div className="grid grid-cols-2 gap-4 font-manrope font-semibold *:pr-1">
            <StudioSlider
              label="Font Size"
              value={style.fontSize}
              onChange={(val) => updateElement(codeEl.id, { fontSize: val })}
              min={10}
              max={28}
              step={1}
              defaultValue={14}
              unit="px"
              compact
            />

            <StudioSlider
              label="Padding"
              value={style.padding}
              onChange={(val) => updateElement(codeEl.id, { padding: val })}
              min={8}
              max={40}
              step={1}
              defaultValue={16}
              unit="px"
              compact
            />

            <StudioSlider
              label="Roundness"
              value={style.borderRadius}
              onChange={(val) => updateElement(codeEl.id, { borderRadius: val })}
              min={0}
              max={32}
              step={1}
              defaultValue={12}
              unit="px"
              compact
            />

            <StudioSlider
              label="Scale"
              value={style.scale}
              onChange={(val) => updateElement(codeEl.id, { scale: val })}
              min={30}
              max={200}
              step={1}
              defaultValue={100}
              unit="%"
              compact
            />

            <StudioSlider
              label="Width"
              value={style.width || 480}
              onChange={(val) => updateElement(codeEl.id, { width: val })}
              min={280}
              max={800}
              step={10}
              defaultValue={480}
              unit="px"
              compact
            />

            <StudioSlider
              label="Horizontal Scroll"
              value={style.scrollX || 0}
              onChange={(val) => updateElement(codeEl.id, { scrollX: val })}
              min={0}
              max={100}
              step={1}
              defaultValue={0}
              unit="%"
              compact
            />
          </div>

          {/* 2x2 Grid below sliders: Window, Glass, Numbers, Normal Presets Dropdown */}
          <div className="grid grid-cols-2 gap-4 font-manrope font-semibold pt-1 items-center *:pr-1">
            {/* Window */}
            <div className="flex items-center justify-between min-w-0 h-8">
              <Label className="text-xs font-medium text-muted-foreground cursor-pointer select-none">
                Window
              </Label>
              <Switch
                checked={style.showWindowControls}
                onCheckedChange={(checked) =>
                  updateElement(codeEl.id, { showWindowControls: checked })
                }
              />
            </div>

            {/* Glass */}
            <div className="flex items-center justify-between min-w-0 h-8">
              <Label className="text-xs font-medium text-muted-foreground cursor-pointer select-none">
                Glass
              </Label>
              <Switch
                checked={Boolean(style.glassmorphism)}
                onCheckedChange={(checked) =>
                  updateElement(codeEl.id, { glassmorphism: checked })
                }
              />
            </div>

            {/* Numbers */}
            <div className="flex items-center justify-between min-w-0 h-8">
              <Label className="text-xs font-medium text-muted-foreground cursor-pointer select-none">
                Numbers
              </Label>
              <Switch
                checked={style.lineNumbers}
                onCheckedChange={(checked) =>
                  updateElement(codeEl.id, { lineNumbers: checked })
                }
              />
            </div>

            {/* Normal Presets Dropdown */}
            <div className="min-w-0">
              <Select
                value={
                  TRANSFORM_3D_PRESETS.find(
                    (p) =>
                      p.id !== "custom" &&
                      p.rotateX === style.rotateX &&
                      p.rotateY === style.rotateY &&
                      p.rotate === style.rotate
                  )?.id || "custom"
                }
                onValueChange={(presetId) => {
                  const preset = TRANSFORM_3D_PRESETS.find(
                    (p) => p.id === presetId
                  );
                  if (preset && preset.id !== "custom") {
                    updateElement(codeEl.id, {
                      rotateX: preset.rotateX,
                      rotateY: preset.rotateY,
                      rotate: preset.rotate,
                    });
                  }
                }}
              >
                <SelectTrigger className="h-8 w-full text-xs cursor-pointer">
                  <SelectValue placeholder="Preset" />
                </SelectTrigger>
                <SelectContent className="text-xs max-h-56">
                  <SelectItem
                    value="custom"
                    className="text-xs py-1.5 cursor-pointer text-muted-foreground"
                    disabled
                  >
                    Custom
                  </SelectItem>
                  {TRANSFORM_3D_PRESETS.map((preset) => (
                    <SelectItem
                      key={preset.id}
                      value={preset.id}
                      className="text-xs py-1.5 cursor-pointer"
                    >
                      {preset.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <Button
            onClick={handleAddCode}
            variant="outline"
            size="sm"
            className="w-full bg-transparent border-dashed rounded-sm border-neutral-400 dark:border-neutral-600 hover:bg-muted/50 text-xs font-semibold"
          >
            <PlusIcon className="w-3.5 h-3.5 mr-2" /> Add Code Layer
          </Button>
          <div className="text-center p-6 text-muted-foreground font-inter text-xs border-2 border-dashed rounded-lg">
            {elements.some((e) => e.type === "code")
              ? "A code snippet exists. Select it from Layers to edit properties."
              : "Add a code snippet to customize syntax, language, and 3D perspectives."}
          </div>
        </div>
      )}
    </div>
  );
}
