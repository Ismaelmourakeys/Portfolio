import { useState, useRef, useEffect, useCallback } from "react";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import SectionTitle from "./SectionTitle";

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

// ── Card individual com tilt 3D + brilho — mesmo padrão do ProjectCard
function CertCard({ cert, index, onClick }) {
  const cardRef = useRef(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { stiffness: 150, damping: 20, mass: 0.5 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [6, -6]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-6, 6]), springConfig);

  const glowX = useTransform(mouseX, [-0.5, 0.5], ["0%", "100%"]);
  const glowY = useTransform(mouseY, [-0.5, 0.5], ["0%", "100%"]);
  const glowBackground = useTransform(
    [glowX, glowY],
    ([x, y]) => `radial-gradient(circle at ${x} ${y}, rgba(56,189,248,0.10) 0%, transparent 65%)`
  );

  const handleMouseMove = useCallback((e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  }, [mouseX, mouseY]);

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
  }, [mouseX, mouseY]);

  return (
    <motion.div
      ref={cardRef}
      onClick={onClick}
      className="cert-card group/card relative flex flex-col cursor-pointer
        bg-gradient-to-br from-slate-800/90 to-slate-900/90
        border border-slate-700/50 rounded-2xl overflow-hidden
        shadow-[0_8px_32px_rgba(0,0,0,0.4)]
        transition-colors duration-300 snap-start"
      initial={{ opacity: 0, scale: 0.85, y: 30 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: false, amount: 0.15 }}
      transition={{
        duration: 0.6,
        delay: index * 0.08,
        ease: [0.34, 1.56, 0.64, 1],
      }}
      style={{ rotateX, rotateY, perspective: 1000 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{
        boxShadow: "0 20px 50px rgba(56,189,248,0.12), 0 8px 32px rgba(0,0,0,0.5)",
        borderColor: "rgba(56,189,248,0.35)",
      }}
    >
      {/* brilho seguindo o mouse */}
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-2xl z-0
          opacity-0 group-hover/card:opacity-100 transition-opacity duration-300"
        style={{ background: glowBackground }}
      />

      {/* linha decorativa topo */}
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

      <div className="p-4 relative z-10">
        <h4 className="text-base font-bold text-white mb-1">{cert.title}</h4>
        <p className="font-mono text-xs text-slate-500">{cert.issuer}</p>
      </div>
    </motion.div>
  );
}

export default function Certificates() {
  const [modalImg, setModalImg] = useState(null);
  const carouselRef = useRef(null);

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
    >
      {/* cabeçalho com stagger animado */}
      <SectionTitle
        tag="/ Conquistas"
        title="Meus"
        highlight=" Certificados"
        subtitle="Confira alguns dos meus certificados e conquistas."
      />

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
          {CERTIFICATES.map((cert, index) => (
            <CertCard
              key={cert.id}
              cert={cert}
              index={index}
              onClick={() => setModalImg(cert.imageSrc)}
            />
          ))}
        </div>
      </div>

      {/* DOTS */}
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

      {/* MODAL */}
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