"use client";

import React, { useEffect, useRef, useState } from "react";
import { LazyMotion, domAnimation, m, useReducedMotion } from "framer-motion";
import { DeviceMobileIcon as Smartphone, BankIcon as Landmark, CpuIcon as Cpu, LightningIcon as Zap } from "@phosphor-icons/react";
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { createPinnedSequence } from '../../runtime/pinned-sequence.js';

export type LayerId = "apps" | "defi" | "depin" | "physical";

export interface LayerInfo {
  id: LayerId;
  level: number;
  label: string;
  title: string;
  tagline: string;
  description: string;
  icon: typeof Smartphone;
  chips: string[];
  side: "left" | "right";
  badgeBg: string;
  badgeText: string;
}

export const LAYERS: LayerInfo[] = [
  {
    id: "apps",
    level: 4,
    label: "Layer 04: Investor Workspace",
    title: "Investor Workspace",
    tagline: "User Interface & Management",
    description:
      "Project profiles, operating updates, and payment records connect investors with the infrastructure behind their participation.",
    icon: Smartphone,
    chips: ["Project Profiles", "Performance Updates", "Payment History"],
    side: "left",
    badgeBg: "bg-purple-50 border-purple-200",
    badgeText: "text-purple-700",
  },
  {
    id: "defi",
    level: 3,
    label: "Layer 03: Capital & Participation",
    title: "Capital & Participation",
    tagline: "On-chain Capital Engine",
    description:
      "Financing agreements define investor participation, with on-chain records supporting the project’s investment and reporting workflow.",
    icon: Landmark,
    chips: ["Project Agreements", "Investor Rights", "On-chain Records"],
    side: "right",
    badgeBg: "bg-teal-50 border-teal-200",
    badgeText: "text-teal-700",
  },
  {
    id: "depin",
    level: 2,
    label: "Layer 02: Project Information",
    title: "Project Information",
    tagline: "Verification & Telemetry",
    description:
      "Energy sales agreements, production reports, and payment history bring the operating reality of an asset into the project review.",
    icon: Cpu,
    chips: ["Energy Production", "Revenue Agreements", "Operating Records"],
    side: "left",
    badgeBg: "bg-blue-50 border-blue-200",
    badgeText: "text-blue-700",
  },
  {
    id: "physical",
    level: 1,
    label: "Layer 01: Energy Infrastructure",
    title: "Energy Infrastructure",
    tagline: "Real-World Energy Assets",
    description:
      "Productive physical assets across renewable solar energy, smart battery storage, and distributed energy networks.",
    icon: Zap,
    chips: ["Renewable Generation", "Energy Storage", "Electrification"],
    side: "right",
    badgeBg: "bg-amber-50 border-amber-200",
    badgeText: "text-amber-700",
  },
];

// Top to bottom stack order
const STACK_ORDER: LayerId[] = ["apps", "defi", "depin", "physical"];
const BUILD_ORDER = STACK_ORDER.slice().reverse();

// ---------- Isometric SVG stack calculations & geometry ----------
const IC = Math.cos(Math.PI / 6); // 0.866
const IS = 0.5;
const iso = (x: number, y: number, z: number): [number, number] => [
  (x - y) * IC,
  (x + y) * IS - z,
];
const p3 = (x: number, y: number, z: number) => {
  const [a, b] = iso(x, y, z);
  return `${a.toFixed(2)},${b.toFixed(2)}`;
};

// Chamfered corners keep slab edges legible in the isometric view.
const SW = 280;
const SD = 280;
const SR = 32;
const ST = 34;
const SGAP = 76;

// SVG viewBox configuration (expanded for wide foundation)
const VBX = -440;
const VBY = -450;
const VBW = 880;
const VBH = 720;
const SVG_H = 650;
const SVG_W = SVG_H * (VBW / VBH);

// Glowing cube layout per layer
const CUBE_LAYOUTS: Record<LayerId, Array<{ x: number; y: number; s: number }>> = {
  apps: [{ x: 0, y: 0, s: 68 }],
  defi: [
    { x: -64, y: -10, s: 44 },
    { x: 10, y: 38, s: 46 },
    { x: 64, y: -38, s: 40 },
  ],
  depin: [
    { x: -54, y: 24, s: 44 },
    { x: 50, y: -28, s: 46 },
  ],
  physical: [],
};

