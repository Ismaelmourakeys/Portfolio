import { motion } from "framer-motion";
import { useTranslation } from "react-i18next"; // ← importa o hook de tradução

export default function Footer() {
  // ── Hook de tradução — só o copyright muda entre idiomas
  const { t } = useTranslation();

  return (
    <footer className="relative bg-slate-950 overflow-hidden">

      <div className="h-px w-full bg-gradient-to-r from-transparent via-secondary/40 to-transparent" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">

          {/* Logo — nome próprio, não traduz */}
          <motion.a
            href="#"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.5 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="group flex items-center gap-2"
          >
            <span className="flex items-center justify-center w-8 h-8 rounded-lg
              bg-secondary/10 border border-secondary/30
              group-hover:bg-secondary/20 transition-colors duration-300">
              <span className="font-mono text-secondary text-xs font-bold">&lt;/&gt;</span>
            </span>
            <span className="font-syne text-xl font-bold text-slate-100
              group-hover:text-secondary transition-colors duration-300">
              Ismael <span className="text-secondary">Moura</span>
            </span>
          </motion.a>

          {/* Nav */}
          <motion.nav
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.5 }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap justify-center gap-x-6 gap-y-2"
          />

          {/*
            Copyright:
            t("footer.rights") → "Todos os direitos reservados."
                               / "All rights reserved."
                               / "Todos los derechos reservados."
          */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.5 }}
            transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="font-mono text-xs text-slate-600 whitespace-nowrap"
          >
            &copy; {new Date().getFullYear()} Ismael Moura. {t("footer.rights")}
          </motion.p>

        </div>
      </div>
    </footer>
  );
}