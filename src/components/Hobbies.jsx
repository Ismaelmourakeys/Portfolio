// Este componente usa os 3 hooks juntos: useState, useEffect e useRef
// É o mais complexo da migração — accordion + slideshow com autoplay por timer

import { useState, useEffect, useRef } from "react";

// ── DADOS DOS HOBBIES
// Cada item tem: id, cor, ícone SVG, label, título, descrição, slides e tags
const HOBBIES = [
  {
    id: "tecnologia",
    color: "sky",
    label: "aprendizado",
    title: "Estudar novas tecnologias",
    description: "Sempre explorando frameworks, linguagens e ferramentas. Cada descoberta abre novas possibilidades.",
    interval: 3000,
    slides: [
      "https://placehold.co/600x280/0f172a/38bdf8?text=React+Study&font=syne",
      "https://placehold.co/600x280/0f172a/818cf8?text=Tailwind+CSS&font=syne",
      "https://placehold.co/600x280/0f172a/34d399?text=Node.js&font=syne",
    ],
    tags: ["React", "Tailwind", "Python", "Node.js"],
    icon: (
      <svg className="w-5 h-5 text-sky-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="7" y="7" width="10" height="10" rx="1" />
        <path d="M7 9H4M7 12H4M7 15H4M17 9h3M17 12h3M17 15h3M9 7V4M12 7V4M15 7V4M9 17v3M12 17v3M15 17v3" />
      </svg>
    ),
  },
  {
    id: "ui",
    color: "violet",
    label: "UI / UX",
    title: "Praticar desenvolvimento de interfaces",
    description: "Criar interfaces acessiveis, bonitas e funcionais. Design e codigo andam sempre juntos.",
    interval: 2800,
    slides: [
      "https://placehold.co/600x280/0f172a/818cf8?text=Figma+Design&font=syne",
      "https://placehold.co/600x280/0f172a/a78bfa?text=Tailwind+UI&font=syne",
      "https://placehold.co/600x280/0f172a/7c3aed?text=Components&font=syne",
    ],
    tags: ["Figma", "Tailwind", "React"],
    icon: (
      <svg className="w-5 h-5 text-violet-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 21V9" />
      </svg>
    ),
  },
  {
    id: "projetos",
    color: "emerald",
    label: "projetos",
    title: "Construir projetos reais",
    description: "Do rascunho ao deploy - transformar ideias em projetos reais e o que mais me ensina.",
    interval: 2500,
    slides: [
      "https://placehold.co/600x280/0f172a/34d399?text=MyGluco+App&font=syne",
      "https://placehold.co/600x280/0f172a/10b981?text=Landing+Page&font=syne",
      "https://placehold.co/600x280/0f172a/6ee7b7?text=Portfolio&font=syne",
      "https://placehold.co/600x280/0f172a/a7f3d0?text=ETEC+Projects&font=syne",
    ],
    tags: ["GitHub", "Vercel", "Firebase"],
    icon: (
      <svg className="w-5 h-5 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    id: "musica",
    color: "yellow",
    label: "musica",
    title: "Ouvir e estudar musica",
    description: "Musico de coracao. Toco em igrejas e eventos - a musica me acompanha em tudo.",
    interval: 3200,
    slides: [
      "https://placehold.co/600x280/0f172a/facc15?text=Teclado&font=syne",
      "https://placehold.co/600x280/0f172a/fbbf24?text=Igreja+%26+Eventos&font=syne",
    ],
    tags: ["Teclado", "Teoria musical"],
    icon: (
      <svg className="w-5 h-5 text-yellow-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" />
      </svg>
    ),
  },
  {
    id: "ingles",
    color: "pink",
    label: "idiomas",
    title: "Aprender ingles",
    description: "Estudando ingles para acessar conteudos tecnicos na fonte e me preparar para o mercado internacional.",
    interval: 3000,
    slides: [
      "https://placehold.co/600x280/0f172a/f472b6?text=FluencyPass&font=syne",
      "https://placehold.co/600x280/0f172a/ec4899?text=Wizard&font=syne",
      "https://placehold.co/600x280/0f172a/db2777?text=Duolingo&font=syne",
    ],
    tags: ["FluencyPass", "Wizard", "Duolingo"],
    icon: (
      <svg className="w-5 h-5 text-pink-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M5 8l6 6M4 14l6-6 2-3M2 5h12M7 2h1" />
        <rect x="14" y="11" width="8" height="11" rx="1" />
        <path d="M18 11V7a4 4 0 0 0-4-4v0" />
      </svg>
    ),
  },
];

// Mapa de cores por tema — centraliza as classes Tailwind por cor
// Assim não precisamos de if/else espalhados pelo JSX
const COLOR_MAP = {
  sky: { text: "text-sky-400", bg: "bg-sky-400/10", border: "border-sky-400/20", bar: "bg-sky-400/40", dot: "bg-sky-400" },
  violet: { text: "text-violet-400", bg: "bg-violet-400/10", border: "border-violet-400/20", bar: "bg-violet-400/40", dot: "bg-violet-400" },
  emerald: { text: "text-emerald-400", bg: "bg-emerald-400/10", border: "border-emerald-400/20", bar: "bg-emerald-400/40", dot: "bg-emerald-400" },
  yellow: { text: "text-yellow-400", bg: "bg-yellow-400/10", border: "border-yellow-400/20", bar: "bg-yellow-400/40", dot: "bg-yellow-400" },
  pink: { text: "text-pink-400", bg: "bg-pink-400/10", border: "border-pink-400/20", bar: "bg-pink-400/40", dot: "bg-pink-400" },
};

// ── COMPONENTE SLIDESHOW
// Componente filho separado — cada accordion tem o seu próprio slideshow
// Isso isola o estado e o timer de cada um
function Slideshow({ slides, interval, isOpen }) {

  // Estado do slide atual — índice do array slides[]
  const [current, setCurrent] = useState(0);

  // useEffect para o autoplay: inicia o timer quando o accordion abre, para quando fecha
  // O array de dependências [isOpen, slides, interval] faz o effect rodar toda vez
  // que qualquer um desses valores mudar
  useEffect(() => {
    // Se o accordion estiver fechado, não roda o timer
    if (!isOpen) return;

    // setInterval: avança para o próximo slide a cada X ms
    // O % slides.length faz o índice voltar para 0 depois do último slide (loop)
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, interval);

    // Cleanup: limpa o timer quando o accordion fechar ou o componente desmontar
    // Sem isso, múltiplos timers se acumulariam causando bugs
    return () => clearInterval(timer);
  }, [isOpen, slides.length, interval]);

  return (
    <div className="relative w-full h-44 rounded-xl overflow-hidden bg-slate-950">

      {/* Renderiza todos os slides, mas só o atual fica visível via opacity
          Isso é mais suave que montar/desmontar elementos */}
      {slides.map((src, i) => (
        <div
          key={src}
          className={`absolute inset-0 transition-opacity duration-700
            ${i === current ? "opacity-100" : "opacity-0"}`}
        >
          <img src={src} alt={`slide ${i + 1}`} className="w-full h-full object-cover" />
        </div>
      ))}

      {/* dots indicadores — clicando muda o slide manualmente */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-1.5 h-1.5 rounded-full transition-all duration-300
              ${i === current ? "bg-white scale-125" : "bg-white/40"}`}
          />
        ))}
      </div>
    </div>
  );
}

// ── COMPONENTE PRINCIPAL
export default function Hobbies() {

  // Estado do accordion aberto — guarda o ID do hobby aberto (ou null = todos fechados)
  // Começamos com o primeiro aberto, igual ao HTML original (class="accordion-item open")
  const [openId, setOpenId] = useState("tecnologia");

  // Função toggle: se clicar no que já está aberto, fecha. Se clicar em outro, abre.
  const toggle = (id) => setOpenId((prev) => (prev === id ? null : id));

  // Progresso: calcula a % baseado no índice do item aberto
  // Se nenhum estiver aberto, mostra 0%
  const openIndex = HOBBIES.findIndex((h) => h.id === openId);
  const progress = openIndex >= 0
    ? Math.round(((openIndex + 1) / HOBBIES.length) * 100)
    : 0;

  return (
    <section id="hobbies" className="relative px-6 sm:px-8 pt-16 sm:pt-20 pb-8 overflow-hidden bg-slate-800">

      {/* BG decorativo */}
      <div className="pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 w-[500px] h-[500px]
        bg-[radial-gradient(circle,rgba(56,189,248,0.06),transparent_70%)]" />

      <div className="relative z-10 max-w-6xl mx-auto">

        {/* cabeçalho */}
        <div className="flex items-center gap-3 mb-3">
          <span className="w-8 h-8 rounded-lg bg-secondary/10 border border-secondary/30
            flex items-center justify-center flex-shrink-0">
            <span className="font-mono text-secondary text-xs font-bold">&lt;/&gt;</span>
          </span>
          <p className="font-mono text-xs tracking-[0.25em] uppercase text-secondary">
            / Conheca-me melhor
          </p>
        </div>

        <h3 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-100 leading-tight mb-3">
          Meus <span className="text-secondary">Hobbies</span>
        </h3>

        <p className="font-mono text-sm text-slate-500 mb-10 lg:mb-12">
          Alem do codigo, algumas coisas que me movem no dia a dia.
        </p>

        {/* coluna direita: lista de accordions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">

          {/* coluna esquerda: barra de progresso */}
          <div className="hidden lg:flex flex-col gap-6 lg:sticky lg:top-8">
            <div className="flex flex-col gap-3">
              <p className="font-mono text-[0.65rem] text-slate-500 tracking-widest uppercase">
                Clique para explorar
              </p>
              <div className="relative h-1 bg-slate-700/30 rounded-full overflow-hidden">
                <div
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-sky-400 to-violet-400 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="font-mono text-xs text-slate-600">
                {progress}% explorado
              </p>
            </div>
          </div>

          {/* coluna direita: accordions SEM translate */}
          <div className="flex flex-col gap-3 -translate-y-30">
            {HOBBIES.map((hobby) => {
              const c = COLOR_MAP[hobby.color];
              // isOpen: true se este hobby é o que está aberto
              const isOpen = openId === hobby.id;

              return (
                <div
                  key={hobby.id}
                  className="group rounded-2xl border border-slate-700/60 bg-slate-900/40
                    overflow-hidden transition-all duration-300
                    hover:border-slate-600/80"
                >
                  {/* ── TRIGGER do accordion */}
                  <button
                    onClick={() => toggle(hobby.id)}
                    className="w-full flex items-center gap-3 sm:gap-4 px-4 sm:px-5 py-3 sm:py-4 text-left"
                  >
                    {/* ícone colorido */}
                    <div className={`flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-xl ${c.bg} border ${c.border}
                      flex items-center justify-center transition-all duration-300`}>
                      {hobby.icon}
                    </div>

                    {/* label + título */}
                    <div className="flex-1 min-w-0">
                      <p className={`font-mono text-[0.6rem] ${c.text} tracking-widest uppercase mb-0.5`}>
                        {hobby.label}
                      </p>
                      <h4 className="font-syne font-bold text-slate-100 text-sm sm:text-base">
                        {hobby.title}
                      </h4>
                    </div>


                    {/* ícone +/- — rotaciona quando aberto via classe condicional */}
                    <div className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 rounded-full border border-slate-600
                      flex items-center justify-center text-slate-400
                      group-hover:border-slate-500 group-hover:text-slate-300 transition-all duration-200 cursor-pointer">
                      <svg
                        className={`w-3 sm:w-3.5 h-3 sm:h-3.5 transition-transform duration-300
                          ${isOpen ? "rotate-45" : ""}`}
                        viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                      >
                        <path d="M12 5v14M5 12h14" />
                      </svg>
                    </div>

                  </button>

                  {/* linha divisória colorida */}
                  <div className="px-4 sm:px-5">
                    <div className={`h-px ${c.bar} rounded-full transition-opacity duration-300
                      ${isOpen ? "opacity-100" : "opacity-40"}`} />
                  </div>

                  {/* ── CORPO do accordion
                      max-height animado: 0 quando fechado, auto quando aberto
                      overflow-hidden esconde o conteúdo quando max-h é 0 */}
                  <div className={`overflow-hidden transition-all duration-300
                    ${isOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"}`}>
                    <div className="px-4 sm:px-5 py-4 flex flex-col gap-4">

                      <p className="text-slate-400 text-sm font-mono leading-relaxed">
                        {hobby.description}
                      </p>

                      {/* Slideshow — passamos isOpen para ele controlar o timer */}
                      <Slideshow
                        slides={hobby.slides}
                        interval={hobby.interval}
                        isOpen={isOpen}
                      />

                      {/* tags */}
                      <div className="flex flex-wrap gap-2">
                        {hobby.tags.map((tag) => (
                          <span
                            key={tag}
                            className={`font-mono text-[0.65rem] ${c.text} ${c.bg} border ${c.border}
                              px-2.5 py-1 rounded-full`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>

        </div>

        {/* Barra de progresso mobile — fica no final */}
        <div className="lg:hidden mt-8 flex flex-col gap-3">
          <p className="font-mono text-[0.65rem] text-slate-500 tracking-widest uppercase">
            Progresso da exploração
          </p>
          <div className="relative h-1 bg-slate-700/30 rounded-full overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-sky-400 to-violet-400 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="font-mono text-xs text-slate-600 text-center">
            {progress}% explorado
          </p>
        </div>
      </div>
    </section>
  );
}
