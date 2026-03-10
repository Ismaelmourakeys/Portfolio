import { useState, useRef } from "react";
import ProjectCard from "./ProjectCard";

const icons = {
  python: `<svg viewBox="0 0 128 128" class="w-9 h-9">
<linearGradient id="python-original-a" gradientUnits="userSpaceOnUse" x1="70.252" y1="1237.476" x2="170.659" y2="1151.089" gradientTransform="matrix(.563 0 0 -.568 -29.215 707.817)"><stop offset="0" stop-color="#5A9FD4"></stop><stop offset="1" stop-color="#306998"></stop></linearGradient><linearGradient id="python-original-b" gradientUnits="userSpaceOnUse" x1="209.474" y1="1098.811" x2="173.62" y2="1149.537" gradientTransform="matrix(.563 0 0 -.568 -29.215 707.817)"><stop offset="0" stop-color="#FFD43B"></stop><stop offset="1" stop-color="#FFE873"></stop></linearGradient><path fill="url(#python-original-a)" d="M63.391 1.988c-4.222.02-8.252.379-11.8 1.007-10.45 1.846-12.346 5.71-12.346 12.837v9.411h24.693v3.137H29.977c-7.176 0-13.46 4.313-15.426 12.521-2.268 9.405-2.368 15.275 0 25.096 1.755 7.311 5.947 12.519 13.124 12.519h8.491V67.234c0-8.151 7.051-15.34 15.426-15.34h24.665c6.866 0 12.346-5.654 12.346-12.548V15.833c0-6.693-5.646-11.72-12.346-12.837-4.244-.706-8.645-1.027-12.866-1.008zM50.037 9.557c2.55 0 4.634 2.117 4.634 4.721 0 2.593-2.083 4.69-4.634 4.69-2.56 0-4.633-2.097-4.633-4.69-.001-2.604 2.073-4.721 4.633-4.721z" transform="translate(0 10.26)"></path><path fill="url(#python-original-b)" d="M91.682 28.38v10.966c0 8.5-7.208 15.655-15.426 15.655H51.591c-6.756 0-12.346 5.783-12.346 12.549v23.515c0 6.691 5.818 10.628 12.346 12.547 7.816 2.297 15.312 2.713 24.665 0 6.216-1.801 12.346-5.423 12.346-12.547v-9.412H63.938v-3.138h37.012c7.176 0 9.852-5.005 12.348-12.519 2.578-7.735 2.467-15.174 0-25.096-1.774-7.145-5.161-12.521-12.348-12.521h-9.268zM77.809 87.927c2.561 0 4.634 2.097 4.634 4.692 0 2.602-2.074 4.719-4.634 4.719-2.55 0-4.633-2.117-4.633-4.719 0-2.595 2.083-4.692 4.633-4.692z" transform="translate(0 10.26)"></path><radialGradient id="python-original-c" cx="1825.678" cy="444.45" r="26.743" gradientTransform="matrix(0 -.24 -1.055 0 532.979 557.576)" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#B8B8B8" stop-opacity=".498"></stop><stop offset="1" stop-color="#7F7F7F" stop-opacity="0"></stop></radialGradient><path opacity=".444" fill="url(#python-original-c)" d="M97.309 119.597c0 3.543-14.816 6.416-33.091 6.416-18.276 0-33.092-2.873-33.092-6.416 0-3.544 14.815-6.417 33.092-6.417 18.275 0 33.091 2.872 33.091 6.417z"></path>
</svg>`,

  kivy: `<div class="flex items-center justify-center">
                            <img src="./assets/icones/kivy-logo.svg" alt="Kivy" class="w-9 h-9 object-contain" />

                        </div>`
};

