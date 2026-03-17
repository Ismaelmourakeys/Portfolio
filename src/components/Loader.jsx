import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const STEPS = [
  { pct: 15, msg: "carregando componentes..." },
  { pct: 40, msg: "compilando estilos..." },
  { pct: 65, msg: "inicializando módulos..." },
  { pct: 85, msg: "renderizando interface..." },
  { pct: 100, msg: "pronto!" },
];

const TOTAL_DURATION = 3200;
const STEP_INTERVAL = TOTAL_DURATION / STEPS.length;
const PARTICLE_COLORS = ["#38bdf8", "#818cf8", "#34d399", "#a78bfa", "#f472b6"];

// ── Som warp via Web Audio API
function playWarpSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();

    const bufferSize = ctx.sampleRate * 1.8;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = "bandpass";
    noiseFilter.frequency.setValueAtTime(800, ctx.currentTime);
    noiseFilter.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 1.4);
    noiseFilter.Q.value = 0.8;
    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0, ctx.currentTime);
    noiseGain.gain.linearRampToValueAtTime(0.35, ctx.currentTime + 0.05);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.6);
    noise.connect(noiseFilter); noiseFilter.connect(noiseGain); noiseGain.connect(ctx.destination);
    noise.start(ctx.currentTime); noise.stop(ctx.currentTime + 1.8);

    const osc = ctx.createOscillator();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(420, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 1.2);
    const oscGain = ctx.createGain();
    oscGain.gain.setValueAtTime(0, ctx.currentTime);
    oscGain.gain.linearRampToValueAtTime(0.18, ctx.currentTime + 0.08);
    oscGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.3);
    const oscFilter = ctx.createBiquadFilter();
    oscFilter.type = "lowpass";
    oscFilter.frequency.setValueAtTime(600, ctx.currentTime);
    oscFilter.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 1.2);
    osc.connect(oscFilter); oscFilter.connect(oscGain); oscGain.connect(ctx.destination);
    osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 1.4);

    const boom = ctx.createOscillator();
    boom.type = "sine";
    boom.frequency.setValueAtTime(120, ctx.currentTime);
    boom.frequency.exponentialRampToValueAtTime(20, ctx.currentTime + 0.4);
    const boomGain = ctx.createGain();
    boomGain.gain.setValueAtTime(0.5, ctx.currentTime);
    boomGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
    boom.connect(boomGain); boomGain.connect(ctx.destination);
    boom.start(ctx.currentTime); boom.stop(ctx.currentTime + 0.5);
  } catch (e) {}
}

