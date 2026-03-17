import { useState, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Loader from "./components/Loader";
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
  const [loading, setLoading] = useState(true);
  const [audioUnlocked, setAudioUnlocked] = useState(false);
  const musicRef = useRef(null);

  useLenis({ duration: 1.0, enabled: !loading });

  // chamado quando o usuário clica em "Entrar" no loader
  // esse clique é a interação que o browser exige para liberar o áudio
  const handleUserInteracted = () => {
    setAudioUnlocked(true);
  };

  return (
    <>
      <Loader
        onDone={() => setLoading(false)}
        onUserInteracted={handleUserInteracted}
      />

      {/* player aparece junto com a página, já minimizado e tocando */}
      <MusicPlayer visible={!loading} autoUnlocked={audioUnlocked} />

      <AnimatePresence>
        {!loading && (
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
        )}
      </AnimatePresence>
    </>
  );
}