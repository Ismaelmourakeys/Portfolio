// SagittariusConstellation.jsx
// Constelação de Sagitário com efeito GSAP:
// No scroll → estrelas se soltam, viram cometa, e se reposicionam como constelação

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

// ── Coordenadas normalizadas do asterismo do Bule (Sagitário)
// x e y em %, serão escaladas para o SVG
const SAG_STARS = [
  { id: "kausAustralis", x: 52,  y: 68, r: 2.6, color: "#fff",    glow: "rgba(56,189,248,0.35)", bright: true  },
  { id: "kausMedia",     x: 40,  y: 56, r: 1.8, color: "#fff",    glow: "rgba(56,189,248,0.2)",  bright: false },
  { id: "kausBorealis",  x: 28,  y: 42, r: 1.6, color: "#fff",    glow: null,                    bright: false },
  { id: "nunki",         x: 60,  y: 40, r: 2.1, color: "#c4b5ff", glow: "rgba(139,92,246,0.3)",  bright: true  },
  { id: "ascella",       x: 48,  y: 46, r: 1.7, color: "#fff",    glow: null,                    bright: false },
  { id: "phi",           x: 65,  y: 65, r: 1.3, color: "#ffe9a0", glow: null,                    bright: false },
  { id: "tau",           x: 72,  y: 54, r: 1.3, color: "#fff",    glow: null,                    bright: false },
  { id: "sigma",         x: 70,  y: 43, r: 1.5, color: "#fff",    glow: null,                    bright: false },
  { id: "alnasl",        x: 18,  y: 37, r: 1.7, color: "#ffe9a0", glow: null,                    bright: false },
  { id: "spoutTip",      x: 10,  y: 28, r: 1.0, color: "rgba(255,255,255,0.8)", glow: null,      bright: false },
  { id: "handle1",       x: 78,  y: 60, r: 1.0, color: "rgba(255,255,255,0.7)", glow: null,      bright: false },
  { id: "handle2",       x: 83,  y: 70, r: 1.0, color: "rgba(255,255,255,0.7)", glow: null,      bright: false },
  { id: "lid1",          x: 55,  y: 34, r: 1.0, color: "rgba(255,255,255,0.7)", glow: null,      bright: false },
  { id: "lid2",          x: 50,  y: 26, r: 1.0, color: "rgba(255,255,255,0.7)", glow: null,      bright: false },
];

const SAG_LINES = [
  ["kausAustralis", "kausMedia"],
  ["kausMedia",     "kausBorealis"],
  ["kausMedia",     "ascella"],
  ["kausAustralis", "phi"],
  ["phi",           "tau"],
  ["tau",           "sigma"],
  ["sigma",         "nunki"],
  ["nunki",         "ascella"],
  ["ascella",       "kausAustralis"],
  ["kausBorealis",  "alnasl"],
  ["alnasl",        "spoutTip"],
  ["tau",           "handle1"],
  ["handle1",       "handle2"],
  ["nunki",         "lid1"],
  ["lid1",          "lid2"],
];

// Posições finais após reposicionamento (offset do centro, em px relativos ao SVG)
// A constelação reaparece ligeiramente deslocada para baixo e rotacionada
const REPOSITION_OFFSET = { x: 0, y: 30, rotation: -8 };

