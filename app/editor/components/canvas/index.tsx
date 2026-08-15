"use client";

import { forwardRef, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Image as ImageIcon } from "lucide-react";
import { ImageLayer } from "./image-layer";
import { TextLayer } from "./text-layer";
import { WebGLCanvas } from "./webgl-canvas";
import { VectorOverlay } from "./vector-overlay";
import { StudioTexture } from "./studio-texture";
import { EditorCanvasProps } from "../../types";

export const Canvas = forwardRef<HTMLDivElement, EditorCanvasProps>(
  (
    {
      width,
      height,
      canvasBackground,
      meshConfig,
      overlayConfig,
      elements,
      onEmptyClick,
      selectedElementId,
      onElementMouseDown,
      onMouseMove,
      onMouseUp,
      isDragging,
      isCropping,
      onCropChange,
    },
    ref
  ) => {
    const handleEmptyClick = useCallback(() => {
      onEmptyClick();
    }, [onEmptyClick]);

    const isMeshBackground =
      canvasBackground === "mesh" ||
      (!canvasBackground.startsWith("url(") &&
        !canvasBackground.startsWith("#") &&
        !canvasBackground.startsWith("rgb"));

    const getBackgroundStyle = (
      bg: string,
      aspectWidth: number,
      aspectHeight: number
    ) => {
      if (bg.startsWith("url(")) {
        const isTallCanvas = aspectHeight >= aspectWidth;
        return {
          backgroundImage: bg,
          backgroundSize: isTallCanvas ? "cover" : "contain",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        };
      }
      if (isMeshBackground) {
        return {
          background: "#09090b",
        };
      }
      return {
        background: bg,
      };
    };

    const visibleElements = elements.filter((el) => el.isVisible);

    return (
      <Card className="p-0 bg-transparent border-none shadow-none overflow-visible relative group/canvas touch-none">
        <div
          ref={ref}
          data-canvas="true"
          id="plator-master-canvas"
          className="relative overflow-hidden transition-all duration-300 ease-in-out flex items-center justify-center select-none touch-none rounded-lg"
          style={{
            width: width,
            height: height,
            ...getBackgroundStyle(canvasBackground, width, height),
            transformStyle: "preserve-3d",
            perspective: "2500px",
            perspectiveOrigin: "center center",
            contain: "layout style paint",
          }}
          onPointerMove={onMouseMove as any}
          onPointerUp={onMouseUp as any}
          onPointerLeave={onMouseUp as any}
        >
          {/* WebGL Fluid Mesh Gradient Background Layer */}
          {isMeshBackground && (
            <WebGLCanvas
              width={width}
              height={height}
              meshColors={meshConfig.colors}
              speed={meshConfig.speed}
              noiseIntensity={meshConfig.noiseIntensity}
              noiseScale={meshConfig.noiseScale}
              noiseGrain={meshConfig.noiseGrain}
              isAnimating={meshConfig.isAnimating}
              ditherEnabled={meshConfig.ditherEnabled}
              ditherType={meshConfig.ditherType}
              ditherPixelSize={meshConfig.ditherPixelSize}
              ditherColorSteps={meshConfig.ditherColorSteps}
            />
          )}

          {/* SVG Vector Pattern Overlay */}
          <VectorOverlay
            type={overlayConfig.pattern}
            opacity={overlayConfig.patternOpacity}
            color={overlayConfig.patternColor}
          />

          {/* Studio Tactile Texture Overlay */}
          <StudioTexture
            type={overlayConfig.texture}
            opacity={overlayConfig.textureOpacity}
          />

          {/* Show placeholder if no elements AND background is not an image */}
          {elements.length === 0 && !canvasBackground.includes("url(") && (
            <div
              onClick={handleEmptyClick}
              className="group w-56 h-36 border-2 border-dashed border-white/70 hover:border-white rounded-xl flex flex-col items-center justify-center cursor-pointer bg-black/20 backdrop-blur-sm hover:backdrop-blur-md transition-all z-20"
            >
              <ImageIcon className="size-8 mb-2 text-white/80 group-hover:text-white transition-colors" />
              <span className="text-sm text-white/90 font-medium font-inter group-hover:text-white">
                Click to Upload Layer
              </span>
            </div>
          )}

          {visibleElements.map((el, index) => {
            const isSelected = selectedElementId === el.id;
            const zIndex = index + 20;
            const wrapperStyle = {
              zIndex,
            };

            if (el.type === "image") {
              return (
                <div key={el.id} style={wrapperStyle}>
                  <ImageLayer
                    img={el}
                    isSelected={isSelected}
                    isDragging={isDragging && isSelected}
                    onPointerDown={
                      el.isLocked ? undefined : (onElementMouseDown as any)
                    }
                    isCropping={isCropping && isSelected}
                    onCropChange={onCropChange}
                    isLocked={el.isLocked}
                  />
                </div>
              );
            } else if (el.type === "text") {
              return (
                <div key={el.id} style={wrapperStyle}>
                  <TextLayer
                    element={el}
                    isSelected={isSelected}
                    isDragging={isDragging && isSelected}
                    onPointerDown={
                      el.isLocked ? undefined : (onElementMouseDown as any)
                    }
                    isLocked={el.isLocked}
                  />
                </div>
              );
            }
            return null;
          })}
        </div>
      </Card>
    );
  }
);

Canvas.displayName = "Canvas";
