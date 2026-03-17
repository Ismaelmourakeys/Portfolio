import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import ProjectCard from "./ProjectCard";
import SectionTitle from "./SectionTitle";

const PROJECTS = [
  {
    id: "mygluco-site",
    tag: "Site Page",
    tagColor: "text-sky-400 bg-sky-400/10 border-sky-400/25",
    title: "Website – MyGluco",
    description:
      "Landing page para o sistema MyGluco, com foco em usabilidade e experiência do usuário. Apresenta funcionalidades, benefícios e conscientização sobre diabetes.",
    liveUrl: "https://mygluco.vercel.app",
    imageSrc: "/assets/img/pagina_principal.png",
    videoSrc: null,
    githubUrl: "https://github.com/Ismaelmourakeys/SiteMygluco",
    techs: ["devicon-html5-plain", "devicon-tailwindcss-plain", "devicon-javascript-plain", "devicon-firebase-plain"],
    techDetails: [
      { icon: "devicon-html5-plain", label: "HTML" },
      { icon: "devicon-tailwindcss-plain", label: "Tailwind" },
      { icon: "devicon-javascript-plain", label: "JavaScript" },
      { icon: "devicon-firebase-plain", label: "Firebase" },
    ],
    detailsDescription: "Estrutura HTML, estilos com Tailwind via CDN, comportamento com JavaScript e backend/serviços com Firebase.",
  },
  {
    id: "mygluco-app",
    tag: "App Mobile",
    tagColor: "text-violet-400 bg-violet-400/10 border-violet-400/25",
    title: "Aplicativo Mobile – MyGluco",
    description:
      "App mobile para gestão de diabetes: monitore glicose, refeições, atividades e medicamentos com gráficos, relatórios e notificações personalizadas.",
    liveUrl: "https://github.com/Ismaelmourakeys/MyGlucoApp",
    imageSrc: null,
    videoSrc: "/assets/video/video_app.mp4",
    githubUrl: "https://github.com/Ismaelmourakeys/MyGlucoApp?tab=readme-ov-file",
    techs: ["devicon-react-original", "devicon-nodejs-plain", "devicon-firebase-plain", "devicon-figma-plain"],
    techDetails: [
      { icon: "devicon-reactnative-original", label: "React Native" },
      { icon: "devicon-nodejs-plain", label: "Node.js" },
      { icon: "devicon-npm-plain", label: "NPM" },
      { icon: "devicon-firebase-plain", label: "Firebase" },
      { icon: "devicon-expo-original", label: "Expo Go" },
      { icon: "devicon-figma-plain", label: "Figma" },
    ],
    detailsDescription: "React Native + Firebase para auth e dados. Node.js/NPM para dependências, Expo Go para testes e Figma para os primeiros designs.",
  },
  {
    id: "etec",
    tag: "Acadêmico",
    tagColor: "text-emerald-400 bg-emerald-400/10 border-emerald-400/25",
    title: "Projetos em Sala – ETEC",
    description:
      "Mix de projetos com foco em lógica de programação usando HTML, CSS e JS. Desenvolvidos na ETEC: listas de exercícios, sistemas de login e cadastro.",
    liveUrl: "/assets/Projetos_DoisBerto/Lista_exercicios.html",
    imageSrc: "/assets/img/Projetos_Sala.png",
    videoSrc: null,
    githubUrl: "https://github.com/Ismaelmourakeys/Projetos_DoisBerto",
    techs: ["devicon-html5-plain", "devicon-css3-plain", "devicon-javascript-plain"],
    techDetails: [
      { icon: "devicon-html5-plain", label: "HTML" },
      { icon: "devicon-css3-plain", label: "CSS" },
      { icon: "devicon-javascript-plain", label: "JavaScript" },
    ],
    detailsDescription: "Estrutura HTML, estilos CSS e comportamento JavaScript. Foco em lógica de programação, navegação entre páginas, login e armazenamento local.",
  },
  {
    id: "kivy-app",
    tag: "Projeto",
    tagColor: "text-blue-400 bg-blue-400/10 border-blue-400/25",
    title: "Aplicação Mobile com Python (Kivy)",
    description:
      "Sistema criado em Python, utilizando framework Kivy. O projeto inclui funcionalidades de login e uma pequena consulta de dados. Objetivo introdutório sobre como montar e estruturar um aplicativo mobile com bibliotecas, widgets, telas e navegação.",
    liveUrl: "https://github.com/Ismaelmourakeys/PythonKivy",
    imageSrc: null,
    videoSrc: "/assets/video/Aplicacao_kivy_py/Aplicacao_py_video.mp4",
    githubUrl: "https://github.com/Ismaelmourakeys/PythonKivy",
    techs: ["python", "kivy"],
    techDetails: [
      { icon: "python", label: "Python" },
      { icon: "kivy", label: "Kivy" },
    ],
    detailsDescription: "Python com framework Kivy para criação de interfaces móveis multiplataforma. Foco em lógica, navegação entre telas e widgets.",
  },
];

