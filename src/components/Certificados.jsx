import { useState, useRef } from "react";

// ── DADOS DOS CERTIFICADOS
// Mesma estratégia do Projects: dados separados do JSX
// Para adicionar um certificado novo, só adiciona um objeto aqui
const CERTIFICATES = [
  {
    id: "cert-1",
    title: "Bootcamp Nexa + AWS - Fundamentos de IA Generativa com BedRock",
    issuer: "DIO",
    // Coloque o caminho real das imagens dos seus certificados aqui
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
  // Adicione mais objetos conforme necessário...
];

export default function Certificates() {

  // ── ESTADO: imagem aberta no modal (null = modal fechado)
  const [modalImg, setModalImg] = useState(null);

  // ── useRef no carrossel para scroll programático (mesma lógica do Projects)
  const carouselRef = useRef(null);

  const scrollPrev = () =>
    carouselRef.current?.scrollBy({ left: -440, behavior: "smooth" });

  const scrollNext = () =>
    carouselRef.current?.scrollBy({ left: 440, behavior: "smooth" });

  return (
    <section
      id="certificados"
      className="px-8 py-20 bg-gradient-to-b from-slate-800 to-slate-900"
      data-animate="left"
    >

      {/* ── cabeçalho */}
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

      {/* ── CARROSSEL */}
      <div className="relative group">

        <button
          onClick={scrollPrev}
          className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-5 z-20
            w-11 h-11 items-center justify-center rounded-full
            bg-slate-800 border border-slate-600
            text-slate-300 hover:text-secondary hover:border-secondary/50
            opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-xl"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        <button
          onClick={scrollNext}
          className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-5 z-20
            w-11 h-11 items-center justify-center rounded-full
            bg-slate-800 border border-slate-600
            text-slate-300 hover:text-secondary hover:border-secondary/50
            opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-xl"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>

        {/* carrossel dinâmico — gerado a partir do array CERTIFICATES
            No vanilla JS isso era feito via innerHTML no JS
            No React, o map() dentro do JSX substitui completamente essa abordagem */}
        <div
          ref={carouselRef}
          className="grid grid-flow-col auto-cols-[88%] sm:auto-cols-[65%] md:auto-cols-[420px]
            gap-5 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4
            [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]
            px-1 items-stretch"
        >
          {CERTIFICATES.map((cert) => (
            // Cada certificado vira um card clicável que abre o modal
            <div
              key={cert.id}
              onClick={() => setModalImg(cert.imageSrc)}
              className="group/card relative flex flex-col cursor-pointer
                bg-gradient-to-br from-slate-800/90 to-slate-900/90
                border border-slate-700/50 rounded-2xl overflow-hidden
                shadow-[0_8px_32px_rgba(0,0,0,0.4)]
                hover:border-sky-400/30 hover:shadow-[0_16px_48px_rgba(0,0,0,0.5)]
                transition-all duration-300 snap-start"
            >
              {/* linha decorativa topo */}
              <div className="h-px w-full bg-gradient-to-r from-transparent via-sky-400/50 to-transparent
                opacity-0 group-hover/card:opacity-100 transition-opacity duration-300" />

              {/* imagem do certificado */}
              <div className="relative w-full h-56 overflow-hidden">
                <img
                  src={cert.imageSrc}
                  alt={cert.title}
                  className="w-full h-full object-cover
                    transition-transform duration-500 group-hover/card:scale-105"
                />
                {/* overlay com ícone de zoom ao hover */}
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

              {/* info do certificado */}
              <div className="p-4">
                <h4 className="text-base font-bold text-white mb-1">
                  {cert.title}
                </h4>
                <p className="font-mono text-xs text-slate-500">{cert.issuer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── MODAL DE IMAGEM
          Mesmo padrão do modal de vídeo em Projects:
          - clique no backdrop fecha
          - stopPropagation impede que clique na imagem feche */}
      {modalImg && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setModalImg(null)}
        >
          <div
            className="relative max-w-4xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* botão fechar */}
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