// useState: guarda valores que podem mudar e re-renderiza o componente quando mudam
// useEffect: executa código "fora do React" (ex: eventos do DOM, timers, APIs)
import { useState, useEffect } from "react";

export default function Header() {

  // ── ESTADO: menu mobile aberto ou fechado
  // useState(false) → valor inicial é false (fechado)
  // menuOpen = valor atual | setMenuOpen = função para atualizar o valor
  const [menuOpen, setMenuOpen] = useState(false);

  // ── ESTADO: se o usuário já rolou a página ou não
  // Começa false (topo da página = sem glassmorphism)
  const [scrolled, setScrolled] = useState(false);

  // ── EFEITO: ouve o scroll da página
  // useEffect(() => { ... }, []) → o [] significa "roda só uma vez, quando o componente montar"
  // É equivalente ao DOMContentLoaded / document.addEventListener do vanilla JS
  useEffect(() => {
    const handleScroll = () => {
      // Se rolou mais de 20px, ativa o glassmorphism
      setScrolled(window.scrollY > 20);
    };

    // Adiciona o listener no mount
    window.addEventListener("scroll", handleScroll);

    // Cleanup: remove o listener quando o componente for desmontado
    // Sem isso, o listener ficaria "pendurado" na memória mesmo sem o Header na tela
    return () => window.removeEventListener("scroll", handleScroll);
  }, []); // [] = roda só uma vez

  // ── EFEITO: fecha o menu mobile ao clicar em qualquer link
  // Roda sempre que menuOpen mudar (porque está no array de dependências)
  useEffect(() => {
    if (!menuOpen) return;

    const closeOnClick = () => setMenuOpen(false);
    document.addEventListener("click", closeOnClick);
    return () => document.removeEventListener("click", closeOnClick);
  }, [menuOpen]);

  return (
    <header
      id="header"
      className="fixed top-0 w-full z-50 transition-all duration-300 animate-slideDown border-b border-transparent"
    >

      {/* Glassmorphism backdrop — aparece via classe condicional quando scrolled = true
          No JSX, lógica condicional de classes é feita com template string + ternário:
          `classe-fixa ${condicao ? 'classe-se-true' : 'classe-se-false'}` */}
      <div
        id="header-bg"
        className={`absolute inset-0 transition-opacity duration-300
          bg-slate-900/80 backdrop-blur-xl border-b border-white/5
          ${scrolled ? "opacity-100" : "opacity-0"}`}
      />

      <div className="relative z-10 max-w-6xl mx-auto flex items-center justify-between px-6 py-4">

        {/* ── LOGO */}
        <a href="#" className="group flex items-center gap-2">
          <span className="flex items-center justify-center w-8 h-8 rounded-lg
            bg-secondary/10 border border-secondary/30
            group-hover:bg-secondary/20 transition-colors duration-300">
            <span className="font-mono text-secondary text-xs font-bold">&lt;/&gt;</span>
          </span>
          <h1 className="font-syne text-xl font-bold text-slate-100
            group-hover:text-secondary transition-colors duration-300">
            Ismael <span className="text-secondary">Moura</span>
          </h1>
        </a>

        {/* ── NAV DESKTOP */}
        <nav className="hidden md:flex space-x-6 text-lg">
          {/* Array de links — map() transforma cada item em JSX
              É a forma React de renderizar listas, substituindo o HTML repetido */}
          {[
            { href: "#sobre", label: "Sobre" },
            { href: "#projetos", label: "Projetos" },
            { href: "#certificados", label: "Certificações" },
            { href: "#hobbies", label: "Hobbies" },
          ].map((link) => (
            <a
              key={link.href} // key: obrigatório em listas, ajuda React a identificar cada item
              href={link.href}
              className="relative text-slate-200 transition-colors duration-300 hover:text-secondary
                after:absolute after:left-1/2 after:bottom-[-4px]
                after:h-[2px] after:w-0 after:bg-secondary
                after:transition-all after:duration-300
                hover:after:w-full hover:after:left-0"
            >
              {link.label}
            </a>
          ))}

          <a
            href="#contato"
            className="ml-3 inline-flex items-center gap-1.5
              font-mono text-xs tracking-widest uppercase
              border border-secondary/40 text-secondary
              px-4 py-2 rounded-full
              hover:bg-secondary hover:text-slate-900 hover:border-secondary
              transition-all duration-300"
          >
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            Contato
          </a>
        </nav>

        {/* ── BOTÃO HAMBURGUER
            onClick={() => setMenuOpen(!menuOpen)}
            → ao clicar, inverte o valor de menuOpen (true vira false, false vira true) */}
        <button
          id="menuToggle"
          aria-label="Abrir menu"
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden relative w-9 h-9 flex flex-col justify-center items-center gap-[5px]
            rounded-lg border border-slate-700 hover:border-secondary/50
            transition-colors duration-300"
        >
          {/* As 3 linhas do hamburguer — transformam em X quando menuOpen = true
              Novamente, classes condicionais com ternário */}
          <span className={`block w-5 h-px bg-secondary transition-all duration-300 origin-center
            ${menuOpen ? "rotate-45 translate-y-[6px]" : ""}`} />
          <span className={`block w-5 h-px bg-secondary transition-all duration-300 origin-center
            ${menuOpen ? "opacity-0 scale-x-0" : ""}`} />
          <span className={`block h-px bg-secondary transition-all duration-300 origin-center
            ${menuOpen ? "w-5 -rotate-45 -translate-y-[6px]" : "w-3 self-start ml-1"}`} />
        </button>
      </div>

      {/* ── MENU MOBILE
          Renderização condicional com &&:
          {condicao && <Componente />} → só renderiza se condicao for true
          Equivale ao display:none / display:flex do vanilla JS */}
      {menuOpen && (
        <div className="md:hidden flex flex-col gap-1 px-6 pb-5 pt-1
          bg-slate-900/95 backdrop-blur-xl border-t border-white/5 animate-fadeIn">
          {[
            { href: "#sobre", label: "Sobre" },
            { href: "#projetos", label: "Projetos" },
            { href: "#certificados", label: "Certificações" },
            { href: "#hobbies", label: "Hobbies" },
          ].map((link) => (
            <a
              key={link.href}
              href={link.href}
              // onClick fecha o menu ao navegar
              onClick={() => setMenuOpen(false)}
              className="py-2 px-3 rounded-lg text-slate-200 hover:text-secondary
                hover:bg-white/5 transition-all duration-200 text-sm font-mono"
            >
              {link.label}
            </a>
          ))}

          <a
            href="#contato"
            onClick={() => setMenuOpen(false)}
            className="mt-2 flex items-center justify-center gap-2
              font-mono text-xs tracking-widest uppercase
              border border-secondary/40 text-secondary
              py-3 rounded-xl
              hover:bg-secondary hover:text-slate-900
              transition-all duration-300"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            Contato
          </a>
        </div>
      )}
    </header>
  );
}