// ── DADOS DOS PROJETOS
// No React, é boa prática separar dados da estrutura visual
// Assim para adicionar um projeto novo, você só mexe nesse array — não no JSX
const PROJECTS = [
  {
    id: "mygluco-site",
    tag: "Site Page",
    // Classe de cor da tag — string de classes Tailwind passada como prop
    tagColor: "text-sky-400 bg-sky-400/10 border-sky-400/25",
    title: "Website – MyGluco",
    description:
      "Landing page para o sistema MyGluco, com foco em usabilidade e experiência do usuário. Apresenta funcionalidades, benefícios e conscientização sobre diabetes.",
    liveUrl: "https://mygluco.vercel.app",
    imageSrc: "/assets/img/pagina_principal.png",
    videoSrc: null, // null = sem vídeo, usa imagem
    githubUrl: "https://github.com/Ismaelmourakeys/SiteMygluco",
    techs: [
      "devicon-html5-plain",
      "devicon-tailwindcss-plain",
      "devicon-javascript-plain",
      "devicon-firebase-plain",
    ],
    techDetails: [
      { icon: "devicon-html5-plain", label: "HTML" },
      { icon: "devicon-tailwindcss-plain", label: "Tailwind" },
      { icon: "devicon-javascript-plain", label: "JavaScript" },
      { icon: "devicon-firebase-plain", label: "Firebase" },
    ],
    detailsDescription:
      "Estrutura HTML, estilos com Tailwind via CDN, comportamento com JavaScript e backend/serviços com Firebase.",
  },
  {
    id: "mygluco-app",
    tag: "App Mobile",
    tagColor: "text-violet-400 bg-violet-400/10 border-violet-400/25",
    title: "Aplicativo Mobile – MyGluco",
    description:
      "App mobile para gestão de diabetes: monitore glicose, refeições, atividades e medicamentos com gráficos, relatórios e notificações personalizadas.",
    liveUrl: null,
    imageSrc: null,
    videoSrc: "/assets/video/video_app.mp4", // tem vídeo — abre modal
    githubUrl: "https://github.com/Ismaelmourakeys/MyGlucoApp?tab=readme-ov-file",
    techs: [
      "devicon-react-original",
      "devicon-nodejs-plain",
      "devicon-firebase-plain",
      "devicon-figma-plain",
    ],
    techDetails: [
      { icon: "devicon-reactnative-original", label: "React Native" },
      { icon: "devicon-nodejs-plain", label: "Node.js" },
      { icon: "devicon-npm-plain", label: "NPM" },
      { icon: "devicon-firebase-plain", label: "Firebase" },
      { icon: "devicon-expo-original", label: "Expo Go" },
      { icon: "devicon-figma-plain", label: "Figma" },
    ],
    detailsDescription:
      "React Native + Firebase para auth e dados. Node.js/NPM para dependências, Expo Go para testes e Figma para os primeiros designs.",
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
    techs: [
      "devicon-html5-plain",
      "devicon-css3-plain",
      "devicon-javascript-plain",
    ],
    techDetails: [
      { icon: "devicon-html5-plain", label: "HTML" },
      { icon: "devicon-css3-plain", label: "CSS" },
      { icon: "devicon-javascript-plain", label: "JavaScript" },
    ],
    detailsDescription:
      "Estrutura HTML, estilos CSS e comportamento JavaScript. Foco em lógica de programação, navegação entre páginas, login e armazenamento local.",
  },
  {
    id: "etec",
    tag: "Projeto",
    tagColor: "text-blue-400 bg-blue-400/10 border-blue-400/25",
    title: "Aplicação Moblie com Python (Kivy)",
    description:
      "Sistema criado em python, utilizando framework Kivy. O projeto inclui funcionalidades de login e uma pequena consulta de dados. Esse projeto teve objetivo introdutório sobre como montar e estruturar um aplicativo mobile com bibliotecas, widgets, telas e navegação.",
    liveUrl: null,
    imageSrc: null,
    videoSrc: "assets/video/Aplicacao_kivy_py/Aplicacao_py_video.mp4",
    githubUrl: "https://github.com/Ismaelmourakeys/Projetos_DoisBerto",
    techDetails: [
      { icon: "python", label: "Python" },
      { icon: "kivy", label: "Kivy" },
    ],
    techs: ["python", "kivy"], // ícones pequenos no rodapé
    detailsDescription:
      "Estrutura HTML, estilos CSS e comportamento JavaScript. Foco em lógica de programação, navegação entre páginas, login e armazenamento local.",
  },
];

