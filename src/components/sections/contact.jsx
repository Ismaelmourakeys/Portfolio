import { motion } from "framer-motion";
import { useTranslation } from "react-i18next"; // ← importa o hook de tradução
import SectionTitle from "../layout/SectionTitle";

// ── Labels (Email, GitHub, etc.) são nomes próprios — não traduzem
// O único campo dinâmico é o subject do email, que muda por idioma
const LINKS = [
  {
    label: "Email",
    value: "ismael_moura@outlook.com",
    // href dinâmico — montado dentro do componente com t()
    hrefBase: "mailto:ismael_moura@outlook.com?subject=",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="M2 7l10 7 10-7" />
      </svg>
    ),
    colorClasses: {
      text: "text-sky-400", bg: "bg-sky-400/10", border: "border-sky-400/20",
      hoverBorder: "hover:border-sky-400/50", glow: "rgba(56,189,248,0.12)",
    },
  },
  {
    label: "GitHub",
    value: "Ismaelmourakeys",
    href: "https://github.com/Ismaelmourakeys",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
      </svg>
    ),
    colorClasses: {
      text: "text-slate-300", bg: "bg-slate-400/10", border: "border-slate-600/40",
      hoverBorder: "hover:border-slate-400/50", glow: "rgba(148,163,184,0.10)",
    },
  },
  {
    label: "LinkedIn",
    value: "ismaelmourakeys",
    href: "https://www.linkedin.com/in/ismaelmourakeys",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
    colorClasses: {
      text: "text-blue-400", bg: "bg-blue-400/10", border: "border-blue-400/20",
      hoverBorder: "hover:border-blue-400/50", glow: "rgba(96,165,250,0.12)",
    },
  },
  {
    label: "Instagram",
    value: "@ismaelmourakeys",
    href: "https://www.instagram.com/ismaelmourakeys/",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
      </svg>
    ),
    colorClasses: {
      text: "text-pink-400", bg: "bg-pink-400/10", border: "border-pink-400/20",
      hoverBorder: "hover:border-pink-400/50", glow: "rgba(244,114,182,0.12)",
    },
  },
];

function ContactCard({ link, index, emailSubject }) {
  const { label, value, href, hrefBase, icon, colorClasses } = link;

  // ── Se for email, monta o href com o subject traduzido
  // hrefBase existe só no link de email — os outros já têm href completo
  const finalHref = hrefBase ? `${hrefBase}${encodeURIComponent(emailSubject)}` : href;

  return (
    <motion.a
      href={finalHref}
      target={finalHref.startsWith("mailto") ? "_self" : "_blank"}
      rel="noreferrer"
      initial={{ opacity: 0, y: 30, scale: 0.92 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: false, amount: 0.2 }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.34, 1.56, 0.64, 1] }}
      whileHover={{
        y: -4,
        boxShadow: `0 20px 40px ${colorClasses.glow}, 0 4px 16px rgba(0,0,0,0.4)`,
      }}
      className={`group flex items-center gap-4 p-5 rounded-2xl
        bg-slate-800/60 border ${colorClasses.border} ${colorClasses.hoverBorder}
        transition-colors duration-300 cursor-pointer`}
    >
      <div className={`flex-shrink-0 w-11 h-11 rounded-xl ${colorClasses.bg} border ${colorClasses.border}
        flex items-center justify-center ${colorClasses.text}
        group-hover:scale-110 transition-transform duration-300`}>
        {icon}
      </div>

      <div className="flex flex-col min-w-0">
        {/* label = nome da rede — não traduz */}
        <span className={`font-mono text-[0.6rem] tracking-widest uppercase ${colorClasses.text} mb-0.5`}>
          {label}
        </span>
        <span className="text-slate-200 text-sm font-medium truncate group-hover:text-white transition-colors duration-200">
          {value}
        </span>
      </div>

      <svg className={`w-4 h-4 ml-auto flex-shrink-0 ${colorClasses.text}
        opacity-0 group-hover:opacity-100 translate-x-0 group-hover:translate-x-1
        transition-all duration-300`}
        viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M7 17L17 7M17 7H7M17 7v10" />
      </svg>
    </motion.a>
  );
}

export default function Contact() {
  // ── Hook de tradução
  const { t } = useTranslation();

  return (
    <section
      id="contato"
      className="relative px-8 py-20 bg-gradient-to-b from-slate-900 to-slate-950 overflow-hidden"
    >
      <div className="pointer-events-none absolute -top-40 -left-40 w-[500px] h-[500px]
        bg-[radial-gradient(circle,rgba(56,189,248,0.05),transparent_70%)]" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 w-[400px] h-[400px]
        bg-[radial-gradient(circle,rgba(139,92,246,0.05),transparent_70%)]" />

      <div className="relative z-10 max-w-3xl">

        {/*
          t("contact.tag")      → "/ Contato"      / "/ Contact"   / "/ Contacto"
          t("contact.title")    → "Vamos"           / "Let's"       / "¿Hablamos?"
          t("contact.highlight")→ " conversar?"     / " talk?"      / ""  (es já tem tudo no title)
          t("contact.subtitle") → subtítulo traduzido
        */}
        <SectionTitle
          tag={t("contact.tag")}
          title={t("contact.title")}
          highlight={t("contact.highlight")}
          subtitle={t("contact.subtitle")}
        />

        {/*
          t("contact.available") → "Disponível para projetos"
                                 / "Available for projects"
                                 / "Disponible para proyectos"
        */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.4, delay: 0.2, ease: [0.34, 1.56, 0.64, 1] }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full
            bg-emerald-400/10 border border-emerald-400/20 mb-10"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-mono text-[0.65rem] tracking-widest uppercase text-emerald-400">
            {t("contact.available")}
          </span>
        </motion.div>

        {/* Cards — passa emailSubject para o card de email */}
        <div className="flex flex-col gap-3">
          {LINKS.map((link, index) => (
            <ContactCard
              key={link.label}
              link={link}
              index={index}
              // t("contact.email_subject") → "Olá Ismael" / "Hello Ismael" / "Hola Ismael"
              emailSubject={t("contact.email_subject")}
            />
          ))}
        </div>

        {/* t("contact.cv") → "Baixar Currículo" / "Download Resume" / "Descargar Currículum" */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-8"
        >
          <motion.a
            href="/assets/docs/Curriculo_IsmaelMoura.pdf"
            target="_blank"
            rel="noreferrer"
            whileHover={{ scale: 1.04, boxShadow: "0 0 32px rgba(56,189,248,0.25)" }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-2.5 bg-secondary text-slate-900
              font-syne font-bold text-sm px-7 py-3 rounded-xl
              hover:brightness-110 transition-all duration-300"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 10v6M9 13l3 3 3-3" />
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
            {t("contact.cv")}
          </motion.a>
        </motion.div>

      </div>
    </section>
  );
}