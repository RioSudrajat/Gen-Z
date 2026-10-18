"use client";

import { useState, useEffect, useRef } from "react";

/* ─────────────── PALETTE ─────────────── */
const C = {
  m50: "#F0FDF9", m100: "#CCFCE8", m200: "#A7F3D0", m300: "#6EE7B7",
  m400: "#34D399", m500: "#10B981", m600: "#059669", m700: "#047857", m800: "#065F46",
  w: "#FFFFFF", g50: "#F8FAFC", g100: "#F1F5F9", g200: "#E2E8F0", g300: "#CBD5E1",
  g400: "#94A3B8", g500: "#64748B", g600: "#475569", g700: "#334155", g800: "#1E293B",
  glow: "rgba(52,211,153,0.15)", soft: "rgba(110,231,183,0.10)",
  dk: "#172B25", scr: "#4ADE80",
};

/* ─────────────── ISOMETRIC PROJECTION ─────────────── */
type Pt = [number, number];
function pointAt<T>(points: readonly T[], index: number): T {
  const point = points[index];
  if (point === undefined) throw new Error("Missing ecosystem geometry point");
  return point;
}
const U = 19.5;
const YF = 0.35;
const ox = 250;
const oy = 180;

function p3(x: number, y: number, z: number, _ox = ox, _oy = oy): Pt {
  return [_ox + (x - y) * U, _oy + (x + y) * U * YF - z * U];
}

function Poly({ pts, fill, stroke, sw = 0.8, opacity = 1, children }: {
  pts: Pt[]; fill: string; stroke?: string; sw?: number; opacity?: number;
  children?: React.ReactNode;
}) {
  return (
    <polygon points={pts.map(p => `${p[0]},${p[1]}`).join(" ")}
      fill={fill} stroke={stroke ?? "none"} strokeWidth={sw}
      strokeLinejoin="round" opacity={opacity}>
      {children}
    </polygon>
  );
}

// Generates a 2D rounded rectangle profile centered at 0,0
function getRoundedRectPts(w: number, d: number, r: number, numPts = 6) {
  const pts: [number, number][] = [];
  for (let i = 0; i <= numPts; i++) {
    const a = i * (Math.PI / 2) / numPts;
    pts.push([w / 2 - r + r * Math.sin(a), d / 2 - r + r * Math.cos(a)]);
  }
  for (let i = 0; i <= numPts; i++) {
    const a = i * (Math.PI / 2) / numPts;
    pts.push([w / 2 - r + r * Math.cos(a), -d / 2 + r - r * Math.sin(a)]);
  }
  for (let i = 0; i <= numPts; i++) {
    const a = i * (Math.PI / 2) / numPts;
    pts.push([-w / 2 + r - r * Math.sin(a), -d / 2 + r - r * Math.cos(a)]);
  }
  for (let i = 0; i <= numPts; i++) {
    const a = i * (Math.PI / 2) / numPts;
    pts.push([-w / 2 + r - r * Math.cos(a), d / 2 - r + r * Math.sin(a)]);
  }
  return pts;
}

type Pt3D = [number, number, number];
interface ExtrudeProps {
  pts3D_A: Pt3D[];
  pts3D_B: Pt3D[];
  fillSide: string;
  strokeSide: string;
  fillCapA: string;
  fillCapB: string;
  strokeCap: string;
}
interface Face {
  poly: Pt[];
  fill: string;
  stroke: string;
  sw: number;
  depth: number;
}

// Generalized 3D Extrusion renderer for convex shapes
function Extrude({ pts3D_A, pts3D_B, fillSide, strokeSide, fillCapA, fillCapB, strokeCap }: ExtrudeProps) {
  const faces: Face[] = pts3D_A.map((ptA: Pt3D, i: number) => {
    const nPtA = pointAt(pts3D_A, (i + 1) % pts3D_A.length);
    const nPtB = pointAt(pts3D_B, (i + 1) % pts3D_B.length);
    const ptB = pointAt(pts3D_B, i);
    const depth = ptA[0] + ptA[1] + nPtA[0] + nPtA[1] + nPtB[0] + nPtB[1] + ptB[0] + ptB[1];
    return {
      poly: [p3(ptA[0], ptA[1], ptA[2]), p3(nPtA[0], nPtA[1], nPtA[2]), p3(nPtB[0], nPtB[1], nPtB[2]), p3(ptB[0], ptB[1], ptB[2])],
      fill: fillSide, stroke: strokeSide, sw: 0.5, depth
    };
  });

  const dA = pts3D_A.reduce((sum: number, p: Pt3D) => sum + p[0] + p[1], 0) / pts3D_A.length * 4;
  faces.push({
    poly: pts3D_A.map((p: Pt3D) => p3(p[0], p[1], p[2])),
    fill: fillCapA, stroke: strokeCap, sw: 1.0, depth: dA
  });

  const dB = pts3D_B.reduce((sum: number, p: Pt3D) => sum + p[0] + p[1], 0) / pts3D_B.length * 4;
  faces.push({
    poly: pts3D_B.map((p: Pt3D) => p3(p[0], p[1], p[2])),
    fill: fillCapB, stroke: strokeCap, sw: 1.0, depth: dB
  });

  faces.sort((a: Face, b: Face) => a.depth - b.depth);

  return (
    <g>
      {faces.map((f: Face, i: number) => <Poly key={i} pts={f.poly} fill={f.fill} stroke={f.stroke} sw={f.sw} />)}
    </g>
  );
}

