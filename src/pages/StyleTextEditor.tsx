import { useState, useRef } from 'react';
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import {
  Upload,
  Download,
  Type,
  Palette,
  Sparkles,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from 'lucide-react';

interface TextStyle {
  fontSize: number;
  fontFamily: string;
  fontWeight: string;
  color: string;
  textShadow: string;
  textAlign: 'left' | 'center' | 'right';
}

interface TextElement {
  id: string;
  content: string;
  position: { x: number; y: number };
  style: TextStyle;
}

const fontFamilies = [
  'Arial',
  'Helvetica',
  'Times New Roman',
  'Georgia',
  'Verdana',
  'Comic Sans MS',
  'Impact',
  'Trebuchet MS',
  'Arial Black',
  'Courier New',
  'Roboto',
  'Open Sans',
  'Lato',
  'Montserrat',
  'Poppins',
  'Oswald',
  'Source Sans Pro',
  'Raleway',
  'Ubuntu',
  'Nunito',
  'Playfair Display',
];

const fontWeights = [
  { value: 'normal', label: 'Normal' },
  { value: 'bold', label: 'Bold' },
  { value: '100', label: 'Thin' },
  { value: '300', label: 'Light' },
  { value: '500', label: 'Medium' },
  { value: '700', label: 'Bold' },
  { value: '900', label: 'Black' },
];

const textColors = ['#ffffff', '#000000', '#ff0000', '#00ff00', '#0000ff'];

const shadowPresets = [
  { name: 'None', value: 'none' },
  { name: 'Light', value: '1px 1px 2px rgba(0,0,0,0.5)' },
  { name: 'Medium', value: '2px 2px 4px rgba(0,0,0,0.8)' },
  { name: 'Heavy', value: '3px 3px 6px rgba(0,0,0,0.9)' },
  { name: 'Glow White', value: '0 0 10px rgba(255,255,255,0.8)' },
  { name: 'Glow Color', value: '0 0 15px rgba(255,0,255,0.8)' },
  {
    name: 'Outline',
    value: '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000',
  },
  { name: '3D Effect', value: '2px 2px 0px #000, 4px 4px 0px rgba(0,0,0,0.5)' },
];

export default function StyleTextEditor() {
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [textElements, setTextElements] = useState<TextElement[]>([]);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 560 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Current text style state
  const [currentText, setCurrentText] = useState('Sample Text');
  const [fontSize, setFontSize] = useState(32);
  const [fontFamily, setFontFamily] = useState('Arial');
  const [fontWeight, setFontWeight] = useState('bold');
  const [color, setColor] = useState('#ffffff');
  const [textShadow, setTextShadow] = useState('2px 2px 4px rgba(0,0,0,0.8)');
  const [textAlign, setTextAlign] = useState<'left' | 'center' | 'right'>(
    'center'
  );

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setBackgroundImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addTextElement = () => {
    const newElement: TextElement = {
      id: `text_${Date.now()}`,
      content: currentText || 'New Text',
      position: {
        x: canvasSize.width / 2 - 100,
        y: canvasSize.height / 2 - 25,
      },
      style: {
        fontSize,
        fontFamily,
        fontWeight,
        color,
        textShadow,
        textAlign,
      },
    };
    setTextElements([...textElements, newElement]);
    setSelectedElement(newElement.id);
  };

  const updateSelectedElement = (updates: Partial<TextElement>) => {
    if (!selectedElement) return;
    setTextElements((elements) =>
      elements.map((el) =>
        el.id === selectedElement ? { ...el, ...updates } : el
      )
    );
  };

  const handleElementMouseDown = (e: React.MouseEvent, elementId: string) => {
    e.preventDefault();
    const element = textElements.find((el) => el.id === elementId);
    if (!element) return;

    const rect = e.currentTarget.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    setIsDragging(true);
    setSelectedElement(elementId);
  };

  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !selectedElement || !canvasRef.current) return;

    const canvasRect = canvasRef.current.getBoundingClientRect();
    const newPosition = {
      x: e.clientX - canvasRect.left - dragOffset.x,
      y: e.clientY - canvasRect.top - dragOffset.y,
    };

    newPosition.x = Math.max(
      0,
      Math.min(newPosition.x, canvasSize.width - 200)
    );
    newPosition.y = Math.max(
      0,
      Math.min(newPosition.y, canvasSize.height - 50)
    );

    updateSelectedElement({ position: newPosition });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const selectedElementData = textElements.find(
    (el) => el.id === selectedElement
  );

  const downloadImage = () => {
    // Implementation for downloading the styled text image
    console.log('Download functionality to be implemented');
  };

  return (
    <div className="min-h-screen dark:bg-neutral-900 bg-neutral-100 text-black dark:text-white  ">
      <Header />

      <div className="pt-20 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1 space-y-4">
              <Card className="p-4 dark:bg-neutral-900 bg-neutral-100 border-neutral-200 dark:border-neutral-700">
                <h3 className="dark:text-white text-black font-semibold mb-4 flex items-center gap-2">
                  <Type className="w-4 h-4" />
                  Text Styling
                </h3>

                {/* Text Content */}
                <div className="mb-4">
                  <Textarea
                    value={selectedElementData?.content || currentText}
                    onChange={(e) => {
                      const newText = e.target.value;
                      if (selectedElementData) {
                        updateSelectedElement({ content: newText });
                      } else {
                        setCurrentText(newText);
                      }
                    }}
                    className="mt-2 border-neutral-300 dark:border-neutral-600"
                    placeholder="Enter your text..."
                  />
                </div>

                {/* Font Family */}
                <div className="mb-4">
                  <Label className="dark:text-white/80 text-black/80 text-sm">
                    Font Family
                  </Label>
                  <Select
                    value={selectedElementData?.style.fontFamily || fontFamily}
                    onValueChange={(value) => {
                      if (selectedElementData) {
                        updateSelectedElement({
                          style: {
                            ...selectedElementData.style,
                            fontFamily: value,
                          },
                        });
                      } else {
                        setFontFamily(value);
                      }
                    }}
                  >
                    <SelectTrigger className="mt-2 border-neutral-300 dark:border-neutral-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {fontFamilies.map((font) => (
                        <SelectItem
                          key={font}
                          value={font}
                          style={{ fontFamily: font }}
                        >
                          {font}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Font Size */}
                <div className="mb-4">
                  <Label className="dark:text-white/80 text-black/80 text-sm">
                    Font Size: {selectedElementData?.style.fontSize || fontSize}
                    px
                  </Label>
                  <Slider
                    value={[selectedElementData?.style.fontSize || fontSize]}
                    onValueChange={([value]) => {
                      if (selectedElementData) {
                        updateSelectedElement({
                          style: {
                            ...selectedElementData.style,
                            fontSize: value,
                          },
                        });
                      } else {
                        setFontSize(value);
                      }
                    }}
                    min={12}
                    max={120}
                    step={1}
                    className="mt-2"
                  />
                </div>

                {/* Font Weight */}
                <div className="mb-4">
                  <Label className="dark:text-white/80 text-black/80 text-sm">
                    Font Weight
                  </Label>
                  <Select
                    value={selectedElementData?.style.fontWeight || fontWeight}
                    onValueChange={(value) => {
                      if (selectedElementData) {
                        updateSelectedElement({
                          style: {
                            ...selectedElementData.style,
                            fontWeight: value,
                          },
                        });
                      } else {
                        setFontWeight(value);
                      }
                    }}
                  >
                    <SelectTrigger className="mt-2 border-neutral-300 dark:border-neutral-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {fontWeights.map((weight) => (
                        <SelectItem key={weight.value} value={weight.value}>
                          {weight.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Text Alignment */}
                <div className="mb-4">
                  <Label className="dark:text-white/80 text-black/80 text-sm">
                    Text Alignment
                  </Label>
                  <div className="flex gap-2 mt-2">
                    {['left', 'center', 'right'].map((align) => (
                      <Button
                        key={align}
                        variant={
                          (selectedElementData?.style.textAlign ||
                            textAlign) === align
                            ? 'default'
                            : 'outline'
                        }
                        size="sm"
                        className="border-neutral-300 dark:border-neutral-600"
                        onClick={() => {
                          if (selectedElementData) {
                            updateSelectedElement({
                              style: {
                                ...selectedElementData.style,
                                textAlign: align as 'left' | 'center' | 'right',
                              },
                            });
                          } else {
                            setTextAlign(align as 'left' | 'center' | 'right');
                          }
                        }}
                      >
                        {align === 'left' && <AlignLeft className="w-4 h-4" />}
                        {align === 'center' && (
                          <AlignCenter className="w-4 h-4" />
                        )}
                        {align === 'right' && (
                          <AlignRight className="w-4 h-4" />
                        )}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Text Color */}
                <div className="mb-4">
                  <Label className="dark:text-white/80 text-black/80 text-sm flex items-center gap-2">
                    <Palette className="w-4 h-4" />
                    Text Color
                  </Label>
                  <div className="grid grid-cols-5 gap-2 mt-2">
                    {textColors.map((colorOption) => (
                      <button
                        key={colorOption}
                        className={`w-8 h-8 rounded border-2 ${
                          (selectedElementData?.style.color || color) ===
                          colorOption
                            ? 'border-primary'
                            : 'border-neutral-300 dark:border-neutral-600'
                        }`}
                        style={{ backgroundColor: colorOption }}
                        onClick={() => {
                          if (selectedElementData) {
                            updateSelectedElement({
                              style: {
                                ...selectedElementData.style,
                                color: colorOption,
                              },
                            });
                          } else {
                            setColor(colorOption);
                          }
                        }}
                      />
                    ))}
                  </div>
                  <Input
                    type="color"
                    value={selectedElementData?.style.color || color}
                    onChange={(e) => {
                      if (selectedElementData) {
                        updateSelectedElement({
                          style: {
                            ...selectedElementData.style,
                            color: e.target.value,
                          },
                        });
                      } else {
                        setColor(e.target.value);
                      }
                    }}
                    className="mt-2 w-full h-8 border-neutral-300 dark:border-neutral-600"
                  />
                </div>

                {/* Text Shadow */}
              </Card>
            </div>

            {/* Center - Canvas */}
            <div className="lg:col-span-2">
              <Card className="p-4 dark:bg-neutral-900 bg-neutral-100 border-neutral-200 dark:border-neutral-700">
                <div
                  ref={canvasRef}
                  className="relative border-2 border-white/30 rounded-lg overflow-hidden mx-auto"
                  style={{
                    width: canvasSize.width,
                    height: canvasSize.height,
                    maxWidth: '100%',
                    backgroundImage: backgroundImage
                      ? `url(${backgroundImage})`
                      : undefined,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundColor: backgroundImage ? undefined : '#f0f0f0',
                  }}
                  onMouseMove={handleCanvasMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                >
                  {textElements.map((element) => (
                    <div
                      key={element.id}
                      className={`absolute cursor-move select-none ${
                        selectedElement === element.id
                          ? 'ring-2 ring-primary'
                          : ''
                      }`}
                      style={{
                        left: element.position.x,
                        top: element.position.y,
                        fontSize: element.style.fontSize,
                        fontFamily: element.style.fontFamily,
                        fontWeight: element.style.fontWeight,
                        color: element.style.color,
                        textShadow: element.style.textShadow,
                        textAlign: element.style.textAlign,
                      }}
                      onMouseDown={(e) => handleElementMouseDown(e, element.id)}
                    >
                      {element.content}
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            <div className="lg:col-span-1 space-y-4">
              <Card className="p-4 dark:bg-neutral-900 bg-neutral-100 border-neutral-300 dark:border-neutral-700">
                <div className="mb-4">
                  <Label className="dark:text-white/80 text-black/80 text-sm flex items-center gap-2">
                    Text Shadow
                  </Label>
                  <Select
                    value={selectedElementData?.style.textShadow || textShadow}
                    onValueChange={(value) => {
                      if (selectedElementData) {
                        updateSelectedElement({
                          style: {
                            ...selectedElementData.style,
                            textShadow: value,
                          },
                        });
                      } else {
                        setTextShadow(value);
                      }
                    }}
                  >
                    <SelectTrigger className="mt-2 w-full border-neutral-300 dark:border-neutral-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {shadowPresets.map((shadow) => (
                        <SelectItem
                          key={shadow.name}
                          value={shadow.value}
                          className="font-normal"
                        >
                          {shadow.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  onClick={addTextElement}
                  className="w-full mb-6"
                  variant="default"
                >
                  Add Text to Canvas
                </Button>

                <Label className="dark:text-white/80 text-black/80 text-sm block mb-2">
                  Background Image
                </Label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  variant="outline"
                  className="w-full border-neutral-300 dark:border-neutral-600"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Image
                </Button>

                <div className="mt-4">
                  <Label className="dark:text-white text-black text-sm">
                    Canvas Size
                  </Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <Input
                      type="number"
                      value={canvasSize.width}
                      onChange={(e) =>
                        setCanvasSize((prev) => ({
                          ...prev,
                          width: parseInt(e.target.value) || 800,
                        }))
                      }
                      className="border-neutral-300 dark:border-neutral-600"
                    />
                    <Input
                      type="number"
                      value={canvasSize.height}
                      onChange={(e) =>
                        setCanvasSize((prev) => ({
                          ...prev,
                          height: parseInt(e.target.value) || 600,
                        }))
                      }
                      className="border-neutral-300 dark:border-neutral-600"
                    />
                  </div>
                </div>
              </Card>

              <Card className="p-4 dark:bg-neutral-900 bg-neutral-100 border-neutral-300 dark:border-neutral-700">
                <>
                  <h3 className="dark:text-white text-black font-semibold mb-4">
                    Export
                  </h3>
                  <Button
                    onClick={() => {
                      if (!canvasRef.current) return;

                      // Create a temporary canvas
                      const canvas = document.createElement('canvas');
                      const ctx = canvas.getContext('2d');
                      if (!ctx) return;

                      // Set canvas size
                      canvas.width = canvasSize.width;
                      canvas.height = canvasSize.height;

                      // Draw background if exists
                      if (backgroundImage) {
                        const img = new Image();
                        img.src = backgroundImage;
                        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                      } else {
                        ctx.fillStyle = '#f0f0f0';
                        ctx.fillRect(0, 0, canvas.width, canvas.height);
                      }

                      // Draw text elements
                      textElements.forEach((element) => {
                        ctx.font = `${element.style.fontWeight} ${element.style.fontSize}px ${element.style.fontFamily}`;
                        ctx.fillStyle = element.style.color;
                        ctx.textAlign = element.style.textAlign;
                        ctx.textBaseline = 'top';

                        // Apply text shadow
                        if (element.style.textShadow !== 'none') {
                          ctx.shadowColor = 'rgba(0,0,0,0.5)';
                          ctx.shadowBlur = 4;
                          ctx.shadowOffsetX = 2;
                          ctx.shadowOffsetY = 2;
                        }

                        // Calculate x position based on text alignment
                        let x = element.position.x;
                        if (element.style.textAlign === 'center') x += 100;
                        if (element.style.textAlign === 'right') x += 200;

                        ctx.fillText(element.content, x, element.position.y);

                        // Reset shadow
                        ctx.shadowColor = 'transparent';
                      });

                      // Create download link
                      const link = document.createElement('a');
                      link.download = 'styled-text.png';
                      link.href = canvas.toDataURL('image/png');
                      link.click();
                    }}
                    variant="outline"
                    className="w-full border-neutral-300 dark:border-neutral-600"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Image
                  </Button>
                </>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
