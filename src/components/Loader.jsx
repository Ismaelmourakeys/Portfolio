import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const STEPS = [
  { pct: 15, msg: "carregando componentes..." },
  { pct: 40, msg: "compilando estilos..." },
  { pct: 65, msg: "inicializando módulos..." },
  { pct: 85, msg: "renderizando interface..." },
  { pct: 100, msg: "pronto!" },
];

const TOTAL_DURATION = 3800;
const STEP_INTERVAL = TOTAL_DURATION / STEPS.length;
const PARTICLE_COLORS = ["#38bdf8", "#818cf8", "#34d399", "#a78bfa", "#f472b6"];

// ── Canvas: estrelas piscando + cometas (mesma lógica do Hero, tela cheia)
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

    // Estrelas
    const stars = Array.from({ length: 300 }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: Math.random() * 0.8 + 0.1,
      speed: Math.random() * 0.006 + 0.001,
      phase: Math.random() * Math.PI * 2,
      color:
        Math.random() > 0.85
          ? "rgba(56,189,248,"   // sky
          : Math.random() > 0.7
          ? "rgba(250,204,21,"   // yellow
          : Math.random() > 0.6
          ? "rgba(167,139,250,"  // violet
          : "rgba(200,210,230,", // branco/cinza
    }));

    // Cometas
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
        // cor aleatória entre branco e azul/violeta
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

        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(this.x, this.y);
        ctx.strokeStyle = grad;
        ctx.lineWidth = this.width;
        ctx.lineCap = "round";
        ctx.stroke();

        // brilho na cabeça
        const glow = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.width * 4);
        glow.addColorStop(0, `rgba(${this.hue},${this.opacity.toFixed(2)})`);
        glow.addColorStop(1, `rgba(${this.hue},0)`);
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.width * 4, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();
      }
    }

    const comets = Array.from({ length: 14 }, () => new Comet());

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

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
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
      style={{
        width: size,
        height: size,
        background: color,
        boxShadow: `0 0 ${size * 4}px ${color}`,
        top: "50%",
        left: "50%",
      }}
      animate={{
        rotate: [angle, angle + 360],
        x: [
          Math.cos((angle * Math.PI) / 180) * radius - size / 2,
          Math.cos(((angle + 360) * Math.PI) / 180) * radius - size / 2,
        ],
        y: [
          Math.sin((angle * Math.PI) / 180) * radius - size / 2,
          Math.sin(((angle + 360) * Math.PI) / 180) * radius - size / 2,
        ],
        opacity: [0, 1, 1, 0],
      }}
      transition={{
        duration: dur,
        repeat: Infinity,
        ease: "linear",
        delay: Math.random() * dur,
      }}
    />
  );
}

export default function Loader({ onDone }) {
  const [stepIndex, setStepIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  const currentStep = STEPS[Math.min(stepIndex, STEPS.length - 1)];
  const progress = currentStep.pct;

  useEffect(() => {
    const timers = STEPS.map((_, i) =>
      setTimeout(() => setStepIndex(i), STEP_INTERVAL * i)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setVisible(false), TOTAL_DURATION + 400);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence onExitComplete={onDone}>
      {visible && (
        <motion.div
          key="loader"
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-slate-950 overflow-hidden"
          exit={{ scale: 1.06, opacity: 0, filter: "blur(24px)" }}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
        >
          {/* espaço sideral: estrelas + cometas */}
          <SpaceCanvas />

          {/* orbe de brilho central */}
          <div
            className="absolute rounded-full pointer-events-none"
            style={{
              width: 500,
              height: 500,
              background:
                "radial-gradient(circle, rgba(56,189,248,0.10) 0%, rgba(139,92,246,0.06) 50%, transparent 70%)",
              filter: "blur(35px)",
            }}
          />

          {/* anéis orbitais */}
          {[
            { size: 260, dur: 5,  color: "rgba(56,189,248,0.22)",  reverse: false },
            { size: 340, dur: 8,  color: "rgba(139,92,246,0.18)",  reverse: true  },
            { size: 420, dur: 13, color: "rgba(52,211,153,0.13)",  reverse: false },
          ].map((ring, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full border border-dashed pointer-events-none"
              style={{ width: ring.size, height: ring.size, borderColor: ring.color }}
              animate={{ rotate: ring.reverse ? [0, -360] : [0, 360] }}
              transition={{ duration: ring.dur, repeat: Infinity, ease: "linear" }}
            />
          ))}

          {/* partículas orbitais */}
          <div className="absolute" style={{ width: 0, height: 0 }}>
            {Array.from({ length: 24 }).map((_, i) => (
              <Particle key={i} index={i} total={24} />
            ))}
          </div>

          {/* logo central */}
          <motion.div
            className="relative z-10 flex items-center justify-center w-28 h-28 rounded-3xl
              bg-slate-900/80 border border-secondary/30 backdrop-blur-sm"
            animate={{
              boxShadow: [
                "0 0 40px rgba(56,189,248,0.10), 0 0 80px rgba(56,189,248,0.04)",
                "0 0 70px rgba(56,189,248,0.28), 0 0 140px rgba(56,189,248,0.12)",
                "0 0 40px rgba(56,189,248,0.10), 0 0 80px rgba(56,189,248,0.04)",
              ],
            }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
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
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Ismael <span className="text-secondary">Moura</span>
          </motion.p>

          {/* barra de progresso + status */}
          <div className="relative z-10 mt-10 flex flex-col items-center gap-3 w-80">
            <div className="w-full h-[3px] bg-slate-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{
                  background: "linear-gradient(90deg, #38bdf8, #818cf8, #34d399)",
                }}
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
          </div>

        </motion.div>
      )}
    </AnimatePresence>
  );
}