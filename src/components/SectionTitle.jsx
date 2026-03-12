// SectionTitle.jsx
// Cabeçalho reutilizável com stagger via Framer Motion
// once: false → anima toda vez que entrar na viewport (não só na primeira)

import { motion } from "framer-motion";

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function SectionTitle({ tag, title, highlight, subtitle }) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.3 }} // ← reanima toda vez
      className="mb-12"
    >
      <motion.div variants={itemVariants} className="flex gap-3 items-center mb-2">
        <span className="w-8 h-8 rounded-lg bg-secondary/10 border border-secondary/30
          flex items-center justify-center">
          <span className="font-mono text-secondary text-xs font-bold">&lt;/&gt;</span>
        </span>
        <p className="font-mono text-xs tracking-[0.25em] uppercase text-secondary">
          {tag}
        </p>
      </motion.div>

      <motion.h3
        variants={itemVariants}
        className="font-arial text-4xl sm:text-5xl font-extrabold text-slate-100 leading-tight m-4"
      >
        {title}<span className="text-secondary">{highlight}</span>
      </motion.h3>

      {subtitle && (
        <motion.p
          variants={itemVariants}
          className="font-mono text-sm text-slate-500"
        >
          {subtitle}
        </motion.p>
      )}
    </motion.div>
  );
}