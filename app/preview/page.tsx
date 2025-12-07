"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Smartphone,
  Monitor,
  Upload,
  Settings,
  Send,
  Check,
  Lock,
  Copy,
  LogOut, // Add Copy icon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Player, Platform, PreviewMode } from "./components/player";
import { ThemeToggle } from "@/components/theme-toggle";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { authClient } from "@/auth-client";
import { useRouter } from "next/navigation";

export default function PreviewPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const [caption, setCaption] = useState("");
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>([
    "twitter",
    "linkedin",
  ]);
  const [previewMode, setPreviewMode] = useState<PreviewMode>("mobile");

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const storedImage = localStorage.getItem("plator-preview-image");
    if (storedImage) setImageSrc(storedImage);
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

  const togglePlatform = (p: Platform) => {
    setSelectedPlatforms((prev) =>
      prev.includes(p) ? prev.filter((item) => item !== p) : [...prev, p]
    );
  };

  const copyImageToClipboard = async () => {
    if (!imageSrc) return false;

    try {
      const response = await fetch(imageSrc);
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

  const downloadImageFallback = () => {
    if (!imageSrc) return;
    const link = document.createElement("a");
    link.href = imageSrc;
    link.download = "plator-post.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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

    const copied = await copyImageToClipboard();

    if (copied) {
      toast.success("Paste Image with Ctrl+V ");
    } else {
      downloadImageFallback();
      toast.info("Image downloaded! Drag it into the tabs.");
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

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/");
        },
      },
    });
  };

  const platforms: { id: Platform; label: string }[] = [
    { id: "twitter", label: "Twitter" },
    { id: "linkedin", label: "LinkedIn" },
  ];

  return (
    <div className="h-screen max-h-screen bg-background flex flex-col overflow-hidden">
      <header className="h-14 shrink-0 border-b border-border flex items-center justify-between px-4 lg:px-6 bg-background/80 backdrop-blur-md z-50">
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

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {!session && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogin}
              className="gap-2 border-neutral-400 dark:border-neutral-700 text-yellow-500 dark:text-yellow-300 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/15 shadow-next dark:shadow-white/25"
            >
              Login to Post
            </Button>
          )}

          {session && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="gap-2 border-neutral-400 dark:border-neutral-700 text-yellow-500 dark:text-yellow-300 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/15 shadow-next dark:shadow-white/25"
            >
              <LogOut size={12} />
              Logout
            </Button>
          )}

          <div className="w-px h-4 bg-border mx-1" />
        </div>
      </header>

      <main className="flex-1 flex flex-col lg:flex-row min-h-0">
        <div className="w-full lg:w-80 border-b lg:border-b-0 lg:border-r border-border bg-card/30 flex flex-col z-20">
          {/* ... Sidebar content ... */}
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase ml-2">
              Configuration
            </h2>
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
          </div>

          <div className="p-6 flex-1 overflow-y-auto space-y-6">
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
                <label className="text-sm font-medium">Media</label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-1 w-full h-32 border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 hover:bg-primary/5 rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all group overflow-hidden relative"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                  {imageSrc ? (
                    <img
                      src={imageSrc}
                      className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-60 transition-opacity"
                    />
                  ) : (
                    <>
                      <Upload
                        size={24}
                        className="text-muted-foreground mb-2 group-hover:text-primary transition-colors"
                      />
                      <span className="text-xs text-muted-foreground font-medium">
                        Click to Upload
                      </span>
                    </>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Caption</label>
                <Textarea
                  className="mt-1 w-full font-manrope min-h-[150px] bg-background border rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
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
            imageSrc={imageSrc}
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
