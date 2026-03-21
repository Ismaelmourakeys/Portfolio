// AboutMe.jsx — fundo espacial com constelação animada + foto maior em destaque
// Desktop: foto à esquerda (maior) + texto à direita
// Mobile: foto compacta no topo + texto fluindo naturalmente abaixo

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SKILLS = [
  { icon: "devicon-html5-plain",       label: "HTML"         },
  { icon: "devicon-css3-plain",         label: "CSS"          },
  { icon: "devicon-javascript-plain",   label: "JavaScript"   },
  { icon: "devicon-python-plain",       label: "Python"       },
  { icon: "devicon-firebase-plain",     label: "Firebase"     },
  { icon: "devicon-react-original",     label: "React Native" },
  { icon: "devicon-nodejs-plain",       label: "Node.js"      },
  { icon: "devicon-tailwindcss-plain",  label: "Tailwind"     },
  { icon: "devicon-git-plain",          label: "Git"          },
  { icon: "devicon-github-original",    label: "GitHub"       },
];

const AREAS = [
  { title: "Front-end", desc: "Interfaces modernas e acessíveis", icon: "⬡" },
  { title: "Mobile",    desc: "Apps com React Native",            icon: "◈" },
  { title: "UI / UX",   desc: "Experiência focada no usuário",    icon: "✦" },
];



// ─────────────────────────────────────────────────────────────
// Spring configs e variantes de animação
// ─────────────────────────────────────────────────────────────
const SPRING_SOFT   = { type: "spring", stiffness: 80,  damping: 14, mass: 0.9 };
const SPRING_BOUNCE = { type: "spring", stiffness: 120, damping: 10, mass: 0.7 };
const SPRING_FAST   = { type: "spring", stiffness: 200, damping: 18, mass: 0.5 };

const dropIn = (delay = 0, spring = SPRING_BOUNCE) => ({
  hidden:  { opacity: 0, y: -60, scale: 0.92 },
  visible: { opacity: 1, y: 0,   scale: 1, transition: { ...spring, delay, opacity: { duration: 0.3, delay } } },
  exit:    { opacity: 0, y: 30,  scale: 0.95, transition: { duration: 0.35, ease: [0.4,0,0.2,1] } },
});

const staggerContainer = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0 } },
  exit:    { transition: { staggerChildren: 0.04, staggerDirection: -1 } },
};

const springItem = {
  hidden:  { opacity: 0, y: -28, scale: 0.88 },
  visible: { opacity: 1, y: 0,   scale: 1, transition: { ...SPRING_FAST, opacity: { duration: 0.25 } } },
  exit:    { opacity: 0, y: 15,  scale: 0.92, transition: { duration: 0.2 } },
};

const inView = { once: false, amount: 0.15 };

