import { useEffect, useRef } from "react";
import Typed from "typed.js";
import { motion, useScroll, useTransform } from "framer-motion";

function SpaceCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const stars = Array.from({ length: 280 }, () => {
      const depth = Math.random();
      return {
        x: Math.random(), y: Math.random(),
        r: depth * 1.2 + 0.15,
        speed: 0.0008 + depth * 0.003,
        phase: Math.random() * Math.PI * 2,
        color: Math.random() > 0.92 ? "rgba(56,189,248,"
          : Math.random() > 0.85 ? "rgba(255,220,180,"
          : Math.random() > 0.5  ? "rgba(210,220,240,"
          : "rgba(240,242,248,",
        minAlpha: 0.08 + Math.random() * 0.12,
        maxAlpha: 0.5 + depth * 0.4,
      };
    });

    const nebulae = Array.from({ length: 4 }, () => ({
      x: Math.random(), y: Math.random(),
      r: 80 + Math.random() * 140,
      color: Math.random() > 0.5 ? [56, 100, 180] : [80, 40, 140],
      alpha: 0.015 + Math.random() * 0.025,
    }));

    class Comet {
      constructor(initial = false) { this.reset(initial); }
      reset(initial = false) {
        this.x = Math.random() * canvas.width * 1.4 - canvas.width * 0.2;
        this.y = initial ? Math.random() * canvas.height * -0.8 : -40;
        this.len = 60 + Math.random() * 100;
        this.speed = 2.5 + Math.random() * 3;
        this.angle = Math.PI / 4 + (Math.random() - 0.5) * 0.35;
        this.width = 0.6 + Math.random() * 1.0;
        this.opacity = 0.35 + Math.random() * 0.35;
        this.active = !initial;
        this.timer = 0;
        this.delay = initial ? Math.floor(Math.random() * 400) : 200 + Math.floor(Math.random() * 600);
      }
      update() {
        if (!this.active) { this.timer++; if (this.timer >= this.delay) this.active = true; return; }
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;
        if (this.x > canvas.width + 80 || this.y > canvas.height + 80) this.reset(false);
      }
      draw() {
        if (!this.active) return;
        const tailX = this.x - Math.cos(this.angle) * this.len;
        const tailY = this.y - Math.sin(this.angle) * this.len;
        const grad = ctx.createLinearGradient(tailX, tailY, this.x, this.y);
        grad.addColorStop(0, `rgba(220,235,255,0)`);
        grad.addColorStop(0.5, `rgba(200,220,255,${(this.opacity * 0.2).toFixed(3)})`);
        grad.addColorStop(1, `rgba(240,248,255,${this.opacity.toFixed(3)})`);
        ctx.beginPath(); ctx.moveTo(tailX, tailY); ctx.lineTo(this.x, this.y);
        ctx.strokeStyle = grad; ctx.lineWidth = this.width; ctx.lineCap = "round"; ctx.stroke();
        const glow = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.width * 5);
        glow.addColorStop(0, `rgba(220,235,255,${(this.opacity * 0.8).toFixed(3)})`);
        glow.addColorStop(1, `rgba(180,210,255,0)`);
        ctx.beginPath(); ctx.arc(this.x, this.y, this.width * 5, 0, Math.PI * 2);
        ctx.fillStyle = glow; ctx.fill();
      }
    }

    const comets = Array.from({ length: 4 }, () => new Comet(true));
    let raf;
    const draw = (t) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      nebulae.forEach((n) => {
        const grad = ctx.createRadialGradient(
          n.x * canvas.width, n.y * canvas.height, 0,
          n.x * canvas.width, n.y * canvas.height, n.r
        );
        grad.addColorStop(0, `rgba(${n.color.join(",")},${n.alpha})`);
        grad.addColorStop(1, `rgba(${n.color.join(",")},0)`);
        ctx.beginPath(); ctx.arc(n.x * canvas.width, n.y * canvas.height, n.r, 0, Math.PI * 2);
        ctx.fillStyle = grad; ctx.fill();
      });
      stars.forEach((s) => {
        const pulse = 0.5 + 0.5 * Math.sin(t * s.speed * 60 + s.phase);
        const alpha = s.minAlpha + (s.maxAlpha - s.minAlpha) * pulse;
        ctx.beginPath(); ctx.arc(s.x * canvas.width, s.y * canvas.height, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `${s.color}${alpha.toFixed(3)})`; ctx.fill();
      });
      comets.forEach((c) => { c.update(); c.draw(); });
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
}

