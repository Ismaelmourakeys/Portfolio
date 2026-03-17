import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";

const NAV_LINKS = [
  { href: "#sobre",        label: "Sobre"         },
  { href: "#projetos",     label: "Projetos"      },
  { href: "#certificados", label: "Certificações" },
  { href: "#hobbies",      label: "Hobbies"       },
];

// Estrelinhas decorativas para o painel mobile
const PANEL_STARS = Array.from({ length: 30 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  r: Math.random() * 1.2 + 0.3,
  dur: 2 + Math.random() * 3,
  delay: Math.random() * 4,
}));

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled]  = useState(false);
  const menuRef = useRef(null);
  const btnRef  = useRef(null);

  // glassmorphism ao rolar
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // fecha ao clicar fora
  useEffect(() => {
    if (!menuOpen) return;
    const onClickOutside = (e) => {
      if (menuRef.current?.contains(e.target) || btnRef.current?.contains(e.target)) return;
      setMenuOpen(false);
    };
    const t = setTimeout(() => document.addEventListener("mousedown", onClickOutside), 10);
    return () => { clearTimeout(t); document.removeEventListener("mousedown", onClickOutside); };
  }, [menuOpen]);

  // bloqueia scroll quando menu aberto
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <header className="fixed top-0 w-full z-50">

      {/* backdrop glassmorphism */}
      <motion.div
        className="absolute inset-0 bg-slate-950/75 backdrop-blur-xl border-b border-white/5"
        initial={{ opacity: 0 }}
        animate={{ opacity: scrolled ? 1 : 0 }}
        transition={{ duration: 0.5 }}
      />

      <div className="relative z-10 max-w-6xl mx-auto flex items-center justify-between px-6 py-4">

        {/* LOGO */}
        <a href="#" className="group flex items-center gap-2">
          <motion.span
            className="flex items-center justify-center w-8 h-8 rounded-lg
              bg-secondary/8 border border-secondary/25"
            whileHover={{ boxShadow: "0 0 16px rgba(56,189,248,0.2)", borderColor: "rgba(56,189,248,0.5)" }}
            transition={{ duration: 0.4 }}
          >
            <span className="font-mono text-secondary text-xs font-bold">&lt;/&gt;</span>
          </motion.span>
          <h1 className="font-syne text-xl font-bold text-slate-100
            group-hover:text-secondary transition-colors duration-500">
            Ismael <span className="text-secondary">Moura</span>
          </h1>
        </a>

        {/* NAV DESKTOP */}
        <nav className="hidden md:flex items-center space-x-6">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="relative text-slate-300/80 text-sm font-mono tracking-wide
                transition-colors duration-400 hover:text-secondary
                after:absolute after:left-1/2 after:bottom-[-4px]
                after:h-px after:w-0 after:bg-secondary/60
                after:transition-all after:duration-400
                hover:after:w-full hover:after:left-0"
            >
              {link.label}
            </a>
          ))}
          <motion.a
            href="#contato"
            className="inline-flex items-center gap-1.5
              font-mono text-xs tracking-widest uppercase
              border border-secondary/30 text-secondary/80
              px-4 py-2 rounded-full transition-all duration-500"
            whileHover={{
              borderColor: "rgba(56,189,248,0.6)",
              color: "#38bdf8",
              boxShadow: "0 0 20px rgba(56,189,248,0.12)",
              backgroundColor: "rgba(56,189,248,0.05)",
            }}
          >
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            Contato
          </motion.a>
        </nav>

        {/* BOTÃO HAMBURGUER */}
        <button
          ref={btnRef}
          aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
          onClick={() => setMenuOpen((v) => !v)}
          className="md:hidden relative z-[60] w-10 h-10 flex flex-col justify-center items-center gap-[5px]
            rounded-xl border border-slate-700/50 hover:border-secondary/40
            transition-colors duration-400 cursor-pointer"
        >
          <motion.span
            animate={menuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="block w-5 h-px bg-secondary/80 origin-center"
          />
          <motion.span
            animate={menuOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.25 }}
            className="block w-5 h-px bg-secondary/80 origin-center"
          />
          <motion.span
            animate={menuOpen ? { rotate: -45, y: -6, width: "20px" } : { rotate: 0, y: 0, width: "12px" }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="block h-px bg-secondary/80 origin-center self-start ml-1"
          />
        </button>
      </div>

      {/* MENU MOBILE */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* overlay — escurece suavemente como noite chegando */}
            <motion.div
              key="overlay"
              className="md:hidden fixed inset-0 z-40"
              style={{ background: "radial-gradient(ellipse at 100% 0%, rgba(2,8,30,0.85) 0%, rgba(2,6,20,0.92) 100%)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              onClick={() => setMenuOpen(false)}
            />

            {/* painel lateral — desliza suavemente */}
            <motion.div
              key="panel"
              ref={menuRef}
              className="md:hidden fixed top-0 right-0 z-50 h-full w-72
                flex flex-col pt-24 pb-8 px-6 overflow-hidden"
              style={{ background: "linear-gradient(135deg, rgba(2,8,30,0.97) 0%, rgba(8,15,40,0.98) 100%)" }}
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* estrelinhas decorativas no painel */}
              <svg className="pointer-events-none absolute inset-0 w-full h-full opacity-40"
                xmlns="http://www.w3.org/2000/svg">
                {PANEL_STARS.map((s) => (
                  <circle key={s.id} cx={`${s.x}%`} cy={`${s.y}%`} r={s.r} fill="white">
                    <animate
                      attributeName="opacity"
                      values="0;0.6;0"
                      dur={`${s.dur}s`}
                      begin={`${s.delay}s`}
                      repeatCount="indefinite"
                    />
                  </circle>
                ))}
              </svg>

              {/* aurora sutil no canto superior */}
              <div className="pointer-events-none absolute top-0 right-0 w-48 h-48 opacity-15"
                style={{
                  background: "radial-gradient(circle at top right, rgba(56,189,248,1), rgba(99,102,241,0.5) 50%, transparent 70%)",
                  filter: "blur(30px)",
                }}
              />

              {/* borda esquerda com gradiente */}
              <div className="absolute top-0 left-0 bottom-0 w-px"
                style={{ background: "linear-gradient(to bottom, transparent, rgba(56,189,248,0.2) 30%, rgba(99,102,241,0.15) 70%, transparent)" }}
              />

              {/* label */}
              <motion.p
                className="font-mono text-[0.58rem] tracking-[0.35em] uppercase text-slate-500/70 mb-6 relative z-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                / navegação
              </motion.p>

              {/* links — entram um a um com float suave */}
              <div className="flex flex-col gap-1 relative z-10">
                {NAV_LINKS.map((link, i) => (
                  <motion.a
                    key={link.href}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    initial={{ opacity: 0, x: 20, filter: "blur(4px)" }}
                    animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                    transition={{ delay: 0.15 + i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="group flex items-center gap-3 py-3 px-4 rounded-xl
                      text-slate-300/80 border border-transparent
                      transition-all duration-400 font-syne font-medium text-base"
                    whileHover={{
                      x: 4,
                      color: "#38bdf8",
                      borderColor: "rgba(56,189,248,0.12)",
                      backgroundColor: "rgba(56,189,248,0.04)",
                    }}
                  >
                    {/* número estelar */}
                    <span className="font-mono text-[0.55rem] text-slate-600/80
                      group-hover:text-secondary/50 transition-colors duration-400 w-4 flex-shrink-0">
                      0{i + 1}
                    </span>
                    {link.label}
                    {/* seta suave */}
                    <motion.svg
                      className="w-3 h-3 ml-auto text-secondary/0 group-hover:text-secondary/60"
                      viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
                      initial={{ x: -4, opacity: 0 }}
                      whileHover={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </motion.svg>
                  </motion.a>
                ))}
              </div>

              {/* divisor estelar */}
              <motion.div
                className="my-5 h-px relative z-10"
                style={{ background: "linear-gradient(to right, transparent, rgba(56,189,248,0.15), transparent)" }}
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 1 }}
                transition={{ delay: 0.55, duration: 0.8, ease: "easeOut" }}
              />

              {/* botão contato */}
              <motion.a
                href="#contato"
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-center gap-2 relative z-10
                  font-mono text-xs tracking-widest uppercase
                  border border-secondary/20 text-secondary/70
                  py-3.5 rounded-xl transition-all duration-500"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                whileHover={{
                  borderColor: "rgba(56,189,248,0.45)",
                  color: "#38bdf8",
                  boxShadow: "0 0 24px rgba(56,189,248,0.10), inset 0 0 24px rgba(56,189,248,0.04)",
                }}
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                Contato
              </motion.a>

              {/* rodapé — coordenadas no espaço */}
              <motion.div
                className="mt-auto pt-6 border-t border-white/4 relative z-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.8 }}
              >
                <p className="font-mono text-[0.55rem] text-slate-700 text-center tracking-widest">
                  ismael<span className="text-secondary/60">.</span>dev
                </p>
                <p className="font-mono text-[0.48rem] text-slate-800 text-center tracking-wider mt-1">
                  23°32′S · 46°38′O
                </p>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}