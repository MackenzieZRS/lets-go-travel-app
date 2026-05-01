"use client";

import { useEffect, useRef } from "react";

interface Point {
  x: number;
  y: number;
}

interface Path {
  start: Point;
  end: Point;
  control: Point;
  progress: number;
  speed: number;
  delay: number;
}

export default function FlightPathCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let paths: Path[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initPaths();
    };

    const initPaths = () => {
      paths = [];
      const numPaths = window.innerWidth > 768 ? 20 : 10;
      
      for (let i = 0; i < numPaths; i++) {
        const startX = Math.random() * canvas.width;
        const startY = Math.random() * canvas.height;
        const endX = Math.random() * canvas.width;
        const endY = Math.random() * canvas.height;
        
        // Create a curved path
        const controlX = (startX + endX) / 2 + (Math.random() - 0.5) * 300;
        const controlY = (startY + endY) / 2 - 200;

        paths.push({
          start: { x: startX, y: startY },
          end: { x: endX, y: endY },
          control: { x: controlX, y: controlY },
          progress: 0,
          speed: 0.001 + Math.random() * 0.002,
          delay: Math.random() * 100,
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      paths.forEach((path) => {
        // Draw the path
        ctx.beginPath();
        ctx.moveTo(path.start.x, path.start.y);
        ctx.quadraticCurveTo(path.control.x, path.control.y, path.end.x, path.end.y);
        ctx.strokeStyle = "rgba(232, 150, 58, 0.3)"; // #E8963A at 30%
        ctx.lineWidth = 1;
        ctx.stroke();

        if (path.delay > 0) {
          path.delay--;
          return;
        }

        // Calculate dot position
        const t = path.progress;
        const x = (1 - t) * (1 - t) * path.start.x + 2 * (1 - t) * t * path.control.x + t * t * path.end.x;
        const y = (1 - t) * (1 - t) * path.start.y + 2 * (1 - t) * t * path.control.y + t * t * path.end.y;

        // Draw dot glow
        ctx.shadowBlur = 15;
        ctx.shadowColor = "#E8963A";
        
        // Draw the dot
        ctx.beginPath();
        ctx.arc(x, y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = "#E8963A";
        ctx.fill();
        
        // Reset shadow
        ctx.shadowBlur = 0;

        // Update progress
        path.progress += path.speed;
        if (path.progress >= 1) {
          path.progress = 0;
          path.delay = Math.random() * 200;
        }
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    window.addEventListener("resize", resize);
    resize();
    draw();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-0 pointer-events-none bg-charcoal"
    />
  );
}
