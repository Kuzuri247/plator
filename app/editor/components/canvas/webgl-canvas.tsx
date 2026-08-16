"use client";

import { useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import {
  WebGLMeshRenderer,
  MeshShaderUniforms,
  hexToRgb01,
} from "../../utils/webgl-shader-engine";

export interface WebGLCanvasProps {
  width: number;
  height: number;
  meshColors: string[];
  speed: number;
  noiseIntensity: number;
  noiseScale: number;
  noiseGrain?: number;
  isAnimating?: boolean;
  ditherEnabled: boolean;
  ditherType: number;
  ditherPixelSize: number;
  ditherColorSteps: number;
  className?: string;
}

export interface WebGLCanvasHandle {
  getCanvas: () => HTMLCanvasElement | null;
}

export const WebGLCanvas = forwardRef<WebGLCanvasHandle, WebGLCanvasProps>(
  (
    {
      width,
      height,
      meshColors,
      speed,
      noiseIntensity,
      noiseScale,
      noiseGrain = 0,
      isAnimating = true,
      ditherEnabled,
      ditherType,
      ditherPixelSize,
      ditherColorSteps,
      className,
    },
    ref
  ) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const rendererRef = useRef<WebGLMeshRenderer | null>(null);

    useImperativeHandle(ref, () => ({
      getCanvas: () => canvasRef.current,
    }));

    const buildUniforms = (): MeshShaderUniforms => {
      const colorsRGB: [
        [number, number, number],
        [number, number, number],
        [number, number, number],
        [number, number, number],
        [number, number, number]
      ] = [
        hexToRgb01(meshColors[0] || "#09090b"),
        hexToRgb01(meshColors[1] || "#18181b"),
        hexToRgb01(meshColors[2] || "#3f3f46"),
        hexToRgb01(meshColors[3] || "#71717a"),
        hexToRgb01(meshColors[4] || "#e4e4e7"),
      ];

      return {
        colors: colorsRGB,
        speed,
        noiseIntensity,
        noiseScale,
        noiseGrain,
        isAnimating,
        ditherEnabled,
        ditherType,
        ditherPixelSize,
        ditherColorSteps,
      };
    };

    // Initialize renderer
    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      canvas.width = width;
      canvas.height = height;

      const renderer = new WebGLMeshRenderer(canvas, buildUniforms());
      renderer.start();
      rendererRef.current = renderer;

      return () => {
        renderer.destroy();
        rendererRef.current = null;
      };
    }, [width, height]);

    // Update uniforms when props change
    useEffect(() => {
      if (!rendererRef.current) return;
      rendererRef.current.updateUniforms(buildUniforms());
    }, [
      meshColors,
      speed,
      noiseIntensity,
      noiseScale,
      noiseGrain,
      isAnimating,
      ditherEnabled,
      ditherType,
      ditherPixelSize,
      ditherColorSteps,
    ]);

    return (
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className={className ?? "absolute inset-0 w-full h-full pointer-events-none"}
        style={{
          width: `${width}px`,
          height: `${height}px`,
          imageRendering: ditherEnabled ? "pixelated" : "auto",
        }}
      />
    );
  }
);

WebGLCanvas.displayName = "WebGLCanvas";
