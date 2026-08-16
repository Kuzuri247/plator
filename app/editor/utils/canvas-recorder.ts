"use client";

export interface RecordOptions {
  durationSeconds: number;
  fps?: number;
  onProgress?: (percent: number) => void;
}

export async function recordCanvasToWebM(
  containerEl: HTMLElement,
  options: RecordOptions
): Promise<Blob> {
  const { durationSeconds = 3, fps = 60, onProgress } = options;

  // Locate primary WebGL canvas
  const webglCanvas = containerEl.querySelector("canvas") || (containerEl instanceof HTMLCanvasElement ? containerEl : null);

  if (!webglCanvas) {
    throw new Error("No canvas element found to record.");
  }

  const width = webglCanvas.width || containerEl.clientWidth || 1280;
  const height = webglCanvas.height || containerEl.clientHeight || 720;

  // Create an offscreen compositing canvas at full resolution
  const compositeCanvas = document.createElement("canvas");
  compositeCanvas.width = width;
  compositeCanvas.height = height;
  const ctx = compositeCanvas.getContext("2d", { alpha: false });

  if (!ctx) {
    throw new Error("Failed to create composite canvas context.");
  }

  // Setup live stream from composite canvas or direct webgl canvas
  const stream = compositeCanvas.captureStream ? compositeCanvas.captureStream(fps) : (webglCanvas as any).captureStream(fps);

  const mimeTypes = [
    "video/webm;codecs=vp9,opus",
    "video/webm;codecs=vp9",
    "video/webm;codecs=vp8,opus",
    "video/webm;codecs=vp8",
    "video/webm",
  ];

  let selectedMime = "";
  for (const mime of mimeTypes) {
    if (MediaRecorder.isTypeSupported(mime)) {
      selectedMime = mime;
      break;
    }
  }

  if (!selectedMime) {
    selectedMime = "video/webm";
  }

  const recorder = new MediaRecorder(stream, {
    mimeType: selectedMime,
    videoBitsPerSecond: 12000000, // 12 Mbps for crisp 1080p
  });

  const chunks: Blob[] = [];
  recorder.ondataavailable = (e) => {
    if (e.data && e.data.size > 0) {
      chunks.push(e.data);
    }
  };

  return new Promise<Blob>((resolve, reject) => {
    let animId: number;
    const startTime = performance.now();
    const totalMs = durationSeconds * 1000;

    recorder.onstop = () => {
      cancelAnimationFrame(animId);
      const fullBlob = new Blob(chunks, { type: selectedMime });
      resolve(fullBlob);
    };

    recorder.onerror = (err) => {
      cancelAnimationFrame(animId);
      reject(err);
    };

    recorder.start(100); // 100ms timeslices

    const renderFrame = () => {
      const elapsed = performance.now() - startTime;
      const progress = Math.min(100, Math.round((elapsed / totalMs) * 100));
      if (onProgress) onProgress(progress);

      // Draw background WebGL canvas
      if (webglCanvas.width > 0 && webglCanvas.height > 0) {
        ctx.drawImage(webglCanvas, 0, 0, width, height);
      }

      // Draw interactive layers if any (SVG or image layers)
      const images = containerEl.querySelectorAll("img");
      images.forEach((img) => {
        if (img.complete && img.naturalWidth > 0 && img.style.opacity !== "0") {
          const rect = img.getBoundingClientRect();
          const parentRect = containerEl.getBoundingClientRect();
          const scaleX = width / parentRect.width;
          const scaleY = height / parentRect.height;
          const x = (rect.left - parentRect.left) * scaleX;
          const y = (rect.top - parentRect.top) * scaleY;
          const w = rect.width * scaleX;
          const h = rect.height * scaleY;

          ctx.save();
          if (img.style.borderRadius) {
            const rad = parseFloat(img.style.borderRadius) * scaleX;
            ctx.beginPath();
            ctx.roundRect(x, y, w, h, rad);
            ctx.clip();
          }
          ctx.drawImage(img, x, y, w, h);
          ctx.restore();
        }
      });

      if (elapsed < totalMs) {
        animId = requestAnimationFrame(renderFrame);
      } else {
        recorder.stop();
      }
    };

    animId = requestAnimationFrame(renderFrame);
  });
}
