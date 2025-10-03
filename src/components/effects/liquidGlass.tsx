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
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const [position, setPosition] = useState<{ x: number; y: number }>({
    x: window.innerWidth / 2 - width / 2,
    y: window.innerHeight / 2 - height / 2,
  });

  const offset = 10;
  const id = generateId();

  // Constrain position within viewport bounds
  function constrainPosition(x: number, y: number) {
    const minX = offset;
    const maxX = window.innerWidth - width - offset;
    const minY = offset;
    const maxY = window.innerHeight - height - offset;

    return {
      x: Math.max(minX, Math.min(maxX, x)),
      y: Math.max(minY, Math.min(maxY, y)),
    };
  }

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

    // 使用Proxy包装mouseRef.current以检测是否在fragment中使用了鼠标参数
    const mouseProxy = new Proxy(mouseRef.current, {
      get(target, prop: string | symbol) {
        return target[prop as keyof typeof target];
      },
    });

    // Fragment shader function from liquid-glass.tsx
    const fragment = (
      uv: { x: number; y: number },
      mouse?: { x: number; y: number }
    ) => {
      const ix = uv.x - 0.5;
      const iy = uv.y - 0.5;
      const distanceToEdge = roundedRectSDF(ix, iy, 0.3, 0.2, 0.6);
      const displacement = smoothStep(0.8, 0, distanceToEdge - 0.15);
      const scaled = smoothStep(0, 1, displacement);
      return texture(ix * scaled + 0.5, iy * scaled + 0.5);
    };

    for (let i = 0; i < data.length; i += 4) {
      const x = (i / 4) % w;
      const y = Math.floor(i / 4 / w);
      const pos = fragment({ x: x / w, y: y / h }, mouseProxy);
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
    const feImage = svg.querySelector(`#${id}_map`);
    if (feImage) {
      feImage.setAttributeNS(
        "http://www.w3.org/1999/xlink",
        "href",
        canvas.toDataURL()
      );
    }

    // Update scale
    const feDisplacementMap = svg.querySelector(`#${id}_displacement`);
    if (feDisplacementMap) {
      feDisplacementMap.setAttribute("scale", maxScale.toString());
    }
  };

  // Dragging handlers
  const dragRef = useRef<{
    isDragging: boolean;
    startX: number;
    startY: number;
    initialX: number;
    initialY: number;
  }>({
    isDragging: false,
    startX: 0,
    startY: 0,
    initialX: 0,
    initialY: 0,
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 初始化元素位置
    container.style.left = position.x + "px";
    container.style.top = position.y + "px";

    function onMouseDown(e: MouseEvent) {
      dragRef.current.isDragging = true;
      dragRef.current.startX = e.clientX;
      dragRef.current.startY = e.clientY;
      // 使用元素的实时位置而不是state中的位置
      if (container) {
        const rect = container.getBoundingClientRect();
        dragRef.current.initialX = rect.left;
        dragRef.current.initialY = rect.top;
      }
      if (container) container.style.cursor = "grabbing";
      e.preventDefault();
    }

    function onMouseMove(e: MouseEvent) {
      if (!dragRef.current.isDragging) return;
      // 直接使用当前位置计算元素应该移动到的位置
      const deltaX = e.clientX - dragRef.current.startX;
      const deltaY = e.clientY - dragRef.current.startY;
      const newX = dragRef.current.initialX + deltaX;
      const newY = dragRef.current.initialY + deltaY;
      const newPos = constrainPosition(newX, newY);

      // 直接设置元素位置
      if (container) {
        container.style.left = newPos.x + "px";
        container.style.top = newPos.y + "px";
        // 移除transform属性以使用绝对定位
        container.style.transform = "none";
      }

      // Update mouse position for shader
      if (container) {
        const rect = container.getBoundingClientRect();
        mouseRef.current.x = (e.clientX - rect.left) / rect.width;
        mouseRef.current.y = (e.clientY - rect.top) / rect.height;
        updateShader();
      }
    }

    function onMouseUp() {
      dragRef.current.isDragging = false;
      if (container) {
        container.style.cursor = "grab";
        // 确保移除transform属性
        container.style.transform = "none";
        const rect = container.getBoundingClientRect();
        setPosition({ x: rect.left, y: rect.top });
      }
    }

    container.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    container.style.cursor = "grab";

    // Initial shader update
    updateShader();

    return () => {
      container.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

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
    backdropFilter: `blur(${blur}px) brightness(${brightness}) saturate(${saturate}) contrast(1.2) url(#${id}_filter)`,
    WebkitBackdropFilter: `brightness(${brightness}) saturate(${saturate}) contrast(1.2)`,
    boxShadow:
      "0 4px 8px rgba(0, 0, 0, 0.25), 0 -10px 25px inset rgba(0, 0, 0, 0.15)",
    cursor: "grab",
    zIndex: 9999,
    pointerEvents: "auto",
    ...style,
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
            id={`${id}_filter`}
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
            x="0"
            y="0"
            width={width}
            height={height}
          >
            <feImage id={`${id}_map`} width={width} height={height} />
            <feDisplacementMap
              id={`${id}_displacement`}
              in="SourceGraphic"
              in2={`${id}_map`}
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
      <div ref={containerRef} className={className} style={containerStyle}>
        {children}
      </div>
    </>
  );
};
