import { useState, useRef, useMemo } from "react";
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next"; // ← importa o hook de tradução
import TechIcon from "./TechIcon";


const isMobile = () =>
  typeof window !== "undefined" && window.matchMedia("(max-width: 768px)").matches;


function CardStars({ count = 18 }) {
  const stars = useMemo(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i, x: Math.random() * 100, y: Math.random() * 100,
      r: Math.random() * 1.2 + 0.3, dur: 1.8 + Math.random() * 2.5, delay: Math.random() * 3,
    })), []
  );

  return (
    <svg className="pointer-events-none absolute inset-0 w-full h-full z-0 opacity-0
      group-hover/card:opacity-100 transition-opacity duration-500 hidden md:block"
      xmlns="http://www.w3.org/2000/svg">
      {stars.map((s) => (
        <circle key={s.id} cx={`${s.x}%`} cy={`${s.y}%`} r={s.r} fill="white">
          <animate attributeName="opacity" values="0;0.7;0" dur={`${s.dur}s`} begin={`${s.delay}s`} repeatCount="indefinite" />
        </circle>
      ))}
    </svg>
  );
}


function CosmicParticles() {
  const particles = useMemo(() =>
    Array.from({ length: 8 }, (_, i) => {
      const angle = (360 / 8) * i;
      const colors = ["#38bdf8", "#818cf8", "#34d399", "#a78bfa", "#f472b6"];
      return { id: i, angle, color: colors[i % colors.length], size: 1.5 + Math.random() * 2, dist: 60 + Math.random() * 30, dur: 2 + Math.random() * 1.5, delay: Math.random() * 1 };
    }), []
  );
  
  return (
    <div className="pointer-events-none absolute inset-0 z-0 opacity-0
      group-hover/card:opacity-100 transition-opacity duration-500 overflow-hidden hidden md:block">
      {particles.map((p) => (
        <motion.div key={p.id} className="absolute rounded-full"
          style={{ width: p.size, height: p.size, background: p.color, boxShadow: `0 0 ${p.size * 3}px ${p.color}`, top: "50%", left: "50%" }}
          animate={{ x: [0, Math.cos((p.angle * Math.PI) / 180) * p.dist, 0], y: [0, Math.sin((p.angle * Math.PI) / 180) * p.dist, 0], opacity: [0, 0.9, 0] }}
          transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

export default function ProjectCard({ project, index = 0 }) {
  // ── Hook de tradução — textos fixos da UI do card
  const { t } = useTranslation();

  const [showDetails, setShowDetails] = useState(false);
  const mobile = useMemo(() => isMobile(), []);

  const cardRef = useRef(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { stiffness: 120, damping: 18, mass: 0.6 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], mobile ? [0, 0] : [0, -0]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], mobile ? [0, 0] : [-0, 0]), springConfig);

  const glowX = useTransform(mouseX, [-0.5, 0.5], ["0%", "100%"]);
  const glowY = useTransform(mouseY, [-0.5, 0.5], ["0%", "100%"]);
  const glowBackground = useTransform([glowX, glowY],
    ([x, y]) => `radial-gradient(circle at ${x} ${y}, rgba(56,189,248,0.13) 0%, rgba(139,92,246,0.06) 50%, transparent 70%)`
  );

  const handleMouseMove = mobile ? undefined : (e) => {
    const card = cardRef.current; if (!card) return;
    const rect = card.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const handleMouseLeave = mobile ? undefined : () => { mouseX.set(0); mouseY.set(0); };

  const entryDelay = index * 0.1;
  const entryInitial = mobile ? { opacity: 0, y: 20 } : { opacity: 0, y: -50, scale: 0.85 };
  const entryAnimate = mobile ? { opacity: 1, y: 0 } : { opacity: 1, y: 0, scale: 1 };
  const entryTransition = mobile
    ? { duration: 0.45, delay: entryDelay, ease: [0.16, 1, 0.3, 1] }
    : { duration: 0.9, delay: entryDelay, ease: [0.34, 1.56, 0.64, 1] };

  return (
    <motion.div
      ref={cardRef}
      className="project-card group/card relative flex flex-col
        bg-gradient-to-br from-slate-800/90 to-slate-900/95
        border border-slate-700/50 rounded-2xl overflow-hidden
        shadow-[0_8px_32px_rgba(0,0,0,0.5)] transition-colors duration-300 snap-start"
      initial={entryInitial} whileInView={entryAnimate}
      viewport={{ once: mobile ? true : false, amount: 0.15 }}
      transition={entryTransition}
      style={{ rotateX, rotateY, perspective: mobile ? "none" : 1000, touchAction: mobile ? "pan-y" : "auto" }}
      onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}
      whileHover={mobile ? {} : {
        boxShadow: "0 0 40px rgba(56,189,248,0.18), 0 0 80px rgba(139,92,246,0.08), 0 20px 50px rgba(0,0,0,0.5)",
        borderColor: "rgba(56,189,248,0.40)",
      }}
    >
      <CardStars count={20} />
      <CosmicParticles />

      <motion.div className="pointer-events-none absolute inset-0 rounded-2xl z-[1]
        opacity-0 group-hover/card:opacity-100 transition-opacity duration-400 hidden md:block"
        style={{ background: glowBackground }} />

      <motion.div className="h-px w-full relative z-[2]"
        style={{ background: "linear-gradient(90deg, transparent, rgba(56,189,248,0.6), rgba(139,92,246,0.4), transparent)" }}
        animate={{ opacity: [0.3, 0.8, 0.3] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: entryDelay }} />

      <div className="conteudo resumo flex flex-col flex-1 p-6 relative z-[2]">
  
        <div className="flex items-start justify-between gap-3 mb-3">
          {/* project.tag não muda entre idiomas (Site Page, App Mobile, etc.) */}
          <span className={`font-mono text-[0.65rem] tracking-widest uppercase px-2.5 py-1 rounded-full border ${project.tagColor}`}>
            {project.tag}
          </span>
  
          {project.liveUrl && (
            <a href={project.liveUrl} target="_blank" rel="noreferrer" className="text-slate-500 hover:text-secondary transition-colors duration-200">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </a>
          )}
        </div>

        {/* project.title e project.description vêm do PROJECTS_DATA[lang] em Projects.jsx */}
        <h4 className="font-syne text-lg font-bold text-yellow-300 mb-3">{project.title}</h4>
        <p className="text-slate-400 text-sm leading-relaxed mb-4 flex-1">{project.description}</p>

        {project.videoSrc ? (
          <div className="relative w-full h-40 rounded-xl overflow-hidden ring-1 ring-white/8 cursor-pointer group/video"
            onClick={() => project.onOpenVideo(project.videoSrc)}>
            <video className="absolute inset-0 w-full h-full object-cover" preload="metadata" muted playsInline>
              <source src={project.videoSrc} type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-black/40 group-hover/video:bg-black/55 transition-colors duration-300 flex items-center justify-center">
              <div className="flex items-center justify-center w-14 h-14 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm group-hover/video:bg-white/20 group-hover/video:scale-110 transition-all duration-300">
                <svg className="w-6 h-6 text-white ml-1" viewBox="0 0 24 24" fill="currentColor"><path d="M5 3v18l15-9L5 3z" /></svg>
              </div>
            </div>
            {/* t("projects.video_label") não existe no JSON — texto fixo simples */}
            <span className="absolute bottom-2 left-2 font-mono text-[0.65rem] tracking-wider bg-black/60 text-slate-300 px-2 py-1 rounded-md">
              Ver vídeo
            </span>
          </div>
        ) : (
          <a href={project.liveUrl} target="_blank" rel="noreferrer" className="block">
            <div className="relative w-full h-40 rounded-xl overflow-hidden ring-1 ring-white/8">
              <img src={project.imageSrc} alt={`Preview ${project.title}`}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
            </div>
          </a>
        )}
      </div>

      <div className="relative z-[2] flex items-center justify-between px-6 py-4 border-t border-white/5">
        <div className="flex gap-2">
          {project.techs.map((tech) => (
            <TechIcon key={tech} icon={tech} className="text-base" size="w-5 h-5" />
          ))}
        </div>
        {/* t("projects.details") → "Detalhes" / "Details" / "Detalles" */}
        <button onClick={() => setShowDetails(true)}
          className="font-mono text-xs text-secondary tracking-widest hover:text-sky-300 transition-colors duration-200 flex items-center gap-1 cursor-pointer">
          {t("projects.details")}
          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <AnimatePresence>
        {showDetails && (
          <motion.div
            className="absolute inset-0 bg-slate-900/96 backdrop-blur-md rounded-2xl p-6 flex flex-col items-center justify-center text-center gap-4 z-30 overflow-y-auto"
            initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* t("projects.close") → "fechar" / "close" / "cerrar" */}
            <button onClick={() => setShowDetails(false)}
              className="absolute top-4 right-4 flex items-center gap-1.5 font-mono text-xs text-slate-400 hover:text-slate-100 transition-colors duration-200 cursor-pointer">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
              {t("projects.close")}
            </button>

            {/* t("projects.tools") → "Ferramentas utilizadas" / "Tools used" / "Herramientas utilizadas" */}
            <p className="font-mono text-xs tracking-widest uppercase text-secondary">
              {t("projects.tools")}
            </p>
            <h4 className="font-syne text-xl font-bold text-yellow-300">{project.title}</h4>

            <div className="w-full max-w-md grid grid-cols-2 sm:grid-cols-4 gap-3">
              {project.techDetails.map((tech) => (
                <div key={tech.label} className="flex flex-col items-center justify-center gap-2 bg-white/5 rounded-lg py-3 px-2">
                  <TechIcon icon={tech.icon} />
                  <span className="text-xs text-slate-200">{tech.label}</span>
                </div>
              ))}
            </div>

            {/* project.detailsDescription vem traduzido do PROJECTS_DATA[lang] */}
            <p className="text-slate-400 text-xs leading-relaxed max-w-xs">
              {project.detailsDescription}
            </p>

            {/* t("projects.github") → "GitHub do projeto" / "Project on GitHub" / "Proyecto en GitHub" */}
            <a href={project.githubUrl} target="_blank" rel="noreferrer"
              className="inline-flex items-center gap-2 bg-secondary text-slate-900 font-syne font-bold text-sm px-5 py-2.5 rounded-xl hover:brightness-110 hover:scale-105 transition-all duration-300">
              <i className="devicon-github-original text-xl" />
              {t("projects.github")}
            </a>

            <button onClick={() => setShowDetails(false)}
              className="font-mono text-xs text-slate-500 hover:text-secondary transition-colors cursor-pointer">
              {t("projects.close")} ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}