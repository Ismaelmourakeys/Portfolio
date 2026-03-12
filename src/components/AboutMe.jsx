// AboutMe.jsx com animações Framer Motion
// Cada bloco entra com fade + slide de baixo pra cima ao entrar na viewport
// once: false → reanima toda vez que o usuário scrolla até a seção

import { motion } from "framer-motion";

const SKILLS = [
  { icon: "devicon-html5-plain", label: "HTML" },
  { icon: "devicon-css3-plain", label: "CSS" },
  { icon: "devicon-javascript-plain", label: "JavaScript" },
  { icon: "devicon-python-plain", label: "Python" },
  { icon: "devicon-firebase-plain", label: "Firebase" },
  { icon: "devicon-react-original", label: "React Native" },
  { icon: "devicon-nodejs-plain", label: "Node.js" },
  { icon: "devicon-tailwindcss-plain", label: "Tailwind" },
  { icon: "devicon-git-plain", label: "Git" },
  { icon: "devicon-github-original", label: "GitHub" },
];

const AREAS = [
  { title: "Front-end", desc: "Interfaces modernas e acessíveis" },
  { title: "Mobile", desc: "Apps com React Native" },
  { title: "UI / UX", desc: "Experiência focada no usuário" },
];

// Variante reutilizável — fade + slide de baixo pra cima
// Usada em todos os blocos da seção
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

// Variante para stagger dos filhos (skills, áreas, CTAs)
const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.07 },
  },
};

const staggerItem = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
  },
};

// Atalho para as props comuns do whileInView
// Evita repetir viewport={{ once: false, amount: 0.2 }} em todo lugar
const inView = { once: false, amount: 0.2 };