type Vertex = [number, number, number];
type OctagonIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
type Octagon = [Vertex, Vertex, Vertex, Vertex, Vertex, Vertex, Vertex, Vertex];

function octVerts(hw: number, hd: number, r: number, z: number): Octagon {
  return [
    [-hw + r, -hd, z],
    [hw - r, -hd, z],
    [hw, -hd + r, z],
    [hw, hd - r, z],
    [hw - r, hd, z],
    [-hw + r, hd, z],
    [-hw, hd - r, z],
    [-hw, -hd + r, z],
  ];
}

function pointsStr(verts: [number, number, number][]) {
  return verts.map((v) => p3(v[0], v[1], v[2])).join(" ");
}

export function GenZStack() {
  const [selected, setSelected] = useState<LayerId | null>(null);
  const [hovered, setHovered] = useState<LayerId | null>(null);
  const stage = useRef<HTMLDivElement>(null);
  const sequence = useRef<ReturnType<typeof createPinnedSequence> | null>(null);
  const active = hovered ?? selected;
  const reduced = useReducedMotion();

  useEffect(() => {
    const section = stage.current!.closest<HTMLElement>('#stack')!;
    const pin = section.querySelector<HTMLElement>('.stack-scroll-pin')!;
    const composition = section.querySelector<HTMLElement>('.stack-composition')!;
    const experience = stage.current!.closest<HTMLElement>('.stack-experience')!;
    const preference = gsap.matchMedia();
    preference.add('(prefers-reduced-motion: no-preference) and (min-height: 640px)', () => {
      section.classList.add('has-pinned-sequence');
      const fit = () => {
        const pinStyle = getComputedStyle(pin);
        const heading = composition.querySelector<HTMLElement>('h2')!;
        const intro = composition.querySelector<HTMLElement>('.section-intro')!;
        const headerHeight = heading.offsetHeight + intro.offsetHeight + parseFloat(getComputedStyle(intro).marginTop);
        const available = pin.clientHeight - parseFloat(pinStyle.paddingTop) - parseFloat(pinStyle.paddingBottom) - headerHeight - parseFloat(getComputedStyle(experience).marginTop);
        const scale = Math.min(1, Math.max(.1, available / stage.current!.offsetHeight));
        experience.style.setProperty('--stack-scale', String(scale));
        experience.style.height = `${stage.current!.offsetHeight * scale}px`;
      };
      fit();
      const observer = new ResizeObserver(fit);
      observer.observe(stage.current!);
      observer.observe(pin);
      const order = BUILD_ORDER;
      const layers = order.map(id => stage.current!.querySelector(`[data-stack-reveal="${id}"]`));
      const labels = order.map(id => stage.current!.querySelector(`.stack-label-${id}`));
      const travel = Math.min(240, pin.clientHeight * .28);
      gsap.set(layers, { y: -travel, opacity: 0, pointerEvents: 'none' });
      gsap.set(labels, { opacity: 0, pointerEvents: 'none' });
      const ground = stage.current!.querySelector('.stack-ground-shadow');
      gsap.set(ground, { opacity: 0 });
      sequence.current = createPinnedSequence({ id: 'stack-sequence', pin, count: order.length });
      sequence.current.timeline.to(ground, { opacity: 1, duration: 0.6 }, 0);
      order.forEach((_id, index) => {
        const timeline = sequence.current!.timeline;
        const layer = layers[index];
        const label = labels[index];
        if (!layer || !label) return;
        timeline.to(layer, { y: 0, opacity: 1, duration: 0.76, ease: 'power2.inOut' }, index);
        timeline.to(label, { opacity: 1, duration: 0.32, ease: 'power1.out' }, index + 0.46);
        timeline.set([layers[index], labels[index]], { pointerEvents: 'auto' }, index + 0.78);
      });
      document.fonts.ready.then(() => ScrollTrigger.refresh());
      return () => {
        observer.disconnect();
        sequence.current?.dispose();
        sequence.current = null;
        section.classList.remove('has-pinned-sequence');
        experience.style.removeProperty('--stack-scale');
        experience.style.removeProperty('height');
      };
    });
    return () => preference.revert();
  }, []);

  useEffect(() => {
    let pointer: { x: number; y: number } | null = null;
    let lastScroll = -Infinity;

    const onScroll = () => {
      lastScroll = performance.now();
      setHovered(null);
    };
    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const moved = !pointer || pointer.x !== event.clientX || pointer.y !== event.clientY;
      pointer = { x: event.clientX, y: event.clientY };
      // Scroll can move a layer under a stationary cursor; only mouse movement selects it.
      if (!moved || event.buttons !== 0 || performance.now() - lastScroll < 150) return;
      if (!(event.target instanceof Element) || !stage.current?.contains(event.target)) return;
      const id = event.target.closest('[data-stack-layer]')?.getAttribute('data-stack-layer');
      if (STACK_ORDER.includes(id as LayerId)) setHovered(id as LayerId);
    };

    window.addEventListener('scroll', onScroll, { capture: true, passive: true });
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll, true);
      window.removeEventListener('pointermove', onPointerMove);
    };
  }, []);

  const selectLayer = (id: LayerId) => {
    sequence.current?.reveal(BUILD_ORDER.indexOf(id));
    setHovered(null);
    setSelected(id);
  };

  return (
    <LazyMotion features={domAnimation}>
      <div className="stack-experience">
        <div
          ref={stage}
          className="stack-stage"
          style={{ height: SVG_H }}
          onPointerLeave={(event) => {
            if (event.pointerType !== "mouse") return;
            setHovered(null);
            if (!event.currentTarget.querySelector(':focus-visible')) setSelected(null);
          }}
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) setSelected(null);
          }}
        >
          <IsoStackSVG active={active} onSelect={selectLayer} />

          <div className="stack-labels" role="group" aria-label="Choose a stack layer">
          {BUILD_ORDER.map((id) => {
            const layer = LAYERS.find((l) => l.id === id)!;
            
            let svgY = 0;
            if (id === "physical") {
              svgY = 45; // Center of expanded image
            } else {
              let z = 0;
              for (let idx = STACK_ORDER.length - 1; idx >= 0; idx--) {
                const lid = STACK_ORDER[idx];
                if (lid === id) {
                  z += ST / 2;
                  break;
                }
                z += ST + SGAP;
              }
              svgY = -z;
            }
            const topPercent = (svgY - VBY) / VBH * 100;

            return (
              <Annotation
                key={id}
                layer={layer}
                side={layer.side}
                topPercent={topPercent}
                active={active === id}
                dimmed={active !== null && active !== id}
                onSelect={selectLayer}
                reduced={!!reduced}
              />
            );
          })}
          </div>
        </div>
      </div>
    </LazyMotion>
  );
}

