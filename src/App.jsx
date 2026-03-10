import Header from './components/header'
import Hero from './components/Hero'
import AboutMe from './components/AboutMe'
import Projects from './components/Projects'
import Certificados from './components/certificados'
import Hobbies from './components/Hobbies'
import Contact from './components/contact'
import Footer from './components/footer'

export default function App() {
  return (
    <>
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
    </>
  )
}