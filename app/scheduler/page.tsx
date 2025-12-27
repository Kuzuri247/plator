"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Clock,
  Twitter,
  Linkedin,
  Pencil,
  PenTool,
  Trash2,
  CalendarClock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { format } from "date-fns";
import { ThemeToggle } from "@/components/theme-toggle";
import { CustomAnalogClock } from "./components/clock";

const MOCK_QUEUE = [
  {
    id: 1,
    content: "Launching our new feature tomorrow!",
    date: new Date(Date.now() + 86400000),
    platform: "twitter",
  },
  {
    id: 2,
    content: "Big networking event coming up.",
    date: new Date(Date.now() + 172800000),
    platform: "linkedin",
  },
];

export default function SchedulerPage() {
  const [content, setContent] = useState("");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [time, setTime] = useState("10:07");
  const [platforms, setPlatforms] = useState<string[]>(["twitter"]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const savedCaption = localStorage.getItem("plator-scheduler-caption");
    if (savedCaption) {
      setContent(savedCaption);
    } else {
      toast("No content found. Go to Previewer to draft a post.");
    }
  }, []);

  const togglePlatform = (p: string) => {
    setPlatforms((prev) =>
      prev.includes(p) ? prev.filter((item) => item !== p) : [...prev, p],
    );
  };

  const handleSchedule = async () => {
    if (!content) {
      toast.error(
        "No content to schedule! Draft something in the Previewer first.",
      );
      return;
    }
    if (!date) {
      toast.error("Please pick a date.");
      return;
    }

    setIsSubmitting(true);

    const [hours, minutes] = time.split(":").map(Number);
    const scheduledDateTime = new Date(date);
    scheduledDateTime.setHours(hours, minutes);

    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        body: JSON.stringify({
          content,
          platforms,
          scheduledAt: scheduledDateTime,
          mediaUrl: localStorage.getItem("plator-scheduler-image") || null,
        }),
      });

      if (!res.ok) throw new Error("Scheduling failed");

      toast.success(`Post scheduled for ${format(scheduledDateTime, "PPP p")}`);
    } catch (e) {
      toast.error("Failed to schedule post");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-screen w-full bg-background flex items-center justify-center relative overflow-hidden">
      <div className="absolute top-6 left-6 flex flex-col gap-2 z-50">
        <Link href="/editor">
          <Button
            variant="outline"
            size="sm"
            className="w-fit px-4 gap-3 bg-background/50 backdrop-blur"
          >
            <Pencil size={14} /> Editor
          </Button>
        </Link>
        <Link href="/preview">
          <Button
            variant="outline"
            size="sm"
            className="w-fit px-3 gap-2 bg-background/50 backdrop-blur"
          >
            <PenTool size={14} /> Preview
          </Button>
        </Link>
      </div>

      <div className="absolute top-4 right-4 flex flex-col gap-2 z-50">
        <ThemeToggle />
      </div>

      <div className="flex w-full max-w-6xl h-[95vh] bg-card border-2 dark:border-neutral-800 rounded-xl shadow-2xl dark:shadow-white/17 overflow-hidden">
        <div className="w-1/2 h-full flex flex-col border-r-2 dark:border-neutral-800 bg-card/50">
          <div className="border-b-2 dark:border-neutral-800 shrink-0">
            <div className="flex items-center justify-between border-b dark:border-neutral-800">
              <div className="flex w-1/2 justify-center py-3 border-r dark:border-neutral-800 bg-muted/10">
                <span className="text-sm font-bold uppercase text-muted-foreground tracking-widest flex items-center gap-2">
                  <CalendarClock size={16} /> Date
                </span>
              </div>
              <div className="flex w-1/2 justify-center py-3 bg-muted/10">
                <span className="text-sm font-bold uppercase text-muted-foreground tracking-widest flex items-center gap-2">
                  <Clock size={16} /> Time
                </span>
              </div>
            </div>

            <div className="flex h-80">
              <div className="w-1/2 border-r dark:border-neutral-800  flex items-center justify-center">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  disabled={(d) =>
                    d < new Date(new Date().setHours(0, 0, 0, 0))
                  }
                  className="rounded-md bg-background shadow-none w-fit fixed"
                  classNames={{
                    month: "space-y-4",
                    table: "border-collapse space-y-1",
                    head_row: "flex w-full justify-between gap-2",
                    row: "flex w-full mt-2 justify-between gap-2",
                    cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                  }}
                />
              </div>

              <div className="w-1/2 bg-muted/5 p-4 relative overflow-hidden flex items-center justify-center">
                <CustomAnalogClock time={time} setTime={setTime} />
              </div>
            </div>
          </div>

          <div className="flex-1 p-6 flex flex-col gap-4">
            <span className="text-sm font-bold uppercase text-muted-foreground tracking-widest">
              Publish To
            </span>

            <div className="flex flex-row gap-3">
              {["twitter", "linkedin"].map((p) => {
                const isActive = platforms.includes(p);
                return (
                  <button
                    key={p}
                    onClick={() => togglePlatform(p)}
                    className={cn(
                      "w-full py-3 rounded-sm border text-md uppercase tracking-wide flex items-center justify-center gap-3 transition-all",
                      isActive
                        ? "bg-primary text-primary-foreground font-bold border-primary shadow-md scale-[1.02]"
                        : "bg-background hover:bg-muted text-muted-foreground font-semibold border-border",
                    )}
                  >
                    {p === "twitter" ? (
                      <Twitter
                        size={18}
                        className={cn(
                          "transition-transform",
                          isActive ? "scale-105" : "scale-100",
                        )}
                      />
                    ) : (
                      <Linkedin
                        size={18}
                        className={cn(
                          "transition-transform",
                          isActive ? "scale-105" : "scale-100",
                        )}
                      />
                    )}
                    {p}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-6 border-t border-border bg-background/30 shrink-0">
            <Button
              className="w-full h-14 text-base font-bold shadow-xl shadow-primary/20"
              onClick={handleSchedule}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Scheduling..." : "Confirm Schedule"}
            </Button>
          </div>
        </div>

        <div className="w-1/2 h-full bg-muted/10 flex flex-col overflow-hidden">
          <div className="p-6 border-b border-border bg-background/50 backdrop-blur-sm shrink-0 flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold font-display">
                Scheduled Queue
              </h2>
              <p className="text-xs text-muted-foreground font-manrope">
                Automation active
              </p>
            </div>
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <CalendarClock size={18} className="text-primary" />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-border hover:scrollbar-thumb-primary/50">
            {MOCK_QUEUE.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-muted-foreground/50">
                <CalendarClock size={48} className="mb-4 opacity-20" />
                <p className="text-sm">Queue is empty</p>
              </div>
            ) : (
              MOCK_QUEUE.map((post) => (
                <div
                  key={post.id}
                  className="group bg-background border-2 dark:border-neutral-800 p-4 rounded-xl flex gap-4 hover:border-primary/50 transition-all shadow-sm"
                >
                  <div className="flex flex-col items-center justify-center w-14 h-14 bg-muted/30 rounded-lg border dark:border-neutral-800 shrink-0">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">
                      {format(post.date, "MMM")}
                    </span>
                    <span className="text-lg font-bold font-display">
                      {format(post.date, "dd")}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0 py-0.5">
                    <p className="text-sm text-foreground/90 line-clamp-1 font-medium">
                      {post.content}
                    </p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        {post.platform === "twitter" ? (
                          <Twitter size={12} />
                        ) : (
                          <Linkedin size={12} />
                        )}
                        <span className="capitalize">{post.platform}</span>
                      </span>
                      <span>•</span>
                      <span>{format(post.date, "h:mm a")}</span>
                    </div>
                  </div>

                  <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              ))
            )}
            <div className="h-10" />
          </div>
        </div>
      </div>
    </div>
  );
}
