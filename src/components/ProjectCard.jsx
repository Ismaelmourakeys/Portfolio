// Precisamos importar useState aqui também pois este componente usa estado próprio
import { useState } from "react";
import TechIcon from "./TechIcon";

// Componente separado para cada card de projeto
// Isso é uma das grandes vantagens do React: isolar lógica repetida em componentes reutilizáveis
// Em vez de copiar o mesmo bloco HTML 3x, você cria 1 componente e passa os dados via "props"

// Props: são os "parâmetros" do componente — dados passados de pai para filho
// Aqui desestruturamos direto: ({ project }) em vez de (props) e depois props.project
export default function ProjectCard({ project }) {

  // useState controla se o overlay de detalhes está visível ou não
  // Cada card tem seu próprio estado independente — isso é encapsulamento no React
  const [showDetails, setShowDetails] = useState(false);

  return (
    // relative no card pai para o overlay absolute funcionar corretamente
    <div className="project-card group/card relative flex flex-col
      bg-gradient-to-br from-slate-800/90 to-slate-900/90
      border border-slate-700/50 rounded-2xl overflow-hidden
      shadow-[0_8px_32px_rgba(0,0,0,0.4)]
      hover:border-sky-400/30 hover:shadow-[0_16px_48px_rgba(0,0,0,0.5)]
      transition-all duration-300 snap-start animate-fadeUp">

      {/* linha decorativa topo */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-sky-400/50 to-transparent
        opacity-0 group-hover/card:opacity-100 transition-opacity duration-300" />

      {/* ── RESUMO (conteúdo principal) */}
      <div className="conteudo resumo flex flex-col flex-1 p-6">

        {/* tag de categoria + link externo */}
        <div className="flex items-start justify-between gap-3 mb-3">
          {/* project.tagColor vem da prop — assim cada card pode ter uma cor diferente */}
          <span className={`font-mono text-[0.65rem] tracking-widest uppercase
            px-2.5 py-1 rounded-full border
            ${project.tagColor}`}>
            {project.tag}
          </span>

          {project.liveUrl && (
            <a href={project.liveUrl} target="_blank" rel="noreferrer"
              className="text-slate-500 hover:text-secondary transition-colors duration-200">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </a>
          )}
        </div>
        

        {/* título */}
        <h4 className="font-syne text-lg font-bold text-yellow-300 mb-3">
          {project.title}
        </h4>

        {/* descrição */}
        <p className="text-slate-400 text-sm leading-relaxed mb-4 flex-1">
          {project.description}
        </p>

        

        {/* mídia: imagem ou vídeo — renderização condicional com ternário
            condicao ? <seTrue /> : <seFalse /> */}
        {project.videoSrc ? (
          // Card com vídeo — abre o modal ao clicar
          // onOpenVideo é uma função passada como prop do componente pai (Projects.jsx)
          <div
            className="relative w-full h-40 rounded-xl overflow-hidden ring-1 ring-white/8 cursor-pointer group/video"
            onClick={() => project.onOpenVideo(project.videoSrc)}
          >
            <video className="absolute inset-0 w-full h-full object-cover"
              preload="metadata" muted playsInline>
              <source src={project.videoSrc} type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-black/40 group-hover/video:bg-black/55
              transition-colors duration-300 flex items-center justify-center">
              <div className="flex items-center justify-center w-14 h-14 rounded-full
                bg-white/10 border border-white/20 backdrop-blur-sm
                group-hover/video:bg-white/20 group-hover/video:scale-110
                transition-all duration-300">
                <svg className="w-6 h-6 text-white ml-1" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M5 3v18l15-9L5 3z" />
                </svg>
              </div>
            </div>
            <span className="absolute bottom-2 left-2 font-mono text-[0.65rem] tracking-wider
              bg-black/60 text-slate-300 px-2 py-1 rounded-md">Ver vídeo</span>
          </div>
        ) : (
          // Card com imagem estática
          <a href={project.liveUrl} target="_blank" rel="noreferrer" className="block">
            <div className="relative w-full h-40 rounded-xl overflow-hidden ring-1 ring-white/8">
              <img src={project.imageSrc} alt={`Preview ${project.title}`}
                className="absolute inset-0 w-full h-full object-cover
                  transition-transform duration-500 group-hover/card:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
            </div>
          </a>
        )}
      </div>

      

      {/* ── FOOTER DO CARD: ícones de tech + botão detalhes */}
      <div className="flex items-center justify-between px-6 py-4 border-t border-white/5">
        <div className="flex gap-2">
          {/* project.techs é um array de strings com as classes devicon
              map() renderiza cada ícone — mesma ideia do Header com os links */}
          {project.techs.map((tech) => (
            <TechIcon key={tech} icon={tech} className="text-base" size="w-5 h-5" />
          ))}
        </div>
        {/* onClick abre o overlay de detalhes setando showDetails para true */}
        <button
          onClick={() => setShowDetails(true)}
          className="font-mono text-xs text-secondary tracking-widest
            hover:text-sky-300 transition-colors duration-200 flex items-center gap-1 cursor-pointer"
        >
          Detalhes
          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>


      {/* ── OVERLAY DE DETALHES
          Renderização condicional: só aparece quando showDetails = true
          absolute inset-0 cobre todo o card pai (que tem relative) */}
      {showDetails && (
        <div className="absolute inset-0 bg-slate-900/95 backdrop-blur-md rounded-2xl
          p-6 flex flex-col items-center justify-center text-center gap-4 z-30
          animate-popUp overflow-y-auto">

          {/* botão fechar — seta showDetails para false */}
          <button
            onClick={() => setShowDetails(false)}
            className="absolute top-4 right-4 flex items-center gap-1.5
              font-mono text-xs text-slate-400 hover:text-slate-100 transition-colors duration-200 cursor-pointer"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
            fechar
          </button>

          <p className="font-mono text-xs tracking-widest uppercase text-secondary">
            Ferramentas utilizadas
          </p>
          <h4 className="font-syne text-xl font-bold text-yellow-300">{project.title}</h4>

          {/* grid de ferramentas com ícone + label */}
          <div className="w-full max-w-md grid grid-cols-2 sm:grid-cols-4 gap-3">
            {project.techDetails.map((tech) => (
              <div key={tech.label}
                className="flex flex-col items-center justify-center gap-2 bg-white/5 rounded-lg py-3 px-2">
                <TechIcon icon={tech.icon} />
                <span className="text-xs text-slate-200">{tech.label}</span>
              </div>
            ))}
          </div>

          <p className="text-slate-400 text-xs leading-relaxed max-w-xs">
            {project.detailsDescription}
          </p>

          <a href={project.githubUrl} target="_blank" rel="noreferrer"
            className="inline-flex items-center gap-2 bg-secondary text-slate-900
              font-syne font-bold text-sm px-5 py-2.5 rounded-xl
              hover:brightness-110 hover:scale-105 transition-all duration-300">
            <i className="devicon-github-original text-xl" /> GitHub do projeto
          </a>

          <button
            onClick={() => setShowDetails(false)}
            className="font-mono text-xs text-slate-500 hover:text-secondary transition-colors cursor-pointer"
          >
            Fechar ✕
          </button>
        </div>
      )}
    </div>
  )}
