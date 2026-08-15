"use client";

import { RefObject, useState } from "react";
import { toast } from "sonner";
import { toPng, toJpeg, toSvg } from "html-to-image";
import { useStore } from "../store/use-store";
import { recordCanvasToWebM } from "../utils/canvas-recorder";
import { transcodeToMp4, transcodeToGif } from "../utils/ffmpeg-service";

export function useExport(
  canvasRef: RefObject<HTMLDivElement | null>,
  setSelectedElementId: (id: string | null) => void
) {
  const {
    aspectRatio,
    canvasBackground,
    exportFormat,
    exportQuality,
    exportDuration,
    exportFps,
  } = useStore();

  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportStatus, setExportStatus] = useState<string>("");

  const downloadBlob = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = filename;
    link.href = url;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const downloadDataUrl = (dataUrl: string, filename: string) => {
    const link = document.createElement("a");
    link.download = filename;
    link.href = dataUrl;
    link.click();
  };

  const generateStaticImage = async () => {
    if (!canvasRef.current) return null;
    setSelectedElementId(null);

    const pixelRatio = parseInt(exportQuality) || 2;

    const options = {
      quality: 1.0,
      pixelRatio,
      width: aspectRatio.width,
      height: aspectRatio.height,
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

    if (exportFormat === "svg") {
      return await toSvg(canvasRef.current, {
        ...options,
        width: aspectRatio.width,
        height: aspectRatio.height,
        pixelRatio: 1,
      });
    } else if (exportFormat === "jpeg") {
      return await toJpeg(canvasRef.current, options);
    } else {
      return await toPng(canvasRef.current, options);
    }
  };

  const handleDownload = async () => {
    if (isExporting) return;
    if (!canvasRef.current) {
      toast.error("Canvas element not found.");
      return;
    }

    setSelectedElementId(null);
    setIsExporting(true);
    setExportProgress(0);

    const toastId = toast.loading(`Preparing ${exportFormat.toUpperCase()} export...`);

    try {
      if (exportFormat === "mp4" || exportFormat === "gif" || exportFormat === "webm") {
        setExportStatus("Recording canvas stream...");
        toast.loading(`Capturing ${exportDuration}s 60fps canvas stream...`, {
          id: toastId,
        });

        const webmBlob = await recordCanvasToWebM(canvasRef.current, {
          durationSeconds: exportDuration || 3,
          fps: exportFps || 60,
          onProgress: (pct) => {
            setExportProgress(Math.round(pct * 0.5)); // 0 - 50% for recording
          },
        });

        if (exportFormat === "webm") {
          downloadBlob(webmBlob, `plator-animation-${Date.now()}.webm`);
          toast.success("WebM exported successfully!", { id: toastId });
          return;
        }

        if (exportFormat === "mp4") {
          setExportStatus("Encoding H.264 MP4 with FFmpeg WASM...");
          toast.loading("Transcoding to MP4 with FFmpeg WASM...", { id: toastId });

          const mp4Blob = await transcodeToMp4(webmBlob, (ffmpegPct) => {
            setExportProgress(50 + Math.round(ffmpegPct * 0.5));
          });

          downloadBlob(mp4Blob, `plator-animation-${Date.now()}.mp4`);
          toast.success("MP4 video exported successfully!", { id: toastId });
          return;
        }

        if (exportFormat === "gif") {
          setExportStatus("Generating 2-pass palette optimized GIF...");
          toast.loading("Generating optimized looping GIF...", { id: toastId });

          const gifBlob = await transcodeToGif(webmBlob, (ffmpegPct) => {
            setExportProgress(50 + Math.round(ffmpegPct * 0.5));
          });

          downloadBlob(gifBlob, `plator-animation-${Date.now()}.gif`);
          toast.success("GIF exported successfully!", { id: toastId });
          return;
        }
      } else {
        // Static image export (PNG, JPEG, SVG)
        setExportStatus("Rendering high-resolution image...");
        const dataUrl = await generateStaticImage();
        if (dataUrl) {
          downloadDataUrl(dataUrl, `plator-export-${Date.now()}.${exportFormat}`);
          toast.success(`${exportFormat.toUpperCase()} exported successfully!`, {
            id: toastId,
          });
        }
      }
    } catch (error: any) {
      console.error("Export failed:", error);
      toast.error(
        `Export failed: ${error?.message || "Unknown error occurred"}`,
        { id: toastId }
      );
    } finally {
      setIsExporting(false);
      setExportProgress(0);
      setExportStatus("");
    }
  };

  return {
    handleDownload,
    isExporting,
    exportProgress,
    exportStatus,
  };
}
