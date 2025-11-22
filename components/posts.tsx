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
} from "lucide-react";
import Image from "next/image";

export const XPost = () => (
  <div className="bg-card border border-border p-6 text-card-foreground w-full max-w-md mx-auto shadow-2xl relative z-10">
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
        </div>{" "}
        <div className="flex justify-center items-center">
          <div className="flex  items-center gap-2 justify-center">
            <span className="font-bold text-[15px] font-display">
              Alex Creator
            </span>
            <span className="text-muted-foreground text-[14px]">
              @alexcreates
            </span>
          </div>
        </div>
      </div>
    </div>
    <div className="mb-6 text-[16px] leading-relaxed font-light font-manrope">
      Just used PlateCreator to schedule my whole week of content. The brutalist
      templates are literally a cheat code.
      <br />
      <br />
      <span className="text-blue-500">#contentcreator</span>{" "}
      <span className="text-blue-500">#growth</span>
    </div>
    <div className="flex justify-between text-muted-foreground border-t border-border pt-4">
      <div className="flex items-center gap-2 group cursor-pointer hover:text-foreground transition-colors">
        <MessageCircle size={18} />
        <span className="text-xs">12</span>
      </div>
      <div className="flex items-center gap-2 group cursor-pointer hover:text-foreground transition-colors">
        <Repeat size={18} />
        <span className="text-xs">5</span>
      </div>
      <div className="flex items-center gap-2 group cursor-pointer hover:text-foreground transition-colors">
        <Heart size={18} />
        <span className="text-xs">84</span>
      </div>
      <div className="flex items-center gap-2 group cursor-pointer hover:text-foreground transition-colors">
        <Share size={18} />
      </div>
    </div>
  </div>
);

export const LinkedInPost = () => (
  <div className="bg-card border border-border p-6 text-card-foreground w-full max-w-md mx-auto shadow-2xl relative z-10">
    <div className="flex justify-between items-start mb-4">
      <div className="flex gap-3">
        {/* Added overflow-hidden here */}
        <div className="w-10 h-10 bg-muted rounded-full overflow-hidden">
          <Image
            src="/pfp2.jpg"
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
  <div className="bg-card border border-border text-card-foreground w-full max-w-md mx-auto shadow-2xl pb-2 relative z-10">
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