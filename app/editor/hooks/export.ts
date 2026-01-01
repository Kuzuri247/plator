// app/editor/hooks/export.ts
import { useState, RefObject } from "react";
import { toast } from "sonner";
import { toPng, toJpeg, toSvg } from "html-to-image";
import { useRouter } from "next/navigation";

export function useExport(
  canvasRef: RefObject<HTMLDivElement | null>,
  setSelectedElementId: (id: string | null) => void,
  currentAspectRatio: { width: number; height: number },
  canvasBackground: string,
) {
  const [exportFormat, setExportFormat] = useState("png");
  const [exportQuality, setExportQuality] = useState("2");
  const router = useRouter();

  const generateImage = async () => {
    if (!canvasRef.current) return null;
    setSelectedElementId(null);

    const pixelRatio = parseInt(exportQuality) || 2;
    
    await new Promise(resolve => setTimeout(resolve, 150));

    const options = {
      quality: 1.0,
      pixelRatio: pixelRatio,
      width: currentAspectRatio.width,
      height: currentAspectRatio.height,
      backgroundColor: canvasBackground.startsWith("#")
        ? canvasBackground
        : "transparent",
      cacheBust: true,
      skipAutoScale: false,
      includeQueryParams: true,
      filter: (node: HTMLElement) => {
        return true;
      },
      style: {
        transform: 'scale(1)',
        transformOrigin: 'top left',
      },
    };

    try {
      await new Promise(resolve => requestAnimationFrame(resolve));
      
      if (exportFormat === "svg") {
        return await toSvg(canvasRef.current, options);
      } else if (exportFormat === "jpeg") {
        return await toJpeg(canvasRef.current, {
          ...options,
          quality: 0.99,
        });
      } else {
        return await toPng(canvasRef.current, options);
      }
    } catch (error) {
      console.error("Export generation failed:", error);
      toast.error("Failed to generate image.");
      return null;
    }
  };

  const downloadImage = (dataUrl: string) => {
    const link = document.createElement("a");
    link.download = `plator-export.${exportFormat}`;
    link.href = dataUrl;
    link.click();
  };

  const handleDownload = async () => {
    const dataUrl = await generateImage();
    if (dataUrl) {
      downloadImage(dataUrl);
      toast.success("Exported successfully!");
    }
  };

  const handleDownloadAndPreview = async () => {
    const dataUrl = await generateImage();
    if (dataUrl) {
      downloadImage(dataUrl);

      try {
        localStorage.setItem("plator-preview-image", dataUrl);
        toast.success("Exported! Redirecting to preview...");

        setTimeout(() => {
          router.push("/preview");
        }, 1000);
      } catch (e) {
        toast.error("Image too large for local preview storage.");
      }
    }
  };

  return {
    exportFormat,
    setExportFormat,
    exportQuality,
    setExportQuality,
    handleDownload,
    handleDownloadAndPreview,
  };
}
