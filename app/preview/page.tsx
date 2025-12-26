"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Smartphone,
  Monitor,
  Send,
  Check,
  Lock,
  X,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Player, Platform, PreviewMode } from "./components/player";
import { ThemeToggle } from "@/components/theme-toggle";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { authClient } from "@/auth-client";

export default function PreviewPage() {
  const { data: session } = authClient.useSession();

  const [caption, setCaption] = useState("");
  const [images, setImages] = useState<string[]>([]);

  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>([ "twitter","linkedin",]);
  const [previewMode, setPreviewMode] = useState<PreviewMode>("mobile");

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const storedImage = localStorage.getItem("plator-preview-image");
    if (storedImage) {
      setImages([storedImage]);
    }
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages: string[] = [];
      const remainingSlots = 4 - images.length;
      const filesToProcess = Array.from(files).slice(0, remainingSlots);

      if (filesToProcess.length === 0) {
        toast.error("Maximum 4 images allowed");
        return;
      }

      filesToProcess.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          if (result) {
            setImages((prev) => [...prev, result]);
          }
        };
        reader.readAsDataURL(file);
      });
      toast.success(`${filesToProcess.length} image(s) added`);
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeImage = (indexToRemove: number) => {
    setImages((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const togglePlatform = (p: Platform) => {
    setSelectedPlatforms((prev) =>
      prev.includes(p) ? prev.filter((item) => item !== p) : [...prev, p]
    );
  };

  // Helper to copy ONLY the FIRST image to clipboard
  const copyFirstImageToClipboard = async () => {
    if (images.length === 0) return false;

    try {
      const response = await fetch(images[0]);
      const blob = await response.blob();

      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob,
        }),
      ]);
      return true;
    } catch (err) {
      console.error("Clipboard failed:", err);
      return false;
    }
  };

  const handlePost = async () => {
    if (!session) {
      toast.error("Please login to post");
      handleLogin();
      return;
    }

    if (selectedPlatforms.length === 0) {
      toast.error("Select at least one platform");
      return;
    }

    const copied = await copyFirstImageToClipboard();

    if (copied) {
      if (images.length > 1) {
        toast.success("First image copied to clipboard! (Browser limit)");
        toast.info("Please drag the other images manually.");
      } else {
        toast.success("Image copied to clipboard!");
      }
    } else {
      toast.error("Failed to copy image to clipboard.");
    }

    selectedPlatforms.forEach((p) => {
      let url = "";
      const text = encodeURIComponent(caption);

      if (p === "twitter") {
        url = `https://twitter.com/intent/tweet?text=${text}`;
      } else if (p === "linkedin") {
        url = `https://www.linkedin.com/feed/?shareActive=true&text=${text}`;
      } else if (p === "instagram") {
        toast.info("Instagram web posting is limited. Use mobile app.");
        return;
      }

      if (url) {
        window.open(url, "_blank");
      }
    });
  };

  const handleLogin = async () => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/preview",
    });
  };

  const platforms: { id: Platform; label: string }[] = [
    { id: "twitter", label: "Twitter" },
    { id: "linkedin", label: "LinkedIn" },
  ];

  return (
    <div className="h-screen max-h-screen bg-background flex flex-col overflow-hidden">
      <header className="h-12 shrink-0 border-b-2 dark:border-neutral-800 flex items-center justify-between px-4 lg:px-6 bg-background/80 backdrop-blur-md z-50">
        <div className="flex items-center gap-4">
          <Link href="/editor">
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg">
              <ArrowLeft size={18} />
            </Button>
          </Link>
          <div className="flex flex-col">
            <span className="text-md font-bold font-display uppercase tracking-wide">
              Previewer
            </span>
          </div>
        </div>

        <span className="text-muted-foreground font-inter uppercase text-sm font-semibold">
          Iterate before posting
        </span>

        <div className="flex items-center gap-2">
          <ThemeToggle />

          <div className="flex bg-muted p-0.5 rounded-lg border-2 dark:border-neutral-800">
            <button
              onClick={() => setPreviewMode("mobile")}
              className={cn(
                "p-1.5 rounded-md transition-all",
                previewMode === "mobile"
                  ? "bg-background text-primary shadow-sm"
                  : "text-muted-foreground dark:bg-neutral-900 hover:text-foreground"
              )}
            >
              <Smartphone size={14} />
            </button>
            <button
              onClick={() => setPreviewMode("desktop")}
              className={cn(
                "p-1.5 rounded-md transition-all",
                previewMode === "desktop"
                  ? "bg-background text-primary shadow-sm"
                  : "text-muted-foreground dark:bg-neutral-900 hover:text-foreground"
              )}
            >
              <Monitor size={14} />
            </button>
          </div>
          {!session && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogin}
              className="gap-2 border-neutral-400 dark:border-neutral-700 text-yellow-500 dark:text-yellow-300 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/15 shadow-next dark:shadow-white/25"
            >
              Login
            </Button>
          )}
        </div>
      </header>

      <main className="flex-1 flex flex-col lg:flex-row min-h-0">
        <div className="w-full lg:w-80 border-r-2 dark:border-r-neutral-800 bg-card/30 flex flex-col z-20">
          <div className="px-6 py-3 flex-1 overflow-y-auto space-y-6 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Select Platforms</label>
                <div className="flex gap-2 flex-wrap mt-1">
                  {platforms.map((p) => {
                    const isSelected = selectedPlatforms.includes(p.id);
                    return (
                      <button
                        key={p.id}
                        onClick={() => togglePlatform(p.id)}
                        className={cn(
                          "px-3 py-2 border rounded-md text-xs transition-all flex-1 text-center font-manrope flex items-center justify-center gap-2",
                          isSelected
                            ? "bg-primary/10 border-primary text-primary font-bold shadow-sm"
                            : "bg-background hover:bg-muted border-2 dark:border-neutral-800 text-muted-foreground"
                        )}
                      >
                        {isSelected && <Check size={12} />}
                        {p.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium">
                    Media ({images.length}/4)
                  </label>
                  {images.length > 0 && (
                    <button
                      onClick={() => setImages([])}
                      className="text-xs text-red-500 hover:underline"
                    >
                      Clear All
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {images.map((img, idx) => (
                    <div
                      key={idx}
                      className="relative group aspect-square rounded-md overflow-hidden border-2 dark:border-neutral-800"
                    >
                      <img src={img} className="w-full h-full object-cover" />
                      <button
                        onClick={() => removeImage(idx)}
                        className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}

                  {images.length < 4 && (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className={cn(
                        "border-2 dark:border-neutral-800 border-dashed border-muted-foreground/25 hover:border-primary/50 hover:bg-primary/5 rounded-md flex flex-col items-center justify-center cursor-pointer transition-all",
                        images.length === 0
                          ? "col-span-2 aspect-2/1"
                          : "aspect-square"
                      )}
                    >
                      <Plus size={20} className="text-muted-foreground mb-1" />
                      <span className="text-[10px] text-muted-foreground font-medium">
                        Add
                      </span>
                    </div>
                  )}
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Caption</label>
                <Textarea
                  className="mt-1 w-full font-manrope min-h-[50px] bg-background rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none border-2 dark:border-neutral-800"
                  placeholder="What's on your mind?"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                />
              </div>
              <div className="space-y-2 flex items-center justify-center">
                <Button
                  variant="primary"
                  size="sm"
                  className="h-8 text-xs font-bold"
                  onClick={handlePost}
                >
                  {!session ? (
                    <Lock size={14} className="mr-2" />
                  ) : (
                    <Send size={14} className="mr-2" />
                  )}
                  Post Now
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Center: Preview Player */}
        <div className="flex-1 bg-muted/10 relative overflow-hidden flex items-center justify-center p-4 lg:p-0">
          <Player
            images={images}
            caption={caption}
            platform={
              selectedPlatforms[selectedPlatforms.length - 1] || "twitter"
            }
            previewMode={previewMode}
          />
        </div>
      </main>
    </div>
  );
}