/* ─────────────── ENERGY CONDUIT ─────────────── */
function Conduit({ id, d, speed = "2.4s", delay = "0s", color = C.m400, on = true }: {
  id: string; d: string; speed?: string; delay?: string; color?: string; on?: boolean;
}) {
  const pid = `${id}_r`;
  return (
    <g opacity={on ? 1 : 0.12}>
      <path d={d} fill="none" stroke={color} strokeWidth={8} opacity={0.06}
        style={{ filter: "blur(5px)" }} />
      <path d={d} fill="none" stroke={color} strokeWidth={2}
        strokeDasharray="7 9" strokeLinecap="round">
        <animate attributeName="stroke-dashoffset" from="0" to="-16"
          dur={speed} begin={delay} repeatCount="indefinite" />
      </path>
      {on && (
        <>
          <text fontSize={11} fill={color} textAnchor="middle" fontWeight={900}
            fontFamily="ui-sans-serif,sans-serif" style={{ filter: `drop-shadow(0 0 3px ${color})` }}>
            <animateMotion dur={speed} begin={delay} repeatCount="indefinite" rotate="0">
              <mpath href={`#${pid}`} />
            </animateMotion>
            ⚡
          </text>
          <text fontSize={8} fill={C.m200} textAnchor="middle" fontWeight={900}
            fontFamily="ui-sans-serif,sans-serif" style={{ filter: `drop-shadow(0 0 2px ${C.m200})` }}>
            <animateMotion dur={speed}
              begin={`${parseFloat(delay) + parseFloat(speed) * 0.4}s`}
              repeatCount="indefinite" rotate="0">
              <mpath href={`#${pid}`} />
            </animateMotion>
            ⚡
          </text>
        </>
      )}
      <path id={pid} d={d} fill="none" visibility="hidden" />
    </g>
  );
}

function FloatZap({ pid, d, color = C.m500, size = 12, speed = "2.4s", delay = "0s" }: {
  pid: string; d: string; color?: string; size?: number; speed?: string; delay?: string;
}) {
  return (
    <g>
      <text fontSize={size} fill={color} textAnchor="middle" fontWeight={900}
        fontFamily="ui-sans-serif,sans-serif"
        style={{ filter: `drop-shadow(0 0 4px ${color})` }}>
        <animateMotion dur={speed} begin={delay} repeatCount="indefinite" rotate="0">
          <mpath href={`#${pid}`} />
        </animateMotion>
        ⚡
      </text>
      <path id={pid} d={d} fill="none" visibility="hidden" />
    </g>
  );
}

