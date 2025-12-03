"use client";

import React from "react";
import { Wifi } from "lucide-react";
import { cn } from "@/lib/utils";
import { XPost, LinkedInPost, InstagramPost } from "@/components/posts";

export type Platform = "twitter" | "linkedin" | "instagram";
export type PreviewMode = "mobile" | "desktop";

interface PlayerProps {
  imageSrc?: string | null;
  caption?: string;
  platform: Platform;
  previewMode: PreviewMode;
}

// Skeleton Components for Desktop View
const LeftSidebarSkeleton = () => (
  <div className="hidden lg:flex flex-col gap-4 w-64 shrink-0 p-4">
    <div className="h-8 w-8 rounded-full bg-muted/50 mb-4" />
    <div className="space-y-4">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex items-center gap-3">
          <div className="h-6 w-6 rounded-full bg-muted/40" />
          <div className="h-4 w-24 rounded bg-muted/30" />
        </div>
      ))}
    </div>
    <div className="mt-auto h-12 w-full rounded-full bg-primary/10" />
  </div>
);

const RightSidebarSkeleton = () => (
  <div className="hidden xl:flex flex-col gap-4 w-72 shrink-0 p-4 pl-8">
    <div className="h-10 w-full rounded-full bg-muted/30 mb-2" />
    <div className="rounded-xl bg-muted/20 p-4 space-y-4">
      <div className="h-4 w-1/3 rounded bg-muted/40" />
      {[1, 2, 3].map((i) => (
        <div key={i} className="space-y-2">
          <div className="flex justify-between">
            <div className="h-3 w-1/4 rounded bg-muted/30" />
            <div className="h-3 w-3 rounded bg-muted/30" />
          </div>
          <div className="h-4 w-3/4 rounded bg-muted/40" />
        </div>
      ))}
    </div>
  </div>
);

export function Player({
  imageSrc,
  caption,
  platform,
  previewMode,
}: PlayerProps) {
  const mobilePostStyles =
    "border-x-0 border-t-0 border-b border-border/50 shadow-none rounded-none max-w-none mx-0";
  const desktopPostStyles =
    "max-w-2xl w-full mx-auto shadow-sm hover:shadow-md transition-shadow";

  const renderContent = () => {
    const styles =
      previewMode === "mobile" ? mobilePostStyles : desktopPostStyles;

    switch (platform) {
      case "twitter":
        return <XPost caption={caption} image={imageSrc} className={styles} />;
      case "linkedin":
        return (
          <LinkedInPost caption={caption} image={imageSrc} className={styles} />
        );
      case "instagram":
        return (
          <InstagramPost
            caption={caption}
            image={imageSrc}
            className={styles}
          />
        );
      default:
        return <XPost caption={caption} image={imageSrc} className={styles} />;
    }
  };

  return (
    <div className="w-full h-full flex items-center justify-center relative p-4">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#ababab_1px,transparent_1px)] bg-size-[20px_20px] opacity-20 pointer-events-none" />

      {/* Device Frame */}
      <div
        className={cn(
          "bg-background border-4 border-neutral-800 dark:border-neutral-700 shadow-2xl flex flex-col overflow-hidden relative transition-all duration-300 ease-in-out",
          previewMode === "mobile"
            ? "w-[375px] h-[750px] max-h-[85vh] rounded-[40px]"
            : "w-full max-w-[1200px] h-[75vh] rounded-xl border-2"
        )}
      >
        {/* Device Status Bar / Header */}
        <div className="h-7 border-b border-border bg-muted/50 flex items-center px-4 gap-2 relative z-10 justify-between shrink-0">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/50"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/50"></div>
          </div>
          {previewMode === "mobile" && (
            <div className="flex items-center gap-2">
              <Wifi size={12} className="text-muted-foreground" />
              <span className="text-[10px] font-mono text-muted-foreground">
                100%
              </span>
            </div>
          )}
          {previewMode === "desktop" && (
            <div className="flex-1 text-center">
              <div className="w-1/3 h-4 bg-muted/50 mx-auto rounded-md text-[10px] flex items-center justify-center text-muted-foreground">
                plator.com
              </div>
            </div>
          )}
        </div>

        <div className="flex-1 bg-background relative overflow-y-auto scrollbar-hide">
          {previewMode === "desktop" ? (
            <div className="flex justify-center h-full">
              <LeftSidebarSkeleton />

              <div className="flex-1 max-w-2xl border-x border-border/50 min-h-full bg-background/50">
                <div className="py-4">
                  {renderContent()}
                  <div className="mt-4 mx-auto max-w-2xl p-4 border-b border-border/50 opacity-30">
                    <div className="flex gap-3">
                      <div className="size-10 bg-muted rounded-full" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 w-1/3 bg-muted rounded" />
                        <div className="h-20 w-full bg-muted rounded" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <RightSidebarSkeleton />
            </div>
          ) : (
            // Mobile Layout: Single Column, Full Width
            <div className="flex flex-col min-h-full bg-background">
              <div className="flex-1">
                {renderContent()}

                <div className="p-4 border-b border-border/50 opacity-40">
                  <div className="flex gap-3">
                    <div className="size-10 bg-muted rounded-full shrink-0" />
                    <div className="space-y-2 w-full">
                      <div className="h-3 w-1/3 bg-muted rounded" />
                      <div className="h-24 w-full bg-muted rounded" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="sticky bottom-0 z-20 bg-background border-t border-border/50 h-14 flex items-center justify-around shrink-0 pb-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="size-6 bg-muted/50 rounded-md" />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
