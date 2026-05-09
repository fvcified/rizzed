"use client";

import { useEffect, useRef, useCallback } from "react";


const ORBITS = [
  { rx: 220, ry: 84  },
  { rx: 375, ry: 143 },
  { rx: 560, ry: 213 },
];


const PLANETS = [
  { oi: 1, angle: Math.PI * 0, r: 32, isTarget: false },
  { oi: 2, angle: Math.PI * 0.50, r: 68, isTarget: true  },
  { oi: 0, angle: Math.PI * 1, r: 18, isTarget: false },
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
    const cy = H * 0.50;

    const zoomPhase = Math.min(scrollProgress / SECTION_START, 1);

    const tiltRaw  = Math.max(0, Math.min(1, (zoomPhase - 0.08) / 0.52));
    const tiltEase = tiltRaw < 0.5
      ? 2 * tiltRaw * tiltRaw
      : 1 - Math.pow(-2 * tiltRaw + 2, 2) / 2;
    const ryScale      = 1.0 - tiltEase;
    const scaledOrbits = ORBITS.map(o => ({ rx: o.rx, ry: Math.max(0.3, o.ry * ryScale) }));
    const zoomScale    = 1 + zoomPhase * 5.5;

    const tp  = PLANETS.find(p => p.isTarget)!;
    const tSx = cx + scaledOrbits[tp.oi].rx * Math.cos(tp.angle);
    const tSy = cy + scaledOrbits[tp.oi].ry * Math.sin(tp.angle);

    const panT    = Math.min(1, zoomPhase / 0.50);
    const camOffX = (W / 2 - tSx) * panT;
    const camOffY = (H / 2 - tSy) * panT;

    ctx.clearRect(0, 0, W, H);

    const bgGrad = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, Math.max(W, H) * 0.65);
    bgGrad.addColorStop(0.00, "rgb(22,19,16)");
    bgGrad.addColorStop(0.30, "rgb(15,13,11)");
    bgGrad.addColorStop(0.60, "rgb(10,9,8)");
    bgGrad.addColorStop(1.00, "rgb(5,4,4)");
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);

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

    const ORBIT_COLOR = "rgba(255,255,255,0.65)";
    const ORBIT_LW    = 0.55;

    const buildEllipsePath = (orb: { rx: number; ry: number }) => {
      ctx.beginPath();
      for (let i = 0; i <= 360; i++) {
        const a  = (i / 360) * Math.PI * 2;
        const ex = cx + orb.rx * Math.cos(a);
        const ey = cy + orb.ry * Math.sin(a);
        if (i === 0) ctx.moveTo(ex, ey); else ctx.lineTo(ex, ey);
      }
      ctx.closePath();
    };

    const drawOrbitBack = (orb: { rx: number; ry: number }) => {
      ctx.save();
      ctx.beginPath();
      ctx.rect(-99999, -99999, 99999 * 2, cy + 99999);
      ctx.clip();
      buildEllipsePath(orb);
      ctx.strokeStyle = ORBIT_COLOR;
      ctx.lineWidth   = ORBIT_LW / zoomScale;
      ctx.stroke();
      ctx.restore();
    };

    const drawOrbitFrontOutsidePlanet = (
      orb: { rx: number; ry: number },
      planetX: number, planetY: number, planetR: number,
    ) => {
      ctx.save();
      ctx.beginPath();
      ctx.rect(-99999, cy, 99999 * 2, 99999);
      ctx.clip();
      ctx.beginPath();
      ctx.rect(-99999, -99999, 99999 * 2, 99999 * 2);
      ctx.arc(planetX, planetY, planetR, 0, Math.PI * 2, true);
      ctx.clip("evenodd");
      buildEllipsePath(orb);
      ctx.strokeStyle = ORBIT_COLOR;
      ctx.lineWidth   = ORBIT_LW / zoomScale;
      ctx.stroke();
      ctx.restore();
    };

    const drawPlanetBody = (px: number, py: number, r: number, isTarget: boolean) => {
      const dx   = cx - px, dy = cy - py;
      const dist = Math.hypot(dx, dy) || 1;
      const nx   = dx / dist, ny = dy / dist;
      const litX = px + nx * r, litY = py + ny * r;
      const shdX = px - nx * r, shdY = py - ny * r;

      ctx.save();
      ctx.beginPath();
      ctx.arc(px, py, r, 0, Math.PI * 2);
      ctx.clip();

      const matte = ctx.createRadialGradient(px, py, 0, px, py, r);
      matte.addColorStop(0.0, "rgb(16,15,13)");
      matte.addColorStop(0.6, "rgb(11,10,9)");
      matte.addColorStop(1.0, "rgb(8,7,6)");
      ctx.fillStyle = matte;
      ctx.fillRect(px - r, py - r, r * 2, r * 2);

      const litFade = isTarget
        ? Math.max(0, 1 - Math.max(0, (zoomPhase - 0.68) / 0.22))
        : 1;

      if (litFade > 0) {
        const lum  = Math.max(0.18, 1 - dist / 900) * litFade;
        const grad = ctx.createLinearGradient(litX, litY, shdX, shdY);
        grad.addColorStop(0.00, `rgba(255,255,255,${(0.40 * lum).toFixed(3)})`);
        grad.addColorStop(0.08, `rgba(210,210,210,${(0.22 * lum).toFixed(3)})`);
        grad.addColorStop(0.20, `rgba(30,28,25,${(0.04 * lum).toFixed(3)})`);
        grad.addColorStop(0.28, "rgba(0,0,0,0)");
        grad.addColorStop(1.00, "rgba(0,0,0,0)");
        ctx.fillStyle = grad;
        ctx.fillRect(px - r, py - r, r * 2, r * 2);
      }
      ctx.restore();
    };

    const drawTargetGlow = (px: number, py: number, r: number) => {
      const glowPhase = Math.max(0, (zoomPhase - 0.75) / 0.25);
      if (glowPhase <= 0) return;
      ctx.save();
      ctx.beginPath();
      ctx.rect(-W, -H, W * 3, H * 3);
      ctx.arc(px, py, r, 0, Math.PI * 2, true);
      ctx.clip("evenodd");
      const rim = ctx.createRadialGradient(px, py, r, px, py, r * 2.2);
      rim.addColorStop(0.0, `rgba(255,255,255,${(0.30 * glowPhase).toFixed(3)})`);
      rim.addColorStop(0.4, `rgba(255,255,255,${(0.10 * glowPhase).toFixed(3)})`);
      rim.addColorStop(1.0, "rgba(255,255,255,0)");
      ctx.beginPath();
      ctx.arc(px, py, r * 2.2, 0, Math.PI * 2);
      ctx.fillStyle = rim; ctx.fill();
      const halo = ctx.createRadialGradient(px, py, r, px, py, r * 5.0);
      halo.addColorStop(0.0, `rgba(255,255,255,${(0.12 * glowPhase).toFixed(3)})`);
      halo.addColorStop(0.4, `rgba(255,255,255,${(0.04 * glowPhase).toFixed(3)})`);
      halo.addColorStop(1.0, "rgba(255,255,255,0)");
      ctx.beginPath();
      ctx.arc(px, py, r * 5.0, 0, Math.PI * 2);
      ctx.fillStyle = halo; ctx.fill();
      ctx.restore();
    };

    PLANETS
      .filter(p => Math.sin(p.angle) < 0 && !p.isTarget)
      .forEach(p => {
        const { px, py } = wpos(p);
        drawOrbitBack(scaledOrbits[p.oi]);
        drawPlanetBody(px, py, p.r, false);
        drawOrbitFrontOutsidePlanet(scaledOrbits[p.oi], px, py, p.r);
      });

    {
      const R       = 42;
      const sunFade = Math.max(0, 1 - Math.max(0, (zoomPhase - 0.58) / 0.28));
      if (sunFade > 0) {
        ctx.globalAlpha = sunFade;
        const corona = ctx.createRadialGradient(cx, cy, R * 0.75, cx, cy, R * 3.6);
        corona.addColorStop(0,   "rgba(255,255,255,0.16)");
        corona.addColorStop(0.5, "rgba(255,255,255,0.04)");
        corona.addColorStop(1,   "rgba(255,255,255,0.00)");
        ctx.beginPath();
        ctx.arc(cx, cy, R * 3.6, 0, Math.PI * 2);
        ctx.fillStyle = corona; ctx.fill();
        ctx.beginPath();
        ctx.arc(cx, cy, R, 0, Math.PI * 2);
        ctx.fillStyle = "#ececec"; ctx.fill();
        ctx.globalAlpha = 1;
      }
    }

    PLANETS
      .filter(p => Math.sin(p.angle) >= 0 && !p.isTarget)
      .sort((a, b) => Math.sin(a.angle) - Math.sin(b.angle))
      .forEach(p => {
        const { px, py } = wpos(p);
        drawOrbitBack(scaledOrbits[p.oi]);
        drawPlanetBody(px, py, p.r, false);
        drawOrbitFrontOutsidePlanet(scaledOrbits[p.oi], px, py, p.r);
      });

    {
      const { px, py } = wpos(tp);
      drawOrbitBack(scaledOrbits[tp.oi]);
      drawPlanetBody(px, py, tp.r, true);
      drawOrbitFrontOutsidePlanet(scaledOrbits[tp.oi], px, py, tp.r);
      drawTargetGlow(px, py, tp.r);
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
      style={{ zIndex: 0, background: "radial-gradient(ellipse at 50% 50%, rgb(22,19,16) 0%, rgb(10,9,8) 55%, rgb(5,4,4) 100%)" }}
    />
  );
}