import { useState, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Loader from "./components/Loader";
import WelcomeScreen from "./components/WelcomeScreen";
import MusicPlayer from "./components/MusicPlayer";
import { useLenis } from "./hooks/useLenis";

import Header from './components/Header';
import Hero from './components/Hero';
import AboutMe from './components/AboutMe';
import Projects from './components/Projects';
import Certificados from './components/Certificados';
import Hobbies from './components/Hobbies';
import Contact from './components/contact';
import Footer from './components/Footer';

export default function App() {
  // "loader" → "welcome" → "app"
  const [phase, setPhase] = useState("loader");
  const [audioUnlocked, setAudioUnlocked] = useState(false);

  const isApp = phase === "app";

  useLenis({ duration: 1.0, enabled: isApp });

  return (
    <>
      {/* 1. Loader */}
      {phase === "loader" && (
        <Loader
          onDone={() => setPhase("welcome")}
          // ── Aqui o usuário clicou em "Entrar" — áudio liberado pelo browser
          onUserInteracted={() => setAudioUnlocked(true)}
        />
      )}

      {/* 2. Tela de boas-vindas */}
      {phase === "welcome" && (
        <WelcomeScreen
          onDone={() => setPhase("app")}
        />
      )}

      {/* 3. Site completo */}
      {isApp && (
        <>
          {/*
            autoUnlocked={audioUnlocked} → true quando o usuário clicou em "Entrar"
            O MusicPlayer usa esse sinal para chamar .play() sem ser bloqueado pelo browser,
            já que o clique no Loader já desbloqueou o contexto de áudio.
          */}
          <MusicPlayer visible autoUnlocked={audioUnlocked} />

          <AnimatePresence>
            <div className="bg-slate-900 text-slate-100 font-sans min-h-screen">
              <motion.div
                key="page"
                initial={{ opacity: 0, filter: "brightness(2) blur(3px)" }}
                animate={{ opacity: 1, filter: "brightness(1) blur(0px)" }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              >
                <Header />
                <main>
                  <Hero />
                  <AboutMe />
                  <Projects />
                  <Certificados />
                  <Hobbies />
                  <Contact />
                </main>
                <Footer />
              </motion.div>
            </div>
          </AnimatePresence>
        </>
      )}
    </>
  );
}