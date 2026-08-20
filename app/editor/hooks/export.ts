"use client";

import { RefObject, useState } from "react";
import { toast } from "sonner";
import { toPng, toJpeg, toSvg } from "html-to-image";
import { useStore } from "../store/use-store";
import { captureCanvasFrames } from "../utils/canvas-recorder";
import {
  renderFramesToMp4,
  renderFramesToGif,
  renderFramesToWebM,
} from "../utils/ffmpeg-service";

export function useExport(
  canvasRef: RefObject<HTMLDivElement | null>,
  setSelectedElementId: (id: string | null) => void
) {
  const {
    aspectRatio,
    canvasBackground,
    meshConfig,
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

    const toastId = toast.loading(
      `Preparing ${exportFormat.toUpperCase()} export...`
    );

    try {
      if (
        exportFormat === "mp4" ||
        exportFormat === "gif" ||
        exportFormat === "webm"
      ) {
        const qualityScale = Math.max(1, parseInt(exportQuality) || 2);
        const targetFps =
          exportFormat === "gif" ? Math.min(exportFps || 30, 30) : exportFps || 60;
        const isMesh =
          canvasBackground === "mesh" ||
          (!canvasBackground.startsWith("url(") &&
            !canvasBackground.startsWith("#") &&
            !canvasBackground.startsWith("rgb"));

        setExportStatus("Capturing high-resolution frames...");
        toast.loading(
          `Capturing ${exportDuration}s @ ${targetFps} FPS (${qualityScale}x HD)...`,
          { id: toastId }
        );

        const captured = await captureCanvasFrames(canvasRef.current, {
          durationSeconds: exportDuration || 3,
          fps: targetFps,
          scale: qualityScale,
          meshConfig,
          isMeshBackground: isMesh,
          onProgress: (pct, status) => {
            setExportProgress(Math.round(pct * 0.45)); // 0 - 45%
            if (status) setExportStatus(status);
          },
        });

        if (exportFormat === "mp4") {
          setExportStatus("Encoding studio-quality H.264 MP4 with FFmpeg...");
          toast.loading("Encoding crystal-clear MP4 with FFmpeg WASM...", {
            id: toastId,
          });

          const mp4Blob = await renderFramesToMp4(
            captured.frames,
            captured.fps,
            (ffmpegPct) => {
              setExportProgress(45 + Math.round(ffmpegPct * 0.55));
            }
          );

          downloadBlob(mp4Blob, `plator-video-${Date.now()}.mp4`);
          toast.success("MP4 exported in crystal-clear quality!", {
            id: toastId,
          });
          return;
        }

        if (exportFormat === "gif") {
          setExportStatus("Generating palette-optimized GIF...");
          toast.loading("Generating optimized looping GIF...", {
            id: toastId,
          });

          const gifBlob = await renderFramesToGif(
            captured.frames,
            captured.fps,
            (ffmpegPct) => {
              setExportProgress(45 + Math.round(ffmpegPct * 0.55));
            }
          );

          downloadBlob(gifBlob, `plator-animation-${Date.now()}.gif`);
          toast.success("GIF exported successfully!", { id: toastId });
          return;
        }

        if (exportFormat === "webm") {
          setExportStatus("Encoding high-quality VP9 WebM...");
          toast.loading("Encoding VP9 WebM...", { id: toastId });

          const webmBlob = await renderFramesToWebM(
            captured.frames,
            captured.fps,
            (ffmpegPct) => {
              setExportProgress(45 + Math.round(ffmpegPct * 0.55));
            }
          );

          downloadBlob(webmBlob, `plator-animation-${Date.now()}.webm`);
          toast.success("WebM exported successfully!", { id: toastId });
          return;
        }
      } else {
        // Static image export (PNG, JPEG, SVG)
        setExportStatus("Rendering high-resolution image...");
        const dataUrl = await generateStaticImage();
        if (dataUrl) {
          downloadDataUrl(
            dataUrl,
            `plator-export-${Date.now()}.${exportFormat}`
          );
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
