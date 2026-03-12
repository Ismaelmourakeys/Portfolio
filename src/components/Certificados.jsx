import { useState, useRef, useEffect } from "react";

const CERTIFICATES = [
  {
    id: "cert-1",
    title: "Bootcamp Nexa + AWS - Fundamentos de IA Generativa com BedRock",
    issuer: "DIO",
    imageSrc: "assets/img/certificados/Bootcamp_AWS-Fundamentos.png",
  },
  {
    id: "cert-2",
    title: "Curso de Inglês - Beginner 1-2",
    issuer: "FluencyPass",
    imageSrc: "assets/img/certificados/Fluency_Academy_beginner-1-2.PNG",
  },
  {
    id: "cert-3",
    title: "Criando um site simples (HTML, CSS e JavaScript)",
    issuer: "Fundação Bradesco",
    imageSrc: "assets/img/certificados/Fundacao_Bradesco_Site_Simples.PNG",
  },
  {
    id: "cert-4",
    title: "Imersão Front-end 2° Edição",
    issuer: "Alura",
    imageSrc: "assets/img/certificados/Alura_Imersao_Front-end_2edicao.PNG",
  },
  {
    id: "cert-5",
    title: "Curso de Python",
    issuer: "Santander Open Academy",
    imageSrc: "assets/img/certificados/Python_Santander_OpenAcademy.PNG",
  },
  {
    id: "cert-6",
    title: "Curso de HTML",
    issuer: "Ada Tech",
    imageSrc: "assets/img/certificados/Ada_Tech_HTML.png",
  },
  {
    id: "cert-7",
    title: "Curso Complementar de Inglês",
    issuer: "Wizard",
    imageSrc: "assets/img/certificados/Wizard_certificado.jpeg",
  },
  {
    id: "cert-8",
    title: "Informática Essencial",
    issuer: "Microlins",
    imageSrc: "assets/img/certificados/Microlins_Informatica.jpeg",
  },
  {
    id: "cert-9",
    title: "Atendente de Farmácia",
    issuer: "Microlins",
    imageSrc: "assets/img/certificados/Microlins_Auxiliar.jpeg",
  },
];

export default function Certificates() {
  const [modalImg, setModalImg] = useState(null);
  const carouselRef = useRef(null);

  // Mesmo padrão do Projects: activeCardIndex + isDesktop → activeDotIndex
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const update = () => setIsDesktop(window.innerWidth >= 768);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const cardsPerDot = isDesktop ? 3 : 1;
  const totalDots = Math.ceil(CERTIFICATES.length / cardsPerDot);
  const activeDotIndex = Math.floor(activeCardIndex / cardsPerDot);

  // IntersectionObserver — detecta qual card está visível
  useEffect(() => {
    const container = carouselRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            const cards = Array.from(container.querySelectorAll(".cert-card"));
            const index = cards.indexOf(entry.target);
            if (index !== -1) setActiveCardIndex(index);
          }
        });
      },
      { root: container, threshold: 0.5 }
    );

    container.querySelectorAll(".cert-card").forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, []);

  const scrollToDot = (dotIndex) => {
    const container = carouselRef.current;
    if (!container) return;

    const cards = container.querySelectorAll(".cert-card");
    const targetCard = cards[dotIndex * cardsPerDot];
    if (!targetCard) return;

    container.scrollTo({
      left: targetCard.offsetLeft - container.offsetLeft,
      behavior: "smooth",
    });

    setActiveCardIndex(dotIndex * cardsPerDot);
  };

  const scrollPrev = () => scrollToDot(Math.max(0, activeDotIndex - 1));
  const scrollNext = () => scrollToDot(Math.min(totalDots - 1, activeDotIndex + 1));

  return (
    <section
      id="certificados"
      className="px-8 py-20 bg-gradient-to-b from-slate-800 to-slate-900"
      data-animate="left"
    >
      {/* cabeçalho */}
      <div className="flex gap-3">
        <span className="w-8 h-8 rounded-lg bg-secondary/10 border border-secondary/30
          flex items-center justify-center">
          <span className="font-mono text-secondary text-xs font-bold">&lt;/&gt;</span>
        </span>
        <p className="font-mono text-xs tracking-[0.25em] uppercase text-secondary mb-2">
          / Conquistas
        </p>
      </div>

      <h3 className="font-arial text-4xl sm:text-5xl font-extrabold text-slate-100 leading-tight m-4">
        Meus<span className="text-secondary"> Certificados</span>
      </h3>

      <p className="font-mono text-sm text-slate-500 mb-12" data-animate="up">
        Confira alguns dos meus certificados e conquistas.
      </p>

      {/* CARROSSEL */}
      <div className="relative group">

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
          className="grid grid-flow-col auto-cols-[88%] sm:auto-cols-[65%] md:auto-cols-[420px]
            gap-5 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4
            [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]
            px-1 items-stretch"
        >
          {CERTIFICATES.map((cert) => (
            <div
              key={cert.id}
              onClick={() => setModalImg(cert.imageSrc)}
              className="cert-card group/card relative flex flex-col cursor-pointer
                bg-gradient-to-br from-slate-800/90 to-slate-900/90
                border border-slate-700/50 rounded-2xl overflow-hidden
                shadow-[0_8px_32px_rgba(0,0,0,0.4)]
                hover:border-sky-400/30 hover:shadow-[0_16px_48px_rgba(0,0,0,0.5)]
                transition-all duration-300 snap-start"
            >
              <div className="h-px w-full bg-gradient-to-r from-transparent via-sky-400/50 to-transparent
                opacity-0 group-hover/card:opacity-100 transition-opacity duration-300" />

              <div className="relative w-full h-56 overflow-hidden">
                <img
                  src={cert.imageSrc}
                  alt={cert.title}
                  className="w-full h-full object-cover
                    transition-transform duration-500 group-hover/card:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover/card:bg-black/40
                  transition-colors duration-300 flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-white opacity-0 group-hover/card:opacity-100
                      transition-opacity duration-300"
                    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <path d="M21 21l-4.35-4.35M11 8v6M8 11h6" />
                  </svg>
                </div>
              </div>

              <div className="p-4">
                <h4 className="text-base font-bold text-white mb-1">{cert.title}</h4>
                <p className="font-mono text-xs text-slate-500">{cert.issuer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* DOTS — pill animado, mesmo padrão do Projects */}
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

      {/* MODAL DE IMAGEM */}
      {modalImg && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setModalImg(null)}
        >
          <div
            className="relative max-w-4xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setModalImg(null)}
              className="absolute -top-12 right-0 flex items-center gap-1.5
                font-mono text-xs text-slate-400 hover:text-slate-100
                transition-colors duration-200 z-10"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
              fechar
            </button>

            <img
              src={modalImg}
              alt="Certificado"
              className="w-full max-h-[85vh] object-contain rounded-2xl
                shadow-2xl border border-white/10"
            />
          </div>
        </div>
      )}
    </section>
  );
}