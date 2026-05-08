"use client";

import { useEffect, useRef, useCallback } from "react";

const ORBITS = [
  { rx: 95,  ry: 26  },
  { rx: 220, ry: 60  },
  { rx: 375, ry: 102 },
  { rx: 560, ry: 152 },
];

const PLANETS = [
  { oi: 0, angle: Math.PI * 1.22, r: 20,  isTarget: false },
  { oi: 1, angle: Math.PI * 0.06, r: 18,  isTarget: false },
  { oi: 2, angle: Math.PI * 1.78, r: 32,  isTarget: false },
  { oi: 3, angle: Math.PI * 0.50, r: 68,  isTarget: true  },
];

export const SECTION_START = 0.88;
export interface TargetInfo { x: number; y: number; r: number; }

function seededRand(seed: number) {
  const x = Math.sin(seed + 1) * 43758.5453123;
  return x - Math.floor(x);
}

interface Props {
  scrollProgress: number;
  onTargetInfo?: (info: TargetInfo) => void;
}

export default function OuterSpace({ scrollProgress, onTargetInfo }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef<number>(0);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W  = canvas.width;
    const H  = canvas.height;
    const cx = W / 2;
    const cy = H * 0.44;

    const zoomPhase = Math.min(scrollProgress / SECTION_START, 1);
    const zoomScale = 1 + zoomPhase * 5.5;

    const tp = PLANETS.find(p => p.isTarget)!;

    const tiltRaw  = Math.max(0, Math.min(1, (zoomPhase - 0.15) / 0.85));
    const tiltEase = tiltRaw < 0.5
      ? 2 * tiltRaw * tiltRaw
      : 1 - Math.pow(-2 * tiltRaw + 2, 2) / 2;
    const ryScale      = 1.0 - tiltEase;
    const scaledOrbits = ORBITS.map(o => ({
      rx: o.rx,
      ry: Math.max(0.3, o.ry * ryScale),
    }));

    const tSx = cx + scaledOrbits[tp.oi].rx * Math.cos(tp.angle);
    const tSy = cy + scaledOrbits[tp.oi].ry * Math.sin(tp.angle);

    const panT    = Math.min(1, zoomPhase / 0.50);
    const camOffX = (W / 2 - tSx) * panT;
    const earlyLiftY = Math.max(0, 1 - zoomPhase / 0.50) * H * 0.06;
    const camOffY    = (H / 2 - tSy) * panT - earlyLiftY;

    const sectionPhase = Math.max(0, Math.min(1,
      (scrollProgress - SECTION_START) / (1 - SECTION_START)
    ));

    const sunFade = Math.max(0, 1 - Math.max(0, (zoomPhase - 0.52) / 0.30));
    const targetLitFade = Math.max(0, 1 - sectionPhase / 0.4) * sunFade;
    const glowFromDark  = Math.max(0, 1 - sunFade / 0.85);
    const glowFromEnd   = Math.max(0, Math.min(1, sectionPhase / 0.5));
    const glowIntensity = Math.max(glowFromDark, glowFromEnd);

    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, W, H);

    if (glowIntensity > 0.01) {
      const nebula = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, Math.max(W, H) * 0.7);
      nebula.addColorStop(0.0, `rgba(20,22,40,${(0.55 * glowIntensity).toFixed(3)})`);
      nebula.addColorStop(0.5, `rgba(10,12,22,${(0.30 * glowIntensity).toFixed(3)})`);
      nebula.addColorStop(1.0, "rgba(0,0,0,0)");
      ctx.fillStyle = nebula;
      ctx.fillRect(0, 0, W, H);
    }

    for (let i = 0; i < 720; i++) {
      const sx   = seededRand(i * 3 + 0) * W;
      const sy   = seededRand(i * 3 + 1) * H;
      const rand = seededRand(i * 3 + 2);
      let radius: number, opacity: number;
      if (rand < 0.65) {
        radius = 0.28 + rand * 0.4; opacity = 0.12 + rand * 0.22;
      } else if (rand < 0.90) {
        radius = 0.55 + (rand - 0.65) * 1.2; opacity = 0.35 + (rand - 0.65) * 0.8;
      } else {
        radius = 0.9 + (rand - 0.90) * 2.5; opacity = 0.65 + (rand - 0.90) * 1.5;
      }
      ctx.beginPath();
      ctx.arc(sx, sy, Math.min(radius, 1.6), 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${Math.min(opacity, 0.92)})`;
      ctx.fill();
    }

    ctx.save();
    ctx.translate(W / 2, H / 2);
    ctx.scale(zoomScale, zoomScale);
    ctx.translate(-W / 2, -H / 2);
    ctx.translate(camOffX, camOffY);

    const wpos = (p: typeof PLANETS[0]) => ({
      px: cx + scaledOrbits[p.oi].rx * Math.cos(p.angle),
      py: cy + scaledOrbits[p.oi].ry * Math.sin(p.angle),
    });

    const strokeOrbitAroundPlanet = (
      orb: { rx: number; ry: number },
      planetX: number, planetY: number,
      planetR: number,
    ) => {
      const steps = 1440;
      ctx.strokeStyle = "rgba(255,255,255,0.65)";
      ctx.lineWidth   = 0.55 / zoomScale;
      let drawing = false;
      for (let i = 0; i <= steps; i++) {
        const a      = (i / steps) * Math.PI * 2;
        const ex     = cx + orb.rx * Math.cos(a);
        const ey     = cy + orb.ry * Math.sin(a);
        const inside = Math.hypot(ex - planetX, ey - planetY) < planetR;
        if (!inside) {
          if (!drawing) { ctx.beginPath(); ctx.moveTo(ex, ey); drawing = true; }
          else ctx.lineTo(ex, ey);
        } else {
          if (drawing) { ctx.stroke(); drawing = false; }
        }
      }
      if (drawing) ctx.stroke();
    };

    const drawPlanetBody = (
      px: number, py: number, r: number,
      litFade: number
    ) => {
      const dx   = cx - px;
      const dy   = cy - py;
      const dist = Math.hypot(dx, dy) || 1;
      const nx   = dx / dist;
      const ny   = dy / dist;
      const litX = px + nx * r;
      const litY = py + ny * r;
      const shdX = px - nx * r;
      const shdY = py - ny * r;

      ctx.save();
      ctx.beginPath();
      ctx.arc(px, py, r, 0, Math.PI * 2);
      ctx.clip();

      const matte = ctx.createRadialGradient(px, py, 0, px, py, r);
      matte.addColorStop(0.0, "rgb(22,20,18)");
      matte.addColorStop(0.6, "rgb(14,13,12)");
      matte.addColorStop(1.0, "rgb(8,7,6)");
      ctx.fillStyle = matte;
      ctx.fillRect(px - r, py - r, r * 2, r * 2);

      if (litFade > 0.01) {
        const lum  = Math.max(0.18, 1 - dist / 900) * litFade;
        const grad = ctx.createLinearGradient(litX, litY, shdX, shdY);
        grad.addColorStop(0.00, `rgba(255,255,255,${(0.40 * lum).toFixed(3)})`);
        grad.addColorStop(0.08, `rgba(210,210,210,${(0.22 * lum).toFixed(3)})`);
        grad.addColorStop(0.22, `rgba(60,60,60,${(0.05 * lum).toFixed(3)})`);
        grad.addColorStop(0.32, "rgba(0,0,0,0)");
        grad.addColorStop(1.00, "rgba(0,0,0,0)");
        ctx.fillStyle = grad;
        ctx.fillRect(px - r, py - r, r * 2, r * 2);
      }

      ctx.restore();
    };

    const drawTargetGlow = (px: number, py: number, r: number) => {
      if (glowIntensity <= 0.01) return;
      const rim = ctx.createRadialGradient(px, py, r * 0.80, px, py, r * 1.6);
      rim.addColorStop(0.00, `rgba(255,255,255,${(0.18 * glowIntensity).toFixed(3)})`);
      rim.addColorStop(0.50, `rgba(255,255,255,${(0.06 * glowIntensity).toFixed(3)})`);
      rim.addColorStop(1.00, "rgba(0,0,0,0)");
      ctx.beginPath();
      ctx.arc(px, py, r * 1.6, 0, Math.PI * 2);
      ctx.fillStyle = rim;
      ctx.fill();
      const halo = ctx.createRadialGradient(px, py, r * 0.9, px, py, r * 4.0);
      halo.addColorStop(0.00, `rgba(255,255,255,${(0.22 * glowIntensity).toFixed(3)})`);
      halo.addColorStop(0.25, `rgba(255,255,255,${(0.10 * glowIntensity).toFixed(3)})`);
      halo.addColorStop(0.60, `rgba(255,255,255,${(0.03 * glowIntensity).toFixed(3)})`);
      halo.addColorStop(1.00, "rgba(0,0,0,0)");
      ctx.beginPath();
      ctx.arc(px, py, r * 4.0, 0, Math.PI * 2);
      ctx.fillStyle = halo;
      ctx.fill();
    };

    PLANETS
      .filter(p => Math.sin(p.angle) < 0 && !p.isTarget)
      .forEach(p => {
        const { px, py } = wpos(p);
        strokeOrbitAroundPlanet(scaledOrbits[p.oi], px, py, p.r);
        drawPlanetBody(px, py, p.r, sunFade);
      });

    if (sunFade > 0) {
      const R = 42;
      ctx.globalAlpha = sunFade;
      const corona = ctx.createRadialGradient(cx, cy, R * 0.75, cx, cy, R * 3.6);
      corona.addColorStop(0,   "rgba(255,255,255,0.16)");
      corona.addColorStop(0.5, "rgba(255,255,255,0.04)");
      corona.addColorStop(1,   "rgba(255,255,255,0.00)");
      ctx.beginPath();
      ctx.arc(cx, cy, R * 3.6, 0, Math.PI * 2);
      ctx.fillStyle = corona;
      ctx.fill();
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.fillStyle = "#ececec";
      ctx.fill();
      ctx.globalAlpha = 1;
    }

    PLANETS
      .filter(p => Math.sin(p.angle) >= 0 && !p.isTarget)
      .sort((a, b) => Math.sin(a.angle) - Math.sin(b.angle))
      .forEach(p => {
        const { px, py } = wpos(p);
        strokeOrbitAroundPlanet(scaledOrbits[p.oi], px, py, p.r);
        drawPlanetBody(px, py, p.r, sunFade);
      });

    {
      const { px, py } = wpos(tp);
      drawTargetGlow(px, py, tp.r);
      strokeOrbitAroundPlanet(scaledOrbits[tp.oi], px, py, tp.r);
      drawPlanetBody(px, py, tp.r, targetLitFade);
    }

    ctx.restore();

    if (onTargetInfo) {
      const rawX   = tSx + camOffX;
      const rawY   = tSy + camOffY;
      const finalX = (rawX - W / 2) * zoomScale + W / 2;
      const finalY = (rawY - H / 2) * zoomScale + H / 2;
      onTargetInfo({ x: finalX, y: finalY, r: tp.r * zoomScale });
    }
  }, [scrollProgress, onTargetInfo]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, [draw]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}