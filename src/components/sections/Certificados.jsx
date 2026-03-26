import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { useTranslation } from "react-i18next"; // ← importa o hook de tradução
import SectionTitle from "../layout/SectionTitle";

// ── Dados fixos dos certificados — título vem do JSON via t()
// Para adicionar novo: coloque aqui + rode translate-certs.mjs
const CERTIFICATES = [
  { id: "cert-1", issuer: "DIO",                   imageSrc: "assets/img/certificados/Bootcamp_AWS-Fundamentos.png"          },
  { id: "cert-2", issuer: "FluencyPass",            imageSrc: "assets/img/certificados/Fluency_Academy_beginner-1-2.PNG"       },
  { id: "cert-3", issuer: "Fundação Bradesco",      imageSrc: "assets/img/certificados/Fundacao_Bradesco_Site_Simples.PNG"     },
  { id: "cert-4", issuer: "Alura",                  imageSrc: "assets/img/certificados/Alura_Imersao_Front-end_2edicao.PNG"    },
  { id: "cert-5", issuer: "Santander Open Academy", imageSrc: "assets/img/certificados/Python_Santander_OpenAcademy.PNG"       },
  { id: "cert-6", issuer: "Ada Tech",               imageSrc: "assets/img/certificados/Ada_Tech_HTML.png"                      },
  { id: "cert-7", issuer: "Wizard",                 imageSrc: "assets/img/certificados/Wizard_certificado.jpeg"                },
  { id: "cert-8", issuer: "Microlins",              imageSrc: "assets/img/certificados/Microlins_Informatica.jpeg"             },
  { id: "cert-9", issuer: "Microlins",              imageSrc: "assets/img/certificados/Microlins_Auxiliar.jpeg"                },
  // ── Adicione novos certificados aqui:
  // { id: "cert-10", issuer: "Instituição", imageSrc: "assets/img/certificados/arquivo.png" },
];

// ── Card individual com tilt 3D + brilho — sem textos traduzíveis
function CertCard({ cert, index, onClick }) {
  // ── Hook de tradução dentro do card para buscar o título traduzido
  // t("certs.titles.cert-1") → título do certificado no idioma atual
  const { t } = useTranslation();
  const cardRef = useRef(null);
  const mouseX  = useMotionValue(0);
  const mouseY  = useMotionValue(0);

  const springConfig = { stiffness: 150, damping: 20, mass: 0.5 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [6, -6]),  springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-6, 6]), springConfig);

  const glowX = useTransform(mouseX, [-0.5, 0.5], ["0%", "100%"]);
  const glowY = useTransform(mouseY, [-0.5, 0.5], ["0%", "100%"]);
  const glowBackground = useTransform(
    [glowX, glowY],
    ([x, y]) => `radial-gradient(circle at ${x} ${y}, rgba(56,189,248,0.10) 0%, transparent 65%)`
  );

  const handleMouseMove = useCallback((e) => {
    const card = cardRef.current; if (!card) return;
    const rect = card.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width  - 0.5);
    mouseY.set((e.clientY - rect.top)  / rect.height - 0.5);
  }, [mouseX, mouseY]);

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0); mouseY.set(0);
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
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.34, 1.56, 0.64, 1] }}
      style={{ rotateX, rotateY, perspective: 1000 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{
        boxShadow: "0 20px 50px rgba(56,189,248,0.12), 0 8px 32px rgba(0,0,0,0.5)",
        borderColor: "rgba(56,189,248,0.35)",
      }}
    >
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-2xl z-0
          opacity-0 group-hover/card:opacity-100 transition-opacity duration-300"
        style={{ background: glowBackground }}
      />

      <div className="h-px w-full bg-gradient-to-r from-transparent via-sky-400/50 to-transparent
        opacity-0 group-hover/card:opacity-100 transition-opacity duration-300" />

      <div className="relative w-full h-56 overflow-hidden">
        <img
          src={cert.imageSrc}
          alt={t(`certs.titles.${cert.id}`)} // alt traduzido com a chave do certificado
          className="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-105"
        />
        <div className="absolute inset-0 bg-black/0 group-hover/card:bg-black/40
          transition-colors duration-300 flex items-center justify-center">
          <svg className="w-8 h-8 text-white opacity-0 group-hover/card:opacity-100 transition-opacity duration-300"
            viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35M11 8v6M8 11h6" />
          </svg>
        </div>
      </div>

      <div className="p-4 relative z-10">
        {/* t(`certs.titles.${cert.id}`) → título do cert no idioma atual
             ex: t("certs.titles.cert-2") → "Curso de Inglês" / "English Course" / "Curso de Inglés" */}
        <h4 className="text-base font-bold text-white mb-1">
          {t(`certs.titles.${cert.id}`)}
        </h4>
        <p className="font-mono text-xs text-slate-500">{cert.issuer}</p>
      </div>
    </motion.div>
  );
}