// ── Borda galáctica — fiel à prévia: nebulosa ondulante vibrante + partículas orbitais
function GalaxyBorder({ size = 420 }) {
  const canvasRef = useRef(null);
  const TAU = Math.PI * 2;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const PAD = 50;
    const S = size + PAD * 2;
    canvas.width = S;
    canvas.height = S;
    const cx = S / 2;
    const cy = S / 2;
    const R = size / 2;

    // Anel nebuloso base — pontos densos ao redor do anel ondulando
    // Igual à prévia: anel colorido que deforma como uma nebulosa viva
    const ringCount = 260;
    const ring = Array.from({ length: ringCount }, (_, i) => ({
      baseAngle: (i / ringCount) * TAU,
      waveAmp: 3 + Math.random() * 6,
      waveFreq: 3 + Math.floor(Math.random() * 6),
      wavePhase: Math.random() * TAU,
      waveSpeed: 0.4 + Math.random() * 0.8,
      dotSize: 1.0 + Math.random() * 1.8,
      hueOffset: Math.random() * 60,
      alphaBase: 0.35 + Math.random() * 0.45,
    }));

    // Partículas orbitais coloridas — 12 igual à prévia
    const COLORS = ["#38bdf8", "#818cf8", "#34d399", "#eeac4a", "#eb5e00"];
    const orbitals = Array.from({ length: 12 }, (_, i) => ({
      angle: (i / 12) * TAU,
      speed: 0.008 + (i % 3) * 0.003,
      dir: i % 4 === 0 ? -1 : 1,
      orbit: R + 2 + (i % 3) * 5,
      size: 2.0 + (i % 3) * 0.8,
      color: COLORS[i % COLORS.length],
      phase: (i / 12) * TAU,
    }));

    // Glow de fundo do anel — igual à prévia
    let t = 0;
    let raf;

    const hexToRgb = (hex) => {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return [r, g, b];
    };

    const draw = () => {
      ctx.clearRect(0, 0, S, S);

      // ── Glow suave ao redor do anel — igual à prévia
      const g1 = ctx.createRadialGradient(cx, cy, R - 12, cx, cy, R + 20);
      g1.addColorStop(0, "rgba(56,189,248,0)");
      g1.addColorStop(0.3, `rgba(56,189,248,${0.06 + 0.04 * Math.sin(t)})`);
      g1.addColorStop(0.6, `rgba(139,92,246,${0.07 + 0.04 * Math.cos(t * 0.7)})`);
      g1.addColorStop(1, "rgba(52,211,153,0)");
      ctx.beginPath(); ctx.arc(cx, cy, R + 20, 0, TAU);
      ctx.fillStyle = g1; ctx.fill();

      // ── Anel nebuloso: pontos que ondulam — a parte principal da borda
      ring.forEach((r) => {
        const a = r.baseAngle + t * 0.15;
        const warp = Math.sin(a * r.waveFreq + t * r.waveSpeed + r.wavePhase) * r.waveAmp;
        const radius = R + warp;
        const x = cx + Math.cos(a) * radius;
        const y = cy + Math.sin(a) * radius;

        // hue percorre 240→300→160 (azul→violeta→verde) igual à prévia
        const hue = 240 + Math.sin(a * 2 + t * 0.5) * 80;
        const bright = 65 + Math.sin(a * 4 + t * 1.5) * 18;
        const alpha = r.alphaBase * (0.55 + 0.45 * Math.sin(a * r.waveFreq + t * 2));

        ctx.beginPath();
        ctx.arc(x, y, r.dotSize, 0, TAU);
        ctx.fillStyle = `hsla(${hue},88%,${bright}%,${Math.max(0.08, alpha).toFixed(3)})`;
        ctx.fill();
      });

      // ── Partículas orbitais com glow — fiel à prévia
      orbitals.forEach((p) => {
        p.angle += p.speed * p.dir;
        const px = cx + Math.cos(p.angle) * p.orbit;
        const py = cy + Math.sin(p.angle) * p.orbit;
        const pulse = 0.7 + 0.3 * Math.sin(t * 3 + p.phase);
        const [rr, gg, bb] = hexToRgb(p.color);

        // glow da partícula — igual à prévia
        const pg = ctx.createRadialGradient(px, py, 0, px, py, p.size * 5);
        pg.addColorStop(0, `rgba(${rr},${gg},${bb},${(0.7 * pulse).toFixed(2)})`);
        pg.addColorStop(0.5, `rgba(${rr},${gg},${bb},0.15)`);
        pg.addColorStop(1, `rgba(${rr},${gg},${bb},0)`);
        ctx.beginPath(); ctx.arc(px, py, p.size * 5, 0, TAU);
        ctx.fillStyle = pg; ctx.fill();

        // núcleo brilhante
        ctx.beginPath(); ctx.arc(px, py, p.size * pulse, 0, TAU);
        ctx.fillStyle = `rgba(${rr},${gg},${bb},0.95)`;
        ctx.fill();

        // ponto branco central
        ctx.beginPath(); ctx.arc(px, py, p.size * 0.35, 0, TAU);
        ctx.fillStyle = "rgba(255,255,255,0.9)";
        ctx.fill();
      });

      // ── Trilha de brilho — faixa de glow que gira igual à prévia
      const trailGrad = ctx.createRadialGradient(cx, cy, R - 4, cx, cy, R + 14);
      trailGrad.addColorStop(0, "rgba(56,189,248,0)");
      trailGrad.addColorStop(0.5, `rgba(56,189,248,${0.04 + 0.03 * Math.sin(t * 1.3)})`);
      trailGrad.addColorStop(1, "rgba(56,189,248,0)");
      ctx.beginPath(); ctx.arc(cx, cy, R + 14, 0, TAU);
      ctx.strokeStyle = trailGrad; ctx.lineWidth = 14; ctx.stroke();

      t += 0.016;
      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [size]);

  const PAD = 50;
  const S = size + PAD * 2;

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        top: -PAD,
        left: -PAD,
        width: S,
        height: S,
        pointerEvents: "none",
        zIndex: 1,
      }}
    />
  );
}