// ─────────────────────────────────────────────────────────────
export default function AboutMe() {
  return (
    <>
      <section
        id="sobre"
        className="relative px-5 sm:px-8 py-20 sm:py-28 overflow-hidden"
      >


        <div className="relative z-10 max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-start gap-10 md:gap-14">

            {/* ── FOTO */}
            <motion.div
              className="flex-shrink-0 flex flex-col items-center md:items-start"
              variants={dropIn(0, SPRING_SOFT)}
              initial="hidden" whileInView="visible" exit="exit" viewport={inView}
            >
              <div className="relative group">
                <div
                  className="absolute inset-0 rounded-3xl blur-2xl opacity-25 scale-95 pointer-events-none"
                  style={{ background: "radial-gradient(circle, rgba(56,189,248,0.7) 0%, rgba(139,92,246,0.5) 60%, transparent 100%)" }}
                />
                <div className="relative w-48 sm:w-60 md:w-72 bg-gradient-to-b from-slate-800/50 to-slate-900/30 rounded-3xl p-4 sm:p-5 md:p-6 ring-1 ring-white/10 backdrop-blur-sm transition-transform duration-500 group-hover:-translate-y-2">
                  <img
                    src="/assets/img/FotoPerfil.jpg"
                    alt="Foto de Ismael Moura"
                    className="w-full aspect-square rounded-2xl object-cover border-2 border-secondary/35 shadow-2xl transition-transform duration-500 group-hover:scale-[1.03]"
                    style={{ objectPosition: "center 20%" }}
                  />
                  <div className="mt-4 text-center">
                    <h4 className="text-sm sm:text-base font-semibold text-secondary">Ismael Moura</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Desenvolvedor Front-end 💡</p>
                  </div>
                </div>
              </div>

              {/* Áreas desktop */}
              <div className="hidden md:flex flex-col gap-2 mt-5 w-full max-w-[17rem]">
                {AREAS.map((area, i) => (
                  <motion.div
                    key={area.title}
                    className="flex items-center gap-3 bg-white/[0.04] border border-white/8 rounded-xl px-3.5 py-2.5 hover:bg-white/[0.07] transition-colors"
                    variants={dropIn(0.25 + i * 0.1, SPRING_FAST)}
                    initial="hidden" whileInView="visible" exit="exit" viewport={inView}
                  >
                    <span className="text-secondary text-base">{area.icon}</span>
                    <div>
                      <p className="text-xs font-semibold text-slate-200">{area.title}</p>
                      <p className="text-[10px] text-slate-500">{area.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* ── TEXTO */}
            <motion.div
              className="flex flex-col gap-5 text-slate-200 flex-1"
              variants={staggerContainer} initial="hidden" whileInView="visible" viewport={inView}
            >
              <motion.div variants={dropIn(0, SPRING_BOUNCE)} className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-lg bg-secondary/10 border border-secondary/30 flex items-center justify-center flex-shrink-0">
                  <span className="font-mono text-secondary text-[10px] font-bold">&lt;/&gt;</span>
                </span>
                <p className="font-mono text-[0.65rem] tracking-[0.28em] uppercase text-secondary">/ quem sou eu</p>
              </motion.div>

              <motion.h3 variants={dropIn(0.08, SPRING_BOUNCE)} className="font-syne text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-100 leading-tight">
                Sobre <span className="text-secondary">mim</span>
              </motion.h3>

              <motion.div variants={dropIn(0.16, SPRING_SOFT)} className="flex flex-col gap-5 text-slate-400 text-sm sm:text-[0.95rem] leading-relaxed">
                <div>
                  <p className="font-mono text-[0.58rem] text-sky-400 tracking-widest uppercase mb-1.5">/ origem</p>
                  <p>Tenho um perfil dedicado, disciplinado e motivado pelo aprendizado constante. Minha trajetória começou fora da tecnologia — como <strong className="text-slate-200">músico</strong>, professor e educador musical, tocando em igrejas e casamentos, e também com <strong className="text-slate-200">atendimento ao público</strong>, onde desenvolvi comunicação, organização e trabalho em equipe.</p>
                </div>
                <div>
                  <p className="font-mono text-[0.58rem] text-violet-400 tracking-widest uppercase mb-1.5">/ virada</p>
                  <p>Com o incentivo e apoio de uma amiga da área, passei a me interessar por tecnologia e criação de soluções que impactam pessoas. Isso me levou ao <strong className="text-slate-200">ensino técnico pela ETEC</strong>, com contato estruturado em lógica de programação, desenvolvimento web e criação de interfaces.</p>
                </div>
                <div>
                  <p className="font-mono text-[0.58rem] text-emerald-400 tracking-widest uppercase mb-1.5">/ agora</p>
                  <p>Focado em evoluir como dev, praticando <strong className="text-slate-200">HTML, CSS, JavaScript, React, React Native</strong> e frameworks modernos, com versionamento em <strong className="text-slate-200">Git/GitHub</strong>. Objetivo: iniciar a graduação em <strong className="text-slate-200">Análise e Desenvolvimento de Sistemas</strong> e ingressar no mercado contribuindo com projetos que façam diferença.</p>
                </div>
              </motion.div>

              {/* Áreas mobile */}
              <motion.div variants={staggerContainer} className="grid grid-cols-3 gap-2 md:hidden">
                {AREAS.map((area) => (
                  <motion.div key={area.title} variants={springItem} className="flex flex-col items-center text-center gap-1 bg-white/[0.04] border border-white/8 rounded-xl p-3 hover:bg-white/[0.07] transition-colors">
                    <span className="text-secondary text-lg">{area.icon}</span>
                    <p className="text-[11px] font-semibold text-slate-200">{area.title}</p>
                    <p className="text-[9px] text-slate-500 leading-tight">{area.desc}</p>
                  </motion.div>
                ))}
              </motion.div>

              {/* Skills */}
              <motion.div variants={staggerContainer} className="flex flex-wrap gap-2">
                {SKILLS.map((skill) => (
                  <motion.span key={skill.label} variants={springItem}
                    className="inline-flex items-center gap-1.5 bg-white/[0.05] px-2.5 py-1.5 rounded-full text-[11px] font-medium text-slate-300 border border-white/8 hover:border-secondary/45 hover:bg-secondary/[0.08] transition-all duration-200 cursor-default">
                    <i className={`${skill.icon} colored text-sm`} />
                    {skill.label}
                  </motion.span>
                ))}
              </motion.div>

              {/* CTAs */}
              <motion.div variants={dropIn(0.1, SPRING_BOUNCE)} className="flex flex-wrap gap-3 pt-1">
                <a href="#contato" className="inline-flex items-center gap-2 bg-secondary text-slate-900 px-5 py-2.5 rounded-xl text-sm font-bold hover:scale-105 hover:brightness-110 transition-all duration-300 shadow-[0_0_20px_rgba(56,189,248,0.18)]">
                  Entrar em contato
                </a>
                <a href="#projetos" className="inline-flex items-center gap-2 border border-slate-600/60 text-slate-400 font-mono text-[11px] tracking-widest uppercase px-5 py-2.5 rounded-xl hover:border-secondary/50 hover:text-secondary hover:bg-secondary/5 transition-all duration-300">
                  Ver projetos
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                </a>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

    </>
  );
}