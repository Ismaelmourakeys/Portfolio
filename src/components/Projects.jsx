import { useState, useRef, useEffect } from "react";
import ProjectCard from "./ProjectCard";

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

  // activeCardIndex rastreia qual CARD está ativo (0 a 3)
  // Assim os dots são calculados a partir disso, sem lógica separada
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);

  // Detecta se é desktop (>= 768px)
  useEffect(() => {
    const update = () => setIsDesktop(window.innerWidth >= 768);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // No desktop: 1 dot por par → dots 0 e 1 (cards 0-1 e cards 2-3)
  // No mobile:  1 dot por card → dots 0, 1, 2, 3
  const cardsPerDot = isDesktop ? 2 : 1;
  const totalDots = Math.ceil(PROJECTS.length / cardsPerDot);

  // Dot ativo = qual grupo o card atual pertence
  const activeDotIndex = Math.floor(activeCardIndex / cardsPerDot);

  // Rola o carrossel até o primeiro card do dot clicado
  const scrollToDot = (dotIndex) => {
    const container = carouselRef.current;
    if (!container) return;

    const cards = container.querySelectorAll(".project-card");
    const targetCardIndex = dotIndex * cardsPerDot;
    const targetCard = cards[targetCardIndex];
    if (!targetCard) return;

    // scrollLeft do card relativo ao container
    container.scrollTo({
      left: targetCard.offsetLeft - container.offsetLeft,
      behavior: "smooth",
    });

    // Atualiza o card ativo imediatamente para feedback visual rápido
    setActiveCardIndex(targetCardIndex);
  };

  const scrollPrev = () => {
    const prevDot = Math.max(0, activeDotIndex - 1);
    scrollToDot(prevDot);
  };

  const scrollNext = () => {
    const nextDot = Math.min(totalDots - 1, activeDotIndex + 1);
    scrollToDot(nextDot);
  };

  // Atualiza activeCardIndex conforme o usuário arrasta
  // Usa IntersectionObserver para precisão — mais confiável que calcular por scrollLeft
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
      {
        root: container,
        threshold: 0.5, // card precisa estar 50% visível para ser considerado "ativo"
        rootMargin: "0px -40% 0px 0px", // ← ignora metade direita, só detecta o card mais à esquerda
      }
    );

    const cards = container.querySelectorAll(".project-card");
    cards.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, []);

  const openVideoModal = (src) => {
    setVideoModalSrc(src);
    setTimeout(() => modalVideoRef.current?.play(), 100);
  };

  const closeVideoModal = () => {
    modalVideoRef.current?.pause();
    setVideoModalSrc(null);
  };

  return (
    <section id="projetos" className="px-8 py-20" data-animate="left">

      {/* cabeçalho */}
      <div className="flex gap-3">
        <span className="w-8 h-8 rounded-lg bg-secondary/10 border border-secondary/30 flex items-center justify-center">
          <span className="font-mono text-secondary text-xs font-bold">&lt;/&gt;</span>
        </span>
        <p className="font-mono text-xs tracking-[0.25em] uppercase text-secondary mb-2">
          / Trabalhos
        </p>
      </div>

      <h3 className="font-arial text-4xl sm:text-5xl font-extrabold text-slate-100 leading-tight m-4">
        Meus<span className="text-secondary"> Projetos</span>
      </h3>

      <p className="font-mono text-sm text-slate-500 mb-12" data-animate="up">
        Confira alguns dos meus projetos de cursos e pessoais.
      </p>

      {/* CARROSSEL */}
      <div className="relative group">

        {/* botão anterior */}
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

        {/* botão próximo */}
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

        {/* carrossel */}
        <div
          ref={carouselRef}
          className="grid grid-flow-col auto-cols-[88%] sm:auto-cols-[65%] md:auto-cols-[420px]
            gap-5 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4
            [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]
            px-1 items-stretch"
        >
          {PROJECTS.map((project) => (
            <ProjectCard
              key={project.id}
              project={{ ...project, onOpenVideo: openVideoModal }}
            />
          ))}
        </div>
      </div>

      {/* DOTS — pill animado */}
      <div className="flex items-center justify-center gap-2 mt-6">
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
      </div>

      {/* MODAL DE VÍDEO */}
      {videoModalSrc && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fadeIn"
          onClick={closeVideoModal}
        >
          <div
            className="relative bg-slate-900 border border-white/10 rounded-2xl overflow-hidden
              w-full max-w-2xl shadow-2xl animate-popUp"
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
        </div>
      )}
    </section>
  );
}