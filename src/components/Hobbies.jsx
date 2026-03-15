import { useState, useEffect, useRef, useCallback } from "react";
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from "framer-motion";

const HOBBIES = [
  {
    id: "tecnologia",
    color: "sky",
    label: "aprendizado",
    title: "O que venho estudando atualmente?",
    description: "Sigo aprimorando minhas habilidades no desenvolvimento web com HTML, CSS (Tailwind), JavaScript e React, criando projetos para fortalecer minha lógica de programação.",
    tags: ["HTML", "CSS", "JavaScript", "React", "Vitejs", "Tailwind", "Node.js"],
    icon: (
      <svg className="w-5 h-5 text-sky-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="7" y="7" width="10" height="10" rx="1" />
        <path d="M7 9H4M7 12H4M7 15H4M17 9h3M17 12h3M17 15h3M9 7V4M12 7V4M15 7V4M9 17v3M12 17v3M15 17v3" />
      </svg>
    ),
    media: [
      { type: "image", src: "/assets/Hobbies/Estudo_React.png", caption: "Portfólio com React" },
      { type: "image", src: "/assets/Hobbies/Imagens_ProjetosSimples/Contador.png", caption: "Contador - Projeto simples para praticar designer e lógica de programação" },
      { type: "video", src: "/assets/Hobbies/Imagens_ProjetosSimples/Dark_mode.mp4", caption: "Projeto de Dark Mode - projeto simples para revisar conceitos"},
    ],
  },
  {
    id: "Farmácia",
    color: "violet",
    label: "experiência profissional",
    title: "Minha Jornada antes do código",
    description: "Após atuar como professor e músico, também tive uma experiência profissional na área da farmácia antes de iniciar minha jornada na programação.",
    tags: ["Farmácia", "Faculdade", "Laboratório", "Trabalho"],
    icon: (
      <svg className="w-5 h-5 text-violet-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 21V9" />
      </svg>
    ),
    media: [
      { type: "image", src: "/assets/Hobbies/Farmacia2.jpg", caption: "Farmácia" },
      { type: "image", src: "/assets/Hobbies/Farmacia.jpg", caption: "Laboratório" },
      { type: "image", src: "assets/Hobbies/Farmacia_Laboratorio.jpg", caption: "Farmácia Magistral" },
      { type: "image", src: "assets/Hobbies/Farmacia_Laboratorio2.jpg", caption: "Farmácia Magistral" },
    ],
  },
  /*
  {
    id: "projetos",
    color: "emerald",
    label: "projetos",
    title: "Construir projetos reais",
    description: "Do rascunho ao deploy — transformar ideias em projetos reais é o que mais me ensina.",
    tags: ["GitHub", "Vercel", "Firebase"],
    icon: (
      <svg className="w-5 h-5 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
      </svg>
    ),
    media: [
      { type: "image", src: "https://placehold.co/800x500/0f172a/34d399?text=MyGluco+App&font=syne", caption: "MyGluco App" },
      { type: "video", src: "", poster: "https://placehold.co/800x500/0f172a/10b981?text=▶+App+Demo&font=syne", caption: "Demonstração do app" },
      { type: "image", src: "https://placehold.co/800x500/0f172a/6ee7b7?text=Portfolio&font=syne", caption: "Portfólio" },
    ],
  },
  */
  {
    id: "musica",
    color: "yellow",
    label: "música",
    title: "Compartilhar minha paixão pela música",
    description: "Alguns lugares que já participei como músico, professor de música e marketing pessoal nas redes sociais.",
    tags: ["Músico", "Teclado", "Eventos", "Projetos", "Aulas",],
    icon: (
      <svg className="w-5 h-5 text-yellow-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" />
      </svg>
    ),
    media: [
      { type: "image", src: "/assets/Hobbies/igreja_advec2.jpg", caption: "Evento de igreja" },
      { type: "image", src: "/assets/Hobbies/culto_panoramica.jpg", caption: "Festividades" },
      { type: "image", src: "/assets/Hobbies/Escola_musica.png", caption: "Escola de música Opendoors" },
      { type: "image", src: "/assets/Hobbies/Aulas_Teclado.png", caption: "Aulas de teclado" },
      { type: "video", src: "/assets/Hobbies/Marketing_instagram.mp4", caption: "Marketing Pessoal" },
      { type: "video", src: "/assets/Hobbies/Nord.mp4", caption: "Tocando na igreja" },
    ],
  },


  {
    id: "ETEC",
    color: "pink",
    label: "Momentos na ETEC",
    title: "Minha experiências na ETEC",
    description: "Alguns momentos que marcaram minha jornada na ETEC, desde projetos acadêmicos até atividades extracurriculares.",

    tags: ["Apresentações", "Projetos", "Visitas técnicas", "Eventos", "Conquistas"],

    icon: (
      <svg className="w-5 h-5 text-pink-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M5 8l6 6M4 14l6-6 2-3M2 5h12M7 2h1" />
        <rect x="14" y="11" width="8" height="11" rx="1" />
        <path d="M18 11V7a4 4 0 0 0-4-4v0" />
      </svg>
    ),
    media: [
      { type: "image", src: "public/assets/Hobbies/VisitaAmazon.jfif", caption: "Visita à Amazon" },
      { type: "image", src: "public/assets/Hobbies/ApresentacaoEtec.jfif", caption: "Apresentação - semana de DS" },
      { type: "image", src: "public/assets/Hobbies/Fetesp.jfif", caption: "Visita à Fetesp" },
      { type: "image", src: "public/assets/Hobbies/ApresentacaoTCC.jfif", caption: "Apresentação de TCC" },
      { type: "image", src: "public/assets/Hobbies/TurmaETEC.jfif", caption: "Turma da ETEC 3°I" },
      { type: "image", src: "public/assets/Hobbies/Professor_design.jpg", caption: "Professor de Design - Antonio (Lobinho)" },
      { type: "image", src: "public/assets/Hobbies/ProfessorDom.jfif", caption: "Professor Alexandre Valezzi (Dom)" },
    ],
  },

];

