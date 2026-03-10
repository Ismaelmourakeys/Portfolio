export default function Contact() {
  return (
    <section
      id="contato"
      className="px-8 py-20"
      data-animate="left"
      data-animate-once
    >
      <h3 className="text-3xl font-bold mb-6 text-secondary">Contato</h3>
      <p className="text-slate-300 mb-6">Vamos conversar?</p>
      <div className="flex flex-wrap gap-6">
        <a href="mailto:Etecismael@gmail.com" className="hover:text-secondary transition-colors duration-300">
          📧 Email
        </a>
        <a
          href="https://github.com/Ismaelmourakeys"
          target="_blank"
          rel="noreferrer"
          className="hover:text-secondary transition-colors duration-300"
        >
          💻 GitHub
        </a>
        <a
          href="https://www.linkedin.com/in/ismaelmourakeys"
          target="_blank"
          rel="noreferrer"
          className="hover:text-secondary transition-colors duration-300"
        >
          🔗 LinkedIn
        </a>
      </div>
    </section>
  );
}