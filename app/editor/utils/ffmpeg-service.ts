"use client";

import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";

let ffmpegInstance: FFmpeg | null = null;
let isLoaded = false;
let loadPromise: Promise<FFmpeg> | null = null;

export async function getFFmpeg(
  onLog?: (message: string) => void,
  onProgress?: (progress: number) => void
): Promise<FFmpeg> {
  if (ffmpegInstance && isLoaded) {
    return ffmpegInstance;
  }

  if (loadPromise) {
    return loadPromise;
  }

  loadPromise = (async () => {
    const ffmpeg = new FFmpeg();

    ffmpeg.on("log", ({ message }) => {
      if (onLog) onLog(message);
    });

    ffmpeg.on("progress", ({ progress }) => {
      if (onProgress) onProgress(Math.round(progress * 100));
    });

    try {
      const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm";
      await ffmpeg.load({
        coreURL: await toBlobURL(
          `${baseURL}/ffmpeg-core.js`,
          "text/javascript"
        ),
        wasmURL: await toBlobURL(
          `${baseURL}/ffmpeg-core.wasm`,
          "application/wasm"
        ),
      });
      ffmpegInstance = ffmpeg;
      isLoaded = true;
      return ffmpeg;
    } catch (error) {
      console.error("Failed to load FFmpeg from CDN, retrying...", error);
      // Fallback to local or alternate CDN
      const fallbackBase = "https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.6/dist/esm";
      await ffmpeg.load({
        coreURL: await toBlobURL(
          `${fallbackBase}/ffmpeg-core.js`,
          "text/javascript"
        ),
        wasmURL: await toBlobURL(
          `${fallbackBase}/ffmpeg-core.wasm`,
          "application/wasm"
        ),
      });
      ffmpegInstance = ffmpeg;
      isLoaded = true;
      return ffmpeg;
    } finally {
      loadPromise = null;
    }
  })();

  return loadPromise;
}

export async function transcodeToMp4(
  webmBlob: Blob,
  onProgress?: (progress: number) => void
): Promise<Blob> {
  const ffmpeg = await getFFmpeg(undefined, onProgress);
  const inputData = await fetchFile(webmBlob);

  await ffmpeg.writeFile("input.webm", inputData);

  // Transcode to standard H.264 MP4 with YUV420P pixel format for broad playback compatibility
  await ffmpeg.exec([
    "-i",
    "input.webm",
    "-c:v",
    "libx264",
    "-preset",
    "ultrafast",
    "-pix_fmt",
    "yuv420p",
    "-y",
    "output.mp4",
  ]);

  const data = await ffmpeg.readFile("output.mp4");
  const uint8 = data instanceof Uint8Array ? data : new Uint8Array(data as any);
  return new Blob([uint8.buffer], { type: "video/mp4" });
}

export async function transcodeToGif(
  webmBlob: Blob,
  onProgress?: (progress: number) => void
): Promise<Blob> {
  const ffmpeg = await getFFmpeg(undefined, onProgress);
  const inputData = await fetchFile(webmBlob);

  await ffmpeg.writeFile("input.webm", inputData);

  // High-Quality 2-Pass Palette Generation & Dithering for GIFs
  await ffmpeg.exec([
    "-i",
    "input.webm",
    "-vf",
    "fps=20,scale=iw:ih:flags=lanczos,palettegen=stats_mode=diff",
    "-y",
    "palette.png",
  ]);

  await ffmpeg.exec([
    "-i",
    "input.webm",
    "-i",
    "palette.png",
    "-lavfi",
    "fps=20,scale=iw:ih:flags=lanczos [x]; [x][1:v] paletteuse=dither=bayer:bayer_scale=5",
    "-y",
    "output.gif",
  ]);

  const data = await ffmpeg.readFile("output.gif");
  const uint8 = data instanceof Uint8Array ? data : new Uint8Array(data as any);
  return new Blob([uint8.buffer], { type: "image/gif" });
}
