import { useEffect, useRef } from "react";
import Typed from "typed.js";
import { motion, useScroll, useTransform } from "framer-motion";

// ── Canvas de espaço sideral: estrelas piscando + cometas
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

    // ── Estrelas
    const stars = Array.from({ length: 260 }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: Math.random() * 1.4 + 0.2,
      speed: Math.random() * 0.006 + 0.001,
      phase: Math.random() * Math.PI * 2,
      color: Math.random() > 0.85
        ? `rgba(56,189,248,` // azul sky ocasional
        : Math.random() > 0.7
          ? `rgba(250,204,21,` // amarelo ocasional
          : `rgba(200,210,230,`, // branco/cinza maioria
    }));

    // ── Cometas
    class Comet {
      constructor() { this.reset(true); }

      reset(initial = false) {
        // começa fora da tela pelo canto superior esquerdo/superior direito
        this.x = Math.random() * canvas.width * 1.5 - canvas.width * 0.25;
        this.y = initial
          ? Math.random() * canvas.height * -1
          : -60;
        this.len = 80 + Math.random() * 120;
        this.speed = 4 + Math.random() * 5;
        this.angle = Math.PI / 4 + (Math.random() - 0.5) * 0.4; // ~45° ± 23°
        this.width = 0.8 + Math.random() * 1.4;
        this.opacity = 0.6 + Math.random() * 0.4;
        this.delay = initial ? Math.random() * 200 : 0; // frame delay
        this.active = !initial;
        this.timer = 0;
      }

      update() {
        if (!this.active) {
          this.timer++;
          if (this.timer >= this.delay) this.active = true;
          return;
        }
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;

        // sumiu da tela → reseta
        if (this.x > canvas.width + 100 || this.y > canvas.height + 100) {
          this.reset();
          // delay aleatório antes do próximo cometa
          this.delay = 80 + Math.random() * 300;
          this.active = false;
          this.timer = 0;
        }
      }

      draw() {
        if (!this.active) return;

        const tailX = this.x - Math.cos(this.angle) * this.len;
        const tailY = this.y - Math.sin(this.angle) * this.len;

        const grad = ctx.createLinearGradient(tailX, tailY, this.x, this.y);
        grad.addColorStop(0, `rgba(255,255,255,0)`);
        grad.addColorStop(0.6, `rgba(180,220,255,${this.opacity * 0.3})`);
        grad.addColorStop(1, `rgba(255,255,255,${this.opacity})`);

        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(this.x, this.y);
        ctx.strokeStyle = grad;
        ctx.lineWidth = this.width;
        ctx.lineCap = "round";
        ctx.stroke();

        // brilho na cabeça do cometa
        const glow = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.width * 3);
        glow.addColorStop(0, `rgba(200,230,255,${this.opacity})`);
        glow.addColorStop(1, `rgba(200,230,255,0)`);
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.width * 3, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();
      }
    }

    const comets = Array.from({ length: 6 }, () => new Comet());

    let raf;
    const draw = (t) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // estrelas piscando
      stars.forEach((s) => {
        const alpha = 0.15 + 0.85 * (0.5 + 0.5 * Math.sin(t * s.speed * 60 + s.phase));
        ctx.beginPath();
        ctx.arc(s.x * canvas.width, s.y * canvas.height, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `${s.color}${(alpha * 0.85).toFixed(2)})`;
        ctx.fill();
      });

      // cometas
      comets.forEach((c) => { c.update(); c.draw(); });

      raf = requestAnimationFrame(draw);
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
      className="absolute inset-0 w-full h-full"
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

  const videoY = useTransform(scrollYProgress, [0, 1], ["0px", "80px"]);

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
    },
  };

  useEffect(() => {
    const typed = new Typed(typedRef.current, {
      strings: ["Desenvolvedor", "UI Designer", "Estudante"],
      typeSpeed: 60,
      backSpeed: 40,
      backDelay: 1800,
      loop: true,
      showCursor: false,
    });
    return () => typed.destroy();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden px-6 py-24 sm:py-32 bg-slate-900"
    >
      {/* Canvas de espaço — substitui o grid quadriculado */}
      <SpaceCanvas />

      {/* glow orbs sutis por cima do canvas */}
      <div className="pointer-events-none absolute -top-40 -left-40 w-[520px] h-[520px]
        rounded-full bg-[radial-gradient(circle,rgba(56,189,248,0.07),transparent_65%)]
        animate-pulse2" />
      <div className="pointer-events-none absolute -bottom-40 -right-20 w-[400px] h-[400px]
        rounded-full bg-[radial-gradient(circle,rgba(250,204,21,0.05),transparent_65%)]
        animate-pulse2 [animation-delay:2s]" />

      {/* INNER */}
      <div className="relative z-10 max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-12 sm:gap-16">

        {/* VÍDEO com parallax */}
        <motion.div
          className="relative flex-shrink-0"
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          style={{ y: videoY }}
        >
          <div className="absolute -inset-4 rounded-full border border-sky-400/15 animate-floatY" />
          <div className="absolute -inset-2 rounded-full border border-dashed border-sky-400/10" />

          <motion.div
            className="absolute -top-3 -right-3 z-10
              flex items-center gap-1.5
              bg-slate-800 border border-sky-400/30 rounded-full
              px-3 py-1.5 shadow-lg shadow-black/40"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,.8)]" />
            <span className="font-mono text-[0.65rem] text-slate-300 tracking-widest">Disponível</span>
          </motion.div>

          <div className="relative w-60 sm:w-[420px] aspect-square rounded-full
            ring-1 ring-sky-400/20 shadow-[0_0_60px_rgba(56,189,248,0.12)]
            overflow-hidden bg-slate-800 animate-floatY">
            <video autoPlay loop muted playsInline className="w-full h-full object-cover object-left">
              <source src="/assets/img/Animacao_Portfolio.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-x-0 bottom-0 h-1/3
              bg-gradient-to-t from-slate-900/60 to-transparent" />
          </div>
        </motion.div>

        {/* TEXTO */}
        <motion.div
          className="flex flex-col items-center sm:items-start text-center sm:text-left max-w-lg"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.p variants={itemVariants}
            className="font-mono text-xs tracking-[0.25em] uppercase text-sky-400 mb-4">
            / portfólio pessoal
          </motion.p>

          <motion.p variants={itemVariants}
            className="text-slate-400 text-sm sm:text-base mb-2 font-mono">
            Olá! Meu nome é{" "}
            <em className="not-italic font-bold text-yellow-300">Ismael Moura</em>{" "}
            e
          </motion.p>

          <motion.h2 variants={itemVariants}
            className="font-arial text-2xl sm:text-4xl font-extrabold text-slate-100 leading-tight mb-6">
            Eu sou&nbsp;
            <span ref={typedRef} className="text-secondary" />
            <span className="text-secondary animate-blink">|</span>
          </motion.h2>

          <motion.p variants={itemVariants}
            className="text-slate-400 text-sm sm:text-[0.95rem] leading-relaxed mb-8 max-w-md">
            Apaixonado por transformar ideias em interfaces{" "}
            <span className="text-slate-200 font-semibold">acessíveis</span>,{" "}
            <span className="text-slate-200 font-semibold">funcionais</span> e{" "}
            <span className="text-slate-200 font-semibold">modernas</span>,
            com foco na experiência do usuário.
          </motion.p>

          <motion.a
            variants={itemVariants}
            href="/assets/docs/Curriculo_IsmaelMoura.pdf"
            download
            className="group inline-flex items-center gap-2
              bg-secondary text-slate-900 font-arial font-bold
              px-7 py-3.5 rounded-xl
              hover:brightness-110 hover:scale-105
              transition-all duration-300 shadow-lg shadow-sky-400/20 mb-10"
          >
            <svg className="w-4 h-4 group-hover:translate-y-0.5 transition-transform duration-200"
              viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 16l-4-4h3V4h2v8h3l-4 4z" />
              <path d="M4 20h16" />
            </svg>
            Download do Currículo (PDF)
          </motion.a>

          <motion.div variants={itemVariants} className="w-full border-t border-white/5 mb-6" />

          <motion.p variants={itemVariants}
            className="font-mono text-[0.7rem] tracking-[0.2em] uppercase text-yellow-300 mb-4">
            Redes Sociais:
          </motion.p>

          <motion.div variants={itemVariants} className="flex gap-4">
            {[
              {
                href: "https://github.com/Ismaelmourakeys",
                label: "GitHub",
                icon: (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 .5C5.73.5.5 5.74.5 12.02c0 5.1 3.29 9.43 7.86 10.96.58.11.79-.25.79-.56v-2.04c-3.2.7-3.87-1.54-3.87-1.54-.53-1.34-1.3-1.7-1.3-1.7-1.06-.73.08-.72.08-.72 1.17.08 1.78 1.2 1.78 1.2 1.04 1.78 2.73 1.27 3.4.97.11-.76.41-1.27.74-1.56-2.55-.29-5.23-1.28-5.23-5.7 0-1.26.45-2.29 1.19-3.1-.12-.3-.52-1.52.11-3.17 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.8 0c2.2-1.5 3.17-1.18 3.17-1.18.64 1.65.24 2.87.12 3.17.74.81 1.18 1.84 1.18 3.1 0 4.43-2.69 5.4-5.25 5.69.42.36.79 1.08.79 2.18v3.23c0 .31.21.67.8.56A11.53 11.53 0 0 0 23.5 12C23.5 5.74 18.27.5 12 .5z" />
                  </svg>
                ),
              },
              {
                href: "https://www.instagram.com/ismaelmourakeys/",
                label: "Instagram",
                icon: (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M7 2C4.24 2 2 4.24 2 7v10c0 2.76 2.24 5 5 5h10c2.76 0 5-2.24 5-5V7c0-2.76-2.24-5-5-5H7zm10 2c1.65 0 3 1.35 3 3v10c0 1.65-1.35 3-3 3H7c-1.65 0-3-1.35-3-3V7c0-1.65 1.35-3 3-3h10zm-5 3.5A5.5 5.5 0 1 0 17.5 13 5.51 5.51 0 0 0 12 7.5zm0 9A3.5 3.5 0 1 1 15.5 13 3.5 3.5 0 0 1 12 16.5zM18 6.5a1 1 0 1 0-1-1 1 1 0 0 0 1 1z" />
                  </svg>
                ),
              },
              {
                href: "https://www.linkedin.com/in/Ismaelmourakeys",
                label: "LinkedIn",
                icon: (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M4.98 3.5C4.98 4.88 3.88 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8h4v16h-4V8zm7.5 0h3.8v2.2h.05c.53-1 1.83-2.2 3.75-2.2 4 0 4.7 2.6 4.7 6v10h-4v-8.8c0-2.1 0-4.8-2.9-4.8s-3.3 2.3-3.3 4.6V24h-4V8z" />
                  </svg>
                ),
              },
            ].map((social) => (
              <a
                key={social.href}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                aria-label={social.label}
                className="group flex items-center justify-center w-10 h-10 rounded-xl
                  bg-slate-800 border border-slate-700/60
                  text-slate-400 hover:text-secondary
                  hover:border-sky-400/50 hover:bg-sky-400/10
                  hover:-translate-y-1 hover:shadow-lg hover:shadow-sky-400/10
                  transition-all duration-300"
              >
                {social.icon}
              </a>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}