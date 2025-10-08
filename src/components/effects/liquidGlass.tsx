"use client";

import React, { useEffect, useRef, useState } from "react";

interface LiquidGlassProps {
  width?: number;
  height?: number;
  borderRadius?: number | string;
  brightness?: number;
  blur?: number;
  saturate?: number;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  centerScale?: number;
  distortX?: number;
  distortY?: number;
  verticalShrink?: number;
  horizontalScale?: number;
}

// Utility functions from liquid-glass.tsx
function smoothStep(a: number, b: number, t: number): number {
  t = Math.max(0, Math.min(1, (t - a) / (b - a)));
  return t * t * (3 - 2 * t);
}

function length(x: number, y: number): number {
  return Math.sqrt(x * x + y * y);
}

function roundedRectSDF(
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
): number {
  const qx = Math.abs(x) - width + radius;
  const qy = Math.abs(y) - height + radius;
  return (
    Math.min(Math.max(qx, qy), 0) +
    length(Math.max(qx, 0), Math.max(qy, 0)) -
    radius
  );
}

function texture(x: number, y: number): { type: "t"; x: number; y: number } {
  return { type: "t", x, y };
}

// Generate unique ID
function generateId(): string {
  return "liquid-glass-" + Math.random().toString(36).substr(2, 9);
}