const COLOR_MAP = {
  sky: { text: "text-sky-400", bg: "bg-sky-400/10", border: "border-sky-400/20", bar: "bg-sky-400/40", glow: "rgba(56,189,248,0.10)", glowHover: "rgba(56,189,248,0.18)" },
  violet: { text: "text-violet-400", bg: "bg-violet-400/10", border: "border-violet-400/20", bar: "bg-violet-400/40", glow: "rgba(139,92,246,0.10)", glowHover: "rgba(139,92,246,0.18)" },
  emerald: { text: "text-emerald-400", bg: "bg-emerald-400/10", border: "border-emerald-400/20", bar: "bg-emerald-400/40", glow: "rgba(52,211,153,0.10)", glowHover: "rgba(52,211,153,0.18)" },
  yellow: { text: "text-yellow-400", bg: "bg-yellow-400/10", border: "border-yellow-400/20", bar: "bg-yellow-400/40", glow: "rgba(250,204,21,0.10)", glowHover: "rgba(250,204,21,0.18)" },
  pink: { text: "text-pink-400", bg: "bg-pink-400/10", border: "border-pink-400/20", bar: "bg-pink-400/40", glow: "rgba(244,114,182,0.10)", glowHover: "rgba(244,114,182,0.18)" },
};

// ── Botão X flutuante — sempre visível, fora do fluxo da mídia
function CloseButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="fixed top-4 right-4 z-[10000] w-10 h-10 rounded-full
        bg-slate-800/95 border-2 border-slate-600
        flex items-center justify-center
        text-slate-300 hover:text-white hover:bg-slate-700 hover:border-secondary
        transition-all duration-200 shadow-2xl"
    >
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="M18 6L6 18M6 6l12 12" />
      </svg>
    </button>
  );
}