// ---------- 3D Isometric SVG Stack Component ----------

function IsoStackSVG({
  active,
  onSelect,
}: {
  active: LayerId | null;
  onSelect: (id: LayerId) => void;
}) {
  const drawOrder = BUILD_ORDER;

  // Precompute per-slab z base + thickness
  const geom = Object.fromEntries(BUILD_ORDER.map((id, index) => [id, { zb: index * (ST + SGAP), t: ST }])) as Record<LayerId, { zb: number; t: number }>;

  return (
    <svg
      viewBox={`${VBX} ${VBY} ${VBW} ${VBH}`}
      width={SVG_W}
      height={SVG_H}
      className="stack-diagram"
      aria-hidden="true"
      style={{ overflow: "visible" }}
    >
      <defs>
        {/* White frosted-glass slab gradients */}
        <linearGradient id="slabTop" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
          <stop offset="60%" stopColor="#F4F4F5" stopOpacity="0.98" />
          <stop offset="100%" stopColor="#E4E4E7" stopOpacity="0.95" />
        </linearGradient>
        <linearGradient id="slabRight" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E4E4E7" />
          <stop offset="100%" stopColor="#A1A1AA" />
        </linearGradient>
        <linearGradient id="slabFront" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#D4D4D8" />
          <stop offset="100%" stopColor="#71717A" />
        </linearGradient>
        <linearGradient id="slabChamfer" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E4E4E7" />
          <stop offset="100%" stopColor="#8A8A93" />
        </linearGradient>

        {/* Active Teal / Emerald Palette */}
        <linearGradient id="slabTopA" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="60%" stopColor="#F0FDFA" />
          <stop offset="100%" stopColor="#99F6E4" />
        </linearGradient>
        <linearGradient id="slabRightA" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#CCFBF1" />
          <stop offset="100%" stopColor="#5EEAD4" />
        </linearGradient>
        <linearGradient id="slabFrontA" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#99F6E4" />
          <stop offset="100%" stopColor="#14B8A6" />
        </linearGradient>
        <linearGradient id="slabChamferA" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#A7F3D0" />
          <stop offset="100%" stopColor="#2DD4BF" />
        </linearGradient>

        {/* Volumetric glow inside glass gap */}
        <radialGradient id="volumeGlow" cx="0.5" cy="0.5" r="0.55">
          <stop offset="0%" stopColor="#A7F3D0" stopOpacity="0.6" />
          <stop offset="55%" stopColor="#2DD4BF" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#14B8A6" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="volumeGlowA" cx="0.5" cy="0.5" r="0.55">
          <stop offset="0%" stopColor="#99F6E4" stopOpacity="0.95" />
          <stop offset="55%" stopColor="#2DD4BF" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#14B8A6" stopOpacity="0" />
        </radialGradient>

        {/* Glass wall gradients */}
        <linearGradient id="glassWall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.22" />
          <stop offset="50%" stopColor="#CCFBF1" stopOpacity="0.10" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.22" />
        </linearGradient>
        <linearGradient id="glassWallBack" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.30" />
          <stop offset="100%" stopColor="#CCFBF1" stopOpacity="0.18" />
        </linearGradient>
        <linearGradient id="glassWallA" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.28" />
          <stop offset="50%" stopColor="#99F6E4" stopOpacity="0.14" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.28" />
        </linearGradient>
        <linearGradient id="glassWallBackA" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#CCFBF1" stopOpacity="0.22" />
        </linearGradient>

        {/* Ground shadow */}
        <radialGradient id="groundShadow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#0F172A" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#0F172A" stopOpacity="0" />
        </radialGradient>

        <filter id="softBlur" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="12" />
        </filter>
        <filter id="cubeGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" />
        </filter>

        {/* Cube gradients */}
        <linearGradient id="cubeTop" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#CCFBF1" />
          <stop offset="100%" stopColor="#5EEAD4" />
        </linearGradient>
        <linearGradient id="cubeInset" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#99F6E4" />
          <stop offset="100%" stopColor="#2DD4BF" />
        </linearGradient>
        <linearGradient id="cubeRight" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2DD4BF" />
          <stop offset="100%" stopColor="#0F766E" />
        </linearGradient>
        <linearGradient id="cubeFront" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#14B8A6" />
          <stop offset="100%" stopColor="#0A3A36" />
        </linearGradient>

        <linearGradient id="cubeTopA" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#99F6E4" />
          <stop offset="100%" stopColor="#14B8A6" />
        </linearGradient>
        <linearGradient id="cubeInsetA" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#CCFBF1" />
          <stop offset="100%" stopColor="#2DD4BF" />
        </linearGradient>
        <linearGradient id="cubeRightA" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#14B8A6" />
          <stop offset="100%" stopColor="#134E4A" />
        </linearGradient>
        <linearGradient id="cubeFrontA" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0D9488" />
          <stop offset="100%" stopColor="#042F2E" />
        </linearGradient>
      </defs>

      {/* Ground shadow */}
      {(() => {
        const [gx, gy] = iso(0, 0, -6);
        return (
          <ellipse
            className="stack-ground-shadow"
            cx={gx}
            cy={gy + 50}
            rx={SW * 1.35}
            ry={SD * 0.65}
            fill="url(#groundShadow)"
            filter="url(#softBlur)"
          />
        );
      })()}

      {drawOrder.map((id) => {
        const { zb, t } = geom[id];
        const isActive = active === id;
        const dim = active !== null && !isActive;
        const topZ = zb + t;
        const wallHi = topZ + SGAP;
        const hasVolume = id !== "apps";

        // ── LAYER 01: LARGE PROMINENT PURE IMAGE EV.PNG AS FOUNDATION ──
        if (id === "physical") {
          return (
            <g key={id} data-stack-reveal={id}>
            <g 
              key={id} 
              className="stack-foundation-layer"
              data-stack-layer={id}
              opacity={dim ? 0.12 : 1}
              style={{ 
                cursor: "pointer",
                transition: "opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1)" 
              }}
              onClick={() => onSelect(id)}
            >
              {/* Wide ambient glow when active */}
              {isActive && (
                <ellipse
                  cx={0}
                  cy={50}
                  rx={360}
                  ry={180}
                  fill="url(#volumeGlowA)"
                  filter="url(#softBlur)"
                  opacity={0.85}
                />
              )}

              <FoundationImage active={isActive} />
            </g>
            </g>
          );
        }

        return (
          <g key={id} data-stack-reveal={id}>
          <g 
            key={id}
            opacity={dim ? 0.12 : 1}
            style={{ transition: "opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1)" }}
          >
            <Slab
              zb={zb}
              t={t}
              widen={0}
              isActive={isActive}
              dim={dim}
              id={id}
              onSelect={onSelect}
              showGlow
            />
            {hasVolume && (
              <GlassWalls zLo={topZ} zHi={wallHi} isActive={isActive} dim={dim} which="back" />
            )}
            {CUBE_LAYOUTS[id].map((c, idx) => (
              <IsoCube
                key={idx}
                cx={c.x}
                cy={c.y}
                cz={zb + t + 6}
                s={c.s}
                active={isActive}
                dim={dim}
              />
            ))}
            {hasVolume && (
              <GlassWalls zLo={topZ} zHi={wallHi} isActive={isActive} dim={dim} which="front" />
            )}
          </g>
          </g>
        );
      })}
    </svg>
  );
}

