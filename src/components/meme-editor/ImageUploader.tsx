import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, Link, Grid } from "lucide-react"
import { GridConfig } from "@/pages/MemeEditor"

interface ImageUploaderProps {
  onImageAdd: (imageUrl: string, gridIndex: number) => void
  gridConfig: GridConfig
}

export function ImageUploader({ onImageAdd, gridConfig }: ImageUploaderProps) {
  const [imageUrl, setImageUrl] = useState("")
  const [selectedGrid, setSelectedGrid] = useState<number>(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        onImageAdd(result, selectedGrid)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleUrlAdd = () => {
    if (imageUrl.trim()) {
      onImageAdd(imageUrl, selectedGrid)
      setImageUrl("")
    }
  }

  const handleSampleImage = () => {
    // Add a sample placeholder image
    const sampleUrl = "https://images.unsplash.com/photo-1517423440428-a5a00ad493e8?w=400&h=300"
    onImageAdd(sampleUrl, selectedGrid)
  }

  const totalGrids = gridConfig.rows * gridConfig.cols

  return (
    <div className="space-y-4">
      <h3 className="dark:text-white text-black font-semibold flex items-center gap-2">
        <Upload className="w-4 h-4" />
        Add Images
      </h3>

      {/* Grid Selection */}
      <div>
        <Label className="dark:text-white text-black text-sm">Target Grid Cell</Label>
        <div className="grid grid-cols-4 gap-2 mt-2">
          {Array.from({ length: totalGrids }, (_, index) => (
            <div className="relative" key={index}>
              <Button
                variant={selectedGrid === index ? "default" : "outline"}
                size="sm"
                className={`h-8 text-xs ${
                  selectedGrid === index
                    ? "bg-primary text-primary-foreground"
                    : "border-neutral-300 dark:border-neutral-600 dark:text-white text-black hover:bg-neutral-200 dark:hover:bg-neutral-700"
                } w-full`}
                onClick={() => setSelectedGrid(index)}
              >
                {index + 1}
              </Button>
              {/* Delete image button (shows only if image exists for this grid cell) */}
              {gridConfig.images?.[index] && (
                <button
                  type="button"
                  className="absolute -top-2 -right-2 bg-red-600 dark:bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs shadow"
                  title="Delete image"
                  onClick={(e) => {
                    e.stopPropagation()
                    onImageAdd("", index)
                  }}
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* File Upload */}
      <div>
        <Label className="dark:text-white text-black text-sm">Upload Image</Label>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
        />
        <Button
          variant="outline"
          className="w-full mt-2 border-neutral-300 dark:border-neutral-600 dark:text-white text-black hover:bg-neutral-200 dark:hover:bg-neutral-700"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="w-4 h-4 mr-2" />
          Choose File
        </Button>
      </div>

      {/* URL Input */}
      <div>
        <Label className="dark:text-white text-black text-sm">Image URL</Label>
        <div className="flex gap-2 mt-2">
          <Input
            placeholder="https://example.com/image.jpg"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="bg-neutral-100 dark:bg-neutral-800 border-neutral-300 dark:border-neutral-600 dark:text-white text-black placeholder:text-neutral-300 dark:placeholder:text-neutral-500"
          />
          <Button
            variant="outline"
            size="icon"
            className="border-neutral-300 dark:border-neutral-600 dark:text-white text-black hover:bg-neutral-200 dark:hover:bg-neutral-700"
            onClick={handleUrlAdd}
          >
            <Link className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Sample Images */}
      <div>
        <Label className="dark:text-white text-black text-sm">Quick Start</Label>
        <div className="space-y-2 mt-2">
          <Button
            variant="outline"
            className="w-full border-neutral-300 dark:border-neutral-600 dark:text-white text-black hover:bg-neutral-200 dark:hover:bg-neutral-700"
            onClick={handleSampleImage}
          >
            <Grid className="w-4 h-4 mr-2" />
            Add Sample Image
          </Button>
        </div>
      </div>

      {/* Popular Meme Templates */}
      <div>
        <Label className="dark:text-white text-black text-sm">Popular Templates</Label>
        <div className="grid grid-cols-2 gap-2 mt-2">
          {[
            { name: "Drake", url: "https://i.imgflip.com/30b1gx.jpg" },
            { name: "Distracted Boyfriend", url: "https://i.imgflip.com/1ur9b0.jpg" },
            { name: "Two Buttons", url: "https://i.imgflip.com/1g8my4.jpg" },
            { name: "Change My Mind", url: "https://i.imgflip.com/24y43o.jpg" }
          ].map((template) => (
            <Button
              key={template.name}
              variant="outline"
              size="sm"
              className="text-xs border-neutral-300 dark:border-neutral-600 dark:text-white text-black hover:bg-neutral-200 dark:hover:bg-neutral-700"
              onClick={() => onImageAdd(template.url, selectedGrid)}
            >
              {template.name}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}