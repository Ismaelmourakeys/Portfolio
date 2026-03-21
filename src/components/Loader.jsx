import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next"; // ← hook de tradução
import i18n from "../data/i18n"; // ← instância global para trocar idioma
import { motion, AnimatePresence } from "framer-motion";

// ── STEPS_PCT — percentuais fixos, mensagens vêm do JSON via t()
const STEPS_PCT = [15, 40, 65, 85, 100];

const TOTAL_DURATION = 3200;
// STEP_INTERVAL usa STEPS_PCT.length — STEPS é criado dentro do componente
const STEP_INTERVAL = TOTAL_DURATION / STEPS_PCT.length;

// ── Canvas: estrelas + cometas (fundo)
function SpaceCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const stars = Array.from({ length: 300 }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: Math.random() * 0.8 + 0.1,
      speed: Math.random() * 0.006 + 0.001,
      phase: Math.random() * Math.PI * 2,
      color:
        Math.random() > 0.85
          ? "rgba(56,189,248,"
          : Math.random() > 0.7
          ? "rgba(250,204,21,"
          : Math.random() > 0.6
          ? "rgba(167,139,250,"
          : "rgba(200,210,230,",
    }));

    class Comet {
      constructor() { this.reset(true); }
      reset(initial = false) {
        this.x = Math.random() * window.innerWidth * 1.4 - window.innerWidth * 0.2;
        this.y = initial ? Math.random() * window.innerHeight * -1 : -80;
        this.len = 100 + Math.random() * 160;
        this.speed = 5 + Math.random() * 6;
        this.angle = Math.PI / 4 + (Math.random() - 0.5) * 0.45;
        this.width = 0.8 + Math.random() * 1.6;
        this.opacity = 0.55 + Math.random() * 0.45;
        this.hue = Math.random() > 0.5 ? "200,230,255" : "210,200,255";
        this.active = !initial;
        this.timer = 0;
        this.delay = initial ? Math.floor(Math.random() * 220) : 0;
      }
      update() {
        if (!this.active) {
          this.timer++;
          if (this.timer >= this.delay) this.active = true;
          return;
        }
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;
        if (this.x > canvas.width + 120 || this.y > canvas.height + 120) {
          this.reset();
          this.delay = 60 + Math.floor(Math.random() * 280);
          this.active = false;
          this.timer = 0;
        }
      }
      draw() {
        if (!this.active) return;
        const tailX = this.x - Math.cos(this.angle) * this.len;
        const tailY = this.y - Math.sin(this.angle) * this.len;
        const grad = ctx.createLinearGradient(tailX, tailY, this.x, this.y);
        grad.addColorStop(0, `rgba(${this.hue},0)`);
        grad.addColorStop(0.55, `rgba(${this.hue},${(this.opacity * 0.3).toFixed(2)})`);
        grad.addColorStop(1, `rgba(${this.hue},${this.opacity.toFixed(2)})`);
        ctx.beginPath(); ctx.moveTo(tailX, tailY); ctx.lineTo(this.x, this.y);
        ctx.strokeStyle = grad; ctx.lineWidth = this.width; ctx.lineCap = "round"; ctx.stroke();
        const glow = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.width * 4);
        glow.addColorStop(0, `rgba(${this.hue},${this.opacity.toFixed(2)})`);
        glow.addColorStop(1, `rgba(${this.hue},0)`);
        ctx.beginPath(); ctx.arc(this.x, this.y, this.width * 4, 0, Math.PI * 2);
        ctx.fillStyle = glow; ctx.fill();
      }
    }

    const comets = Array.from({ length: 8 }, () => new Comet());
    let raf;
    const draw = (t) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach((s) => {
        const alpha = 0.15 + 0.85 * (0.5 + 0.5 * Math.sin(t * s.speed * 60 + s.phase));
        ctx.beginPath();
        ctx.arc(s.x * canvas.width, s.y * canvas.height, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `${s.color}${(alpha * 0.85).toFixed(2)})`;
        ctx.fill();
      });
      comets.forEach((c) => { c.update(); c.draw(); });
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
}