function Slab({
  zb,
  t,
  widen,
  isActive,
  id,
  onSelect,
  showGlow,
}: {
  zb: number;
  t: number;
  widen: number;
  isActive: boolean;
  dim: boolean;
  id: LayerId;
  onSelect: (id: LayerId) => void;
  showGlow: boolean;
}) {
  const zt = zb + t;
  const hw = SW / 2 + widen;
  const hd = SD / 2 + widen;
  const r = SR;

  const topV = octVerts(hw, hd, r, zt);
  const botV = octVerts(hw, hd, r, zb);

  const side = (a: OctagonIndex, b: OctagonIndex) => {
    return `${p3(...topV[a])} ${p3(...topV[b])} ${p3(...botV[b])} ${p3(...botV[a])}`;
  };
  const rightPts = side(2, 3);
  const frChamfer = side(3, 4);
  const frontPts = side(4, 5);
  const flChamfer = side(5, 6);

  const topFill = isActive ? "url(#slabTopA)" : "url(#slabTop)";
  const rightFill = isActive ? "url(#slabRightA)" : "url(#slabRight)";
  const frontFill = isActive ? "url(#slabFrontA)" : "url(#slabFront)";
  const chamferFill = isActive ? "url(#slabChamferA)" : "url(#slabChamfer)";
  const edge = isActive ? "#0F766E" : "rgba(20,184,166,0.35)";
  const glowFill = isActive ? "url(#volumeGlowA)" : "url(#volumeGlow)";

  const [gx, gy] = iso(0, 0, zt + SGAP / 2);

  const inset = 10;
  const topInsetV = octVerts(hw - inset, hd - inset, Math.max(r - inset * 0.6, 8), zt);

  return (
    <g
      data-stack-layer={id}
      style={{ cursor: "pointer" }}
      onClick={() => onSelect(id)}
    >
      {showGlow && (
        <ellipse
          cx={gx}
          cy={gy}
          rx={hw * 0.88}
          ry={hd * 0.5}
          fill={glowFill}
          filter="url(#softBlur)"
          pointerEvents="none"
        />
      )}

      {/* Side faces */}
      <polygon points={frontPts} fill={frontFill} stroke={edge} strokeWidth="0.4" strokeLinejoin="round" />
      <polygon points={flChamfer} fill={chamferFill} stroke={edge} strokeWidth="0.4" strokeLinejoin="round" />
      <polygon points={frChamfer} fill={chamferFill} stroke={edge} strokeWidth="0.4" strokeLinejoin="round" />
      <polygon points={rightPts} fill={rightFill} stroke={edge} strokeWidth="0.4" strokeLinejoin="round" />

      {/* Top face + inset frame */}
      <polygon
        points={pointsStr(topV)}
        fill={topFill}
        stroke={edge}
        strokeWidth={isActive ? 1.2 : 0.7}
        strokeLinejoin="round"
      />
      <polygon
        points={pointsStr(topInsetV)}
        fill="none"
        stroke={isActive ? "rgba(15,118,110,0.35)" : "rgba(20,184,166,0.25)"}
        strokeWidth="0.6"
        strokeLinejoin="round"
      />
    </g>
  );
}