export default function Projects() {
  const [videoModalSrc, setVideoModalSrc] = useState(null);
  const modalVideoRef = useRef(null);
  const carouselRef = useRef(null);
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);

  // ── Refs para controle de touch manual
  const touchStartX = useRef(null);
  const touchStartY = useRef(null);
  const isSwiping = useRef(false);

  useEffect(() => {
    const update = () => setIsDesktop(window.innerWidth >= 768);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const cardsPerDot = isDesktop ? 2 : 1;
  const totalDots = Math.ceil(PROJECTS.length / cardsPerDot);
  const activeDotIndex = Math.floor(activeCardIndex / cardsPerDot);

  // ── Navega para um card específico pelo índice absoluto
  const scrollToCard = useCallback((cardIndex) => {
    const container = carouselRef.current;
    if (!container) return;

    const clamped = Math.max(0, Math.min(PROJECTS.length - 1, cardIndex));
    const cards = container.querySelectorAll(".project-card");
    const target = cards[clamped];
    if (!target) return;

    container.scrollTo({
      left: target.offsetLeft - container.offsetLeft,
      behavior: "smooth",
    });
    setActiveCardIndex(clamped);
  }, []);

  const scrollToDot = useCallback((dotIndex) => {
    scrollToCard(dotIndex * cardsPerDot);
  }, [scrollToCard, cardsPerDot]);

  const scrollPrev = () => scrollToDot(Math.max(0, activeDotIndex - 1));
  const scrollNext = () => scrollToDot(Math.min(totalDots - 1, activeDotIndex + 1));

  // ── IntersectionObserver para atualizar dot ativo no desktop
  useEffect(() => {
    const container = carouselRef.current;
    if (!container) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            const cards = Array.from(container.querySelectorAll(".project-card"));
            const index = cards.indexOf(entry.target);
            if (index !== -1) setActiveCardIndex(index);
          }
        });
      },
      { root: container, threshold: 0.5, rootMargin: "0px -40% 0px 0px" }
    );
    container.querySelectorAll(".project-card").forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, []);

  // ── Touch handlers: swipe controlado, 1 card por vez no mobile
  const handleTouchStart = useCallback((e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    isSwiping.current = false;
  }, []);

  const handleTouchMove = useCallback((e) => {
    if (touchStartX.current === null) return;

    const dx = e.touches[0].clientX - touchStartX.current;
    const dy = e.touches[0].clientY - touchStartY.current;

    // Movimento vertical dominante → scroll de página, não interfere
    if (!isSwiping.current && Math.abs(dy) > Math.abs(dx)) return;

    // Marca como swipe horizontal e bloqueia o scroll nativo do carrossel
    isSwiping.current = true;
    e.preventDefault();
  }, []);

  const handleTouchEnd = useCallback((e) => {
    if (touchStartX.current === null || !isSwiping.current) return;

    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const THRESHOLD = 40; // mínimo de pixels para considerar swipe

    if (Math.abs(dx) >= THRESHOLD) {
      if (dx < 0) {
        // swipe esquerda → próximo card
        scrollToCard(activeCardIndex + 1);
      } else {
        // swipe direita → card anterior
        scrollToCard(activeCardIndex - 1);
      }
    }

    touchStartX.current = null;
    touchStartY.current = null;
    isSwiping.current = false;
  }, [activeCardIndex, scrollToCard]);

  // Anexa touchmove com { passive: false } para poder usar preventDefault
  useEffect(() => {
    const container = carouselRef.current;
    if (!container) return;

    container.addEventListener("touchmove", handleTouchMove, { passive: false });
    return () => container.removeEventListener("touchmove", handleTouchMove);
  }, [handleTouchMove]);

  const openVideoModal = (src) => {
    setVideoModalSrc(src);
    setTimeout(() => modalVideoRef.current?.play(), 100);
  };

  const closeVideoModal = () => {
    modalVideoRef.current?.pause();
    setVideoModalSrc(null);
  };

  return (
    <section id="projetos" className="px-8 py-20">

      <SectionTitle
        tag="/ Trabalhos"
        title="Meus"
        highlight=" Projetos"
        subtitle="Confira alguns dos meus projetos de cursos e pessoais."
      />

      <motion.div
        className="relative group"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <button
          onClick={scrollPrev}
          disabled={activeDotIndex === 0}
          className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-5 z-20
            w-11 h-11 items-center justify-center rounded-full
            bg-slate-800 border border-slate-600 cursor-pointer
            text-slate-300 hover:text-secondary hover:border-secondary/50
            disabled:opacity-30 disabled:cursor-default disabled:hover:text-slate-300
            opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-xl"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        <button
          onClick={scrollNext}
          disabled={activeDotIndex === totalDots - 1}
          className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-5 z-20
            w-11 h-11 items-center justify-center rounded-full
            bg-slate-800 border border-slate-600 cursor-pointer
            text-slate-300 hover:text-secondary hover:border-secondary/50
            disabled:opacity-30 disabled:cursor-default disabled:hover:text-slate-300
            opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-xl"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>

        <div
          ref={carouselRef}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="grid grid-flow-col auto-cols-[88%] sm:auto-cols-[65%] md:auto-cols-[420px]
            gap-5 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4
            [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]
            px-1 items-stretch touch-pan-y"
        >
          {PROJECTS.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={{ ...project, onOpenVideo: openVideoModal }}
              index={index}
            />
          ))}
        </div>
      </motion.div>

      {/* DOTS */}
      <motion.div
        className="flex items-center justify-center gap-2 mt-6"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: false, amount: 0.1 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        {Array.from({ length: totalDots }).map((_, index) => (
          <button
            key={index}
            onClick={() => scrollToDot(index)}
            aria-label={`Ir para grupo ${index + 1}`}
            className={`transition-all duration-300 rounded-full
              ${index === activeDotIndex
                ? "w-8 h-2 bg-secondary cursor-default shadow-lg"
                : "w-2 h-2 bg-slate-600 hover:bg-slate-500 cursor-pointer"
              }`}
          />
        ))}
      </motion.div>

      {/* MODAL DE VÍDEO — portal para escapar de transforms do framer-motion */}
      {videoModalSrc && createPortal(
        <div
          onClick={closeVideoModal}
          style={{
            position: "fixed",
            top: 0, left: 0, right: 0, bottom: 0,
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
            backgroundColor: "rgba(0,0,0,0.8)",
            backdropFilter: "blur(8px)",
          }}
        >
          <div
            className="relative bg-slate-900 border border-white/10 rounded-2xl overflow-hidden w-full max-w-2xl shadow-2xl animate-popUp"
            style={{ maxHeight: "85vh" }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeVideoModal}
              className="absolute top-3 right-3 z-40 flex items-center gap-1.5
                font-mono text-xs text-slate-400 hover:text-slate-100 transition-colors duration-200"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
              fechar
            </button>
            <video
              ref={modalVideoRef}
              controls
              className="w-full h-auto bg-black max-h-[70vh]"
              playsInline
              src={videoModalSrc}
            />
          </div>
        </div>,
        document.body
      )}
    </section>
  );
}