// ── Canvas warp: linhas de velocidade
function WarpCanvas({ active }) {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const DURATION = 1000;

    const lines = Array.from({ length: 160 }, (_, i) => {
      const angle = (i / 160) * Math.PI * 2;
      const colors = ["#38bdf8", "#818cf8", "#ffffff", "#a78bfa", "#34d399"];
      return {
        angle,
        dist: 10 + Math.random() * 60,
        len: 40 + Math.random() * 160,
        speed: 2.5 + Math.random() * 5,
        width: 0.4 + Math.random() * 1.2,
        color: colors[Math.floor(Math.random() * colors.length)],
        opacity: 0.3 + Math.random() * 0.5,
      };
    });

    const start = performance.now();

    const draw = (now) => {
      const elapsed = now - start;
      const p = Math.min(elapsed / DURATION, 1);
      const eased = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = `rgba(2,6,23,${eased * 0.92})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      lines.forEach((line) => {
        line.dist += line.speed * (1 + eased * 10);
        const x1 = cx + Math.cos(line.angle) * line.dist;
        const y1 = cy + Math.sin(line.angle) * line.dist;
        const x2 = cx + Math.cos(line.angle) * (line.dist + line.len * (0.2 + eased * 0.8));
        const y2 = cy + Math.sin(line.angle) * (line.dist + line.len * (0.2 + eased * 0.8));

        const alpha = line.opacity * Math.min(1, eased * 4) * (1 - Math.max(0, (eased - 0.75) * 4));
        const hex = line.color.replace("#", "");
        const r = parseInt(hex.slice(0, 2), 16);
        const g = parseInt(hex.slice(2, 4), 16);
        const b = parseInt(hex.slice(4, 6), 16);

        const grad = ctx.createLinearGradient(x1, y1, x2, y2);
        grad.addColorStop(0, `rgba(${r},${g},${b},0)`);
        grad.addColorStop(1, `rgba(${r},${g},${b},${Math.max(0, alpha).toFixed(3)})`);
        ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2);
        ctx.strokeStyle = grad; ctx.lineWidth = line.width * (1 + eased * 1.5);
        ctx.lineCap = "round"; ctx.stroke();
      });

      if (eased > 0.6 && eased < 0.9) {
        const flashP = (eased - 0.6) / 0.3;
        const intensity = Math.sin(flashP * Math.PI) * 0.55;
        const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, canvas.width * 0.5);
        gradient.addColorStop(0, `rgba(180,210,255,${intensity})`);
        gradient.addColorStop(0.4, `rgba(56,189,248,${intensity * 0.3})`);
        gradient.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      if (p < 1) rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, [active]);

  if (!active) return null;
  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-20 pointer-events-none" />;
}

// ── Poeira cósmica / nebulosa ao redor do avatar
function CosmicDustCanvas({ active }) {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    if (active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const SIZE = 360;
    canvas.width = SIZE;
    canvas.height = SIZE;

    const cx = SIZE / 2;
    const cy = SIZE / 2;

    const dustColors = [
      { r: 56,  g: 189, b: 248 },
      { r: 129, g: 140, b: 248 },
      { r: 167, g: 139, b: 250 },
      { r: 52,  g: 211, b: 153 },
      { r: 244, g: 114, b: 182 },
      { r: 255, g: 255, b: 255 },
      { r: 196, g: 181, b: 253 },
      { r: 147, g: 197, b: 253 },
    ];

    const dust = Array.from({ length: 220 }, () => {
      const c = dustColors[Math.floor(Math.random() * dustColors.length)];
      const orbit = 60 + Math.random() * 105;
      const angle = Math.random() * Math.PI * 2;
      const tilt = (Math.random() - 0.5) * 0.7;
      const speed = (Math.random() * 0.004 + 0.001) * (Math.random() > 0.5 ? 1 : -1);
      const size = Math.random() < 0.12 ? 1.4 + Math.random() * 1.2 : 0.3 + Math.random() * 0.9;
      const brightness = Math.random();
      return {
        angle, orbit, tilt, speed, size,
        r: c.r, g: c.g, b: c.b,
        alphaBase: brightness * (1 - (orbit - 60) / 105) * 0.85 + 0.1,
        phase: Math.random() * Math.PI * 2,
        phaseSpeed: Math.random() * 0.03 + 0.005,
        isBlob: Math.random() < 0.08,
        blobSize: 4 + Math.random() * 12,
      };
    });

    const nebulae = Array.from({ length: 6 }, () => ({
      angle: Math.random() * Math.PI * 2,
      orbit: 55 + Math.random() * 90,
      tilt: (Math.random() - 0.5) * 0.6,
      size: 28 + Math.random() * 45,
      c: dustColors[Math.floor(Math.random() * dustColors.length)],
      alpha: 0.025 + Math.random() * 0.05,
      speed: 0.0003 + Math.random() * 0.0008,
    }));

    // Glow central pré-renderizado — não recria gradiente a cada frame
    const glowOffscreen = document.createElement("canvas");
    glowOffscreen.width = SIZE; glowOffscreen.height = SIZE;
    const glowCtx = glowOffscreen.getContext("2d");
    const centerGlow = glowCtx.createRadialGradient(cx, cy, 0, cx, cy, 80);
    centerGlow.addColorStop(0, "rgba(56,189,248,0.04)");
    centerGlow.addColorStop(0.5, "rgba(139,92,246,0.03)");
    centerGlow.addColorStop(1, "rgba(0,0,0,0)");
    glowCtx.fillStyle = centerGlow;
    glowCtx.fillRect(0, 0, SIZE, SIZE);

    let frameCount = 0;

    const draw = () => {
      rafRef.current = requestAnimationFrame(draw);

      // ── CONTROLE DE FPS ──────────────────────────────────────────
      // % 1 = 60fps  → sem throttle, máximo de fluidez
      // % 2 = 30fps  → pula 1 frame em cada 2, metade do custo
      // % 3 = 20fps  → pula 2 frames em cada 3, bem mais leve
      // Se travar, troque % 1 por % 2 ou % 3
      frameCount++;
      if (frameCount % 1 !== 0) return; // ← altere aqui

      ctx.clearRect(0, 0, SIZE, SIZE);

      nebulae.forEach((n) => {
        n.angle += n.speed;
        const x = cx + Math.cos(n.angle) * n.orbit;
        const y = cy + Math.sin(n.angle) * n.orbit * (1 - Math.abs(n.tilt) * 0.5);
        const grd = ctx.createRadialGradient(x, y, 0, x, y, n.size);
        grd.addColorStop(0, `rgba(${n.c.r},${n.c.g},${n.c.b},${n.alpha})`);
        grd.addColorStop(1, `rgba(${n.c.r},${n.c.g},${n.c.b},0)`);
        ctx.beginPath(); ctx.arc(x, y, n.size, 0, Math.PI * 2);
        ctx.fillStyle = grd; ctx.fill();
      });

      // Glow central do offscreen (sem recriar gradiente a cada frame)
      ctx.drawImage(glowOffscreen, 0, 0);

      dust.forEach((p) => {
        p.angle += p.speed;
        p.phase += p.phaseSpeed;
        const ex = Math.cos(p.angle) * p.orbit;
        const ey = Math.sin(p.angle) * p.orbit * (1 - Math.abs(p.tilt) * 0.55);
        const depth = 0.4 + 0.6 * (Math.sin(p.angle + p.tilt) * 0.5 + 0.5);
        const alpha = p.alphaBase * depth * (0.6 + 0.4 * Math.sin(p.phase));
        const x = cx + ex;
        const y = cy + ey;

        if (p.isBlob) {
          const grd = ctx.createRadialGradient(x, y, 0, x, y, p.blobSize);
          grd.addColorStop(0, `rgba(${p.r},${p.g},${p.b},${(alpha * 0.4).toFixed(3)})`);
          grd.addColorStop(1, `rgba(${p.r},${p.g},${p.b},0)`);
          ctx.beginPath(); ctx.arc(x, y, p.blobSize, 0, Math.PI * 2);
          ctx.fillStyle = grd; ctx.fill();
        } else {
          ctx.beginPath(); ctx.arc(x, y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${p.r},${p.g},${p.b},${Math.min(alpha, 0.9).toFixed(3)})`;
          ctx.fill();
          if (p.size > 1.0) {
            const glow = ctx.createRadialGradient(x, y, 0, x, y, p.size * 3.5);
            glow.addColorStop(0, `rgba(${p.r},${p.g},${p.b},${(alpha * 0.5).toFixed(3)})`);
            glow.addColorStop(1, `rgba(${p.r},${p.g},${p.b},0)`);
            ctx.beginPath(); ctx.arc(x, y, p.size * 3.5, 0, Math.PI * 2);
            ctx.fillStyle = glow; ctx.fill();
          }
        }
      });
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, [active]);

  if (active) return null;
  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        width: 360,
        height: 360,
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        pointerEvents: "none",
        zIndex: 5,
      }}
    />
  );
}

