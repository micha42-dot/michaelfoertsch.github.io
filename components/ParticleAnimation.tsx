import React, { useEffect, useRef } from 'react';

interface Point {
  x: number;
  y: number;
  z: number;
  ox: number; // original x (cube)
  oy: number; // original y
  oz: number;
  tx: number; // target x (sphere)
  ty: number; // target y
  tz: number;
}

const ParticleAnimation: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    // Track mouse globally
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let rotationX = 0;
    let rotationY = 0;
    let hoverFactor = 0; // 0 = cube, 1 = sphere
    let time = 0;

    // Configuration
    const PARTICLE_COUNT = 2500; // Reduced density as requested
    const baseSize = 1000; // Internal coordinate space size

    // Initialize points
    const points: Point[] = [];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      // Cube positions
      const x = (Math.random() - 0.5) * baseSize;
      const y = (Math.random() - 0.5) * baseSize;
      const z = (Math.random() - 0.5) * baseSize;

      // Sphere positions
      const length = Math.sqrt(x*x + y*y + z*z);
      // Keep sphere same size as cube boundaries
      const sphereScale = 1.0; 
      const nx = (x / length) * baseSize * sphereScale;
      const ny = (y / length) * baseSize * sphereScale;
      const nz = (z / length) * baseSize * sphereScale;

      points.push({
        x, y, z,
        ox: x, oy: y, oz: z,
        tx: nx, ty: ny, tz: nz
      });
    }

    const render = () => {
      if (!canvas || !ctx) return;
      
      // Handle Resize
      if (canvas.width !== window.innerWidth || canvas.height !== window.innerHeight) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }

      const width = canvas.width;
      const height = canvas.height;
      
      // Layout Logic: Center on Mobile, Right side (shifted) on Desktop
      const isMobile = width < 768;
      // Shift further right (75%) to act as a backdrop
      const cx = isMobile ? width / 2 : width * 0.75; 
      const cy = height / 2;

      // Dynamic Object Size based on viewport
      // Smaller scale as requested previously
      const baseScale = isMobile 
        ? Math.min(width, height) * 0.25 
        : Math.min(width, height) * 0.30;

      // Interaction Logic: Distance based trigger
      const dx = mouseRef.current.x - cx;
      const dy = mouseRef.current.y - cy;
      const distance = Math.sqrt(dx*dx + dy*dy);
      
      // Trigger radius should roughly match the visual size of the object plus a buffer
      // Since object is smaller, we can be slightly more generous relative to size to catch the mouse
      const triggerRadius = baseScale * 1.8; 
      const isHovering = distance < triggerRadius;

      // Smooth transition for morphing
      const targetFactor = isHovering ? 1 : 0;
      // Interpolation speed
      hoverFactor += (targetFactor - hoverFactor) * 0.08;

      // Pulse logic
      time += 0.05;
      // Pulse calculation: 
      // When hoverFactor is high, pulse strongly.
      // Frequency: time * 2
      const pulseMagnitude = (Math.sin(time * 3) + 1) * 0.5; // 0 to 1, faster beat
      const pulseScale = 1 + (pulseMagnitude * 0.2 * hoverFactor);

      // Clear
      ctx.clearRect(0, 0, width, height);

      // Auto rotation
      // Spin faster when it is a pulsing ball
      const rotSpeed = 0.002 + (0.008 * hoverFactor);
      rotationY += rotSpeed;
      rotationX += rotSpeed * 0.5;

      const objectScale = baseScale * pulseScale;
      const PERSPECTIVE = 1200;

      // Colors
      // Cube: Subtle White/Gray
      // Sphere: Vibrant Electric Blue
      const startR = 200, startG = 200, startB = 200;
      const endR = 50, endG = 150, endB = 255; // Bright Blue
      
      const r = startR + (endR - startR) * hoverFactor;
      const g = startG + (endG - startG) * hoverFactor;
      const b = startB + (endB - startB) * hoverFactor;
      
      // Add a slight glow effect when pulsing
      if (hoverFactor > 0.5) {
         ctx.shadowBlur = 20 * hoverFactor;
         ctx.shadowColor = `rgba(${r}, ${g}, ${b}, 0.5)`;
      } else {
         ctx.shadowBlur = 0;
      }

      ctx.fillStyle = `rgb(${Math.floor(r)}, ${Math.floor(g)}, ${Math.floor(b)})`;

      points.forEach(p => {
        // 1. Interpolate Shape (Cube <-> Sphere)
        let lx = p.ox + (p.tx - p.ox) * hoverFactor;
        let ly = p.oy + (p.ty - p.oy) * hoverFactor;
        let lz = p.oz + (p.tz - p.oz) * hoverFactor;

        // 2. Rotation
        // Rotate Y
        const cosY = Math.cos(rotationY);
        const sinY = Math.sin(rotationY);
        let x1 = lx * cosY - lz * sinY;
        let z1 = lz * cosY + lx * sinY;
        let y1 = ly;

        // Rotate X
        const cosX = Math.cos(rotationX);
        const sinX = Math.sin(rotationX);
        let y2 = y1 * cosX - z1 * sinX;
        let z2 = z1 * cosX + y1 * sinX;
        let x2 = x1;

        // 3. Projection (3D space -> 2D screen)
        const worldX = x2 * (objectScale / baseSize * 2);
        const worldY = y2 * (objectScale / baseSize * 2);
        const worldZ = z2 * (objectScale / baseSize * 2);

        const scale = PERSPECTIVE / (PERSPECTIVE + worldZ);
        const x2d = cx + worldX * scale;
        const y2d = cy + worldY * scale;

        // Draw
        // With higher density, keep particles slightly smaller so it doesn't look like a blob
        const sizeBase = 1.0 + (0.8 * hoverFactor); 
        const size = Math.max(0.1, sizeBase * scale);
        
        const alpha = ((worldZ + objectScale) / (objectScale * 2)) * 0.5 + 0.3;

        ctx.globalAlpha = Math.min(Math.max(alpha, 0), 1);
        ctx.beginPath();
        ctx.arc(x2d, y2d, size, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
};

export default ParticleAnimation;