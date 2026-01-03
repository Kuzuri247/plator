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

    const options = {
      quality: 1.0,
      pixelRatio: pixelRatio,
      width: currentAspectRatio.width,
      height: currentAspectRatio.height,
      cacheBust: true,
      skipAutoScale: false,
      backgroundColor: canvasBackground.startsWith("#")
        ? canvasBackground
        : undefined,
      style: {
        transform: "scale(1)",
        transformOrigin: "top left",
      },
      filter: (node: HTMLElement) => {
        if (node.tagName === "SCRIPT" || node.tagName === "STYLE") {
          return false;
        }
        return true;
      },
    };

    try {
      if (exportFormat === "svg") {
        return await toSvg(canvasRef.current, {
          ...options,
          width: currentAspectRatio.width,
          height: currentAspectRatio.height,
          pixelRatio: 1,
        });
      } else if (exportFormat === "jpeg") {
        return await toJpeg(canvasRef.current, {
          ...options,
          quality: 1.0,
        });
      } else {
        return await toPng(canvasRef.current, options);
      }
    } catch (error) {
      console.error("Export generation failed:", error);
      
      try {
        toast.info("Retrying with compatibility mode...");
        const fallbackOptions = {
          ...options,
          pixelRatio: Math.max(1, pixelRatio - 1),
          cacheBust: true,
        };
        
        if (exportFormat === "svg") {
          return await toSvg(canvasRef.current, {
            ...fallbackOptions,
            pixelRatio: 1,
          });
        } else if (exportFormat === "jpeg") {
          return await toJpeg(canvasRef.current, fallbackOptions);
        } else {
          return await toPng(canvasRef.current, fallbackOptions);
        }
      } catch (fallbackError) {
        console.error("Fallback export also failed:", fallbackError);
        toast.error("Failed to generate image.");
        return null;
      }
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
