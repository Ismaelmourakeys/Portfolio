// SpaceWrapper.jsx — canvas compartilhado que cobre Hero + AboutMe
// Cometas atravessam as duas seções livremente
// Gradiente vertical: espaço escuro → azul ciano → verde Terra

import { useEffect, useRef } from "react";

// ─────────────────────────────────────────────────────────────
// Canvas compartilhado: fundo + estrelas + cometas
// ─────────────────────────────────────────────────────────────
function SharedSpaceCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // ── Gradiente de fundo: espaço → ciano → verde terra
    // Pré-renderizado em offscreen — não recria a cada frame
    const buildBg = () => {
      const off = document.createElement("canvas");
      off.width = canvas.width; off.height = canvas.height;
      const offCtx = off.getContext("2d");

      // Gradiente vertical principal
      const bg = offCtx.createLinearGradient(0, 0, 0, off.height);
      bg.addColorStop(0.00, "rgb(2,6,23)");          // espaço profundo
      bg.addColorStop(0.25, "rgb(5,10,35)");          // azul escuro
      bg.addColorStop(0.50, "rgb(8,20,55)");          // azul médio
      bg.addColorStop(0.68, "rgb(10, 32, 66)");         // azul escuro médio
      bg.addColorStop(0.80, "rgb(7, 37, 68)");         // azul mais claro
      // bg.addColorStop(0.90, "rgb(7, 39, 51)");         // transição ciano
      bg.addColorStop(0.96, "rgb(8, 17, 49)");          // ciano escuro → verde
      // bg.addColorStop(1.00, "rgb(5, 14, 39)");          // verde terra escuro
      offCtx.fillStyle = bg;
      offCtx.fillRect(0, 0, off.width, off.height);

      // Nebulae sutis
      const nebulae = [
        { x: 0.12, y: 0.08, r: 280, color: [40,60,180],  alpha: 0.045 },
        { x: 0.85, y: 0.18, r: 220, color: [100,40,180], alpha: 0.038 },
        { x: 0.55, y: 0.38, r: 200, color: [30,100,200], alpha: 0.025 },
        { x: 0.20, y: 0.55, r: 180, color: [20,80,160],  alpha: 0.020 },
        { x: 0.78, y: 0.70, r: 160, color: [15,80,100],  alpha: 0.018 },
      ];
      nebulae.forEach((n) => {
        const g = offCtx.createRadialGradient(
          n.x * off.width, n.y * off.height, 0,
          n.x * off.width, n.y * off.height, n.r
        );
        g.addColorStop(0, `rgba(${n.color.join(",")},${n.alpha})`);
        g.addColorStop(1, `rgba(${n.color.join(",")},0)`);
        offCtx.beginPath();
        offCtx.arc(n.x * off.width, n.y * off.height, n.r, 0, Math.PI * 2);
        offCtx.fillStyle = g; offCtx.fill();
      });

      return off;
    };
    let bgOffscreen = buildBg();
    window.addEventListener("resize", () => { bgOffscreen = buildBg(); });

    // ── Estrelas — mais densas no topo (espaço), somem no fundo (Terra)
    const stars = Array.from({ length: 380 }, () => {
    //                                 ^^^
    //                        AQUI ALTERA A QUANTIDADE DE ESTRELAS
      const depth = Math.random();
      const yPos  = Math.random(); // posição vertical normalizada
      return {
        x: Math.random(),
        y: yPos,
        r: Math.random() < 0.04
          ? 1.8 + Math.random() * 1.2
          : Math.random() < 0.14
          ? 0.8 + depth * 0.7
          : depth * 0.55 + 0.08,
        speed:    0.0005 + depth * 0.0016,
        phase:    Math.random() * Math.PI * 2,
        color:    Math.random() > 0.88 ? "rgba(56,189,248,"
                : Math.random() > 0.75 ? "rgba(167,139,250,"
                : "rgba(210,220,245,",
        minAlpha: depth * 0.05 + 0.02,
        // Estrelas somem gradualmente conforme se aproximam da Terra
        maxAlpha: (depth * 0.45 + 0.12) * Math.max(0, 1 - yPos * 1.1),
      };
    });

    // ── Poeira cósmica — deriva lentamente
    const dust = Array.from({ length: 80 }, () => ({
      x:     Math.random(),
      y:     Math.random() * 0.85, // só na parte de cima (espaço)
      r:     0.3 + Math.random() * 0.9,
      vx:    (Math.random() - 0.5) * 0.00009,
      vy:    (Math.random() - 0.5) * 0.00006,
      alpha: 0.04 + Math.random() * 0.12,
      color: Math.random() > 0.5 ? "rgba(56,189,248," : "rgba(167,139,250,",
    }));

    // ── Cometas — atravessam Hero E AboutMe livremente
    class Comet {
      constructor(initial = false) { this.reset(initial); }
      reset(initial = false) {
        const roll = Math.random();
        this.type = roll < 0.18 ? 0 : roll < 0.68 ? 1 : 2;
        const rng = (a, b) => a + Math.random() * (b - a);
        const sizes = [
          { len: [25,55],   speed: [1.2,2.5], width: [0.3,0.55], op: [0.10,0.22] },
          { len: [80,150],  speed: [2.5,4.0], width: [0.6,1.1],  op: [0.25,0.42] },
          { len: [170,280], speed: [3.5,5.5], width: [1.1,2.0],  op: [0.40,0.68] },
        ];
        const s = sizes[this.type];
        this.x     = Math.random() * canvas.width * 1.5 - canvas.width * 0.25;
        this.y     = initial ? Math.random() * canvas.height * -1 : -60;
        this.len   = rng(...s.len);
        this.speed = rng(...s.speed);
        this.angle = Math.PI / 4 + (Math.random() - 0.5) * 0.45;
        this.width = rng(...s.width);
        this.opacity = rng(...s.op);
        const hues = ["220,235,255","230,240,255","210,228,248","238,235,215"];
        this.hue   = hues[Math.floor(Math.random() * hues.length)];
        this.active = !initial; this.timer = 0;
        this.delay  = initial
          ? Math.floor(Math.random() * 500)
          : 200 + Math.floor(Math.random() * (this.type === 2 ? 1600 : 900));
      }
      update() {
        if (!this.active) {
          this.timer++;
          if (this.timer >= this.delay) this.active = true;
          return;
        }
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;
        // Cometa atravessa o canvas inteiro — só reseta ao sair completamente
        if (this.x > canvas.width + 150 || this.y > canvas.height + 150) this.reset(false);
      }
      draw() {
        if (!this.active) return;
        // Opacidade diminui conforme o cometa desce (chega na atmosfera)
        const yFade = Math.max(0, 1 - (this.y / canvas.height) * 0.85);
        const op    = this.opacity * yFade;
        if (op < 0.01) return;

        const tailX = this.x - Math.cos(this.angle) * this.len;
        const tailY = this.y - Math.sin(this.angle) * this.len;
        const grad  = ctx.createLinearGradient(tailX, tailY, this.x, this.y);
        grad.addColorStop(0,    `rgba(${this.hue},0)`);
        grad.addColorStop(0.55, `rgba(${this.hue},${(op * 0.3).toFixed(3)})`);
        grad.addColorStop(1,    `rgba(${this.hue},${op.toFixed(3)})`);
        ctx.beginPath(); ctx.moveTo(tailX, tailY); ctx.lineTo(this.x, this.y);
        ctx.strokeStyle = grad; ctx.lineWidth = this.width; ctx.lineCap = "round"; ctx.stroke();

        if (this.type > 0) {
          const glowR = this.width * (this.type === 2 ? 5.5 : 3.5);
          const glow  = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, glowR);
          glow.addColorStop(0, `rgba(${this.hue},${(op * 0.9).toFixed(3)})`);
          glow.addColorStop(1, `rgba(${this.hue},0)`);
          ctx.beginPath(); ctx.arc(this.x, this.y, glowR, 0, Math.PI * 2);
          ctx.fillStyle = glow; ctx.fill();
        }
        if (this.type === 2) {
          ctx.beginPath(); ctx.arc(this.x, this.y, this.width * 0.9, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,255,255,${(op * 0.85).toFixed(3)})`; ctx.fill();
        }
      }
    }

    // ── 6 cometas para cobrir os dois componentes
    const comets = Array.from({ length: 10 }, () => new Comet(true));
    //                                 ^^^
    //                             AQUI ALTERA A QUANTIDADE DE COMETAS

    let raf; let fc = 0;

    const draw = (t) => {
      raf = requestAnimationFrame(draw);
      fc++; if (fc % 1 !== 0) return; // 60fps

      const W = canvas.width;
      const H = canvas.height;

      ctx.clearRect(0, 0, W, H);
      ctx.drawImage(bgOffscreen, 0, 0, W, H);

      // ── Estrelas
      stars.forEach((s) => {
        if (s.maxAlpha < 0.01) return; // skip estrelas invisíveis (fundo da seção)
        const pulse = 0.5 + 0.5 * Math.sin(t * s.speed * 60 + s.phase);
        const a     = s.minAlpha + (s.maxAlpha - s.minAlpha) * pulse;
        const sx    = s.x * W; const sy = s.y * H;

        if (s.r > 0.55) {
          const hr = s.r * (s.r > 1.3 ? 6 : 4);
          const hg = ctx.createRadialGradient(sx, sy, 0, sx, sy, hr);
          hg.addColorStop(0, `${s.color}${(a * 0.28).toFixed(3)})`);
          hg.addColorStop(1, `${s.color}0)`);
          ctx.beginPath(); ctx.arc(sx, sy, hr, 0, Math.PI * 2);
          ctx.fillStyle = hg; ctx.fill();
        }
        ctx.beginPath(); ctx.arc(sx, sy, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `${s.color}${a.toFixed(3)})`; ctx.fill();
        if (s.r > 0.85) {
          ctx.beginPath(); ctx.arc(sx, sy, s.r * 0.4, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,255,255,${(a * 0.7).toFixed(3)})`; ctx.fill();
        }
        if (s.r > 1.5) {
          [[1,0],[0,1]].forEach(([dx,dy]) => {
            [1,-1].forEach((dir) => {
              const sl = s.r * 5 * pulse;
              const sg = ctx.createLinearGradient(sx,sy, sx+dx*dir*sl, sy+dy*dir*sl);
              sg.addColorStop(0, `${s.color}${(a*0.4).toFixed(3)})`);
              sg.addColorStop(1, `${s.color}0)`);
              ctx.beginPath(); ctx.moveTo(sx,sy); ctx.lineTo(sx+dx*dir*sl, sy+dy*dir*sl);
              ctx.strokeStyle = sg; ctx.lineWidth = s.r * 0.2; ctx.lineCap = "round"; ctx.stroke();
            });
          });
        }
      });

      // ── Poeira cósmica
      dust.forEach((p) => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = 1; if (p.x > 1) p.x = 0;
        if (p.y < 0) p.y = 0.85; if (p.y > 0.85) p.y = 0;
        ctx.beginPath(); ctx.arc(p.x * W, p.y * H, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${p.alpha.toFixed(3)})`; ctx.fill();
      });

      // ── Cometas
      comets.forEach((c) => { c.update(); c.draw(); });
    };

    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  );
}

// ─────────────────────────────────────────────────────────────
// Wrapper: envolve Hero + AboutMe com canvas compartilhado
// ─────────────────────────────────────────────────────────────
export default function SpaceWrapper({ children }) {
  return (
    <div className="relative">
      {/* Canvas cobre tudo — Hero + AboutMe juntos */}
      <SharedSpaceCanvas />

      {/* Conteúdo por cima */}
      <div className="relative z-10">
        {children}
      </div>

            {/* ── Divisória — curvatura da Terra com atmosfera animada */}
      <div className="pointer-events-none relative z-20" style={{ marginBottom: "-2px" }}>
        <svg
          width="100%"
          viewBox="0 0 1440 180"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ display: "block" }}
        >
          <defs>
            <radialGradient id="atm1" cx="50%" cy="100%" r="60%">
              <stop offset="0%"   stopColor="#0ea5e9" stopOpacity="0.18"/>
              <stop offset="40%"  stopColor="#1d4ed8" stopOpacity="0.10"/>
              <stop offset="100%" stopColor="#020617" stopOpacity="0"/>
            </radialGradient>
            <radialGradient id="atm2" cx="50%" cy="100%" r="40%">
              <stop offset="0%"   stopColor="#38bdf8" stopOpacity="0.22"/>
              <stop offset="60%"  stopColor="#0ea5e9" stopOpacity="0.08"/>
              <stop offset="100%" stopColor="#020617" stopOpacity="0"/>
            </radialGradient>
            <radialGradient id="atm3" cx="50%" cy="100%" r="22%">
              <stop offset="0%"   stopColor="#7dd3fc" stopOpacity="0.28"/>
              <stop offset="100%" stopColor="#38bdf8"  stopOpacity="0"/>
            </radialGradient>
          </defs>

          {/* Camadas de glow atmosférico */}
          <ellipse cx="720" cy="340" rx="1300" ry="380" fill="url(#atm1)"/>
          <ellipse cx="720" cy="310" rx="1000" ry="280" fill="url(#atm2)"/>
          <ellipse cx="720" cy="290" rx="700"  ry="200" fill="url(#atm3)"/>

          {/* Preenchimento da Terra abaixo da curva */}
          <path d="M-20,180 Q720,30 1460,180 L1460,180 L-20,180 Z" fill="rgb(15,23,42)"/>

          {/* Borda — 4 camadas sobrepostas para realismo */}
          <path d="M-20,180 Q720,30 1460,180" fill="none" stroke="#1a3275a8" strokeWidth="8" strokeOpacity="1.55"/>
          <path d="M-20,180 Q720,30 1460,180" fill="none" stroke="#0b348d" strokeWidth="1.5" strokeOpacity="1.65"/>
          <path d="M-20,180 Q720,30 1460,180" fill="none" stroke="#45768b" strokeWidth="0.8" strokeOpacity="1.90"/>
          <path d="M-20,180 Q720,30 1460,180" fill="none" stroke="#e0f2fe7c" strokeWidth="0.2" strokeOpacity="1.55"/>

          {/* Pulso 1 — onda de luz percorrendo a curva */}
          <path d="M-20,180 Q720,30 1460,180" fill="none" stroke="#7dd4fc63" strokeWidth="50" strokeOpacity="0" strokeDasharray="180 9999">
            <animate attributeName="strokeDashoffset" from="0" to="-1800" dur="5s" repeatCount="indefinite"/>
            <animate attributeName="strokeOpacity" values="0;0.65;0.85;0.65;0" dur="5s" repeatCount="indefinite"/>
          </path>

          {/* Pulso 2 — defasado */}
          <path d="M-20,180 Q720,30 1460,180" fill="none" stroke="#bae5fd75" strokeWidth="20" strokeOpacity="0" strokeDasharray="120 9999">
            <animate attributeName="strokeDashoffset" from="0" to="-1800" dur="5s" begin="2.5s" repeatCount="indefinite"/>
            <animate attributeName="strokeOpacity" values="0;0.45;0.70;0.45;0" dur="5s" begin="2.5s" repeatCount="indefinite"/>
          </path>

          {/* Partículas estáticas na borda */}
          <circle cx="160"  cy="155" r="1.2" fill="#38bdf8" opacity="0.50"/>
          <circle cx="320"  cy="120" r="0.9" fill="#7dd3fc" opacity="0.40"/>
          <circle cx="500"  cy="90"  r="1.4" fill="#38bdf8" opacity="0.45"/>
          <circle cx="720"  cy="68"  r="1.6" fill="#bae6fd" opacity="0.60"/>
          <circle cx="940"  cy="85"  r="1.3" fill="#38bdf8" opacity="0.42"/>
          <circle cx="1120" cy="112" r="1.0" fill="#7dd3fc" opacity="0.45"/>
          <circle cx="1280" cy="148" r="1.2" fill="#38bdf8" opacity="0.50"/>

          {/* Partículas pulsantes */}
          <circle cx="400" cy="108" r="0.9" fill="#93c5fd">
            <animate attributeName="opacity" values="0.2;0.75;0.2" dur="3.2s" repeatCount="indefinite"/>
          </circle>
          <circle cx="720" cy="64" r="1.2" fill="#7dd3fc">
            <animate attributeName="opacity" values="0.3;1.0;0.3" dur="2.5s" begin="0.8s" repeatCount="indefinite"/>
          </circle>
          <circle cx="1040" cy="100" r="0.9" fill="#93c5fd">
            <animate attributeName="opacity" values="0.2;0.70;0.2" dur="3.8s" begin="1.5s" repeatCount="indefinite"/>
          </circle>
          <circle cx="560" cy="78" r="0.7" fill="#bae6fd">
            <animate attributeName="opacity" values="0.1;0.60;0.1" dur="4.1s" begin="2.2s" repeatCount="indefinite"/>
          </circle>
          <circle cx="880" cy="76" r="0.8" fill="#bae6fd">
            <animate attributeName="opacity" values="0.1;0.55;0.1" dur="3.5s" begin="3.0s" repeatCount="indefinite"/>
          </circle>
        </svg>
      </div>
    </div>
  );
}