// ── Dropdown de seleção de idioma exibido no Loader
// Ao escolher, chama i18n.changeLanguage() que atualiza toda a app
const LANGUAGES = [
  { code: "pt", label: "Português", flag: "🇧🇷" },
  { code: "en", label: "English",   flag: "🇺🇸" },
  { code: "es", label: "Español",   flag: "🇪🇸" },
];

function LangSelector() {
  const { i18n: i18nHook } = useTranslation();
  const [open, setOpen] = useState(false);
  const current = LANGUAGES.find((l) => l.code === i18nHook.language) || LANGUAGES[0];

  const change = (code) => {
    i18n.changeLanguage(code); // ← troca idioma globalmente
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full
          font-mono text-xs tracking-widest border border-secondary/30
          text-secondary/80 bg-slate-900/60 backdrop-blur-sm
          hover:border-secondary/60 hover:bg-slate-800/60
          transition-all duration-200 cursor-pointer"
      >
        <span className="text-sm leading-none">{current.flag}</span>
        <span className="uppercase">{current.code}</span>
        <motion.svg
          className="w-2.5 h-2.5"
          viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <path d="M6 9l6 6 6-6" />
        </motion.svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="absolute bottom-full mb-2 right-0 w-40 rounded-xl overflow-hidden
              border border-slate-700/60 shadow-2xl z-50"
            style={{ background: "rgba(2,8,30,0.97)", backdropFilter: "blur(20px)" }}
            initial={{ opacity: 0, y: 6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{   opacity: 0, y: 6, scale: 0.95 }}
            transition={{ duration: 0.18, ease: [0.16,1,0.3,1] }}
          >
            {LANGUAGES.map((lang, i) => (
              <motion.button
                key={lang.code}
                onClick={() => change(lang.code)}
                className={`w-full flex items-center gap-2.5 px-4 py-2.5
                  font-mono text-xs tracking-wide transition-colors duration-150 cursor-pointer
                  ${lang.code === i18nHook.language
                    ? "text-secondary bg-secondary/10"
                    : "text-slate-400 hover:text-slate-200 hover:bg-white/5"}`}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <span className="text-base leading-none">{lang.flag}</span>
                <span>{lang.label}</span>
                {lang.code === i18nHook.language && (
                  <svg className="w-3 h-3 ml-auto text-secondary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                )}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Loader({ onDone, onUserInteracted }) {
  // ── Hook de tradução — busca mensagens de loading nos JSONs
  // Como o i18next detecta o idioma do browser automaticamente,
  // as mensagens de step já aparecem no idioma correto.
  // O botão "Entrar" rotaciona entre os 3 idiomas para dar boas-vindas a todos.
  const { t } = useTranslation();

  // ── STEPS dinâmico — percentuais fixos + mensagens do JSON
  // t("loader.steps.0") → "carregando componentes..." / "loading components..." / "cargando componentes..."
  const STEPS = STEPS_PCT.map((pct, i) => ({
    pct,
    msg: t(`loader.steps.${i}`),
  }));

  const [stepIndex, setStepIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const [warp, setWarp] = useState(false);
  const [ready, setReady] = useState(false);
  const [entering, setEntering] = useState(false);

  // ── Pré-carrega o áudio assim que o componente monta
  // O browser baixa e decodifica o arquivo antes do clique,
  // então quando o usuário apertar "Entrar" o som toca instantâneo
  const audioRef = useRef(null);
  useEffect(() => {
    const audio = new Audio("/assets/audio/effect_sound1.wav");
    audio.preload = "auto"; // força o download imediato
    audio.volume = 0.5;
    audio.load();           // dispara o carregamento
    audioRef.current = audio;
  }, []);

  const currentStep = STEPS[Math.min(stepIndex, STEPS.length - 1)];
  const progress = currentStep.pct;

  useEffect(() => {
    const timers = STEPS.map((_, i) =>
      setTimeout(() => {
        setStepIndex(i);
        if (i === STEPS.length - 1) {
          setTimeout(() => setReady(true), 400);
        }
      }, STEP_INTERVAL * i)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  const handleEnter = async () => {
    if (entering) return;
    setEntering(true);

    // Desbloqueia contexto de áudio do site (MusicPlayer etc.)
    onUserInteracted?.();

    // Toca o som do loader — async/await para capturar erros corretamente
    const audio = audioRef.current;
    if (audio) {
      try {
        audio.currentTime = 0;
        await audio.play();
      } catch (e) {
        // Autoplay bloqueado ou outro erro — ignora silenciosamente
        console.warn("Som do loader não reproduzido:", e.message);
      }
    }

    setWarp(true);
    setTimeout(() => setVisible(false), 1050);
  };

  return (
    <AnimatePresence onExitComplete={onDone}>
      {visible && (
        <motion.div
          key="loader"
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-slate-950 overflow-hidden"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeIn" }}
        >
          <SpaceCanvas />
          <WarpCanvas active={warp} />

          <div
            className="absolute rounded-full pointer-events-none"
            style={{
              width: 500,
              height: 500,
              background: "radial-gradient(circle, rgba(56,189,248,0.10) 0%, rgba(139,92,246,0.06) 50%, transparent 70%)",
              filter: "blur(35px)",
            }}
          />

          <CosmicDustCanvas active={warp} />

          {!warp &&
            [
              { size: 260, dur: 5,  color: "rgba(56,189,248,0.22)", reverse: false },
              { size: 340, dur: 8,  color: "rgba(139,92,246,0.18)", reverse: true  },
              { size: 420, dur: 13, color: "rgba(52,211,153,0.13)", reverse: false },
            ].map((ring, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full border border-dashed pointer-events-none"
                style={{ width: ring.size, height: ring.size, borderColor: ring.color }}
                animate={{ rotate: ring.reverse ? [0, -360] : [0, 360] }}
                transition={{ duration: ring.dur, repeat: Infinity, ease: "linear" }}
              />
            ))}

          <motion.div
            className="relative z-10 flex items-center justify-center w-28 h-28 rounded-3xl bg-slate-900/80 border border-secondary/30 backdrop-blur-sm"
            style={{ zIndex: 10 }}
            animate={
              warp
                ? { scale: 0, opacity: 0 }
                : {
                    boxShadow: [
                      "0 0 40px rgba(56,189,248,0.10), 0 0 80px rgba(56,189,248,0.04)",
                      "0 0 70px rgba(56,189,248,0.28), 0 0 140px rgba(56,189,248,0.12)",
                      "0 0 40px rgba(56,189,248,0.10), 0 0 80px rgba(56,189,248,0.04)",
                    ],
                  }
            }
            transition={
              warp
                ? { duration: 0.3, ease: "easeIn" }
                : { duration: 2.5, repeat: Infinity, ease: "easeInOut" }
            }
          >
            <span className="font-mono font-bold text-4xl select-none">
              <span className="text-slate-400">&lt;</span>
              <span className="text-secondary">/</span>
              <span className="text-slate-400">&gt;</span>
            </span>
          </motion.div>

          <motion.p
            className="relative z-10 mt-5 font-syne font-bold text-xl text-slate-200 tracking-wide"
            initial={{ opacity: 0, y: 8 }}
            animate={warp ? { opacity: 0, y: -20 } : { opacity: 1, y: 0 }}
            transition={warp ? { duration: 0.25 } : { delay: 0.4, duration: 0.6 }}
          >
            Ismael <span className="text-secondary">Moura</span>
          </motion.p>

          {/* ── Dropdown de idioma — escolha antes de entrar, traduz toda a página */}
          {!warp && (
            <motion.div
              className="relative z-10 mt-4"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <LangSelector />
            </motion.div>
          )}

          <div className="relative z-10 mt-10 flex flex-col items-center gap-4 w-80">
            {!warp && (
              <>
                <div className="w-full h-[3px] bg-slate-800 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: "linear-gradient(90deg, #38bdf8, #818cf8, #34d399)" }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                  />
                </div>
                <div className="flex items-center justify-between w-full">
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={currentStep.msg}
                      className="font-mono text-xs tracking-widest text-slate-500"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      transition={{ duration: 0.25 }}
                    >
                      {/* currentStep.msg já vem traduzido do JSON via t() */}
                      {currentStep.msg}
                    </motion.p>
                  </AnimatePresence>
                  <motion.span
                    className="font-mono text-sm text-secondary tabular-nums font-bold"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    {progress}%
                  </motion.span>
                </div>
              </>
            )}

            <AnimatePresence>
              {ready && !warp && (
                <motion.button
                  onClick={handleEnter}
                  initial={{ opacity: 0, y: 12, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9, y: -8 }}
                  transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
                  className="mt-2 relative group cursor-pointer"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <motion.div
                    className="absolute inset-0 rounded-full blur-md"
                    style={{ background: "linear-gradient(90deg, #38bdf8, #818cf8, #34d399)" }}
                    animate={{ opacity: [0.3, 0.7, 0.3], scale: [1, 1.08, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <div
                    className="relative flex items-center gap-3 px-10 py-3.5 rounded-full
                    bg-slate-950 border border-secondary/40
                    font-mono text-sm tracking-widest text-secondary uppercase
                    group-hover:border-secondary/70 transition-colors duration-300"
                  >
                    <motion.svg
                      className="w-4 h-4"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      animate={{ x: [0, 2, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <path d="M8 5v14l11-7z" />
                    </motion.svg>
                    {/* t("loader.enter") → "Entrar" / "Enter" / "Ingresar" — idioma já escolhido no dropdown */}
                    {t("loader.enter")}
                    <motion.span
                      className="absolute -top-1 -right-1 text-[10px] text-secondary/60"
                      animate={{ opacity: [0.4, 1, 0.4], scale: [0.8, 1.2, 0.8] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                    >✦</motion.span>
                    <motion.span
                      className="absolute -bottom-1 -left-1 text-[8px] text-violet-400/60"
                      animate={{ opacity: [0.3, 0.9, 0.3], scale: [0.7, 1.1, 0.7] }}
                      transition={{ duration: 2.5, repeat: Infinity }}
                    >✦</motion.span>
                  </div>
                </motion.button>
              )}
            </AnimatePresence>
          </div>

        </motion.div>
      )}
    </AnimatePresence>
  );
}