export const LiquidGlass: React.FC<LiquidGlassProps> = ({
  width = 300,
  height = 200,
  borderRadius = 150,
  brightness = 1.1,
  saturate = 1.1,
  blur = 0.25,
  className,
  style,
  children,
  centerScale = 1,
  distortX = 0.3,
  distortY = 0.2,
  verticalShrink = 1,
  horizontalScale = 1,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef<{ x: number; y: number }>({ x: 0.5, y: 0.5 });

  const idRef = useRef<string>(generateId());

  const [mounted, setMounted] = useState(false);

  const dragRef = useRef<{
    isDragging: boolean;
    startX: number;
    startY: number;
    initialLeft: number;
    initialTop: number;
  }>({
    isDragging: false,
    startX: 0,
    startY: 0,
    initialLeft: 0,
    initialTop: 0,
  });

  // Update shader effect based on mouse position
  const updateShader = () => {
    const canvas = canvasRef.current;
    const svg = svgRef.current;

    if (!canvas || !svg) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = width;
    const h = height;
    const data = new Uint8ClampedArray(w * h * 4);

    let maxScale = 0;
    const rawValues: number[] = [];

    // Fragment shader function from liquid-glass.tsx with center radial shrink effect
    const fragment = (
      uv: { x: number; y: number },
      mouse?: { x: number; y: number }
    ) => {
      const ix = uv.x - 0.5;
      const iy = uv.y - 0.5;

      const scaledIx = ix * centerScale * horizontalScale;
      const scaledIy = iy * centerScale * verticalShrink;

      const distanceToEdge = roundedRectSDF(
        scaledIx,
        scaledIy,
        distortX,
        distortY,
        0.6
      );
      const edgeScale = smoothStep(0.8, 0, distanceToEdge - 0.15);

      const finalScale = edgeScale;
      return texture(scaledIx * finalScale + 0.5, scaledIy * finalScale + 0.5);
    };

    for (let i = 0; i < data.length; i += 4) {
      const x = (i / 4) % w;
      const y = Math.floor(i / 4 / w);
      const pos = fragment({ x: x / w, y: y / h }, mouseRef.current);
      const dx = pos.x * w - x;
      const dy = pos.y * h - y;
      maxScale = Math.max(maxScale, Math.abs(dx), Math.abs(dy));
      rawValues.push(dx, dy);
    }

    maxScale *= 0.5;

    let index = 0;
    for (let i = 0; i < data.length; i += 4) {
      const r = rawValues[index++] / maxScale + 0.5;
      const g = rawValues[index++] / maxScale + 0.5;
      data[i] = r * 255;
      data[i + 1] = g * 255;
      data[i + 2] = 0;
      data[i + 3] = 255;
    }

    ctx.putImageData(new ImageData(data, w, h), 0, 0);

    // Update the feImage href
    const feImage = svg.querySelector(`#${idRef.current}_map`);
    if (feImage) {
      feImage.setAttributeNS(
        "http://www.w3.org/1999/xlink",
        "href",
        canvas.toDataURL()
      );
    }

    // Update scale
    const feDisplacementMap = svg.querySelector(
      `#${idRef.current}_displacement`
    );
    if (feDisplacementMap) {
      feDisplacementMap.setAttribute("scale", maxScale.toString());
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    updateShader();

    const handleMouseMove = (event: MouseEvent) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;

      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;

      mouseRef.current = { x, y };
      updateShader();

      if (dragRef.current.isDragging && containerRef.current) {
        const dx = event.clientX - dragRef.current.startX;
        const dy = event.clientY - dragRef.current.startY;
        containerRef.current.style.left =
          dragRef.current.initialLeft + dx + "px";
        containerRef.current.style.top = dragRef.current.initialTop + dy + "px";
        containerRef.current.style.transform = "none";
      }
    };

    const handleMouseUp = () => {
      if (!containerRef.current) return;
      dragRef.current.isDragging = false;
      containerRef.current.style.cursor = "grab";
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [
    mounted,
    width,
    height,
    centerScale,
    distortX,
    distortY,
    verticalShrink,
    horizontalScale,
  ]);

  if (!mounted) return null;

  // Style for container div
  const containerStyle: React.CSSProperties = {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width,
    height,
    overflow: "hidden",
    borderRadius:
      typeof borderRadius === "number" ? `${borderRadius}px` : borderRadius,
    backdropFilter: `blur(${blur}px) brightness(${brightness}) saturate(${saturate}) contrast(1.2) url(#${idRef.current}_filter)`,
    WebkitBackdropFilter: `brightness(${brightness}) saturate(${saturate}) contrast(1.2)`,
    boxShadow:
      "0 4px 8px rgba(0, 0, 0, 0.25), 0 -10px 25px inset rgba(0, 0, 0, 0.15)",
    cursor: "grab",
    zIndex: 9999,
    pointerEvents: "auto",
    ...style,
  };

  // Handler for mouse down on the container only
  const handleContainerMouseDown = (
    event: React.MouseEvent<HTMLDivElement>
  ) => {
    if (!containerRef.current) return;
    dragRef.current.isDragging = true;
    dragRef.current.startX = event.clientX;
    dragRef.current.startY = event.clientY;

    const style = window.getComputedStyle(containerRef.current);
    const left = parseFloat(style.left) || 0;
    const top = parseFloat(style.top) || 0;

    dragRef.current.initialLeft = left;
    dragRef.current.initialTop = top;

    // Disable transform during drag
    containerRef.current.style.transform = "none";
    containerRef.current.style.position = "fixed";
    containerRef.current.style.cursor = "grabbing";
  };

  return (
    <>
      <svg
        ref={svgRef}
        xmlns="http://www.w3.org/2000/svg"
        width="0"
        height="0"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          pointerEvents: "none",
          zIndex: 9998,
        }}
      >
        <defs>
          <filter
            id={`${idRef.current}_filter`}
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
            x="0"
            y="0"
            width={width}
            height={height}
          >
            <feImage
              id={`${idRef.current}_map`}
              width={width}
              height={height}
            />
            <feDisplacementMap
              id={`${idRef.current}_displacement`}
              in="SourceGraphic"
              in2={`${idRef.current}_map`}
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        style={{ display: "none" }}
      />
      <div
        ref={containerRef}
        className={className}
        style={containerStyle}
        onMouseDown={handleContainerMouseDown}
      >
        {children}
      </div>
    </>
  );
};
