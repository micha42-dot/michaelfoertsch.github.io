import React, { useEffect, useRef } from 'react';

interface Point {
  x: number;
  y: number;
  z: number;
  ox: number; // original x (cube)
  oy: number; // original y
  oz: number; // original z
  tx: number; // target x (sphere or core)
  ty: number; // target y
  tz: number; // target z
  layer: 'shell' | 'core'; // Differentiate between outer shell and inner core
}

// Helper interface for projected 2D points used in the render pass
interface ProjectedPoint {
  x: number;
  y: number;
  z: number; // Depth for sorting/alpha
  r: number;
  g: number;
  b: number;
  alpha: number;
  size: number;
  glow: number;
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
    
    // State variables for rotation
    let autoRotationY = 0; 
    let mouseRotationX = 0; 
    let mouseRotationY = 0; 
    
    let hoverFactor = 0; 
    let time = 0;

    // Configuration
    const PARTICLE_COUNT = 850; // Reduced further for a looser, cleaner look
    const baseSize = 1000; 
    
    // Initialize points
    const points: Point[] = [];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      // Cube positions (Source)
      const x = (Math.random() - 0.5) * baseSize;
      const y = (Math.random() - 0.5) * baseSize;
      const z = (Math.random() - 0.5) * baseSize;

      // Determine Layer
      const isCore = Math.random() < 0.25; 
      
      // Calculate Target Positions
      const length = Math.sqrt(x*x + y*y + z*z);
      
      let nx, ny, nz;

      if (isCore) {
        // Core: Compressed into the center
        const theta = Math.random() * 2 * Math.PI;
        const phi = Math.acos(2 * Math.random() - 1);
        const r = (Math.random() * 0.25 + 0.05) * baseSize; 
        
        nx = r * Math.sin(phi) * Math.cos(theta);
        ny = r * Math.sin(phi) * Math.sin(theta);
        nz = r * Math.cos(phi);
      } else {
        // Shell: Projected to surface
        const sphereScale = 1.0; 
        nx = (x / length) * baseSize * sphereScale;
        ny = (y / length) * baseSize * sphereScale;
        nz = (z / length) * baseSize * sphereScale;
      }

