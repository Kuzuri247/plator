export const ScalePattern = () => {
  const rows = 5;
  const cols = 5;

  return (
    <div className="absolute inset-0 grid grid-cols-5 grid-rows-5 pointer-events-none select-none z-0 gap-0">
      {Array.from({ length: rows * cols }).map((_, i) => {
        const row = Math.floor(i / cols);
        const col = i % cols;
        // staggered pattern
        // Determine if this cell should have the pattern
        let isActive = false;
        if (row % 2 === 0) {
          // Rows 1, 3, 5 (index 0, 2, 4) -> Active on cols 1, 3, 5 (index 0, 2, 4)
          if (col % 2 === 0) isActive = true;
        } else {
          // Rows 2, 4 (index 1, 3) -> Active on cols 2, 4 (index 1, 3)
          if (col % 2 !== 0) isActive = true;
        }

        return (
          <div key={i} className="relative border-[0.5px] border-border/20">
            {isActive && (
              <div
                className="absolute inset-0 opacity-100 dark:opacity-50 transition-opacity duration-500"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(315deg, oklch(var(--primary)/0.30) 0, oklch(var(--primary)/0.2) 1px, transparent 0, transparent 50%)",
                  backgroundSize: "9px 9px",
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export const EtchingCorner = ({ className }: { className?: string }) => (
  <div className={`absolute size-4 border-black dark:border-white ${className}`}>
    <div className="absolute w-full h-px bg-black dark:border-white top-0 left-0"></div>
    <div className="absolute h-full w-px bg-black dark:border-white top-0 left-0"></div>
    <div className="absolute top-0 left-0 size-4 bg-foreground"></div>
  </div>
);