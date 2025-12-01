import { useState, RefObject } from "react";
import { toast } from "sonner";
import { toPng, toJpeg, toSvg } from "html-to-image";

export function useExport(
  canvasRef: RefObject<HTMLDivElement | null>,
  setSelectedElementId: (id: string | null) => void,
  currentAspectRatio: { width: number; height: number },
  canvasBackground: string
) {
  const [exportFormat, setExportFormat] = useState("png");
  const [exportQuality, setExportQuality] = useState("2");

  const handleDownload = async () => {
    if (!canvasRef.current) return;
    // De-select elements to remove selection rings/borders before capturing
    setSelectedElementId(null);
    
    try {
      const pixelRatio = parseInt(exportQuality) || 2;
      const options = {
        quality: 1.0,
        pixelRatio: pixelRatio,
        width: currentAspectRatio.width,
        height: currentAspectRatio.height,
        backgroundColor: canvasBackground.startsWith("#")
          ? canvasBackground
          : undefined,
      };

      let dataUrl;
      if (exportFormat === "svg") {
        dataUrl = await toSvg(canvasRef.current, options);
      } else if (exportFormat === "jpeg") {
        dataUrl = await toJpeg(canvasRef.current, options);
      } else {
        dataUrl = await toPng(canvasRef.current, options);
      }

      const link = document.createElement("a");
      link.download = `plator-export.${exportFormat}`;
      link.href = dataUrl;
      link.click();
      toast.success("Exported successfully!");
    } catch (error) {
      console.error("Export failed:", error);
      toast.error("Failed to export. Please try again.");
    }
  };

  return {
    exportFormat,
    setExportFormat,
    exportQuality,
    setExportQuality,
    handleDownload,
  };
}