function IsoCube({
  cx,
  cy,
  cz,
  s,
  active,
}: {
  cx: number;
  cy: number;
  cz: number;
  s: number;
  active: boolean;
  dim: boolean;
}) {
  const hs = s / 2;
  const zb = cz;
  const zt = cz + s * 0.55;
  const topPts = `${p3(cx - hs, cy - hs, zt)} ${p3(cx + hs, cy - hs, zt)} ${p3(cx + hs, cy + hs, zt)} ${p3(cx - hs, cy + hs, zt)}`;
  const rightPts = `${p3(cx + hs, cy - hs, zt)} ${p3(cx + hs, cy + hs, zt)} ${p3(cx + hs, cy + hs, zb)} ${p3(cx + hs, cy - hs, zb)}`;
  const frontPts = `${p3(cx + hs, cy + hs, zt)} ${p3(cx - hs, cy + hs, zt)} ${p3(cx - hs, cy + hs, zb)} ${p3(cx + hs, cy + hs, zb)}`;

  const ins = hs * 0.5;
  const zi = zt + 3;
  const topInsetPts = `${p3(cx - ins, cy - ins, zi)} ${p3(cx + ins, cy - ins, zi)} ${p3(cx + ins, cy + ins, zi)} ${p3(cx - ins, cy + ins, zi)}`;

  const top = active ? "url(#cubeTopA)" : "url(#cubeTop)";
  const inset = active ? "url(#cubeInsetA)" : "url(#cubeInset)";
  const sideR = active ? "url(#cubeRightA)" : "url(#cubeRight)";
  const sideF = active ? "url(#cubeFrontA)" : "url(#cubeFront)";
  const edge = active ? "#0F766E" : "#14B8A6";

  const [gx, gy] = iso(cx, cy, zb - 2);

  return (
    <g pointerEvents="none">
      <ellipse
        cx={gx}
        cy={gy + 8}
        rx={hs * 1.15}
        ry={hs * 0.55}
        fill={active ? "#5EEAD4" : "#2DD4BF"}
        opacity="0.35"
        filter="url(#cubeGlow)"
      />
      <polygon points={frontPts} fill={sideF} stroke={edge} strokeWidth="0.35" strokeLinejoin="round" />
      <polygon points={rightPts} fill={sideR} stroke={edge} strokeWidth="0.35" strokeLinejoin="round" />
      <polygon points={topPts} fill={top} stroke={edge} strokeWidth="0.5" strokeLinejoin="round" />
      <polygon
        points={topInsetPts}
        fill={inset}
        stroke={active ? "#5EEAD4" : "#99F6E4"}
        strokeWidth="0.5"
        strokeLinejoin="round"
      />
      <circle
        cx={iso(cx, cy, zi)[0]}
        cy={iso(cx, cy, zi)[1]}
        r={Math.max(hs * 0.06, 1.5)}
        fill={active ? "#0F766E" : "#14B8A6"}
        opacity="0.85"
      />
    </g>
  );
}