export default function Hero() {
  const typedRef = useRef(null);
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const videoY = useTransform(scrollYProgress, [0, 1], ["0px", "60px"]);
  const bgY    = useTransform(scrollYProgress, [0, 1], ["0px", "30px"]);

  useEffect(() => {
    const typed = new Typed(typedRef.current, {
      strings: ["Desenvolvedor", "UI Designer", "Estudante"],
      typeSpeed: 55,
      backSpeed: 35,
      backDelay: 2200,
      loop: true,
      showCursor: false,
      startDelay: 1400,
    });
    return () => typed.destroy();
  }, []);

  const avatarVariants = {
    hidden: { opacity: 0, x: -80, scale: 0.88, filter: "blur(12px)" },
    visible: { opacity: 1, x: 0, scale: 1, filter: "blur(0px)",
      transition: { duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.2 } },
  };
  const tagVariants = {
    hidden: { opacity: 0, y: -20, filter: "blur(6px)" },
    visible: { opacity: 1, y: 0, filter: "blur(0px)",
      transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.7 } },
  };
  const greetingVariants = {
    hidden: { opacity: 0, x: 40, filter: "blur(6px)" },
    visible: { opacity: 1, x: 0, filter: "blur(0px)",
      transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.95 } },
  };
  const titleVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.96, filter: "blur(8px)" },
    visible: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)",
      transition: { duration: 1.1, ease: [0.34, 1.56, 0.64, 1], delay: 1.15 } },
  };
  const descVariants = {
    hidden: { opacity: 0, y: 20, filter: "blur(4px)" },
    visible: { opacity: 1, y: 0, filter: "blur(0px)",
      transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 1.4 } },
  };
  const ctaVariants = {
    hidden: { opacity: 0, y: 16, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1,
      transition: { duration: 0.8, ease: [0.34, 1.56, 0.64, 1], delay: 1.65 } },
  };
  const socialsVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0,
      transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 1.9 } },
  };
  const flashVariants = {
    hidden: { opacity: 1 },
    visible: { opacity: 0, transition: { duration: 1.2, ease: "easeOut" } },
  };

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden px-6 py-24 sm:py-32 bg-slate-950"
    >
      <motion.div
        className="pointer-events-none absolute inset-0 z-20 bg-white"
        variants={flashVariants}
        initial="hidden"
        animate="visible"
      />

      <SpaceCanvas />

      <motion.div className="pointer-events-none absolute inset-0" style={{ y: bgY }}>
        <div className="absolute -top-60 -left-60 w-[700px] h-[700px] rounded-full opacity-[0.07]"
          style={{ background: "radial-gradient(circle, rgba(56,189,248,1) 0%, rgba(99,102,241,0.6) 40%, transparent 70%)", filter: "blur(60px)" }} />
        <div className="absolute -bottom-60 -right-40 w-[500px] h-[500px] rounded-full opacity-[0.04]"
          style={{ background: "radial-gradient(circle, rgba(250,180,80,1) 0%, rgba(220,80,120,0.5) 50%, transparent 70%)", filter: "blur(50px)" }} />
      </motion.div>

      <div className="relative z-10 max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-12 sm:gap-20">

        {/* AVATAR com borda nebulosa */}
        <motion.div
          className="relative flex-shrink-0"
          variants={avatarVariants}
          initial="hidden"
          animate="visible"
          style={{ y: videoY }}
        >
          {/* borda galáctica — canvas animado responsivo */}
          <div className="hidden sm:block">
            <GalaxyBorder size={420} />
          </div>
          <div className="block sm:hidden">
            <GalaxyBorder size={240} />
          </div>

          {/* badge disponível */}
          <motion.div
            className="absolute -top-3 -right-3 z-10
              flex items-center gap-1.5
              bg-slate-900/90 border border-sky-400/25 rounded-full
              px-3 py-1.5 shadow-lg shadow-black/60 backdrop-blur-sm"
            initial={{ opacity: 0, scale: 0.5, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 1.3, duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
          >
            <motion.span
              className="w-2 h-2 rounded-full bg-emerald-400"
              animate={{ boxShadow: [
                "0 0 4px rgba(52,211,153,0.4)",
                "0 0 12px rgba(52,211,153,0.9)",
                "0 0 4px rgba(52,211,153,0.4)",
              ]}}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            />
            <span className="font-mono text-[0.65rem] text-slate-300 tracking-widest">Disponível</span>
          </motion.div>

          {/* vídeo */}
          <div
            className="relative w-60 sm:w-[420px] aspect-square rounded-full
              overflow-hidden bg-slate-900 z-[2]"
            style={{ boxShadow: "0 0 60px rgba(56,189,248,0.08), 0 0 120px rgba(99,102,241,0.06)" }}
          >
            <video autoPlay loop muted playsInline className="w-full h-full object-cover object-left">
              <source src="/assets/img/Animacao_Portfolio.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-slate-950/50 to-transparent" />
          </div>
        </motion.div>

        {/* TEXTO */}
        <div className="flex flex-col items-center sm:items-start text-center sm:text-left max-w-lg">

          <motion.p variants={tagVariants} initial="hidden" animate="visible"
            className="font-mono text-[0.7rem] tracking-[0.3em] uppercase text-sky-400/80 mb-5">
            / portfólio pessoal
          </motion.p>

          <motion.p variants={greetingVariants} initial="hidden" animate="visible"
            className="text-slate-400/90 text-sm sm:text-base mb-2 font-mono leading-relaxed">
            Olá! Meu nome é{" "}
            <em className="not-italic font-semibold text-yellow-300/90">Ismael Moura</em>{" "}
            e
          </motion.p>

          <motion.h2 variants={titleVariants} initial="hidden" animate="visible"
            className="text-2xl sm:text-4xl font-extrabold text-slate-100 leading-tight mb-6">
            Eu sou&nbsp;
            <span ref={typedRef} className="text-secondary" />
            <motion.span className="text-secondary"
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut", delay: 1.4 }}
            >|</motion.span>
          </motion.h2>

          <motion.p variants={descVariants} initial="hidden" animate="visible"
            className="text-slate-400/80 text-sm sm:text-[0.95rem] leading-relaxed mb-8 max-w-md">
            Apaixonado por transformar ideias em interfaces{" "}
            <span className="text-slate-200/90 font-medium">acessíveis</span>,{" "}
            <span className="text-slate-200/90 font-medium">funcionais</span> e{" "}
            <span className="text-slate-200/90 font-medium">modernas</span>,
            com foco na experiência do usuário.
          </motion.p>

          <motion.a variants={ctaVariants} initial="hidden" animate="visible"
            href="/assets/docs/Curriculo_IsmaelMoura.pdf"
            download
            className="group inline-flex items-center gap-2.5
              bg-secondary/90 text-slate-900 font-bold
              px-7 py-3.5 rounded-xl mb-10
              transition-all duration-500
              hover:bg-secondary hover:shadow-[0_0_30px_rgba(56,189,248,0.25)]
              hover:scale-[1.03]"
          >
            <motion.svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
              animate={{ y: [0, 2, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <path d="M12 16l-4-4h3V4h2v8h3l-4 4z" />
              <path d="M4 20h16" />
            </motion.svg>
            Download do Currículo (PDF)
          </motion.a>

          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut", delay: 1.8 }}
            style={{ transformOrigin: "left" }}
            className="w-full h-px bg-gradient-to-r from-transparent via-white/8 to-transparent mb-6"
          />

          <motion.p variants={socialsVariants} initial="hidden" animate="visible"
            className="font-mono text-[0.65rem] tracking-[0.25em] uppercase text-yellow-300/70 mb-4">
            Redes Sociais
          </motion.p>

          <motion.div
            className="flex gap-3"
            initial="hidden"
            animate="visible"
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.12, delayChildren: 2.0 } } }}
          >
            {[
              { href: "https://github.com/Ismaelmourakeys", label: "GitHub",
                icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .5C5.73.5.5 5.74.5 12.02c0 5.1 3.29 9.43 7.86 10.96.58.11.79-.25.79-.56v-2.04c-3.2.7-3.87-1.54-3.87-1.54-.53-1.34-1.3-1.7-1.3-1.7-1.06-.73.08-.72.08-.72 1.17.08 1.78 1.2 1.78 1.2 1.04 1.78 2.73 1.27 3.4.97.11-.76.41-1.27.74-1.56-2.55-.29-5.23-1.28-5.23-5.7 0-1.26.45-2.29 1.19-3.1-.12-.3-.52-1.52.11-3.17 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.8 0c2.2-1.5 3.17-1.18 3.17-1.18.64 1.65.24 2.87.12 3.17.74.81 1.18 1.84 1.18 3.1 0 4.43-2.69 5.4-5.25 5.69.42.36.79 1.08.79 2.18v3.23c0 .31.21.67.8.56A11.53 11.53 0 0 0 23.5 12C23.5 5.74 18.27.5 12 .5z"/></svg> },
              { href: "https://www.instagram.com/ismaelmourakeys/", label: "Instagram",
                icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M7 2C4.24 2 2 4.24 2 7v10c0 2.76 2.24 5 5 5h10c2.76 0 5-2.24 5-5V7c0-2.76-2.24-5-5-5H7zm10 2c1.65 0 3 1.35 3 3v10c0 1.65-1.35 3-3 3H7c-1.65 0-3-1.35-3-3V7c0-1.65 1.35-3 3-3h10zm-5 3.5A5.5 5.5 0 1 0 17.5 13 5.51 5.51 0 0 0 12 7.5zm0 9A3.5 3.5 0 1 1 15.5 13 3.5 3.5 0 0 1 12 16.5zM18 6.5a1 1 0 1 0-1-1 1 1 0 0 0 1 1z"/></svg> },
              { href: "https://www.linkedin.com/in/Ismaelmourakeys", label: "LinkedIn",
                icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M4.98 3.5C4.98 4.88 3.88 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8h4v16h-4V8zm7.5 0h3.8v2.2h.05c.53-1 1.83-2.2 3.75-2.2 4 0 4.7 2.6 4.7 6v10h-4v-8.8c0-2.1 0-4.8-2.9-4.8s-3.3 2.3-3.3 4.6V24h-4V8z"/></svg> },
            ].map((social) => (
              <motion.a
                key={social.href}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                aria-label={social.label}
                variants={{
                  hidden: { opacity: 0, y: 10, scale: 0.8 },
                  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: [0.34, 1.56, 0.64, 1] } },
                }}
                className="flex items-center justify-center w-10 h-10 rounded-xl
                  bg-slate-900/60 border border-slate-700/40
                  text-slate-400 backdrop-blur-sm transition-all duration-500"
                whileHover={{
                  y: -4, color: "#38bdf8",
                  borderColor: "rgba(56,189,248,0.4)",
                  backgroundColor: "rgba(56,189,248,0.06)",
                  boxShadow: "0 8px 24px rgba(56,189,248,0.15)",
                }}
              >
                {social.icon}
              </motion.a>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}