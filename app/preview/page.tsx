"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarClock,
  Smartphone,
  Monitor,
  Upload,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Player, Platform, PreviewMode } from "./components/player";
import { ThemeToggle } from "@/components/theme-toggle";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function PreviewPage() {
  const [caption, setCaption] = useState("");
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [platform, setPlatform] = useState<Platform>("twitter");
  const [previewMode, setPreviewMode] = useState<PreviewMode>("mobile");

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const storedImage = localStorage.getItem("plator-preview-image");
    if (storedImage) {
      setImageSrc(storedImage);
    }
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImageSrc(result);
        toast.success("Image updated");
      };
      reader.readAsDataURL(file);
    }
  };

  const platforms: { id: Platform; label: string }[] = [
    { id: "twitter", label: "Twitter" },
    { id: "linkedin", label: "LinkedIn" },
    { id: "instagram", label: "Instagram" },
  ];

  return (
    <div className="h-screen max-h-screen bg-background flex flex-col overflow-hidden">
      {/* Navigation */}
      <header className="h-14 shrink-0 border-b border-border flex items-center justify-between px-4 lg:px-6 bg-background/80 backdrop-blur-md z-50">
        <div className="flex items-center gap-4">
          <Link href="/editor">
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg">
              <ArrowLeft size={18} />
            </Button>
          </Link>
          <div className="flex flex-col">
            <span className="text-sm font-bold font-display uppercase tracking-wide">
              Preview & Schedule
            </span>
            <span className="text-xs text-muted-foreground font-mono">
              Ready to Publish
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <div className="w-px h-4 bg-border mx-1" />

          <Button
            variant="outline"
            size="sm"
            className="hidden sm:flex h-8 text-xs"
          >
            <Settings size={14} className="mr-2" />
            Settings
          </Button>

          <Button variant="primary" size="sm" className="h-8 text-xs font-bold">
            <CalendarClock size={14} className="mr-2" />
            Schedule Post
          </Button>
        </div>
      </header>

      <main className="flex-1 flex flex-col lg:flex-row min-h-0">
        {/* Left Side: Settings & Toggle */}
        <div className="w-full lg:w-80 border-b lg:border-b-0 lg:border-r border-border bg-card/30 flex flex-col z-20">
          {/* Header of Left Panel with Toggle */}
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase text-muted-foreground ml-2">
              Post Details
            </h2>

            {/* View Toggle */}
            <div className="flex bg-muted p-0.5 rounded-lg border border-border">
              <button
                onClick={() => setPreviewMode("mobile")}
                className={cn(
                  "p-1.5 rounded-md transition-all",
                  previewMode === "mobile"
                    ? "bg-background text-primary shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
                title="Mobile View"
              >
                <Smartphone size={14} />
              </button>
              <button
                onClick={() => setPreviewMode("desktop")}
                className={cn(
                  "p-1.5 rounded-md transition-all",
                  previewMode === "desktop"
                    ? "bg-background text-primary shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
                title="Desktop View"
              >
                <Monitor size={14} />
              </button>
            </div>
          </div>

          <div className="p-6 flex-1 overflow-y-auto space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Platforms</label>
                <div className="flex gap-2 flex-wrap mt-1">
                  {platforms.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setPlatform(p.id)}
                      className={cn(
                        "px-3 py-1.5 border rounded text-xs transition-colors flex-1 text-center font-manrope",
                        platform === p.id
                          ? "bg-primary text-primary-foreground border-primary font-bold shadow-sm"
                          : "bg-background hover:border-primary text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Post Image</label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className=" mt-1 w-full h-24 border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 hover:bg-primary/5 rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all group"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                  <Upload
                    size={20}
                    className="text-muted-foreground mb-2 group-hover:text-primary transition-colors"
                  />
                  <span className="text-[10px] text-muted-foreground font-medium">
                    {imageSrc ? "Add Image" : "Upload Generated Image"}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium ">Caption</label>
                <Textarea
                  className=" mt-1 w-full font-manrope min-h-[120px] bg-background border rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                  placeholder="Write your caption here..."
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Center: Preview Player */}
        <div className="flex-1 bg-muted/10 relative overflow-hidden flex items-center justify-center">
          <Player
            imageSrc={imageSrc}
            caption={caption}
            platform={platform}
            previewMode={previewMode}
          />
        </div>
      </main>
    </div>
  );
}