export default function Certificates() {
  // ── Hook de tradução — textos fixos da UI
  const { t } = useTranslation();

  const [modalImg, setModalImg] = useState(null);
  const carouselRef = useRef(null);
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);

  const touchStartX = useRef(null);
  const touchStartY = useRef(null);
  const isSwiping   = useRef(false);

  useEffect(() => {
    const update = () => setIsDesktop(window.innerWidth >= 768);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const cardsPerDot  = isDesktop ? 3 : 1;
  const totalDots    = Math.ceil(CERTIFICATES.length / cardsPerDot);
  const activeDotIndex = Math.floor(activeCardIndex / cardsPerDot);

  const scrollToCard = useCallback((cardIndex) => {
    const container = carouselRef.current; if (!container) return;
    const clamped = Math.max(0, Math.min(CERTIFICATES.length - 1, cardIndex));
    const cards  = container.querySelectorAll(".cert-card");
    const target = cards[clamped]; if (!target) return;
    container.scrollTo({ left: target.offsetLeft - container.offsetLeft, behavior: "smooth" });
    setActiveCardIndex(clamped);
  }, []);

  const scrollToDot = useCallback((dotIndex) => {
    scrollToCard(dotIndex * cardsPerDot);
  }, [scrollToCard, cardsPerDot]);

  const scrollPrev = () => scrollToDot(Math.max(0, activeDotIndex - 1));
  const scrollNext = () => scrollToDot(Math.min(totalDots - 1, activeDotIndex + 1));

  useEffect(() => {
    const container = carouselRef.current; if (!container) return;
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

  const handleTouchStart = useCallback((e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    isSwiping.current   = false;
  }, []);

  const handleTouchMove = useCallback((e) => {
    if (touchStartX.current === null) return;
    const dx = e.touches[0].clientX - touchStartX.current;
    const dy = e.touches[0].clientY - touchStartY.current;
    if (!isSwiping.current && Math.abs(dy) > Math.abs(dx)) return;
    isSwiping.current = true;
    e.preventDefault();
  }, []);

  const handleTouchEnd = useCallback((e) => {
    if (touchStartX.current === null || !isSwiping.current) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const THRESHOLD = 40;
    if (Math.abs(dx) >= THRESHOLD) {
      if (dx < 0) scrollToCard(activeCardIndex + 1);
      else        scrollToCard(activeCardIndex - 1);
    }
    touchStartX.current = null;
    touchStartY.current = null;
    isSwiping.current   = false;
  }, [activeCardIndex, scrollToCard]);

  useEffect(() => {
    const container = carouselRef.current; if (!container) return;
    container.addEventListener("touchmove", handleTouchMove, { passive: false });
    return () => container.removeEventListener("touchmove", handleTouchMove);
  }, [handleTouchMove]);

  return (
    <section id="certificados" className="px-8 py-20 bg-gradient-to-b from-slate-800 to-slate-900">

      {/*
        SectionTitle com textos traduzidos:
        t("certs.tag")      → "/ Conquistas"   / "/ Achievements" / "/ Logros"
        t("certs.title")    → "Meus"            / "My"             / "Mis"
        t("certs.highlight")→ "Certificados"    / "Certificates"   / "Certificados"
        t("certs.subtitle") → subtítulo traduzido
      */}
      <SectionTitle
        tag={t("certs.tag")}
        title={t("certs.title")}
        highlight={` ${t("certs.highlight")}`}
        subtitle={t("certs.subtitle")}
      />

      <div className="relative group">
        <button onClick={scrollPrev} disabled={activeDotIndex === 0}
          className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-5 z-20
            w-11 h-11 items-center justify-center rounded-full
            bg-slate-800 border border-slate-600 cursor-pointer
            text-slate-300 hover:text-secondary hover:border-secondary/50
            disabled:opacity-30 disabled:cursor-default disabled:hover:text-slate-300
            opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-xl">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        <button onClick={scrollNext} disabled={activeDotIndex === totalDots - 1}
          className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-5 z-20
            w-11 h-11 items-center justify-center rounded-full
            bg-slate-800 border border-slate-600 cursor-pointer
            text-slate-300 hover:text-secondary hover:border-secondary/50
            disabled:opacity-30 disabled:cursor-default disabled:hover:text-slate-300
            opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-xl">
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
                : "w-2 h-2 bg-slate-600 hover:bg-slate-500 cursor-pointer"}`}
          />
        ))}
      </div>

      {/* MODAL — portal para escapar de transforms do framer-motion */}
      {modalImg && createPortal(
        <div
          onClick={() => setModalImg(null)}
          style={{
            position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
            zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center",
            padding: "1rem", backgroundColor: "rgba(0,0,0,0.8)", backdropFilter: "blur(6px)",
          }}
        >
          <div className="relative max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setModalImg(null)}
              className="absolute -top-12 right-0 flex items-center gap-1.5
                font-mono text-xs text-slate-400 hover:text-slate-100
                transition-colors duration-200 z-10"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
              {/* t("certs.close") → "fechar" / "close" / "cerrar" */}
              {t("certs.close")}
            </button>
            {/* t("certs.alt") → "Certificado" / "Certificate" / "Certificado" */}
            <img
              src={modalImg}
              alt={t("certs.alt")}
              className="w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl border border-white/10"
            />
          </div>
        </div>,
        document.body
      )}
    </section>
  );
}