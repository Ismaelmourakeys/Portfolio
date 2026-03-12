import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const NAV_LINKS = [
  { href: "#sobre", label: "Sobre" },
  { href: "#projetos", label: "Projetos" },
  { href: "#certificados", label: "Certificações" },
  { href: "#hobbies", label: "Hobbies" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef(null);
  const btnRef = useRef(null);

  // glassmorphism ao rolar
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ── FIX: fecha ao clicar FORA do menu e do botão
  // O bug anterior usava document.addEventListener sem excluir o botão,
  // então o próprio clique no botão fechava o menu imediatamente após abrir.
  useEffect(() => {
    if (!menuOpen) return;
    const onClickOutside = (e) => {
      if (
        menuRef.current?.contains(e.target) ||
        btnRef.current?.contains(e.target)
      ) return;
      setMenuOpen(false);
    };
    // pequeno delay para não capturar o clique que abriu
    const t = setTimeout(() => document.addEventListener("mousedown", onClickOutside), 10);
    return () => {
      clearTimeout(t);
      document.removeEventListener("mousedown", onClickOutside);
    };
  }, [menuOpen]);

  // bloqueia scroll do body quando menu aberto
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <header className="fixed top-0 w-full z-50 transition-all duration-300">

      {/* backdrop glassmorphism */}
      <div className={`absolute inset-0 transition-opacity duration-300
        bg-slate-900/80 backdrop-blur-xl border-b border-white/5
        ${scrolled ? "opacity-100" : "opacity-0"}`}
      />

      <div className="relative z-10 max-w-6xl mx-auto flex items-center justify-between px-6 py-4">

        {/* LOGO */}
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

        {/* NAV DESKTOP */}
        <nav className="hidden md:flex items-center space-x-6 text-lg">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
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

        {/* BOTÃO HAMBURGUER — linhas animadas com Framer Motion */}
        <button
          ref={btnRef}
          aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
          onClick={() => setMenuOpen((v) => !v)}
          className="md:hidden relative z-[60] w-10 h-10 flex flex-col justify-center items-center gap-[5px]
            rounded-xl border border-slate-700 hover:border-secondary/50
            transition-colors duration-300 cursor-pointer"
        >
          <motion.span
            animate={menuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.25 }}
            className="block w-5 h-px bg-secondary origin-center"
          />
          <motion.span
            animate={menuOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.2 }}
            className="block w-5 h-px bg-secondary origin-center"
          />
          <motion.span
            animate={menuOpen ? { rotate: -45, y: -6, width: "20px" } : { rotate: 0, y: 0, width: "12px" }}
            transition={{ duration: 0.25 }}
            className="block h-px bg-secondary origin-center self-start ml-1"
          />
        </button>
      </div>

      {/* MENU MOBILE — painel lateral deslizando da direita */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* overlay escuro */}
            <motion.div
              key="overlay"
              className="md:hidden fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setMenuOpen(false)}
            />

            {/* painel lateral */}
            <motion.div
              key="panel"
              ref={menuRef}
              className="md:hidden fixed top-0 right-0 z-50 h-full w-72
                bg-slate-900 border-l border-white/8
                flex flex-col pt-24 pb-8 px-6 shadow-2xl shadow-black/60"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* linha decorativa topo */}
              <div className="absolute top-0 left-0 right-0 h-px
                bg-gradient-to-r from-transparent via-secondary/40 to-transparent" />

              {/* label */}
              <p className="font-mono text-[0.6rem] tracking-[0.3em] uppercase text-slate-500 mb-5">
                / navegação
              </p>

              {/* links com stagger */}
              <div className="flex flex-col gap-1">
                {NAV_LINKS.map((link, i) => (
                  <motion.a
                    key={link.href}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.06 + i * 0.07, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="group flex items-center gap-3 py-3 px-4 rounded-xl
                      text-slate-300 hover:text-secondary
                      hover:bg-secondary/8 border border-transparent hover:border-secondary/20
                      transition-all duration-200 font-syne font-semibold text-base"
                  >
                    <span className="font-mono text-[0.6rem] text-slate-600 group-hover:text-secondary/60
                      transition-colors duration-200 w-4 flex-shrink-0">
                      0{i + 1}
                    </span>
                    {link.label}
                    <svg
                      className="w-3.5 h-3.5 ml-auto opacity-0 group-hover:opacity-100
                        -translate-x-1 group-hover:translate-x-0
                        transition-all duration-200 text-secondary"
                      viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </motion.a>
                ))}
              </div>

              {/* divisor */}
              <div className="my-5 h-px bg-white/5" />

              {/* botão contato */}
              <motion.a
                href="#contato"
                onClick={() => setMenuOpen(false)}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.34, duration: 0.3 }}
                className="flex items-center justify-center gap-2
                  font-mono text-xs tracking-widest uppercase
                  bg-secondary/10 border border-secondary/30 text-secondary
                  py-3.5 rounded-xl
                  hover:bg-secondary hover:text-slate-900 hover:border-secondary
                  transition-all duration-300"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                Contato
              </motion.a>

              {/* rodapé do painel */}
              <div className="mt-auto pt-6 border-t border-white/5">
                <p className="font-mono text-[0.6rem] text-slate-600 text-center tracking-widest">
                  ismael<span className="text-secondary">.</span>dev
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}