export default function Projects() {

  // ── ESTADO: src do vídeo aberto no modal (null = modal fechado)
  // Quando o usuário clica no card de vídeo, guardamos o src aqui e abrimos o modal
  const [videoModalSrc, setVideoModalSrc] = useState(null);

  // useRef no elemento <video> do modal para dar play/pause via código
  const modalVideoRef = useRef(null);

  // ── useRef no carrossel para controlar o scroll programaticamente
  const carouselRef = useRef(null);

  // ── Funções do carrossel
  // scrollBy move o scroll relativo à posição atual
  const scrollPrev = () => {
    carouselRef.current?.scrollBy({ left: -440, behavior: "smooth" });
  };
  const scrollNext = () => {
    carouselRef.current?.scrollBy({ left: 440, behavior: "smooth" });
  };

  // ── Abre o modal de vídeo
  // Esta função é passada como prop para cada ProjectCard
  const openVideoModal = (src) => {
    setVideoModalSrc(src);
    // Pequeno delay para o elemento aparecer no DOM antes de dar play
    setTimeout(() => {
      modalVideoRef.current?.play();
    }, 100);
  };

  // ── Fecha o modal de vídeo
  const closeVideoModal = () => {
    modalVideoRef.current?.pause();
    setVideoModalSrc(null);
  };

  return (
    <section id="projetos" className="px-8 py-20" data-animate="left">

      {/* ── cabeçalho da seção */}
      <div className="flex gap-3">
        <span className="w-8 h-8 rounded-lg bg-secondary/10 border border-secondary/30
          flex items-center justify-center">
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

      {/* ── CARROSSEL */}
      <div className="relative group">

        {/* botão anterior — usa o ref para scrollar */}
        <button
          onClick={scrollPrev}
          className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-5 z-20
            w-11 h-11 items-center justify-center rounded-full
            bg-slate-800 border border-slate-600
            text-slate-300 hover:text-secondary hover:border-secondary/50
            opacity-0 group-hover:opacity-100
            transition-all duration-300 shadow-xl"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        {/* botão próximo */}
        <button
          onClick={scrollNext}
          className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-5 z-20
            w-11 h-11 items-center justify-center rounded-full
            bg-slate-800 border border-slate-600
            text-slate-300 hover:text-secondary hover:border-secondary/50
            opacity-0 group-hover:opacity-100
            transition-all duration-300 shadow-xl"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>

        {/* grid/carrossel — ref={carouselRef} conecta ao useRef para controlar o scroll */}
        <div
          ref={carouselRef}
          className="grid grid-flow-col auto-cols-[88%] sm:auto-cols-[65%] md:auto-cols-[420px]
            gap-5 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4
            [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]
            px-1 items-stretch"
        >
          {/* map() transforma o array PROJECTS em cards JSX
              Passamos openVideoModal como prop para o ProjectCard poder abrir o modal */}
          {PROJECTS.map((project) => (
            <ProjectCard
              key={project.id}
              project={{ ...project, onOpenVideo: openVideoModal }}
            />
          ))}
        </div>
      </div>

      {/* ── MODAL DE VÍDEO
          Renderização condicional: só aparece quando videoModalSrc não é null */}
      {videoModalSrc && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fadeIn"
          // Clique no backdrop (fundo escuro) fecha o modal
          onClick={closeVideoModal}
        >
          {/* stopPropagation impede que o clique dentro do modal feche ele
              sem isso, clicar no vídeo fecharia o modal */}
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

            {/* ref={modalVideoRef} para poder dar play/pause via código */}
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