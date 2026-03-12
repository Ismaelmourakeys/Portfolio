import Header from './components/Header'
import Hero from './components/Hero'
import AboutMe from './components/AboutMe'
import Projects from './components/Projects'
import Certificados from './components/Certificados'
import Hobbies from './components/Hobbies'
import Contact from './components/contact'
import Footer from './components/Footer'

import { useState } from "react";
import Loader from "./components/Loader";

export default function App() {
  
  const [loading, setLoading] = useState(true);
  
  return (
    <>
    <Loader onDone={() => setLoading(false)}/>
      {!loading && (
    <div className="bg-slate-900 text-slate-100 font-sans min-h-screen">
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
    </div>
    )}
    </>
  );
}