// ── Lightbox de imagem
function Lightbox({ src, caption, onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[9998] flex items-center justify-center p-6 bg-black/90 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        {/* X sempre no canto da tela, nunca coberto pela imagem */}
        <CloseButton onClick={onClose} />

        <motion.div
          className="flex flex-col items-center gap-3 max-w-5xl w-full"
          initial={{ scale: 0.92, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.92, opacity: 0 }}
          transition={{ ease: [0.16, 1, 0.3, 1], duration: 0.32 }}
          onClick={(e) => e.stopPropagation()}
        >
          <img
            src={src}
            alt={caption}
            className="max-w-full max-h-[85vh] w-auto rounded-2xl shadow-2xl object-contain"
          />
          {caption && (
            <p className="font-mono text-xs text-slate-400 tracking-widest text-center">
              {caption}
            </p>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ── Modal de vídeo
function VideoModal({ src, caption, onClose }) {
  const videoRef = useRef(null);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    // autoplay assim que montar
    setTimeout(() => videoRef.current?.play(), 100);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const handleClose = () => {
    videoRef.current?.pause();
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[9999] flex items-center justify-center p-6 bg-black/92 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleClose}
      >
        {/* X sempre no canto da tela */}
        <CloseButton onClick={handleClose} />

        <motion.div
          className="flex flex-col items-center gap-3 max-w-5xl w-full"
          initial={{ scale: 0.92, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.92, opacity: 0 }}
          transition={{ ease: [0.16, 1, 0.3, 1], duration: 0.32 }}
          onClick={(e) => e.stopPropagation()}
        >
          <video
            ref={videoRef}
            src={src}
            controls
            playsInline
            className="max-w-full max-h-[85vh] w-auto rounded-2xl shadow-2xl"
          />
          {caption && (
            <p className="font-mono text-xs text-slate-400 tracking-widest text-center">
              {caption}
            </p>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ── Thumbnail automática de vídeo via canvas
function VideoThumb({ src, className }) {
  const [thumb, setThumb] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!src) return;
    const video = document.createElement("video");
    video.src = src;
    video.crossOrigin = "anonymous";
    video.muted = true;
    video.playsInline = true;
    // busca o frame do segundo 0.5
    video.currentTime = 0.5;
    video.addEventListener("seeked", () => {
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth || 320;
      canvas.height = video.videoHeight || 180;
      canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);
      setThumb(canvas.toDataURL("image/jpeg", 0.8));
    }, { once: true });
    video.load();
  }, [src]);

  if (!thumb) {
    // fallback enquanto carrega
    return (
      <div className={`${className} bg-slate-900 flex items-center justify-center`}>
        <svg className="w-4 h-4 text-slate-600" viewBox="0 0 24 24" fill="currentColor">
          <path d="M8 5v14l11-7z" />
        </svg>
      </div>
    );
  }

  return <img src={thumb} alt="thumbnail" className={className} />;
}

// ── Player de mídia (foto ou vídeo) — no accordion
function MediaItem({ item, color }) {
  const c = COLOR_MAP[color];
  const [lightbox, setLightbox] = useState(false);
  const [videoModal, setVideoModal] = useState(false);

  if (item.type === "image") {
    return (
      <>
        <motion.div
          className="relative rounded-xl overflow-hidden cursor-zoom-in group/img bg-slate-950"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
          onClick={() => setLightbox(true)}
        >
          <img
            src={item.src}
            alt={item.caption}
            className="w-full object-contain max-h-[500px]"
          />
          {/* overlay zoom hint */}
          <div className="absolute inset-0 bg-black/0 group-hover/img:bg-black/20
            transition-all duration-300 flex items-center justify-center">
            <div className="opacity-0 group-hover/img:opacity-100 transition-opacity duration-300
              w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20
              flex items-center justify-center">
              <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35M11 8v6M8 11h6" />
              </svg>
            </div>
          </div>
          {item.caption && (
            <div className="absolute bottom-0 left-0 right-0 px-3 py-2
              bg-gradient-to-t from-slate-950/80 to-transparent">
              <p className={`font-mono text-[0.6rem] tracking-widest ${c.text}`}>{item.caption}</p>
            </div>
          )}
        </motion.div>
        {lightbox && (
          <Lightbox src={item.src} caption={item.caption} onClose={() => setLightbox(false)} />
        )}
      </>
    );
  }

  // ── vídeo
  return (
    <>
      <div className="relative rounded-xl overflow-hidden bg-slate-950 group/vid cursor-pointer"
        onClick={item.src ? () => setVideoModal(true) : undefined}
      >
        {/* thumbnail automática do vídeo */}
        {item.src ? (
          <VideoThumb src={item.src} className="w-full object-contain max-h-[500px]" />
        ) : (
          <img src={item.poster} alt={item.caption} className="w-full object-contain max-h-[500px] opacity-70" />
        )}

        {/* botão play centralizado */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover/vid:bg-black/30 transition-colors duration-200">
          <motion.div
            className={`w-14 h-14 rounded-full ${c.bg} border-2 ${c.border} backdrop-blur-sm
              flex items-center justify-center`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg className={`w-6 h-6 ${c.text} ml-0.5`} viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          </motion.div>
        </div>

        {/* badge VÍDEO */}
        <div className={`absolute top-2 right-2 ${c.bg} border ${c.border} rounded-full
          px-2 py-0.5 flex items-center gap-1`}>
          <span className={`w-1.5 h-1.5 rounded-full ${c.text.replace("text-", "bg-")} animate-pulse`} />
          <span className={`font-mono text-[0.55rem] tracking-widest ${c.text} uppercase`}>vídeo</span>
        </div>

        {item.caption && (
          <div className="absolute bottom-0 left-0 right-0 px-3 py-2
            bg-gradient-to-t from-slate-950/80 to-transparent">
            <p className={`font-mono text-[0.6rem] tracking-widest ${c.text}`}>{item.caption}</p>
          </div>
        )}
      </div>

      {videoModal && item.src && (
        <VideoModal src={item.src} caption={item.caption} onClose={() => setVideoModal(false)} />
      )}
    </>
  );
}

// ── Galeria de mídia com thumbnails
function MediaGallery({ media, color, isOpen }) {
  const [active, setActive] = useState(0);
  const c = COLOR_MAP[color];

  useEffect(() => { if (!isOpen) setActive(0); }, [isOpen]);

  const item = media[active];

  return (
    <div className="flex flex-col gap-3">
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
        >
          <MediaItem item={item} color={color} />
        </motion.div>
      </AnimatePresence>

      {media.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {media.map((m, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`relative flex-shrink-0 w-16 h-12 rounded-lg overflow-hidden
                border-2 transition-all duration-200 bg-slate-950
                ${i === active
                  ? `${c.border.replace("/20", "/70")} scale-105`
                  : "border-slate-700/40 opacity-60 hover:opacity-100"}`}
            >
              {/* thumbnail automática para vídeos na galeria */}
              {m.type === "video" && m.src ? (
                <VideoThumb src={m.src} className="w-full h-full object-cover" />
              ) : (
                <img
                  src={m.src || m.poster}
                  alt={m.caption}
                  className="w-full h-full object-cover"
                />
              )}
              {m.type === "video" && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Accordion individual
function HobbyAccordion({ hobby, index, isOpen, onToggle }) {
  const c = COLOR_MAP[hobby.color];
  const cardRef = useRef(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { stiffness: 150, damping: 20, mass: 0.5 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [3, -3]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-3, 3]), springConfig);
  const glowX = useTransform(mouseX, [-0.5, 0.5], ["0%", "100%"]);
  const glowY = useTransform(mouseY, [-0.5, 0.5], ["0%", "100%"]);
  const glowBackground = useTransform(
    [glowX, glowY],
    ([x, y]) => `radial-gradient(circle at ${x} ${y}, ${c.glow} 0%, transparent 65%)`
  );

  const handleMouseMove = useCallback((e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  }, [mouseX, mouseY]);

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0); mouseY.set(0);
  }, [mouseX, mouseY]);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: false, amount: 0.15 }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      animate={{ scale: isOpen ? 1.01 : 1 }}
      style={{ rotateX, rotateY, perspective: 1000 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ boxShadow: `0 16px 40px ${c.glowHover}, 0 4px 16px rgba(0,0,0,0.4)` }}
      className="group rounded-2xl border border-slate-700/60 bg-slate-900/50
        overflow-hidden transition-colors duration-300 hover:border-slate-600/80"
    >
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-2xl z-0
          opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: glowBackground }}
      />

      <button
        onClick={onToggle}
        className="relative z-10 w-full flex items-center gap-3 sm:gap-4 px-4 sm:px-5 py-3.5 sm:py-4 text-left"
      >
        <motion.div
          animate={isOpen ? { scale: [1, 1.15, 1] } : { scale: 1 }}
          transition={isOpen ? { duration: 0.4 } : {}}
          className={`flex-shrink-0 w-10 h-10 rounded-xl ${c.bg} border ${c.border}
            flex items-center justify-center`}
        >
          {hobby.icon}
        </motion.div>

        <div className="flex-1 min-w-0">
          <p className={`font-mono text-[0.58rem] ${c.text} tracking-widest uppercase mb-0.5`}>
            {hobby.label}
          </p>
          <h4 className="font-syne font-bold text-slate-100 text-sm sm:text-base leading-snug">
            {hobby.title}
          </h4>
        </div>

        <span className={`hidden sm:flex flex-shrink-0 items-center gap-1
          font-mono text-[0.6rem] ${c.text} ${c.bg} border ${c.border}
          px-2 py-0.5 rounded-full`}>
          <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 3v18" />
          </svg>
          {hobby.media.length}
        </span>

        <div className="flex-shrink-0 w-7 h-7 rounded-full border border-slate-600
          flex items-center justify-center text-slate-400
          group-hover:border-slate-500 group-hover:text-slate-300 transition-all duration-200">
          <motion.svg
            animate={{ rotate: isOpen ? 45 : 0 }}
            transition={{ duration: 0.25 }}
            className="w-3.5 h-3.5"
            viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
          >
            <path d="M12 5v14M5 12h14" />
          </motion.svg>
        </div>
      </button>

      <div className="px-4 sm:px-5 relative z-10">
        <div className={`h-px ${c.bar} rounded-full transition-opacity duration-300
          ${isOpen ? "opacity-100" : "opacity-30"}`} />
      </div>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden relative z-10"
          >
            <div className="px-4 sm:px-5 py-4 flex flex-col gap-5">
              <p className="text-slate-400 text-sm font-mono leading-relaxed">
                {hobby.description}
              </p>
              <MediaGallery media={hobby.media} color={hobby.color} isOpen={isOpen} />
              <div className="flex flex-wrap gap-2">
                {hobby.tags.map((tag) => (
                  <span key={tag}
                    className={`font-mono text-[0.62rem] ${c.text} ${c.bg} border ${c.border}
                      px-2.5 py-1 rounded-full`}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function Hobbies() {
  const [openId, setOpenId] = useState("tecnologia");
  const toggle = (id) => setOpenId((prev) => (prev === id ? null : id));

  const openIndex = HOBBIES.findIndex((h) => h.id === openId);
  const progress = openIndex >= 0 ? Math.round(((openIndex + 1) / HOBBIES.length) * 100) : 0;

  return (
    <section id="hobbies" className="relative px-6 sm:px-8 pt-16 sm:pt-20 pb-12 overflow-hidden bg-slate-800">

      <div className="pointer-events-none absolute -bottom-40 -right-40 w-[500px] h-[500px]
        bg-[radial-gradient(circle,rgba(56,189,248,0.06),transparent_70%)]" />

      <div className="relative z-10 max-w-6xl mx-auto">

        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex items-center gap-3 mb-3">
            <span className="w-8 h-8 rounded-lg bg-secondary/10 border border-secondary/30
              flex items-center justify-center flex-shrink-0">
              <span className="font-mono text-secondary text-xs font-bold">&lt;/&gt;</span>
            </span>
            <p className="font-mono text-xs tracking-[0.25em] uppercase text-secondary">
              / Conheça-me melhor
            </p>
          </div>
          <h3 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-100 leading-tight mb-3">
            Minhas <span className="text-secondary">Experiências</span>
          </h3>
          <p className="font-mono text-sm text-slate-500 mb-10 lg:mb-12">
            Além do código, algumas coisas que movem meu dia a dia.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_200px] gap-8 lg:gap-12 items-start">

          <div className="flex flex-col gap-3">
            {HOBBIES.map((hobby, index) => (
              <HobbyAccordion
                key={hobby.id}
                hobby={hobby}
                index={index}
                isOpen={openId === hobby.id}
                onToggle={() => toggle(hobby.id)}
              />
            ))}
          </div>

          <div className="hidden lg:flex flex-col gap-6 lg:sticky lg:top-8">
            <motion.div
              className="flex flex-col gap-3"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <p className="font-mono text-[0.65rem] text-slate-500 tracking-widest uppercase">
                Clique para explorar
              </p>
              <div className="relative h-1 bg-slate-700/30 rounded-full overflow-hidden">
                <motion.div
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-sky-400 to-violet-400 rounded-full"
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              </div>
              <p className="font-mono text-xs text-slate-600">{progress}% explorado</p>

              <div className="mt-4 flex flex-col gap-2">
                <p className="font-mono text-[0.6rem] text-slate-600 tracking-widest uppercase">Tipos de mídia</p>
                <div className="flex items-center gap-2">
                  <svg className="w-3 h-3 text-slate-500 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" />
                  </svg>
                  <span className="font-mono text-[0.65rem] text-slate-500">foto — clique p/ ampliar</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-3 h-3 text-slate-500 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                  <span className="font-mono text-[0.65rem] text-slate-500">vídeo — clique p/ reproduzir</span>
                </div>
                <p className="font-mono text-[0.6rem] text-slate-600 mt-1">ESC para fechar</p>
              </div>
            </motion.div>
          </div>
        </div>

        <div className="lg:hidden mt-8 flex flex-col gap-3">
          <p className="font-mono text-[0.65rem] text-slate-500 tracking-widest uppercase">
            Progresso da exploração
          </p>
          <div className="relative h-1 bg-slate-700/30 rounded-full overflow-hidden">
            <motion.div
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-sky-400 to-violet-400 rounded-full"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
          <p className="font-mono text-xs text-slate-600 text-center">{progress}% explorado</p>
        </div>
      </div>
    </section>
  );
}