export default function SagittariusConstellation({ width = 320, height = 380, className = "" }) {
  const svgRef      = useRef(null);
  const wrapperRef  = useRef(null);
  const starsRef    = useRef({});
  const glowsRef    = useRef({});
  const linesRef    = useRef([]);
  const cometRef    = useRef(null);
  const cometTailRef = useRef(null);
  const labelRef    = useRef(null);

  useEffect(() => {
    const svg     = svgRef.current;
    const wrapper = wrapperRef.current;
    if (!svg || !wrapper) return;

    const W = width;
    const H = height;

    // Posições originais de cada estrela em px
    const originalPos = {};
    SAG_STARS.forEach((s) => {
      originalPos[s.id] = { x: (s.x / 100) * W, y: (s.y / 100) * H };
    });

    const starEls  = SAG_STARS.map((s) => starsRef.current[s.id]).filter(Boolean);
    const glowEls  = SAG_STARS.map((s) => glowsRef.current[s.id]).filter(Boolean);
    const lineEls  = linesRef.current.filter(Boolean);
    const comet    = cometRef.current;
    const cometTail = cometTailRef.current;
    const label    = labelRef.current;

    // ── FASE 0: entrada inicial das estrelas (sem scroll)
    const entryTl = gsap.timeline({ delay: 0.3 });

    // Estrelas entram com scale + fade staggerado
    entryTl.fromTo(
      starEls,
      { opacity: 0, scale: 0, transformOrigin: "center center" },
      {
        opacity: 1,
        scale: 1,
        duration: 0.7,
        ease: "back.out(2)",
        stagger: { amount: 1.2, from: "center" },
      }
    );

    // Linhas se desenham após as estrelas
    lineEls.forEach((line, i) => {
      const totalLen = line.getTotalLength?.() ?? 80;
      gsap.set(line, { strokeDasharray: totalLen, strokeDashoffset: totalLen });
    });

    entryTl.to(
      lineEls,
      {
        strokeDashoffset: 0,
        duration: 0.8,
        ease: "power2.out",
        stagger: 0.05,
      },
      "-=0.4"
    );

    entryTl.fromTo(
      label,
      { opacity: 0, y: -8 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
      "-=0.3"
    );

    // Twinkle contínuo nas estrelas brilhantes
    SAG_STARS.filter((s) => s.bright).forEach((s) => {
      const el = starsRef.current[s.id];
      if (!el) return;
      gsap.to(el, {
        opacity: 0.4,
        duration: 1.5 + Math.random(),
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        delay: Math.random() * 2,
      });
    });

    // ── FASE 1–3: scroll animation via ScrollTrigger com timeline scrubada
    const scrollTl = gsap.timeline({
      scrollTrigger: {
        trigger: wrapper,
        // A animação começa quando o topo do wrapper chega ao centro da tela
        start: "top center",
        // Termina quando o fundo do wrapper ultrapassa o topo
        end: "bottom+=400 top",
        scrub: 1.8,
        // pin: true, // descomente se quiser fixar o elemento durante o scroll
      },
    });

    // ── FASE 1: linhas somem primeiro (0 → 0.15)
    scrollTl.to(
      lineEls,
      {
        opacity: 0,
        strokeDashoffset: (i) => {
          const line = lineEls[i];
          return line?.getTotalLength?.() ?? 80;
        },
        duration: 0.15,
        ease: "power2.in",
        stagger: 0.008,
      },
      0
    );

    scrollTl.to(label, { opacity: 0, duration: 0.1 }, 0);

    // ── FASE 2: estrelas convergem para o centro (0.1 → 0.35)
    // Todas as estrelas voam em direção ao ponto central do SVG
    const centerX = W * 0.5;
    const centerY = H * 0.5;

    SAG_STARS.forEach((s, i) => {
      const el   = starsRef.current[s.id];
      const glow = glowsRef.current[s.id];
      const orig = originalPos[s.id];

      const dx = centerX - orig.x;
      const dy = centerY - orig.y;

      scrollTl.to(
        el,
        {
          x: dx,
          y: dy,
          opacity: 0.6,
          scale: 0.5,
          duration: 0.25,
          ease: "power3.in",
        },
        0.1 + i * 0.006
      );

      if (glow) {
        scrollTl.to(glow, { opacity: 0, duration: 0.15 }, 0.08);
      }
    });

    // ── FASE 3: cometa atravessa a tela (0.3 → 0.65)
    // O cometa começa no centro e atravessa diagonalmente para baixo
    gsap.set(comet,    { opacity: 0, x: centerX - 12, y: centerY - 12 });
    gsap.set(cometTail, { opacity: 0 });

    scrollTl.to(
      starEls,
      { opacity: 0, duration: 0.08, ease: "power2.in" },
      0.32
    );

    scrollTl.to(
      [comet, cometTail],
      { opacity: 1, duration: 0.06 },
      0.35
    );

    // O cometa percorre um arco descendente (MotionPath)
    scrollTl.to(
      comet,
      {
        duration: 0.3,
        ease: "power1.inOut",
        motionPath: {
          path: [
            { x: centerX - 12,      y: centerY - 12      },
            { x: centerX + W * 0.2, y: centerY + H * 0.15 },
            { x: centerX + W * 0.15, y: centerY + H * 0.3 + REPOSITION_OFFSET.y },
          ],
          type: "cubic",
          autoRotate: true,
        },
      },
      0.35
    );

    // Cauda do cometa acompanha com delay (cria efeito de rastro)
    scrollTl.to(
      cometTail,
      {
        duration: 0.3,
        ease: "power1.inOut",
        motionPath: {
          path: [
            { x: centerX - 12,      y: centerY - 12       },
            { x: centerX + W * 0.2, y: centerY + H * 0.15  },
            { x: centerX + W * 0.15, y: centerY + H * 0.3 + REPOSITION_OFFSET.y },
          ],
          type: "cubic",
          autoRotate: true,
        },
      },
      0.38 // levemente atrasado = rastro
    );

    // ── FASE 4: cometa explode e estrelas reaparecem nas posições finais (0.62 → 1.0)
    scrollTl.to(
      [comet, cometTail],
      { opacity: 0, scale: 2.5, duration: 0.08, ease: "power2.out" },
      0.63
    );

    // Estrelas reaparecem espalhando a partir do centro final do cometa
    SAG_STARS.forEach((s, i) => {
      const el   = starsRef.current[s.id];
      const glow = glowsRef.current[s.id];
      const orig = originalPos[s.id];

      // Posição final = posição original + offset de reposicionamento
      const finalX = orig.x + REPOSITION_OFFSET.x;
      const finalY = orig.y + REPOSITION_OFFSET.y;
      const endDx  = finalX - orig.x; // = REPOSITION_OFFSET.x
      const endDy  = finalY - orig.y; // = REPOSITION_OFFSET.y

      scrollTl.fromTo(
        el,
        {
          // Parte da posição do centro final do cometa
          x: centerX + W * 0.15 - orig.x,
          y: centerY + H * 0.3 + REPOSITION_OFFSET.y - orig.y,
          opacity: 0,
          scale: 0.3,
        },
        {
          x: endDx,
          y: endDy,
          opacity: 1,
          scale: 1,
          duration: 0.3,
          ease: "back.out(1.8)",
          stagger: 0.012,
        },
        0.68 + i * 0.01
      );

      if (glow) {
        scrollTl.to(glow, { opacity: 1, duration: 0.2 }, 0.78);
      }
    });

    // Linhas reaparecem na posição final
    lineEls.forEach((line, i) => {
      const totalLen = line.getTotalLength?.() ?? 80;
      scrollTl.fromTo(
        line,
        { strokeDashoffset: totalLen, opacity: 0 },
        {
          strokeDashoffset: 0,
          opacity: 1,
          duration: 0.2,
          ease: "power2.out",
        },
        0.82 + i * 0.01
      );
    });

    scrollTl.to(label, { opacity: 1, y: REPOSITION_OFFSET.y, duration: 0.15 }, 0.92);

    return () => {
      entryTl.kill();
      scrollTl.kill();
      ScrollTrigger.getAll().forEach((t) => t.kill());
      gsap.killTweensOf([...starEls, ...glowEls, ...lineEls, comet, cometTail, label]);
    };
  }, [width, height]);

  const W = width;
  const H = height;

  const starMap = Object.fromEntries(
    SAG_STARS.map((s) => [s.id, { x: (s.x / 100) * W, y: (s.y / 100) * H }])
  );

  return (
    <div
      ref={wrapperRef}
      className={className}
      style={{ width, height, position: "relative", pointerEvents: "none" }}
    >
      <svg
        ref={svgRef}
        width={W}
        height={H}
        viewBox={`0 0 ${W} ${H}`}
        style={{ overflow: "visible", display: "block" }}
      >
        {/* ── Linhas da constelação */}
        {SAG_LINES.map(([fromId, toId], i) => {
          const from = starMap[fromId];
          const to   = starMap[toId];
          if (!from || !to) return null;
          return (
            <line
              key={`${fromId}-${toId}`}
              ref={(el) => (linesRef.current[i] = el)}
              x1={from.x} y1={from.y}
              x2={to.x}   y2={to.y}
              stroke="rgba(56,189,248,0.3)"
              strokeWidth="0.8"
              strokeLinecap="round"
            />
          );
        })}

        {/* ── Halos de brilho (glow) das estrelas principais */}
        {SAG_STARS.map((s) => {
          if (!s.glow) return null;
          const { x, y } = starMap[s.id];
          return (
            <circle
              key={`glow-${s.id}`}
              ref={(el) => (glowsRef.current[s.id] = el)}
              cx={x} cy={y}
              r={s.r * 4}
              fill={s.glow}
            />
          );
        })}

        {/* ── Estrelas principais */}
        {SAG_STARS.map((s) => {
          const { x, y } = starMap[s.id];
          return (
            <circle
              key={s.id}
              ref={(el) => (starsRef.current[s.id] = el)}
              cx={x} cy={y}
              r={s.r}
              fill={s.color}
            />
          );
        })}

        {/* ── Cometa: núcleo */}
        <g ref={cometRef} style={{ opacity: 0 }}>
          {/* Núcleo brilhante */}
          <circle cx={0} cy={0} r={4} fill="#fff" />
          <circle cx={0} cy={0} r={8} fill="rgba(56,189,248,0.4)" />
          <circle cx={0} cy={0} r={14} fill="rgba(56,189,248,0.15)" />
        </g>

        {/* ── Cauda do cometa (linha gradiente) */}
        <g ref={cometTailRef} style={{ opacity: 0 }}>
          <line
            x1={0}  y1={0}
            x2={-40} y2={-18}
            stroke="rgba(56,189,248,0.6)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <line
            x1={0}  y1={0}
            x2={-60} y2={-24}
            stroke="rgba(139,92,246,0.4)"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <line
            x1={0}  y1={0}
            x2={-50} y2={-30}
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="1"
            strokeLinecap="round"
          />
        </g>

        {/* ── Label da constelação */}
        <text
          ref={labelRef}
          x={8}
          y={16}
          fontSize="9"
          fontFamily="monospace"
          fill="rgba(56,189,248,0.45)"
          letterSpacing="2"
        >
          SAGITTARIUS
        </text>
      </svg>
    </div>
  );
}