function GlassWalls({
  zLo,
  zHi,
  isActive,
  which,
}: {
  zLo: number;
  zHi: number;
  isActive: boolean;
  dim: boolean;
  which: "back" | "front";
}) {
  const hw = SW / 2;
  const hd = SD / 2;
  const r = SR;
  const bot = octVerts(hw, hd, r, zLo);
  const top = octVerts(hw, hd, r, zHi);
  const quad = (a: OctagonIndex, b: OctagonIndex) =>
    `${p3(...bot[a])} ${p3(...bot[b])} ${p3(...top[b])} ${p3(...top[a])}`;

  const backEdges: Array<[OctagonIndex, OctagonIndex]> = [
    [7, 0],
    [0, 1],
    [1, 2],
  ];
  const frontEdges: Array<[OctagonIndex, OctagonIndex]> = [
    [2, 3],
    [3, 4],
    [4, 5],
    [5, 6],
    [6, 7],
  ];
  const edges = which === "back" ? backEdges : frontEdges;

  const fillBack = isActive ? "url(#glassWallBackA)" : "url(#glassWallBack)";
  const fillFront = isActive ? "url(#glassWallA)" : "url(#glassWall)";
  const fill = which === "back" ? fillBack : fillFront;
  const stroke = isActive ? "rgba(94,234,212,0.55)" : "rgba(45,212,191,0.3)";
  const topEdgeStroke = isActive ? "rgba(94,234,212,0.7)" : "rgba(20,184,166,0.4)";

  return (
    <g pointerEvents="none">
      {edges.map(([a, b], i) => (
        <polygon
          key={i}
          points={quad(a, b)}
          fill={fill}
          stroke={stroke}
          strokeWidth="0.4"
          strokeLinejoin="round"
        />
      ))}
      {which === "front" &&
        edges.map(([a, b], i) => (
          <line
            key={`t-${i}`}
            x1={iso(...top[a])[0]}
            y1={iso(...top[a])[1]}
            x2={iso(...top[b])[0]}
            y2={iso(...top[b])[1]}
            stroke={topEdgeStroke}
            strokeWidth="0.6"
          />
        ))}
    </g>
  );
}