function RevenueCoins({ cx, cy }: { cx: number; cy: number }) {
  return (
    <g>
      {[{ dx: -12, d: "0s" }, { dx: 0, d: "1.1s" }, { dx: 12, d: "2.2s" }].map((c, i) => (
        <g key={i}>
          <circle r={6} fill={C.m400} style={{ filter: `drop-shadow(0 0 4px ${C.m300})` }}>
            <animate attributeName="opacity" values="0;1;1;0"
              keyTimes="0;0.15;0.85;1" dur="3.4s" begin={c.d} repeatCount="indefinite" />
            <animateTransform attributeName="transform" type="translate"
              from={`${cx + c.dx} ${cy + 14}`} to={`${cx + c.dx} ${cy - 26}`}
              dur="3.4s" begin={c.d} repeatCount="indefinite" />
          </circle>
          <text fontSize={7} fill={C.w} textAnchor="middle" fontWeight={900}
            fontFamily="ui-sans-serif,sans-serif" dominantBaseline="central">
            <animate attributeName="opacity" values="0;1;1;0"
              keyTimes="0;0.15;0.85;1" dur="3.4s" begin={c.d} repeatCount="indefinite" />
            <animateTransform attributeName="transform" type="translate"
              from={`${cx + c.dx} ${cy + 14}`} to={`${cx + c.dx} ${cy - 26}`}
              dur="3.4s" begin={c.d} repeatCount="indefinite" />
            $
          </text>
        </g>
      ))}
    </g>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SOLAR PANEL — FACING FORWARD
   ═══════════════════════════════════════════════════════════════ */
function SolarFarm({ bx, by, gen }: { bx: number; by: number; gen: boolean }) {
  const p = (x: number, y: number, z: number) => p3(bx + x, by + y, z);

  const pW = 4.4, pD = 2.3;
  const zF = 1.9, zB = 0.35;
  
  // Panel Corners (Left Panel)
  const pFL = p(0.04, 0.04, zF), pFM_L = p(pW / 2 - 0.04, 0.04, zF);
  const pBM_L = p(pW / 2 - 0.04, pD - 0.04, zB), pBL = p(0.04, pD - 0.04, zB);

  // Panel Corners (Right Panel)
  const pFM_R = p(pW / 2 + 0.04, 0.04, zF), pFR = p(pW - 0.04, 0.04, zF);
  const pBR = p(pW - 0.04, pD - 0.04, zB), pBM_R = p(pW / 2 + 0.04, pD - 0.04, zB);

  // Mid points for overall layout
  const pFM = p(pW / 2, 0, zF);
  const pBM = p(pW / 2, pD, zB);

  // Base support rails running along the ground
  const railLY = -0.3, railHY = pD + 0.3, railH = 0.12;
  const rL_T: Pt[] = [p(0.7, railLY, railH), p(0.9, railLY, railH), p(0.9, railHY, railH), p(0.7, railHY, railH)];
  const rL_S: Pt[] = [p(0.9, railLY, 0), p(0.9, railLY, railH), p(0.9, railHY, railH), p(0.9, railHY, 0)];
  
  const rR_T: Pt[] = [p(3.5, railLY, railH), p(3.7, railLY, railH), p(3.7, railHY, railH), p(3.5, railHY, railH)];
  const rR_S: Pt[] = [p(3.7, railLY, 0), p(3.7, railLY, railH), p(3.7, railHY, railH), p(3.7, railHY, 0)];

  // Horizontal ground beam connecting the rails at the back
  const rH_T: Pt[] = [p(0.9, pD - 0.2, railH), p(3.5, pD - 0.2, railH), p(3.5, pD, railH), p(0.9, pD, railH)];
  const rH_F: Pt[] = [p(0.9, pD - 0.2, 0), p(0.9, pD - 0.2, railH), p(3.5, pD - 0.2, railH), p(3.5, pD - 0.2, 0)];

  // Column support locations (aligned with rails at x = 0.8 and 3.6)
  const sLB = p(0.8, pD - 0.5, railH), sLT = p(0.8, 0.2, zF - 0.2);
  const sRB = p(3.6, pD - 0.5, railH), sRT = p(3.6, 0.2, zF - 0.2);

  // Vertical back legs
  const bkLB = p(0.8, pD - 0.1, railH), bkLT = p(0.8, pD - 0.1, zB + 0.05);
  const bkRB = p(3.6, pD - 0.1, railH), bkRT = p(3.6, pD - 0.1, zB + 0.05);

  const drawCells = (c0: Pt, c1: Pt, c2: Pt, c3: Pt, rows = 5, cols = 3) => {
    const cells: React.ReactElement[] = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const getPt = (tR: number, tC: number): Pt => {
          const left: Pt = [c0[0] + (c3[0] - c0[0]) * tR, c0[1] + (c3[1] - c0[1]) * tR];
          const right: Pt = [c1[0] + (c2[0] - c1[0]) * tR, c1[1] + (c2[1] - c1[1]) * tR];
          return [left[0] + (right[0] - left[0]) * tC, left[1] + (right[1] - left[1]) * tC];
        };
        const p0 = getPt(r / rows + 0.04, c / cols + 0.04);
        const p1 = getPt(r / rows + 0.04, (c + 1) / cols - 0.04);
        const p2 = getPt((r + 1) / rows - 0.04, (c + 1) / cols - 0.04);
        const p3_ = getPt((r + 1) / rows - 0.04, c / cols - 0.04);
        cells.push(
          <Poly key={`${r}_${c}`} pts={[p0, p1, p2, p3_]} fill={C.w} opacity={0.32} stroke={C.w} sw={0.3} />
        );
      }
    }
    return cells;
  };

  const gc = p(pW / 2, pD / 2, 0);

  return (
    <g>
      {/* Ground Shadow */}
      <ellipse cx={gc[0]} cy={gc[1] + 4} rx={66} ry={20} fill={C.glow} />

      {/* ─── GROUND SUPPORT STRUCTURE (WHITE RAILS WITH MINT ACCENTS) ─── */}
      {/* Left Rail */}
      <Poly pts={rL_T} fill={C.g50} stroke={C.g200} sw={0.5} />
      <Poly pts={rL_S} fill={C.g100} stroke={C.g200} sw={0.5} />
      <line x1={p(0.7, railLY, railH)[0]} y1={p(0.7, railLY, railH)[1]} x2={p(0.7, railHY, railH)[0]} y2={p(0.7, railHY, railH)[1]} stroke={C.m400} strokeWidth={1.2} />
      
      {/* Right Rail */}
      <Poly pts={rR_T} fill={C.g50} stroke={C.g200} sw={0.5} />
      <Poly pts={rR_S} fill={C.g100} stroke={C.g200} sw={0.5} />
      <line x1={p(3.1, railLY, railH)[0]} y1={p(3.1, railLY, railH)[1]} x2={p(3.1, railHY, railH)[0]} y2={p(3.1, railHY, railH)[1]} stroke={C.m400} strokeWidth={1.2} />

      {/* Horizontal Connector Rail */}
      <Poly pts={rH_T} fill={C.g50} stroke={C.g200} sw={0.5} />
      <Poly pts={rH_F} fill={C.g100} stroke={C.g200} sw={0.5} />
      <line x1={p(0.8, 2.1, railH)[0]} y1={p(0.8, 2.1, railH)[1]} x2={p(3.0, 2.1, railH)[0]} y2={p(3.0, 2.1, railH)[1]} stroke={C.m400} strokeWidth={1.2} />



      {/* ─── Columns (3D shaded mint struts) ─── */}
      {/* Left Diagonal Column */}
      <Poly pts={[p(0.66, 1.6, railH), p(0.66, 0.2, zF - 0.2), p(0.74, 0.2, zF - 0.2), p(0.74, 1.6, railH)]} fill={C.m400} stroke={C.m500} sw={0.5} />
      <Poly pts={[p(0.74, 1.6, railH), p(0.74, 0.2, zF - 0.2), p(0.74, 0.2, zF - 0.25), p(0.74, 1.6, 0)]} fill={C.m500} opacity={0.8} />

      {/* Right Diagonal Column */}
      <Poly pts={[p(3.06, 1.6, railH), p(3.06, 0.2, zF - 0.2), p(3.14, 0.2, zF - 0.2), p(3.14, 1.6, railH)]} fill={C.m400} stroke={C.m500} sw={0.5} />
      <Poly pts={[p(3.14, 1.6, railH), p(3.14, 0.2, zF - 0.2), p(3.14, 0.2, zF - 0.25), p(3.14, 1.6, 0)]} fill={C.m500} opacity={0.8} />

      {/* Left Back Column (Short vertical leg) */}
      <Poly pts={[p(0.67, 2.1, railH), p(0.67, 2.1, zB + 0.05), p(0.73, 2.1, zB + 0.05), p(0.73, 2.1, railH)]} fill={C.m500} stroke={C.m600} sw={0.5} />
      {/* Right Back Column */}
      <Poly pts={[p(3.07, 2.1, railH), p(3.07, 2.1, zB + 0.05), p(3.13, 2.1, zB + 0.05), p(3.13, 2.1, railH)]} fill={C.m500} stroke={C.m600} sw={0.5} />

      {/* Hanging Cables (underneath panels) */}
      <path d={`M ${p(0.8, 1.1, zF * 0.5)[0]},${p(0.8, 1.1, zF * 0.5)[1]} Q ${p(0.9, 1.4, 0.2)[0]},${p(0.9, 1.4, 0.2)[1]} ${p(1.1, 1.2, zF * 0.4)[0]},${p(1.1, 1.2, zF * 0.4)[1]}`} fill="none" stroke={C.m500} strokeWidth={1} />
      <path d={`M ${p(3.0, 1.1, zF * 0.5)[0]},${p(3.0, 1.1, zF * 0.5)[1]} Q ${p(2.9, 1.4, 0.2)[0]},${p(2.9, 1.4, 0.2)[1]} ${p(2.7, 1.2, zF * 0.4)[0]},${p(2.7, 1.2, zF * 0.4)[1]}`} fill="none" stroke={C.m500} strokeWidth={1} />

      {/* ─── DOUBLE SOLAR PANELS (MINT OUTER FRAME & DARK GLASS INNER CELL-GRID) ─── */}
      {/* Left Panel Frame */}
      <Poly pts={[pBL, pBM_L, pFM_L, pFL]} fill={C.m300} stroke={C.m500} sw={0.8} />
      {/* Left Panel Inner Dark Glass */}
      <Poly pts={[p(0.12, pD - 0.12, zB + 0.05), p(pW / 2 - 0.12, pD - 0.12, zB + 0.05), p(pW / 2 - 0.12, 0.12, zF - 0.05), p(0.12, 0.12, zF - 0.05)]} fill="#0C251C" stroke="#163D2E" sw={0.5} />
      {/* Left Panel Cells */}
      {drawCells(p(0.12, pD - 0.12, zB + 0.05), p(pW / 2 - 0.12, pD - 0.12, zB + 0.05), p(pW / 2 - 0.12, 0.12, zF - 0.05), p(0.12, 0.12, zF - 0.05), 5, 3)}

      {/* Right Panel Frame */}
      <Poly pts={[pBM_R, pBR, pFR, pFM_R]} fill={C.m300} stroke={C.m500} sw={0.8} />
      {/* Right Panel Inner Dark Glass */}
      <Poly pts={[p(pW / 2 + 0.12, pD - 0.12, zB + 0.05), p(pW - 0.12, pD - 0.12, zB + 0.05), p(pW - 0.12, 0.12, zF - 0.05), p(pW / 2 + 0.12, 0.12, zF - 0.05)]} fill="#0C251C" stroke="#163D2E" sw={0.5} />
      {/* Right Panel Cells */}
      {drawCells(p(pW / 2 + 0.12, pD - 0.12, zB + 0.05), p(pW - 0.12, pD - 0.12, zB + 0.05), p(pW - 0.12, 0.12, zF - 0.05), p(pW / 2 + 0.12, 0.12, zF - 0.05), 5, 3)}

      {/* Center Divider Gap Line */}
      <line x1={pFM[0]} y1={pFM[1]} x2={pBM[0]} y2={pBM[1]} stroke={C.g500} strokeWidth={1} opacity={0.4} />



      {/* Generation Glow Effect */}
      {gen && (
        <>
          <Poly pts={[pBL, pBR, pFR, pFL]} fill={C.m300} opacity={0.03}>
            <animate attributeName="opacity" values="0.01;0.08;0.01" dur="2.6s" repeatCount="indefinite" />
          </Poly>
          {/* Main energy node */}
          <circle cx={p(-0.5, -0.3, zF + 0.5)[0]} cy={p(-0.5, -0.3, zF + 0.5)[1]} r={6} fill={C.m300} opacity={0.85} style={{ filter: `drop-shadow(0 0 6px ${C.m400})` }}>
            <animate attributeName="opacity" values="0.6;1;0.6" dur="2.6s" repeatCount="indefinite" />
          </circle>
          <circle cx={p(-0.5, -0.3, zF + 0.5)[0]} cy={p(-0.5, -0.3, zF + 0.5)[1]} r={13} fill={C.m200} opacity={0.15}>
            <animate attributeName="r" values="9;15;9" dur="2.6s" repeatCount="indefinite" />
          </circle>
        </>
      )}
    </g>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SLEEK CHARGING STATION
   ═══════════════════════════════════════════════════════════════ */
function ChargingStation({ bx, by, active }: { bx: number; by: number; active: boolean }) {
  // Base Platform (White top, mint edge)
  const baseProf = getRoundedRectPts(6.0, 6.0, 0.8);
  const bA = baseProf.map(p => [bx + p[0] + 2.6, by + p[1] + 2.6, 0] as [number, number, number]);
  const bB = baseProf.map(p => [bx + p[0] + 2.6, by + p[1] + 2.6, 0.25] as [number, number, number]);

  // Kiosk Foot (extends forward towards car)
  const kY = by + 2.6;
  const fProf = getRoundedRectPts(4.4, 1.2, 0.3);
  const fZ = 0.75;
  const fA = fProf.map(p => [bx + 0.1, kY + p[0], fZ + p[1]] as [number, number, number]);
  const fB = fProf.map(p => [bx + 1.2, kY + p[0], fZ + p[1]] as [number, number, number]);

  // Kiosk Body (Landscape matching reference)
  const kProf = getRoundedRectPts(5.0, 3.8, 0.6);
  const kZ = 3.0;
  const kA = kProf.map(p => [bx, kY + p[0], kZ + p[1]] as [number, number, number]);
  const kB = kProf.map(p => [bx + 0.7, kY + p[0], kZ + p[1]] as [number, number, number]);

  const gc = p3(bx + 2.4, by + 2.6, 0);
  // Stowed single cable on the left side edge
  const pSocket = p3(bx + 0.35, by + 1.2, 4.4); // High socket outlet on left side panel
  const pDock = p3(bx + 0.35, by + 1.35, 2.6); // Lower dock holder on left side panel
  const cpStowed1 = p3(bx - 0.2, by + 0.4, 3.2); // Hanging loop control points
  const cpStowed2 = p3(bx - 0.2, by + 0.4, 1.6);
  const cableHanging = `M ${pSocket[0]},${pSocket[1]} C ${cpStowed1[0]},${cpStowed1[1]} ${cpStowed2[0]},${cpStowed2[1]} ${pDock[0]},${pDock[1]}`;

  // Isometric transform matrix for perfectly aligned screen graphics!
  const [e, f] = p3(bx + 0.72, 0, 0);
  const mat = `matrix(${U}, ${-U * YF}, 0, ${U}, ${e}, ${f})`;
  const cx_bat = -kY;
  const cy_bat = -kZ;

  return (
    <g>
      <ellipse cx={gc[0]} cy={gc[1] + 4} rx={78} ry={24} fill={C.glow} opacity={0.5} />

      {/* Base: White cap, Mint edge */}
      <Extrude pts3D_A={bA} pts3D_B={bB} fillSide={C.m300} strokeSide={C.m400} fillCapA={C.m200} fillCapB={C.w} strokeCap={C.m300} />
      
      {/* Foot: Smooth white curve into the kiosk */}
      <Extrude pts3D_A={fA} pts3D_B={fB} fillSide={C.g100} strokeSide={C.g200} fillCapA={C.g50} fillCapB={C.w} strokeCap={C.g200} />

      {/* Kiosk: Mint edge, White faces */}
      <Extrude pts3D_A={kA} pts3D_B={kB} fillSide={C.m300} strokeSide={C.m400} fillCapA={C.m100} fillCapB={C.w} strokeCap={C.m300} />

      {/* Screen Graphic Layer projected isometrically */}
      <g transform={mat}>
        {/* Screen Background */}
        <rect x={cx_bat - 1.8} y={cy_bat - 1.1} width={3.6} height={2.4} rx={0.3} fill={C.dk} stroke={C.m100} strokeWidth={0.06} />
        <rect x={cx_bat - 1.8} y={cy_bat - 1.1} width={3.6} height={2.4} rx={0.3} fill={C.w} opacity={0.03} />

        {/* Battery Outline */}
        <rect x={cx_bat - 0.8} y={cy_bat - 0.4} width={1.6} height={0.8} rx={0.15} fill="none" stroke={active ? C.scr : C.g600} strokeWidth={0.08} />
        {/* Battery Tip */}
        <rect x={cx_bat + 0.8} y={cy_bat - 0.15} width={0.12} height={0.3} rx={0.05} fill={active ? C.scr : C.g600} />
        
        {/* Battery Fill (Animated) */}
        {active && (
          <rect x={cx_bat - 0.72} y={cy_bat - 0.32} width={0} height={0.64} rx={0.08} fill={C.scr}>
            <animate attributeName="width" values="0;1.44;1.44;0" keyTimes="0;0.7;0.95;1" dur="3.5s" repeatCount="indefinite" />
          </rect>
        )}
        
        {/* Zap Icon */}
        <text x={cx_bat} y={cy_bat + 0.04} fontSize={0.65} fill={active ? C.dk : C.g600} textAnchor="middle" dominantBaseline="central" fontWeight={900} fontFamily="ui-sans-serif,sans-serif">⚡</text>

        {/* Segmented Progress Bar */}
        {Array.from({ length: 12 }).map((_, i) => (
          <rect key={i} x={cx_bat - 0.8 + i * 0.14} y={cy_bat + 0.55} width={0.1} height={0.15} rx={0.03} fill={C.scr} opacity={active ? 1 : 0.2}>
            {active && <animate attributeName="opacity" values="0.2;1;0.2" dur={`${1.0 + i * 0.1}s`} repeatCount="indefinite" />}
          </rect>
        ))}
      </g>
      {!active && (
        <g>
          <path d={cableHanging} fill="none" stroke={C.g800} strokeWidth={2.8} strokeLinecap="round" opacity={0.9} />
          {/* Connector plug docked back in station */}
          <ellipse cx={pDock[0]} cy={pDock[1]} rx={3.5} ry={2.5} fill={C.g800} transform={`rotate(-15 ${pDock[0]} ${pDock[1]})`} />
          <circle cx={pDock[0]} cy={pDock[1]} r={1.0} fill={C.m400} />
        </g>
      )}
    </g>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SLEEK EV CAR — Macro Painter's Algorithm + Convex Sorting
   ═══════════════════════════════════════════════════════════════ */
function EVCar({ cx, cy, cz, theta, ch }: { cx: number; cy: number; cz: number; theta: number; ch: boolean }) {
  const bezier = (t: number, p0: Pt, p1: Pt, p2: Pt, p3: Pt): Pt => {
    const c = 1 - t;
    return [
      c * c * c * p0[0] + 3 * c * c * t * p1[0] + 3 * c * t * t * p2[0] + t * t * t * p3[0],
      c * c * c * p0[1] + 3 * c * c * t * p1[1] + 3 * c * t * t * p2[1] + t * t * t * p3[1]
    ];
  };

  const generateCarProfile = () => {
    const pts: [number, number][] = [];
    pts.push([-2.2, 0.20], [-2.4, 0.45], [-2.3, 0.70]); // Rear bumper
    for (let i = 1; i <= 10; i++) pts.push(bezier(i / 10, [-2.3, 0.70], [-1.5, 0.85], [-0.8, 1.35], [0.1, 1.35])); // Fastback rear glass
    for (let i = 1; i <= 10; i++) pts.push(bezier(i / 10, [0.1, 1.35], [0.8, 1.35], [1.5, 0.85], [1.9, 0.70])); // Smooth roof to hood
    for (let i = 1; i <= 10; i++) pts.push(bezier(i / 10, [1.9, 0.70], [2.2, 0.60], [2.4, 0.45], [2.35, 0.25])); // Hood to bumper
    pts.push([2.2, 0.15], [0, 0.15]); // Front bottom & skirt
    pts.push([-2.2, 0.20]); // CLOSE THE LOOP to prevent holes!
    return pts; // 36 points
  };

  const generateSideGlassProfile = () => {
    const pts: [number, number][] = [];
    for (let i = 0; i <= 10; i++) pts.push(bezier(i / 10, [-1.7, 0.80], [-1.0, 0.85], [-0.5, 1.25], [0.1, 1.25]));
    for (let i = 1; i <= 10; i++) pts.push(bezier(i / 10, [0.1, 1.25], [0.6, 1.25], [0.9, 0.88], [1.1, 0.80]));
    pts.push([-1.7, 0.80]); // Beltline
    return pts;
  };

  const W = 1.7;
  const bodyL = ch ? "#EFF9F5" : "#F1F5F9";
  const bodyS = ch ? "#DCF0E8" : "#E2E8F0";
  const glass = C.dk;
  const trim = ch ? C.m400 : C.g300;

  const transform = (lx: number, ly: number, lz: number): [number, number, number] => {
    const cosT = Math.cos(theta);
    const sinT = Math.sin(theta);
    const rx = lx * cosT - ly * sinT;
    const ry = lx * sinT + ly * cosT;
    return [cx + rx, cy + ry, cz + lz];
  };

  const sp = generateCarProfile();
  const rotatedL = sp.map(([y, z]) => transform(-W / 2, y, z));
  const rotatedR = sp.map(([y, z]) => transform(W / 2, y, z));
  const projL = rotatedL.map(([x, y, z]) => p3(x, y, z));
  const projR = rotatedR.map(([x, y, z]) => p3(x, y, z));

  const avgD = (pts: [number, number, number][]) => pts.reduce((sum, p) => sum + p[0] + p[1], 0) / pts.length;

  // 1. MACRO SORTING - Guarantee perfect grouping for side vs center vs wheels
  // In isometric space from [-1, -1, 1], +X side is closer if cos(theta)+sin(theta) > 0
  const isRightCloser = (Math.cos(theta) + Math.sin(theta)) > 0;
  
  // 2. Wheel Component
  const wheelLocs = [
    { ly: -1.35, lx: -0.90 }, { ly: -1.35, lx: 0.90 },
    { ly: 1.45, lx: -0.90 }, { ly: 1.45, lx: 0.90 }
  ];
  
  const drawWheel = (w: { lx: number; ly: number }) => {
    const wheelPts: Pt[] = [], rimPts: Pt[] = [];
    const numPts = 12, R = 0.44, rRim = 0.28;
    const [cx_w, cy_w, cz_w] = transform(w.lx, w.ly, 0.42);

    for (let i = 0; i < numPts; i++) {
      const angle = (i * 2 * Math.PI) / numPts;
      const [gx, gy, gz] = transform(w.lx, w.ly + R * Math.cos(angle), 0.42 + R * Math.sin(angle));
      wheelPts.push(p3(gx, gy, gz));
      const [r_gx, r_gy, r_gz] = transform(w.lx, w.ly + rRim * Math.cos(angle), 0.42 + rRim * Math.sin(angle));
      rimPts.push(p3(r_gx, r_gy, r_gz));
    }

    return (
      <g key={`${w.lx}_${w.ly}`}>
        <Poly pts={wheelPts} fill={C.g800} stroke={C.g700} sw={0.5} />
        <Poly pts={rimPts} fill={ch ? C.m700 : C.g600} stroke={ch ? C.m500 : C.g500} sw={0.4} />
        {rimPts.map((pt, idx) => idx % 2 === 0 ? (
          <line key={idx} x1={p3(cx_w, cy_w, cz_w)[0]} y1={p3(cx_w, cy_w, cz_w)[1]} x2={pt[0]} y2={pt[1]} stroke={ch ? C.m300 : C.g300} strokeWidth={0.6} opacity={0.6} />
        ) : null)}
        <circle cx={p3(cx_w, cy_w, cz_w)[0]} cy={p3(cx_w, cy_w, cz_w)[1]} r={2.2} fill={ch ? C.m400 : C.g400} />
      </g>
    );
  };

  const rightWheels = wheelLocs.filter(w => w.lx > 0).map(drawWheel);
  const leftWheels = wheelLocs.filter(w => w.lx < 0).map(drawWheel);

  // 3. Side Bodies & Glass Overlays
  const gp = generateSideGlassProfile();
  const glassRotL = gp.map(([y, z]) => transform(-W / 2 - 0.01, y, z));
  const glassRotR = gp.map(([y, z]) => transform(W / 2 + 0.01, y, z));

  const rightSide = (
    <g key="rs">
      <Poly pts={projR} fill={bodyS} stroke={trim} sw={0.5} />
      <Poly pts={glassRotR.map(([x, y, z]) => p3(x, y, z))} fill={glass} />
    </g>
  );

  const leftSide = (
    <g key="ls">
      <Poly pts={projL} fill={bodyS} stroke={trim} sw={0.5} />
      <Poly pts={glassRotL.map(([x, y, z]) => p3(x, y, z))} fill={glass} />
    </g>
  );

  // 4. Extruded Center Faces
  const extruded = [];
  for (let i = 0; i < sp.length - 1; i++) {
    const p0 = pointAt(projR, i), p1 = pointAt(projR, i + 1), p2 = pointAt(projL, i + 1), p3_ = pointAt(projL, i);
    let fill = bodyL;
    if (i >= 2 && i <= 21) fill = glass; // Continuous Panoramic Roof
    else if (i >= 30) fill = C.dk; // Black Front Grille area
    
    let depth = avgD([pointAt(rotatedR, i), pointAt(rotatedR, i + 1), pointAt(rotatedL, i + 1), pointAt(rotatedL, i)]);
    if (i >= 33) {
      depth = -999; // Underbody always rendered first
    } else if (i >= 22 && i <= 29) {
      depth += 5.0; // Ensure hood renders on top of windshield
    }
    
    extruded.push({
      poly: <Poly key={`ex_${i}`} pts={[p0, p1, p2, p3_]} fill={fill} stroke={fill} sw={1.2} />,
      depth
    });
  }
  extruded.sort((a, b) => a.depth - b.depth);

  const carCenter2D = p3(cx, cy, cz);
  const frontR = pointAt(projR, 31), frontL = pointAt(projL, 31);
  const rearR = pointAt(projR, 2), rearL = pointAt(projL, 2);

  return (
    <g>
      <ellipse cx={carCenter2D[0]} cy={carCenter2D[1]} rx={50} ry={11} fill={C.g800} opacity={0.07} />
      {ch && <ellipse cx={carCenter2D[0]} cy={carCenter2D[1]} rx={55} ry={13} fill={C.glow} />}

      {/* STRICT Painter's Algorithm rendering order */}
      {isRightCloser ? leftWheels : rightWheels}
      {isRightCloser ? leftSide : rightSide}
      
      {extruded.map(e => e.poly)}
      
      {isRightCloser ? rightSide : leftSide}
      {isRightCloser ? rightWheels : leftWheels}

      {/* Sleek Horizontal Headlights (visible when front faces camera) */}
      {(Math.cos(theta) - Math.sin(theta)) > 0 && (
        <g>
          <ellipse cx={frontR[0]} cy={frontR[1] - 2} rx={4.5} ry={1.2} fill={C.m200} opacity={0.9} transform={`rotate(-15 ${frontR[0]} ${frontR[1]})`}>
            {ch && <animate attributeName="opacity" values="0.5;1;0.5" dur="1.6s" repeatCount="indefinite" />}
          </ellipse>
          <ellipse cx={frontL[0]} cy={frontL[1] - 2} rx={4.5} ry={1.2} fill={C.m200} opacity={0.9} transform={`rotate(15 ${frontL[0]} ${frontL[1]})`}>
            {ch && <animate attributeName="opacity" values="0.5;1;0.5" dur="1.6s" repeatCount="indefinite" />}
          </ellipse>
        </g>
      )}

      {/* Taillights (visible when rear faces camera) */}
      {(Math.cos(theta) - Math.sin(theta)) < 0 && (
        <g>
          <ellipse cx={rearR[0]} cy={rearR[1]} rx={3} ry={1.2} fill="#EF4444" opacity={0.8} transform={`rotate(-15 ${rearR[0]} ${rearR[1]})`} />
          <ellipse cx={rearL[0]} cy={rearL[1]} rx={3} ry={1.2} fill="#EF4444" opacity={0.8} transform={`rotate(15 ${rearL[0]} ${rearL[1]})`} />
          <Poly pts={[rearR, pointAt(projR, 3), pointAt(projL, 3), rearL]} fill="#EF4444" opacity={0.5} />
        </g>
      )}
    </g>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN — Interactive EV Ecosystem
   ═══════════════════════════════════════════════════════════════ */
export function InteractiveGenZEcosystem() {
  const [progress, setProgress] = useState(180);
  const [playing, setPlaying] = useState(true);
  const [motionAllowed, setMotionAllowed] = useState(false);
  const scene = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const desktop = window.matchMedia("(min-width: 1024px)");
    const update = () => setMotionAllowed(!reducedMotion.matches && desktop.matches && !document.hidden);
    update();
    reducedMotion.addEventListener("change", update);
    desktop.addEventListener("change", update);
    document.addEventListener("visibilitychange", update);
    return () => {
      reducedMotion.removeEventListener("change", update);
      desktop.removeEventListener("change", update);
      document.removeEventListener("visibilitychange", update);
    };
  }, []);

  useEffect(() => {
    if (!playing || !motionAllowed) {
      scene.current?.pauseAnimations();
      return;
    }
    scene.current?.unpauseAnimations();
    const id = setInterval(() => {
      setProgress(p => (p + 3) % 1000);
    }, 35);
    return () => clearInterval(id);
  }, [playing, motionAllowed]);

  const isC = progress < 300;
  const charge = isC ? (progress / 300) * 100 : 100;
  const off = isC ? 0 : (progress - 300) / 700;

  const stationX = 1.0;
  const stationY = 5.2; 
  // Park EV Car perpendicular to station
  const pX = stationX + 2.6; 
  const pY = stationY + 2.6; 

  const keyframes = [
    { u: 0.0, x: pX, y: pY },
    { u: 0.12, x: pX, y: pY + 2.8 },
    { u: 0.28, x: pX + 3.0, y: pY + 4.1 },
    { u: 0.48, x: pX + 9.5, y: pY + 4.1 }, 
    { u: 0.60, x: pX + 11.5, y: pY + 2.0 },
    { u: 0.72, x: pX + 11.5, y: pY - 2.5 },
    { u: 0.85, x: pX + 8.5, y: pY - 4.2 },
    { u: 0.95, x: pX, y: pY - 3.5 },
    { u: 1.0, x: pX, y: pY }
  ];

  function getPositionAt(u: number): [number, number] {
    u = Math.max(0, Math.min(1, u));
    for (let i = 0; i < keyframes.length - 1; i++) {
      const k1 = pointAt(keyframes, i);
      const k2 = pointAt(keyframes, i + 1);
      if (u >= k1.u && u <= k2.u) {
        const range = k2.u - k1.u;
        const factor = range === 0 ? 0 : (u - k1.u) / range;
        return [
          k1.x + (k2.x - k1.x) * factor,
          k1.y + (k2.y - k1.y) * factor
        ];
      }
    }
    return [pX, pY];
  }

  const getCarState = (): { cx: number; cy: number; cz: number; theta: number } => {
    if (isC) {
      return { cx: pX, cy: pY, cz: 0, theta: 0 };
    } else {
      const [cx, cy] = getPositionAt(off);
      const [nx, ny] = getPositionAt(off + 0.015);
      const alpha = Math.atan2(ny - cy, nx - cx);
      const theta = alpha - Math.PI / 2;

      let cz = 0;
      if (off < 0.12) {
        cz = 0.25 * (1 - off / 0.12);
      } else if (off > 0.92) {
        cz = 0.25 * ((off - 0.92) / 0.08);
      }

      return { cx, cy, cz, theta };
    }
  };

  const carState = getCarState();

  const solarX = stationX + 6.5;
  const solarY = stationY - 5.5;

  const sOut = p3(solarX + 2.2, solarY + 2.3, 0.35);
  const hIn = p3(stationX + 0.35, stationY + 2.6, 4.9);

  const pSH = `M ${sOut[0]},${sOut[1]} Q ${(sOut[0] + hIn[0]) / 2},${Math.min(sOut[1], hIn[1]) - 32} ${hIn[0]},${hIn[1]}`;
  
  // Split cable into two parts to simulate wrapping around the rear of the car
  const pPortK = p3(stationX + 0.3, stationY + 0.1, 1.4); // Left edge of station
  const pPortC = p3(pX + 0.85, pY + 0.65, 0.8); // Right fender, behind wheel
  const pMid = p3(pX + 1.2, pY - 2.0, 0.0); // Ground point at the rear-right bumper
  
  // Background cable: Station to rear-right bumper (going behind the car)
  const cp1 = p3(stationX + 0.2, stationY - 0.5, 0.0); 
  const cp2 = p3(pX - 0.4, pY - 2.6, 0.0);
  const pChargeCableBg = `M ${pPortK[0]},${pPortK[1]} C ${cp1[0]},${cp1[1]} ${cp2[0]},${cp2[1]} ${pMid[0]},${pMid[1]}`;
  
  // Foreground cable: From rear-right bumper along the floor to the fender port
  const cp3 = p3(pX + 1.4, pY - 0.8, 0.0); 
  const cp4 = p3(pX + 1.2, pY + 0.4, 0.0);
  const pChargeCableFg = `M ${pMid[0]},${pMid[1]} C ${cp3[0]},${cp3[1]} ${cp4[0]},${cp4[1]} ${pPortC[0]},${pPortC[1]}`;

  const items = [
    {
      depth: stationX + stationY + 2.5,
      render: () => <ChargingStation bx={stationX} by={stationY} active={isC} key="station" />
    },
    {
      depth: 9998.0, // Render background cable BEHIND the car
      render: () => isC ? (
        <g key="cable-bg">
          <path d={pChargeCableBg} fill="none" stroke={C.g800} strokeWidth={3.0} strokeLinecap="round" />
          <path d={pChargeCableBg} fill="none" stroke={C.m400} strokeWidth={1.2} strokeDasharray="4 4" strokeLinecap="round">
             <animate attributeName="stroke-dashoffset" from="0" to="-16" dur="1s" repeatCount="indefinite" />
          </path>
          {/* Connector plug at station */}
          <circle cx={pPortK[0]} cy={pPortK[1]} r={4} fill={C.g800} />
          <circle cx={pPortK[0]} cy={pPortK[1]} r={1.5} fill={C.m400} />
        </g>
      ) : <g key="cable-bg" />
    },
    {
      depth: stationX + stationY - 10.0,
      render: () => (
        <g key="conduit">
          <Conduit id="cSH" d={pSH} speed="2.8s" delay="0s" />
          <FloatZap pid="fSH" d={pSH} speed="2.8s" delay="0.3s" />
        </g>
      )
    },
    {
      depth: 9999.0, // Render car always on top of other assets
      render: () => (
        <EVCar cx={carState.cx} cy={carState.cy} cz={carState.cz} theta={carState.theta} ch={isC} key="car" />
      )
    },
    {
      depth: 10000.0, // Render foreground cable completely in front of the car
      render: () => isC ? (
        <g key="cable-fg">
          <path d={pChargeCableFg} fill="none" stroke={C.g800} strokeWidth={3.0} strokeLinecap="round" />
          <path d={pChargeCableFg} fill="none" stroke={C.m400} strokeWidth={1.2} strokeDasharray="4 4" strokeLinecap="round">
             <animate attributeName="stroke-dashoffset" from="0" to="-16" dur="1s" repeatCount="indefinite" />
          </path>
          {/* Connector plug at car */}
          <ellipse cx={pPortC[0]} cy={pPortC[1]} rx={5} ry={3.5} fill={C.g800} transform={`rotate(-25 ${pPortC[0]} ${pPortC[1]})`} />
          <circle cx={pPortC[0]} cy={pPortC[1]} r={1.5} fill={C.m400} />
        </g>
      ) : <g key="cable-fg" />
    },
    {
      depth: solarX + solarY + 1.9,
      render: () => <SolarFarm bx={solarX} by={solarY} gen key="solar" />
    }
  ];
  items.sort((a, b) => a.depth - b.depth);

  return (
    <div className="genz-ecosystem">
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: `radial-gradient(55% 45% at 50% 55%, ${C.soft} 0%, transparent 70%)` }} />

      <svg ref={scene} viewBox="10 100 520 300" width="100%" height="100%"
        role="img" aria-label="Illustration of solar panels powering an electric vehicle charging station"
        style={{ maxHeight: "560px" }}
        xmlns="http://www.w3.org/2000/svg">



        {items.map(item => item.render())}

        {isC && <RevenueCoins cx={p3(stationX + 2.2, stationY + 2.1, 3.6)[0]} cy={p3(stationX + 2.2, stationY + 2.1, 3.6)[1]} />}

        {isC && (() => {
          const rp = p3(pX, pY, 2.0);
          return (
            <g transform={`translate(${rp[0] - 2},${rp[1] - 4})`}>
              <circle r={14} fill={C.w} stroke={C.m400} strokeWidth={2} style={{ filter: "drop-shadow(0 2px 6px rgba(16,185,129,0.22))" }} />
              <circle r={14} fill="none" stroke={C.m400} strokeWidth={2.6}
                strokeDasharray={`${(charge / 100) * 87.96} 87.96`}
                strokeLinecap="round" transform="rotate(-90)" />
              <text textAnchor="middle" dominantBaseline="central" fontSize={8.5} fontWeight={800} fill={C.m700} fontFamily="ui-sans-serif,sans-serif">
                {Math.round(charge)}%
              </text>
            </g>
          );
        })()}


      </svg>
      <div className="ecosystem-caption">
        <button type="button" className="ecosystem-motion" aria-pressed={!playing || !motionAllowed}
          onClick={() => setPlaying(value => !value)} disabled={!motionAllowed}>
          {!motionAllowed ? "Animation paused" : playing ? "Pause animation" : "Play animation"}
        </button>
      </div>
    </div>
  );
}