      points.push({
        x, y, z,
        ox: x, oy: y, oz: z,
        tx: nx, ty: ny, tz: nz,
        layer: isCore ? 'core' : 'shell'
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
      
      // Layout Logic
      const isMobile = width < 768;
      const cx = isMobile ? width / 2 : width * 0.75; 
      const cy = height / 2;

      // Dynamic Object Size
      const baseScale = isMobile 
        ? Math.min(width, height) * 0.20
        : Math.min(width, height) * 0.22;

      // Interaction Logic
      const dx = mouseRef.current.x - cx;
      const dy = mouseRef.current.y - cy;
      const distance = Math.sqrt(dx*dx + dy*dy);
      
      const triggerRadius = baseScale * 2.5; 
      const isHovering = distance < triggerRadius;

      // Smooth transition
      const targetFactor = isHovering ? 1 : 0;
      hoverFactor += (targetFactor - hoverFactor) * 0.05;

      // Time
      time += 0.038;
      
      // Clear
      ctx.clearRect(0, 0, width, height);

      // --- ROTATION LOGIC ---
      const rotSpeedBase = 0.0015;
      const rotSpeedMHD = 0.011; 
      autoRotationY += rotSpeedBase + (rotSpeedMHD * hoverFactor);

      let targetTiltX = 0;
      let targetPanY = 0;

      if (mouseRef.current.x > -100) {
          targetTiltX = (dy / height) * Math.PI * 0.5; 
          targetPanY = (dx / width) * Math.PI * 0.5;
      }

      mouseRotationX += (targetTiltX - mouseRotationX) * 0.05;
      mouseRotationY += (targetPanY - mouseRotationY) * 0.05;

      const finalRotationX = mouseRotationX;
      const finalRotationY = autoRotationY + mouseRotationY;

      const PERSPECTIVE = 1200;
      
      const cosY = Math.cos(finalRotationY);
      const sinY = Math.sin(finalRotationY);
      const cosX = Math.cos(finalRotationX);
      const sinX = Math.sin(finalRotationX);

      // --- PASS 1: CALCULATE POSITIONS ---
      // We need to calculate all points first before drawing lines
      const projectedPoints: ProjectedPoint[] = new Array(PARTICLE_COUNT);

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const p = points[i];

        // Interpolation
        let lx = p.ox + (p.tx - p.ox) * hoverFactor;
        let ly = p.oy + (p.ty - p.oy) * hoverFactor;
        let lz = p.oz + (p.tz - p.oz) * hoverFactor;

        // Rotation
        let x1 = lx * cosY - lz * sinY;
        let z1 = lz * cosY + lx * sinY;
        let y1 = ly;

        let y2 = y1 * cosX - z1 * sinX;
        let z2 = z1 * cosX + y1 * sinX;
        let x2 = x1;

        let isGlitching = false;

        // Physics
        if (hoverFactor > 0.01) {
            if (p.layer === 'shell') {
                const freq = 0.02; 
                const speed = 11.5;
                
                const wave1 = Math.sin(p.ox * freq + time * speed);
                const wave2 = Math.cos(p.oy * freq + time * speed);
                const wave3 = Math.sin(p.oz * freq + time * speed * 1.5); 
                
                const screenScaleEst = PERSPECTIVE / (PERSPECTIVE + z2);
                const estScreenX = x2 * screenScaleEst * (baseScale / baseSize * 2);
                const estScreenY = y2 * screenScaleEst * (baseScale / baseSize * 2);

                const distToMouseX = estScreenX - dx;
                const distToMouseY = estScreenY - dy;
                const distToMouse = Math.sqrt(distToMouseX*distToMouseX + distToMouseY*distToMouseY);
                
                const magnetRange = 300;
                const magnetStrength = Math.max(0, 1 - distToMouse / magnetRange);
                
                const twitch = (Math.random() - 0.5) * 40 * hoverFactor;

                let displacement = ((wave1 + wave2 + wave3) * 100 * hoverFactor) + twitch; 
                
                if (magnetStrength > 0) {
                    displacement += magnetStrength * 250 * hoverFactor;
                    
                    const glitchChance = 0.2;
                    if (Math.random() < glitchChance) {
                        isGlitching = true;
                        const glitchSeverity = 50 * magnetStrength * hoverFactor;
                        if (Math.random() > 0.5) {
                            x2 += (Math.random() - 0.5) * glitchSeverity;
                        } else {
                            y2 += (Math.random() - 0.5) * glitchSeverity;
                        }
                    }
                }

                const scale = 1 + (displacement / baseSize); 
                
                x2 *= scale;
                y2 *= scale;
                z2 *= scale;

                if (magnetStrength > 0) {
                     const pullFactor = 0.1 * magnetStrength * hoverFactor;
                     x2 += (dx - estScreenX) * pullFactor;
                     y2 += (dy - estScreenY) * pullFactor;
                }

            } else {
                // Core Jitter
                const jitterBase = 60 * hoverFactor;
                x2 += (Math.random() - 0.5) * jitterBase;
                y2 += (Math.random() - 0.5) * jitterBase;
                z2 += (Math.random() - 0.5) * jitterBase;
            }
        }

        // Projection
        const worldX = x2 * (baseScale / baseSize * 2);
        const worldY = y2 * (baseScale / baseSize * 2);
        const worldZ = z2 * (baseScale / baseSize * 2);

        const scale = PERSPECTIVE / (PERSPECTIVE + worldZ);
        const x2d = cx + worldX * scale;
        const y2d = cy + worldY * scale;
        const alpha = ((worldZ + baseScale) / (baseScale * 2)) * 0.5 + 0.4;

        // Color Calculation
        let r, g, b;
        let glowSize = 0;
        
        if (hoverFactor < 0.1) {
            const gray = 150 + Math.random() * 100;
            r = gray; g = gray; b = gray;
        } else {
            if (p.layer === 'core') {
                const dist = Math.sqrt(x2*x2 + y2*y2 + z2*z2);
                const normDist = Math.min(1, dist / (baseSize * 0.4));
                const flicker = Math.random() * 0.2;
                
                if (normDist < 0.3) {
                    r = 255; g = 255; b = 200 + Math.random() * 55; glowSize = 25;
                } else if (normDist < 0.7) {
                    r = 255; g = Math.floor(200 * (1 - normDist)) - (flicker * 50); b = 0; glowSize = 15;
                } else {
                    r = 200 - (normDist * 100); g = 0; b = 0;
                }
            } else {
                if (isGlitching) {
                    r = 220; g = 255; b = 255;
                } else {
                    const energy = (Math.sin(p.ox * 0.02 + time * 5) + 1) / 2; 
                    const spark = Math.random() > 0.98 ? 100 : 0;
                    r = 30 + (50 * energy) + spark;   
                    g = 80 + (100 * energy) + spark;  
                    b = 200 + (55 * energy) + spark; 
                }
            }
        }

        // Blending
        if (hoverFactor > 0 && hoverFactor < 1) {
             const cubeR = 180; const cubeG = 180; const cubeB = 180;
             r = cubeR + (r - cubeR) * hoverFactor;
             g = cubeG + (g - cubeG) * hoverFactor;
             b = cubeB + (b - cubeB) * hoverFactor;
        }

        projectedPoints[i] = { x: x2d, y: y2d, z: worldZ, r, g, b, alpha, size: Math.max(1.5, 4 * scale), glow: glowSize };
      }

      // --- SORT POINTS BY X-COORDINATE ---
      // This enables efficient spatial search on X-axis
      projectedPoints.sort((a, b) => a.x - b.x);

      // --- PASS 2: RENDER ---
      
      // A. Render Network Lines (The Net)
      ctx.lineWidth = 0.5;
      const connectionDistance = 65; // Reduced connection distance for a looser, less cluttered net

      for (let i = 0; i < PARTICLE_COUNT; i++) {
          const p1 = projectedPoints[i];
          if (p1.alpha <= 0) continue;

          // Improved search loop:
          // Check until X-distance is too large
          for (let j = 1; j < PARTICLE_COUNT - i; j++) {
              const p2 = projectedPoints[i + j];
              
              const dx = p2.x - p1.x;
              if (dx > connectionDistance) break;

              if (p2.alpha <= 0) continue;

              const dy = Math.abs(p1.y - p2.y);
              if (dy > connectionDistance) continue;

              const distSq = dx*dx + dy*dy;
              if (distSq < connectionDistance * connectionDistance) {
                  // Reduced opacity multiplier for lighter lines
                  const opacity = Math.min(p1.alpha, p2.alpha) * 0.15; 
                  ctx.strokeStyle = `rgba(${p1.r}, ${p1.g}, ${p1.b}, ${opacity})`;
                  ctx.beginPath();
                  ctx.moveTo(p1.x, p1.y);
                  ctx.lineTo(p2.x, p2.y);
                  ctx.stroke();
              }
          }
      }

      // B. Render Particles (Pixels)
      for (let i = 0; i < PARTICLE_COUNT; i++) {
          const p = projectedPoints[i];
          if (p.alpha <= 0) continue;

          ctx.fillStyle = `rgba(${Math.floor(p.r)}, ${Math.floor(p.g)}, ${Math.floor(p.b)}, ${p.alpha})`;
          
          if (p.glow > 0 && hoverFactor > 0.5) {
              ctx.shadowBlur = p.glow * hoverFactor;
              ctx.shadowColor = `rgba(${p.r}, ${p.g}, ${p.b}, 0.8)`;
          } else {
              ctx.shadowBlur = 0;
          }

          ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
          ctx.shadowBlur = 0;
      }

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