function FoundationImage({ active }: { active: boolean }) {
  const target = useRef<SVGSVGElement>(null);
  const [visible, setVisible] = useState(false);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry?.isIntersecting) return;
      setVisible(true);
      observer.disconnect();
    }, { rootMargin: '400px' });
    if (target.current) observer.observe(target.current);
    return () => observer.disconnect();
  }, []);

  return <svg ref={target} className="stack-foundation" x="-360" y="-150" width="720" height="400" viewBox="0 220 1254 950" preserveAspectRatio="xMidYMid meet" style={{
    overflow: 'visible',
    filter: active
      ? "saturate(1.25) contrast(1.08) brightness(1.02) drop-shadow(0 15px 35px rgba(20,184,166,0.4))"
      : "saturate(1.0) contrast(1.0) drop-shadow(0 10px 25px rgba(0,0,0,0.14))",
    transition: "filter 0.4s ease",
  }}>
    {visible && status !== 'error' && <image href="/assets/stack-infrastructure.webp" width="1254" height="1254" onLoad={() => setStatus('ready')} onError={() => setStatus('error')} />}
    {status !== 'ready' && <text x="627" y="700" textAnchor="middle" className="stack-image-status">{status === 'error' ? 'Infrastructure illustration unavailable' : 'Loading infrastructure illustration…'}</text>}
  </svg>;
}

function Annotation({
  layer,
  side,
  topPercent,
  active,
  dimmed,
  onSelect,
  reduced,
}: {
  layer: LayerInfo;
  side: "left" | "right";
  topPercent: number;
  active: boolean;
  dimmed: boolean;
  onSelect: (id: LayerId) => void;
  reduced: boolean;
}) {
  const isLeft = side === "left";
  return (
    <button
      type="button"
      className={`stack-label stack-label-${layer.id} ${isLeft ? 'stack-label-left' : 'stack-label-right'}${active ? ' selected' : ''}${dimmed ? ' dimmed' : ''}`}
      data-stack-layer={layer.id}
      aria-pressed={active}
      onClick={() => onSelect(layer.id)}
      onFocus={() => onSelect(layer.id)}
      style={{
        top: `${topPercent}%`,
        [isLeft ? "left" : "right"]: 0,
        width: 280,
        transform: "translateY(-50%)",
      }}
    >
        <span className="stack-connector" aria-hidden="true">
          <span
            className="stack-connector-line"
            style={{
              background: active
                ? isLeft
                  ? "linear-gradient(90deg, transparent, #14B8A6)"
                  : "linear-gradient(90deg, #14B8A6, transparent)"
                : dimmed
                ? "rgba(15,23,42,0.06)"
                : "rgba(15,23,42,0.18)",
            }}
          />
          <span
            className="stack-connector-dot"
            style={{
              background: active ? "#14B8A6" : dimmed ? "rgba(15,23,42,0.12)" : "rgba(15,23,42,0.3)",
              boxShadow: active ? "0 0 10px #5EEAD4" : "none",
              marginLeft: isLeft ? "auto" : 0,
            }}
          />
        </span>

        <m.span
          animate={{
            opacity: active ? 1 : dimmed ? 0.65 : 0.85,
            x: reduced || active ? 0 : isLeft ? -6 : 6,
          }}
          transition={{ duration: reduced ? 0 : 0.3 }}
          className="stack-label-content"
        >
          <strong>
            {layer.title}
          </strong>
          <span className="layer-number">
            {layer.label}
          </span>
          <span className="stack-label-chips">
            {layer.chips.slice(0, 3).map((c) => (
              <span
                key={c}
                className="stack-label-chip"
                style={{
                  background: active ? "rgba(20,184,166,0.10)" : "rgba(15,23,42,0.04)",
                  borderColor: active ? "rgba(20,184,166,0.35)" : "rgba(15,23,42,0.10)",
                  color: active ? "#0F766E" : "#111827",
                }}
              >
                {c}
              </span>
            ))}
          </span>
        </m.span>
    </button>
  );
}
