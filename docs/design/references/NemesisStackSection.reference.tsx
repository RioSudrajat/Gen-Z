"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { MotionDiv, MotionH2, MotionP } from "@/components/ui/motion";
import { Layers, Smartphone, Landmark, Cpu, Zap, CheckCircle2 } from "lucide-react";

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
    label: "Layer 04 — Apps & Ecosystem",
    title: "Apps & Ecosystem",
    tagline: "User Interface & Management",
    description:
      "Web and mobile interfaces for investors to track yield and operators to manage fleet health and onboard new RWA assets.",
    icon: Smartphone,
    chips: ["Investor Dashboard", "Operator Portal", "RWA Tokenization App"],
    side: "left",
    badgeBg: "bg-purple-50 border-purple-200",
    badgeText: "text-purple-700",
  },
  {
    id: "defi",
    level: 3,
    label: "Layer 03 — DeFi & Liquidity",
    title: "DeFi & Liquidity",
    tagline: "On-chain Capital Engine",
    description:
      "Financial smart contracts automating capital deployment, stablecoin deposits (IDRX), and real-time yield distribution.",
    icon: Landmark,
    chips: ["IDRX Stablecoin Pools", "Automated Yield Distribution", "Smart Contract Vaults"],
    side: "right",
    badgeBg: "bg-teal-50 border-teal-200",
    badgeText: "text-teal-700",
  },
  {
    id: "depin",
    level: 2,
    label: "Layer 02 — DePIN Network",
    title: "DePIN Network",
    tagline: "Verification & Telemetry",
    description:
      "Decentralized network layer validating physical work, tracking GPS telemetry, and submitting cryptographic proofs on-chain.",
    icon: Cpu,
    chips: ["Proof of Physical Work (PoPW)", "GPS & IoT Telemetry", "On-chain Activity Records"],
    side: "left",
    badgeBg: "bg-blue-50 border-blue-200",
    badgeText: "text-blue-700",
  },
  {
    id: "physical",
    level: 1,
    label: "Layer 01 — Physical Infrastructure EV Smart Ecosystem",
    title: "Physical Infrastructure EV Smart Ecosystem",
    tagline: "Real-World EV Assets",
    description:
      "Productive physical assets across EV mobility fleets, charging & swap networks, and renewable solar energy.",
    icon: Zap,
    chips: ["EV Mobility", "EV Infrastructure", "EV Energy"],
    side: "right",
    badgeBg: "bg-amber-50 border-amber-200",
    badgeText: "text-amber-700",
  },
];

// Top to bottom stack order
const STACK_ORDER: LayerId[] = ["apps", "defi", "depin", "physical"];

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

// Slab geometry — chamfered octagon footprint reads as rounded corners in isometric perspective
const SW = 280;
const SD = 280;
const SR = 32;
const ST = 34;
const SGAP = 76;
const SN = 4; // 4 layers

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

function octVerts(hw: number, hd: number, r: number, z: number) {
  return [
    [-hw + r, -hd, z],
    [hw - r, -hd, z],
    [hw, -hd + r, z],
    [hw, hd - r, z],
    [hw - r, hd, z],
    [-hw + r, hd, z],
    [-hw, hd - r, z],
    [-hw, -hd + r, z],
  ] as [number, number, number][];
}

function pointsStr(verts: [number, number, number][]) {
  return verts.map((v) => p3(v[0], v[1], v[2])).join(" ");
}

