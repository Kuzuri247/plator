import {
  Heart,
  MessageCircle,
  Repeat,
  Share,
  MoreHorizontal,
  ThumbsUp,
  Send,
  Bookmark,
  Image as ImageIcon,
  Earth,
  BadgeCheck,
  BarChart2,
} from "lucide-react";
import Image from "next/image";

export const XPost = () => (
  <div className="bg-card border-2 p-4 text-card-foreground w-full max-w-md mx-auto shadow-2xl relative z-10">
    <div className="flex gap-2">
      {/* Left Column: Avatar */}
      <div className="shrink-0">
        <div className="w-10 h-10 bg-muted rounded-full overflow-hidden cursor-pointer hover:opacity-90 transition-opacity">
          <Image
            src="/pfp2.jpg"
            alt="avatar"
            width={45}
            height={45}
            className="rounded-full"
            style={{ objectFit: "cover" }}
          />
        </div>
      </div>

      {/* Right Column: Content */}
      <div className="flex-1 min-w-0">
        {/* Header Row */}
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-1 text-[15px] leading-5 overflow-hidden">
            <span className="font-bold text-foreground truncate hover:underline cursor-pointer">
              Alex Creator
            </span>
            <BadgeCheck
              size={16}
              className="text-blue-500 fill-blue-500/10 shrink-0"
            />
            <span className="text-muted-foreground truncate">@alexcreates</span>
            <span className="text-muted-foreground shrink-0">·</span>
            <span className="text-muted-foreground shrink-0 hover:underline cursor-pointer">
              17h
            </span>
          </div>
          <div className="p-1 rounded-full hover:bg-blue-500/10 hover:text-blue-500 transition-colors cursor-pointer -mr-2 -mt-1">
            <MoreHorizontal size={16} className="text-muted-foreground" />
          </div>
        </div>

        {/* Post Text */}
        <div className="mt-0.5 mb-3 text-[15px] leading-normal font-normal font-manrope text-foreground whitespace-pre-wrap">
          Just used PlateCreator to schedule my whole week of content. The
          brutalist templates are literally a cheat code.
          <br />
          <br />
          <span className="text-blue-500 hover:underline cursor-pointer">
            #contentcreator
          </span>{" "}
          <span className="text-blue-500 hover:underline cursor-pointer">
            #growth
          </span>
        </div>

        {/* Post Media (Video/Image Placeholder) */}
        <div className="rounded-2xl overflow-hidden border border-border/50 mb-3 bg-muted/20 relative h-48 w-92 flex items-center justify-center group cursor-pointer">
          <div
            className="absolute inset-0 opacity-50"
            style={{
              backgroundImage:
                "repeating-linear-gradient(-45deg, transparent, transparent 4px, currentColor 4px, currentColor 5px)",
              color: "oklch(var(--border))",
            }}
          />
          <ImageIcon
            size={48}
            className="text-muted-foreground/50 relative z-10"
            strokeWidth={1}
          />
          <div className="absolute bottom-3 right-3 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded font-medium z-10">
            0:05
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex justify-between text-muted-foreground w-full max-w-[calc(100%-1rem)]">
          <div className="flex items-center gap-1 group cursor-pointer transition-colors hover:text-blue-500">
            <div className="p-1.5 -ml-1.5 rounded-full group-hover:bg-blue-500/10 transition-colors">
              <MessageCircle size={18} />
            </div>
            <span className="text-xs">12</span>
          </div>

          <div className="flex items-center gap-1 group cursor-pointer transition-colors hover:text-green-500">
            <div className="p-1.5 -ml-1.5 rounded-full group-hover:bg-green-500/10 transition-colors">
              <Repeat size={18} />
            </div>
            <span className="text-xs">5</span>
          </div>

          <div className="flex items-center gap-1 group cursor-pointer transition-colors hover:text-pink-500">
            <div className="p-1.5 -ml-1.5 rounded-full group-hover:bg-pink-500/10 transition-colors">
              <Heart size={18} />
            </div>
            <span className="text-xs">84</span>
          </div>

          <div className="flex items-center gap-1 group cursor-pointer transition-colors hover:text-blue-500">
            <div className="p-1.5 -ml-1.5 rounded-full group-hover:bg-blue-500/10 transition-colors">
              <BarChart2 size={18} />
            </div>
            <span className="text-xs">712</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-1.5 -ml-1.5 rounded-full hover:bg-blue-500/10 hover:text-blue-500 transition-colors cursor-pointer">
              <Bookmark size={18} />
            </div>
            <div className="p-1.5 -ml-1.5 rounded-full hover:bg-blue-500/10 hover:text-blue-500 transition-colors cursor-pointer">
              <Share size={18} />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export const LinkedInPost = () => (
  <div className="bg-card border-2 p-6 text-card-foreground w-full max-w-md mx-auto shadow-2xl relative z-10">
    <div className="flex justify-between items-start mb-4">
      <div className="flex gap-3">
        {/* Added overflow-hidden here */}
        <div className="w-10 h-10 bg-muted rounded-full overflow-hidden">
          <Image
            src="/pfp1.jpg"
            alt="avatar"
            width={45}
            height={45}
            className="rounded-full"
            style={{ cursor: "pointer", objectFit: "cover" }}
          />
        </div>
        <div>
          <div className="font-bold text-[16px] font-display leading-tight font-manrope">
            Sarah Design
          </div>
          <div className="text-neutral-500 text-[12px] font-inter">
            Product Designer
          </div>
          <div className="text-neutral-500 text-[11px] font-sm flex font-inter">
            3d . Edited . <Earth className="size-3.5 " />
          </div>
        </div>
      </div>
      <MoreHorizontal size={20} className="text-muted-foreground" />
    </div>
    <div className="mb-6 text-[14px] leading-relaxed font-light font-inter">
      Consistency is the hardest part of building a personal brand.
      <br />
      <br />
      Finally found a workflow that works with PlateCreator. The drag-and-drop
      scheduler is a game changer.
      <div className="h-42 w-full bg-muted/30 flex items-center justify-center border-2 mt-4 border-border relative overflow-hidden group">
        <div
          className="absolute inset-0 opacity-50 "
          style={{
            backgroundImage:
              "repeating-linear-gradient(-45deg, transparent, transparent 4px, currentColor 4px, currentColor 5px)",
            color: "oklch(var(--border))",
          }}
        />
        <div className="relative z-10 flex flex-col items-center text-muted-foreground">
          <ImageIcon size={32} strokeWidth={1} className="mb-2" />
        </div>
      </div>
    </div>
    <div className="border-t border-border pt-3 flex justify-between text-muted-foreground">
      <div className="flex flex-col items-center gap-1 hover:bg-muted p-2 cursor-pointer flex-1 transition-colors rounded">
        <ThumbsUp size={16} />
        <span className="text-[10px] uppercase tracking-wider hidden sm:inline font-manrope">
          Like
        </span>
      </div>
      <div className="flex flex-col items-center gap-1 hover:bg-muted p-2 cursor-pointer flex-1 transition-colors rounded">
        <MessageCircle size={16} />
        <span className="text-[10px] uppercase tracking-wider hidden sm:inline font-manrope">
          Comment
        </span>
      </div>
      <div className="flex flex-col items-center gap-1 hover:bg-muted p-2 cursor-pointer flex-1 transition-colors rounded">
        <Repeat size={16} />
        <span className="text-[10px] uppercase tracking-wider hidden sm:inline font-manrope">
          Repost
        </span>
      </div>
      <div className="flex flex-col items-center gap-1 hover:bg-muted p-2 cursor-pointer flex-1 transition-colors rounded">
        <Send size={16} className=" mb-1" />
        <span className="text-[10px] uppercase tracking-wider hidden sm:inline font-manrope">
          Send
        </span>
      </div>
    </div>
  </div>
);

export const InstagramPost = () => (
  <div className="bg-card border-2 text-card-foreground w-full max-w-md mx-auto shadow-2xl pb-2 relative z-10">
    <div className="flex justify-between items-center p-3 border-b border-border">
      <div className="flex items-center gap-3">
        {/* Added overflow-hidden here */}
        <div className="w-10 h-10 bg-muted rounded-full overflow-hidden">
          <Image
            src="/pfp3.jpg"
            alt="avatar"
            width={45}
            height={45}
            className="rounded-full"
            style={{ cursor: "pointer", objectFit: "contain" }}
          />
        </div>{" "}
        <span className="text-xs font-bold font-display font-manrope">
          visual_architect
        </span>
      </div>
      <MoreHorizontal size={16} className="text-muted-foreground" />
    </div>

    {/* Reduced height from aspect-square to specific height to fit frame better */}
    <div className="h-56 w-full bg-muted/30 flex items-center justify-center border-b border-border relative overflow-hidden group">
      <div
        className="absolute inset-0 opacity-50"
        style={{
          backgroundImage:
            "repeating-linear-gradient(-45deg, transparent, transparent 4px, currentColor 4px, currentColor 5px)",
          color: "oklch(var(--border))",
        }}
      />
      <div className="relative z-10 flex flex-col items-center text-muted-foreground">
        <ImageIcon size={32} strokeWidth={1} className="mb-2" />
      </div>
    </div>

    <div className="px-4 py-2">
      <div className="flex justify-between items-center mb-2">
        <div className="flex gap-3 text-foreground">
          <Heart
            size={20}
            className="cursor-pointer hover:text-muted-foreground transition-colors"
          />
          <MessageCircle
            size={20}
            className="cursor-pointer hover:text-muted-foreground transition-colors"
          />
          <Send
            size={20}
            className="cursor-pointer hover:text-muted-foreground transition-colors"
          />
        </div>
        <Bookmark
          size={20}
          className="cursor-pointer hover:text-muted-foreground transition-colors"
        />
      </div>

      <div className="text-xs font-bold mb-1 font-manrope">3,492 likes</div>
      <div className="text-xs leading-snug text-muted-foreground line-clamp-2 ">
        <span className="font-bold mr-2 text-foreground font-manrope">
          visual_architect
        </span>
        <span className="font-inter">
          Minimalist designs that convert. Built entirely in PlateCreator. Link
          in bio.
        </span>
      </div>
    </div>
  </div>
);
