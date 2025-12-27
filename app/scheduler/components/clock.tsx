import { useState, useEffect, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export const CustomAnalogClock = ({
  time,
  setTime,
}: {
  time: string;
  setTime: (t: string) => void;
}) => {
  const [hours, minutes] = time.split(":").map(Number);
  const clockRef = useRef<HTMLDivElement>(null);
  const [draggingHand, setDraggingHand] = useState<"hour" | "minute" | null>(
    null,
  );

  const isPm = hours >= 12;
  const displayHours = hours % 12 || 12;

  const minuteRotation = minutes * 6;
  const hourRotation = displayHours * 30 + minutes * 0.5;

  const angleFromPointer = (clientX: number, clientY: number) => {
    if (!clockRef.current) return 0;
    const rect = clockRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    const dx = clientX - cx;
    const dy = clientY - cy;

    let deg = (Math.atan2(dy, dx) * 180) / Math.PI;
    deg = deg + 90;
    if (deg < 0) deg += 360;
    return deg;
  };

  const updateTimeFromAngle = useCallback(
    (clientX: number, clientY: number, hand: "hour" | "minute") => {
      const angleDeg = angleFromPointer(clientX, clientY);
      if (hand === "minute") {
        const newMinutes = Math.round((angleDeg / 360) * 60) % 60;
        setTime(
          `${hours.toString().padStart(2, "0")}:${newMinutes
            .toString()
            .padStart(2, "0")}`,
        );
      } else {
        let h12 = Math.round((angleDeg / 360) * 12);
        if (h12 === 0) h12 = 12;

        let newHour24 = h12;
        if (isPm && h12 !== 12) newHour24 += 12;
        if (!isPm && h12 === 12) newHour24 = 0;

        setTime(
          `${newHour24.toString().padStart(2, "0")}:${minutes
            .toString()
            .padStart(2, "0")}`,
        );
      }
    },
    [hours, minutes, isPm, setTime],
  );

  const handlePointerDown =
    (hand: "hour" | "minute") => (e: React.PointerEvent) => {
      e.preventDefault();
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      setDraggingHand(hand);
    };

  useEffect(() => {
    const handleMove = (e: PointerEvent) => {
      if (!draggingHand) return;
      updateTimeFromAngle(e.clientX, e.clientY, draggingHand);
    };
    const handleUp = () => setDraggingHand(null);

    if (draggingHand) {
      window.addEventListener("pointermove", handleMove);
      window.addEventListener("pointerup", handleUp);
    }
    return () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
    };
  }, [draggingHand, updateTimeFromAngle]);

  const toggleAmPm = () => {
    let newHours = hours;
    if (isPm) newHours -= 12;
    else newHours += 12;
    setTime(
      `${newHours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}`,
    );
  };

  return (
    <div className="flex flex-col items-center justify-center gap-6 h-full select-none">
      <div
        ref={clockRef}
        className="relative w-48 h-48 rounded-full border-[6px] border-muted bg-card shadow-inner flex items-center justify-center touch-none"
      >
        {/* markings  */}
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "absolute bg-muted-foreground/30 rounded-full origin-center",
              i % 3 === 0 ? "w-1 h-4" : "w-1 h-2",
            )}
            style={{
              transform: `rotate(${i * 30}deg) translateY(-90px)`,
            }}
          />
        ))}

        <div className="absolute w-4 h-4 bg-primary rounded-full z-30 border-2 border-background shadow-sm" />
        {/* hour hand */}
        <div
          className={cn(
            "absolute top-1/2 left-1/2 w-2 h-16 -translate-x-1/2 -translate-y-1/2 origin-bottom z-20",
            draggingHand === "hour"
              ? "cursor-grabbing"
              : "cursor-grab transition-transform duration-150 ease-out",
          )}
          style={{
            transform: `translate(1%, -50%) rotate(${hourRotation}deg)`,
            transformOrigin: "50% 100%",
          }}
          onPointerDown={handlePointerDown("hour")}
        >
          <div className="w-full h-full bg-primary rounded-full shadow-md" />
        </div>
        {/* minute hand */}
        <div
          className={cn(
            "absolute top-1/2 left-1/2 w-1 h-20 -translate-x-1/2 -translate-y-1/2 origin-bottom z-10",
            draggingHand === "minute"
              ? "cursor-grabbing"
              : "cursor-grab transition-transform duration-150 ease-out",
          )}
          style={{
            transform: `translate(-1%, -50%) rotate(${minuteRotation}deg)`,
            transformOrigin: "50% 100%",
          }}
          onPointerDown={handlePointerDown("minute")}
        >
          <div className="w-full h-full bg-muted-foreground rounded-full shadow-sm" />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 bg-muted/40 px-3 py-1 rounded-sm border border-border/50 focus-within:border-primary/50 transition-colors">
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="bg-transparent text-xl font-mono font-bold text-foreground focus:outline-none cursor-pointer w-24 text-center "
          />
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={toggleAmPm}
          className={cn(
            "w-12 h-10 font-bold border-2 transition-all rounded-sm",
          )}
        >
          {isPm ? "PM" : "AM"}
        </Button>
      </div>
    </div>
  );
};
