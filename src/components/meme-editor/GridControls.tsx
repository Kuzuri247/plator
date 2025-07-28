import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Grid, Maximize2 } from 'lucide-react';
import { GridConfig } from '@/pages/MemeEditor';

interface GridControlsProps {
  config: GridConfig;
  onChange: (config: GridConfig) => void;
  canvasSize: { width: number; height: number };
  onCanvasSizeChange: (size: { width: number; height: number }) => void;
}

const canvasPresets = [
  { name: 'Square (1:1)', width: 600, height: 600 },
  { name: 'Landscape (16:9)', width: 800, height: 450 },
  { name: 'Portrait (9:16)', width: 450, height: 800 },
  { name: 'Classic (4:3)', width: 800, height: 600 },
  { name: 'Instagram Post', width: 640, height: 640 },
  { name: 'Facebook Cover', width: 820, height: 312 },
  { name: 'Twitter Header', width: 600, height: 200 },
];

export function GridControls({
  config,
  onChange,
  canvasSize,
  onCanvasSizeChange,
}: GridControlsProps) {
  const handleRowsChange = (value: number[]) => {
    onChange({ ...config, rows: value[0] });
  };

  const handleColsChange = (value: number[]) => {
    onChange({ ...config, cols: value[0] });
  };

  const handleGapChange = (value: number[]) => {
    onChange({ ...config, gap: value[0] });
  };

  const handlePresetChange = (preset: string) => {
    const selected = canvasPresets.find((p) => p.name === preset);
    if (selected) {
      onCanvasSizeChange({ width: selected.width, height: selected.height });
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="dark:text-white text-black font-semibold flex items-center gap-2">
        <Grid className="w-4 h-4" />
        Grid & Canvas
      </h3>

      {/* Canvas Size Presets */}
      <div>
        <Label className="dark:text-white text-black text-sm flex items-center gap-2">
          <Maximize2 className="w-3 h-3" />
          Canvas Size
        </Label>
        <Select onValueChange={handlePresetChange}>
          <SelectTrigger className="mt-2 bg-neutral-300 dark:bg-white/10  border-white/30 text-white ">
            <SelectValue placeholder="Choose preset" />
          </SelectTrigger>
          <SelectContent>
            {canvasPresets.map((preset) => (
              <SelectItem key={preset.name} value={preset.name}>
                {preset.name} ({preset.width}×{preset.height})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="dark:text-white text-black text-xs mt-1">
          Current: {canvasSize.width}×{canvasSize.height}px
        </div>
      </div>

      {/* Grid Rows */}
      <div>
        <Label className="dark:text-white text-black text-sm">
          Rows: {config.rows}
        </Label>
        <Slider
          value={[config.rows]}
          onValueChange={handleRowsChange}
          min={1}
          max={6}
          step={1}
          className="mt-2"
        />
      </div>

      {/* Grid Columns */}
      <div>
        <Label className="dark:text-white text-black text-sm">
          Columns: {config.cols}
        </Label>
        <Slider
          value={[config.cols]}
          onValueChange={handleColsChange}
          min={1}
          max={6}
          step={1}
          className="mt-2"
        />
      </div>

      {/* Grid Gap */}
      <div>
        <Label className="dark:text-white text-black text-sm">
          Gap: {config.gap}px
        </Label>
        <Slider
          value={[config.gap]}
          onValueChange={handleGapChange}
          min={0}
          max={20}
          step={1}
          className="mt-2"
        />
      </div>

      {/* Grid Info */}
      <div className="p-3 bg-white/5 rounded border border-neutral-300 dark:border-white/20">
        <div className="dark:text-white text-black text-sm flex justify-around">
          <div>Total Cells: {config.rows * config.cols}</div>
          <div>
            Cell Size:{' '}
            {Math.round(canvasSize.width / config.cols - config.gap * 2)}×
            {Math.round(canvasSize.height / config.rows - config.gap * 2)}px
          </div>
        </div>
      </div>
    </div>
  );
}