export default function AboutMe() {
  return (
    <section id="sobre" className="px-6 py-20 bg-slate-800">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">

        {/* CARD COM FOTO — entra da esquerda */}
        <motion.div
          className="relative group"
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={inView}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="relative mx-auto md:mx-0 md:absolute md:-bottom-48 w-72
            sm:w-80 md:w-96 bg-gradient-to-b from-slate-900/50 to-transparent rounded-3xl
            p-6 md:p-10 shadow-2xl ring-1 ring-white/10 backdrop-blur-sm
            transition-transform duration-300 group-hover:-translate-y-2">

            <img
              src="/assets/img/FotoPerfil.jpg"
              alt="Foto de Ismael Moura"
              className="w-56 h-full rounded-2xl object-cover mx-auto border-4 border-secondary
                shadow-xl transition-transform duration-500 group-hover:scale-105"
            />

            <div className="mt-6 text-center">
              <h4 className="text-xl font-semibold text-secondary">Ismael Moura</h4>
              <p className="text-sm text-slate-300 mt-1">Desenvolvedor Front-end 💡</p>
            </div>
          </div>

          <div className="hidden md:block absolute -right-6 -bottom-6 w-28 h-28 rounded-lg
            bg-gradient-to-tr from-secondary/30 to-yellow-300/10 blur-xl pointer-events-none" />
        </motion.div>

        {/* BLOCO DE TEXTO — stagger interno */}
        <motion.div
          className="text-slate-200"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={inView}
        >
          <div className="flex flex-col gap-4">

            {/* label topo */}
            <motion.div variants={fadeUp} className="flex items-center sm:justify-start justify-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-secondary/10 border border-secondary/30
                flex items-center justify-center">
                <span className="font-mono text-secondary text-xs font-bold">&lt;/&gt;</span>
              </span>
              <p className="font-mono text-xs tracking-[0.25em] uppercase text-secondary mb-2">
                / quem sou eu
              </p>
            </motion.div>

            {/* título */}
            <motion.div variants={fadeUp} className="flex items-center sm:justify-start justify-center">
              <h3 className="font-arial text-4xl sm:text-5xl font-extrabold text-slate-100 leading-tight">
                Sobre <span className="text-secondary">mim</span>
              </h3>
            </motion.div>

            {/* texto scrollável */}
            <motion.div
              variants={fadeUp}
              className="sobre-scroll space-y-6 text-slate-300 leading-relaxed
                text-center sm:text-start text-sm sm:text-base max-h-72 overflow-y-auto pr-3"
            >
              <div>
                <p className="font-mono text-[0.6rem] text-sky-400 tracking-widest uppercase mb-2">/ origem</p>
                <p className="text-slate-400 leading-relaxed">
                  Tenho um perfil dedicado, disciplinado e motivado pelo aprendizado constante.
                  Minha trajetória começou fora da tecnologia — como{" "}
                  <strong className="text-slate-200">músico</strong>, professor e educador musical,
                  tocando em igrejas e casamentos, e também com{" "}
                  <strong className="text-slate-200">atendimento ao público</strong>,
                  onde desenvolvi comunicação, organização e trabalho em equipe.
                </p>
              </div>

              <div>
                <p className="font-mono text-[0.6rem] text-violet-400 tracking-widest uppercase mb-2">/ virada</p>
                <p className="text-slate-400 leading-relaxed">
                  Com o incentivo e apoio de uma amiga da área, passei a me interessar por tecnologia
                  e criação de soluções que impactam pessoas. Isso me levou ao{" "}
                  <strong className="text-slate-200">ensino técnico pela ETEC</strong>, com contato
                  estruturado em lógica de programação, desenvolvimento web e criação de interfaces.
                </p>
              </div>

              <div>
                <p className="font-mono text-[0.6rem] text-emerald-400 tracking-widest uppercase mb-2">/ agora</p>
                <p className="text-slate-400 leading-relaxed">
                  Focado em evoluir como dev, praticando{" "}
                  <strong className="text-slate-200">HTML, CSS, JavaScript, React, React Native</strong>{" "}
                  e frameworks modernos, com versionamento em{" "}
                  <strong className="text-slate-200">Git/GitHub</strong>. Objetivo: iniciar a graduação em{" "}
                  <strong className="text-slate-200">Análise e Desenvolvimento de Sistemas</strong>{" "}
                  e ingressar no mercado contribuindo com projetos que façam diferença.
                </p>
              </div>
            </motion.div>

            {/* SKILLS — cada pill aparece em stagger */}
            <motion.div
              variants={staggerContainer}
              className="flex flex-wrap gap-3 mt-4 items-center justify-center sm:justify-start"
            >
              {SKILLS.map((skill) => (
                <motion.span
                  key={skill.label}
                  variants={staggerItem}
                  className="inline-flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full
                    text-xs font-medium text-slate-100 border border-white/10
                    hover:border-secondary/50 hover:bg-secondary/10 transition-all cursor-default"
                >
                  <i className={`${skill.icon} colored`} />
                  {skill.label}
                </motion.span>
              ))}
            </motion.div>

            {/* ÁREAS — cada card aparece em stagger */}
            <motion.div
              variants={staggerContainer}
              className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center"
            >
              {AREAS.map((area) => (
                <motion.div
                  key={area.title}
                  variants={staggerItem}
                  className="bg-white/5 border border-white/10 rounded-2xl p-4
                    hover:bg-white/10 transition"
                >
                  <h5 className="text-secondary font-semibold">{area.title}</h5>
                  <p className="text-xs text-slate-400 mt-1">{area.desc}</p>
                </motion.div>
              ))}
            </motion.div>

            {/* CTAs */}
            <motion.div
              variants={fadeUp}
              className="mt-6 flex flex-wrap gap-3 justify-center"
            >
              <a
                href="#contato"
                className="inline-flex items-center gap-2 bg-secondary text-slate-900
                  px-6 py-3 rounded-xl text-sm font-semibold
                  hover:scale-105 hover:opacity-90 transition"
              >
                Entrar em contato
              </a>
              <a
                href="#projetos"
                className="inline-flex items-center gap-2
                  border border-slate-600 text-slate-300 font-mono text-xs tracking-widest uppercase
                  px-6 py-3 rounded-xl
                  hover:border-secondary/50 hover:text-secondary hover:bg-secondary/5
                  transition-all duration-300"
              >
                Ver projetos
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </a>
            </motion.div>

          </div>
        </motion.div>
      </div>
    </section>
  );
}