export default function NemesisStackSection() {
  const [active, setActive] = useState<LayerId | null>("depin");

  return (
    <section
      id="stack"
      className="relative overflow-hidden bg-gradient-to-b from-white via-teal-50/20 to-white py-24 text-zinc-900 md:py-36"
    >
      {/* Background ambient lighting blobs */}
      <div className="pointer-events-none absolute left-1/2 top-1/4 -translate-x-1/2 h-[500px] w-[700px] rounded-full bg-gradient-to-tr from-teal-200/25 via-emerald-100/35 to-indigo-100/15 blur-[120px]" />
      <div className="pointer-events-none absolute right-10 bottom-10 h-[350px] w-[350px] rounded-full bg-teal-300/15 blur-[100px]" />

      <div className="relative mx-auto max-w-[1340px] px-6 md:px-8">
        {/* Centered title */}
        <div className="mx-auto max-w-3xl text-center">
          <MotionH2
            className="font-[family-name:var(--font-plus-jakarta)] text-4xl font-extrabold leading-[1.08] tracking-tight text-zinc-900 md:text-6xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.2, 0, 0, 1] }}
          >
            Nemesis Modular Stack for <br />
            <span className="bg-gradient-to-r from-[#2DD4BF] via-[#14B8A6] to-[#0D9488] bg-clip-text text-transparent">
              Productive EV Infrastructure
            </span>
          </MotionH2>
          <MotionP
            className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-zinc-500 md:text-lg"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.2, 0, 0, 1] }}
          >
            Four interlocking layers turn real-world hardware into verified on-chain yield. Click or hover a layer to focus.
          </MotionP>
        </div>

        {/* 3D Isometric SVG Stack + Side Annotations */}
        <div
          className="relative mx-auto mt-16 w-full max-w-[1240px] md:mt-20"
          style={{ height: SVG_H }}
          onMouseLeave={() => setActive(null)}
        >
          <IsoStackSVG active={active} onSelect={setActive} />

          {/* Annotation labels — left and right, aligned to each slab's 3D Y coordinate */}
          {STACK_ORDER.map((id) => {
            const layer = LAYERS.find((l) => l.id === id)!;
            
            let svgY = 0;
            if (id === "physical") {
              svgY = 45; // Center of expanded image
            } else {
              let z = 0;
              for (let idx = SN - 1; idx >= 0; idx--) {
                const lid = STACK_ORDER[idx];
                if (lid === id) {
                  z += ST / 2;
                  break;
                }
                z += ST + SGAP;
              }
              svgY = -z;
            }
            const topPx = (svgY - VBY) * (SVG_H / VBH);

            return (
              <Annotation
                key={id}
                layer={layer}
                side={layer.side}
                topPx={topPx}
                active={active === id}
                dimmed={active !== null && active !== id}
              />
            );
          })}
        </div>

        {/* Active layer detail summary card */}
        <div className="mx-auto mt-8 max-w-2xl">
          <AnimatePresence mode="wait">
            {LAYERS.filter((l) => l.id === active).map((l) => (
              <MotionDiv
                key={l.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="rounded-3xl border border-zinc-200/80 bg-white/90 p-6 text-center shadow-[0_12px_40px_rgba(0,0,0,0.06)] backdrop-blur-md md:p-8"
              >
                <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-zinc-500 bg-zinc-50 border-zinc-200">
                  {l.label}
                </div>
                <h3 className="mt-3 font-[family-name:var(--font-plus-jakarta)] text-2xl font-bold text-zinc-900 md:text-3xl">
                  {l.title}
                </h3>
                <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-zinc-600 md:text-base">
                  {l.description}
                </p>
                <div className="mt-5 flex flex-wrap justify-center gap-2">
                  {l.chips.map((chip) => (
                    <span
                      key={chip}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-teal-100 bg-teal-50/60 px-3.5 py-1.5 text-xs font-semibold text-teal-800"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 text-teal-600" />
                      {chip}
                    </span>
                  ))}
                </div>
              </MotionDiv>
            ))}
          </AnimatePresence>
        </div>

      </div>
    </section>
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
  const drawOrder = STACK_ORDER.slice().reverse();

  // Precompute per-slab z base + thickness
  const geom: Record<LayerId, { zb: number; t: number }> = {} as any;
  {
    let z = 0;
    for (let idx = SN - 1; idx >= 0; idx--) {
      const id = STACK_ORDER[idx];
      geom[id] = { zb: z, t: ST };
      z += ST + SGAP;
    }
  }

  return (
    <svg
      viewBox={`${VBX} ${VBY} ${VBW} ${VBH}`}
      width={SVG_W}
      height={SVG_H}
      className="absolute left-1/2 top-0 -translate-x-1/2 select-none"
      style={{ overflow: "visible" }}
    >
      <defs>
        {/* Expanded Clip path for Large Prominent EV image at Layer 01 */}
        <clipPath id="purePhysicalImageClip">
          <rect x="-360" y="-150" width="720" height="400" rx="32" />
        </clipPath>

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
            <g 
              key={id} 
              opacity={dim ? 0.12 : 1}
              style={{ 
                cursor: "pointer",
                transition: "opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1)" 
              }}
              onClick={() => onSelect(id)}
              onMouseEnter={() => onSelect(id)}
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

              {/* Large Pure Fitted EV Ecosystem Foundation Image */}
              <image
                href="/images/ecosystem-ev.png"
                xlinkHref="/images/ecosystem-ev.png"
                x="-360"
                y="-150"
                width="720"
                height="400"
                preserveAspectRatio="xMidYMid meet"
                clipPath="url(#purePhysicalImageClip)"
                style={{
                  filter: isActive 
                    ? "saturate(1.25) contrast(1.08) brightness(1.02) drop-shadow(0 15px 35px rgba(20,184,166,0.4))" 
                    : "saturate(1.0) contrast(1.0) drop-shadow(0 10px 25px rgba(0,0,0,0.14))",
                  transition: "filter 0.4s ease",
                }}
              />
            </g>
          );
        }

        return (
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
  dim,
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

  const side = (a: number, b: number) => {
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
      style={{ cursor: "pointer" }}
      onClick={() => onSelect(id)}
      onMouseEnter={() => onSelect(id)}
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
  dim,
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
  dim,
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
  const quad = (a: number, b: number) =>
    `${p3(...bot[a])} ${p3(...bot[b])} ${p3(...top[b])} ${p3(...top[a])}`;

  const backEdges: Array<[number, number]> = [
    [7, 0],
    [0, 1],
    [1, 2],
  ];
  const frontEdges: Array<[number, number]> = [
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

function Annotation({
  layer,
  side,
  topPx,
  active,
  dimmed,
}: {
  layer: LayerInfo;
  side: "left" | "right";
  topPx: number;
  active: boolean;
  dimmed: boolean;
}) {
  const isLeft = side === "left";
  return (
    <div
      className="absolute text-left pointer-events-none z-10"
      style={{
        top: topPx,
        [isLeft ? "left" : "right"]: 0,
        width: 280,
        transform: "translateY(-50%)",
      }}
    >
      <div className={`flex items-start gap-3 ${isLeft ? "" : "flex-row-reverse text-right"}`}>
        {/* Connector line */}
        <div className="pt-2.5 flex-shrink-0" style={{ width: 64 }}>
          <div
            className="h-px w-full transition-all duration-300"
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
          <div
            className="mt-1 h-1.5 w-1.5 rounded-full transition-all duration-300"
            style={{
              background: active ? "#14B8A6" : dimmed ? "rgba(15,23,42,0.12)" : "rgba(15,23,42,0.3)",
              boxShadow: active ? "0 0 10px #5EEAD4" : "none",
              marginLeft: isLeft ? "auto" : 0,
            }}
          />
        </div>

        <MotionDiv
          animate={{
            opacity: active ? 1 : dimmed ? 0.22 : 0.65,
            x: active ? 0 : isLeft ? -6 : 6,
          }}
          transition={{ duration: 0.3 }}
          className="flex-1"
        >
          <div className="font-[family-name:var(--font-plus-jakarta)] text-lg font-bold tracking-tight text-zinc-900 transition-colors">
            {layer.title}
          </div>
          <div className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.16em] text-zinc-400">
            {layer.label}
          </div>
          <div className={`mt-2 flex flex-wrap gap-1.5 ${isLeft ? "" : "justify-end"}`}>
            {layer.chips.slice(0, 3).map((c) => (
              <span
                key={c}
                className="rounded-full border px-2.5 py-0.5 text-[10px] font-medium transition-colors"
                style={{
                  background: active ? "rgba(20,184,166,0.10)" : "rgba(15,23,42,0.04)",
                  borderColor: active ? "rgba(20,184,166,0.35)" : "rgba(15,23,42,0.10)",
                  color: active ? "#0F766E" : "rgba(15,23,42,0.6)",
                }}
              >
                {c}
              </span>
            ))}
          </div>
        </MotionDiv>
      </div>
    </div>
  );
}