// ── Canvas: estrelas + cometas
function SpaceCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);

    const stars = Array.from({ length: 300 }, () => ({
      x: Math.random(), y: Math.random(),
      r: Math.random() * 0.8 + 0.1,
      speed: Math.random() * 0.006 + 0.001,
      phase: Math.random() * Math.PI * 2,
      color: Math.random() > 0.85 ? "rgba(56,189,248,"
        : Math.random() > 0.7 ? "rgba(250,204,21,"
        : Math.random() > 0.6 ? "rgba(167,139,250,"
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
        this.active = !initial; this.timer = 0;
        this.delay = initial ? Math.floor(Math.random() * 220) : 0;
      }
      update() {
        if (!this.active) { this.timer++; if (this.timer >= this.delay) this.active = true; return; }
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;
        if (this.x > canvas.width + 120 || this.y > canvas.height + 120) {
          this.reset(); this.delay = 60 + Math.floor(Math.random() * 280); this.active = false; this.timer = 0;
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
        ctx.beginPath(); ctx.arc(s.x * canvas.width, s.y * canvas.height, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `${s.color}${(alpha * 0.85).toFixed(2)})`; ctx.fill();
      });
      comets.forEach((c) => { c.update(); c.draw(); });
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
}

// ── Canvas warp: linhas de velocidade — transição suave para escuro
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
      // ease in — começa devagar, acelera
      const eased = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // fundo: transparente → slate-950 gradual
      ctx.fillStyle = `rgba(2,6,23,${eased * 0.92})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      lines.forEach((line) => {
        line.dist += line.speed * (1 + eased * 10);
        const x1 = cx + Math.cos(line.angle) * line.dist;
        const y1 = cy + Math.sin(line.angle) * line.dist;
        const x2 = cx + Math.cos(line.angle) * (line.dist + line.len * (0.2 + eased * 0.8));
        const y2 = cy + Math.sin(line.angle) * (line.dist + line.len * (0.2 + eased * 0.8));

        // alpha: aparece suave, some no final
        const alpha = line.opacity * Math.min(1, eased * 4) * (1 - Math.max(0, (eased - 0.75) * 4));

        const hex = line.color.replace("#", "");
        const r = parseInt(hex.slice(0,2),16);
        const g = parseInt(hex.slice(2,4),16);
        const b = parseInt(hex.slice(4,6),16);

        const grad = ctx.createLinearGradient(x1, y1, x2, y2);
        grad.addColorStop(0, `rgba(${r},${g},${b},0)`);
        grad.addColorStop(1, `rgba(${r},${g},${b},${Math.max(0, alpha).toFixed(3)})`);

        ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2);
        ctx.strokeStyle = grad;
        ctx.lineWidth = line.width * (1 + eased * 1.5);
        ctx.lineCap = "round"; ctx.stroke();
      });

      // flash suave no centro — só no pico, mais gentil que antes
      if (eased > 0.6 && eased < 0.9) {
        const flashP = (eased - 0.6) / 0.3;
        const intensity = Math.sin(flashP * Math.PI) * 0.55; // bell curve suave
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

// ── Partícula orbital
function Particle({ index, total }) {
  const angle = (360 / total) * index;
  const dur = 2.2 + Math.random() * 2.5;
  const color = PARTICLE_COLORS[index % PARTICLE_COLORS.length];
  const size = 2.5 + Math.random() * 3.5;
  const radius = 140 + Math.random() * 40;

  return (
    <motion.div
      className="absolute rounded-full"
      style={{ width: size, height: size, background: color, boxShadow: `0 0 ${size * 4}px ${color}`, top: "50%", left: "50%" }}
      animate={{
        rotate: [angle, angle + 360],
        x: [Math.cos((angle * Math.PI) / 180) * radius - size / 2, Math.cos(((angle + 360) * Math.PI) / 180) * radius - size / 2],
        y: [Math.sin((angle * Math.PI) / 180) * radius - size / 2, Math.sin(((angle + 360) * Math.PI) / 180) * radius - size / 2],
        opacity: [0, 1, 1, 0],
      }}
      transition={{ duration: dur, repeat: Infinity, ease: "linear", delay: Math.random() * dur }}
    />
  );
}

export default function Loader({ onDone, onUserInteracted }) {
  const [stepIndex, setStepIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const [warp, setWarp] = useState(false);
  const [ready, setReady] = useState(false); // progresso chegou a 100%
  const [entering, setEntering] = useState(false); // usuário clicou em Entrar

  const currentStep = STEPS[Math.min(stepIndex, STEPS.length - 1)];
  const progress = currentStep.pct;

  // avança steps automaticamente
  useEffect(() => {
    const timers = STEPS.map((_, i) =>
      setTimeout(() => {
        setStepIndex(i);
        if (i === STEPS.length - 1) {
          // pequena pausa antes de mostrar o botão
          setTimeout(() => setReady(true), 400);
        }
      }, STEP_INTERVAL * i)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  // usuário clicou em "Entrar" — dispara tudo
  const handleEnter = () => {
    if (entering) return;
    setEntering(true);

    // notifica App.jsx que houve interação — libera o áudio
    onUserInteracted?.();

    // som + warp
    playWarpSound();
    setWarp(true);

    // esconde loader após warp
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

          {/* orbe central */}
          <div className="absolute rounded-full pointer-events-none"
            style={{ width: 500, height: 500, background: "radial-gradient(circle, rgba(56,189,248,0.10) 0%, rgba(139,92,246,0.06) 50%, transparent 70%)", filter: "blur(35px)" }}
          />

          {/* anéis — somem no warp */}
          {!warp && [
            { size: 260, dur: 5,  color: "rgba(56,189,248,0.22)",  reverse: false },
            { size: 340, dur: 8,  color: "rgba(139,92,246,0.18)",  reverse: true  },
            { size: 420, dur: 13, color: "rgba(52,211,153,0.13)",  reverse: false },
          ].map((ring, i) => (
            <motion.div key={i}
              className="absolute rounded-full border border-dashed pointer-events-none"
              style={{ width: ring.size, height: ring.size, borderColor: ring.color }}
              animate={{ rotate: ring.reverse ? [0, -360] : [0, 360] }}
              transition={{ duration: ring.dur, repeat: Infinity, ease: "linear" }}
            />
          ))}

          {/* partículas — somem no warp */}
          {!warp && (
            <div className="absolute" style={{ width: 0, height: 0 }}>
              {Array.from({ length: 24 }).map((_, i) => (
                <Particle key={i} index={i} total={24} />
              ))}
            </div>
          )}

          {/* logo */}
          <motion.div
            className="relative z-10 flex items-center justify-center w-28 h-28 rounded-3xl bg-slate-900/80 border border-secondary/30 backdrop-blur-sm"
            animate={warp
              ? { scale: 0, opacity: 0 }
              : { boxShadow: ["0 0 40px rgba(56,189,248,0.10), 0 0 80px rgba(56,189,248,0.04)", "0 0 70px rgba(56,189,248,0.28), 0 0 140px rgba(56,189,248,0.12)", "0 0 40px rgba(56,189,248,0.10), 0 0 80px rgba(56,189,248,0.04)"] }
            }
            transition={warp ? { duration: 0.3, ease: "easeIn" } : { duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <span className="font-mono font-bold text-4xl select-none">
              <span className="text-slate-400">&lt;</span>
              <span className="text-secondary">/</span>
              <span className="text-slate-400">&gt;</span>
            </span>
          </motion.div>

          {/* nome */}
          <motion.p
            className="relative z-10 mt-5 font-syne font-bold text-xl text-slate-200 tracking-wide"
            initial={{ opacity: 0, y: 8 }}
            animate={warp ? { opacity: 0, y: -20 } : { opacity: 1, y: 0 }}
            transition={warp ? { duration: 0.25 } : { delay: 0.4, duration: 0.6 }}
          >
            Ismael <span className="text-secondary">Moura</span>
          </motion.p>

          {/* barra + status + botão Entrar */}
          <div className="relative z-10 mt-10 flex flex-col items-center gap-4 w-80">

            {/* barra de progresso */}
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

            {/* botão Entrar — aparece quando ready e some no warp */}
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
                  {/* glow pulsante atrás do botão */}
                  <motion.div
                    className="absolute inset-0 rounded-full blur-md"
                    style={{ background: "linear-gradient(90deg, #38bdf8, #818cf8, #34d399)" }}
                    animate={{ opacity: [0.3, 0.7, 0.3], scale: [1, 1.08, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  />

                  {/* botão real */}
                  <div className="relative flex items-center gap-3 px-10 py-3.5 rounded-full
                    bg-slate-950 border border-secondary/40
                    font-mono text-sm tracking-widest text-secondary uppercase
                    group-hover:border-secondary/70 transition-colors duration-300"
                  >
                    {/* ícone play */}
                    <motion.svg
                      className="w-4 h-4"
                      viewBox="0 0 24 24" fill="currentColor"
                      animate={{ x: [0, 2, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <path d="M8 5v14l11-7z"/>
                    </motion.svg>
                    Entrar
                    {/* estrelinhas decorativas */}
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