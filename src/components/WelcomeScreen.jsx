import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next"; // ← hook de tradução
import { motion, AnimatePresence } from "framer-motion";

const EXIT_DELAY = 4800;

// ─────────────────────────────────────────────────────────────
// ── CONFIG DAS LINHAS — só timing e estilo, texto vem do JSON
// t("welcome.lines.0") → "// SISTEMA INICIALIZADO" / "// SYSTEM INITIALIZED"
// ─────────────────────────────────────────────────────────────
const LINES_CONFIG = [
  { delay: 0,    type: 400, glitch: 350, color: "text-slate-500",   size: "text-xs",            mono: true  },
  { delay: 700,  type: 500, glitch: 400, color: "text-sky-400",     size: "text-sm",             mono: true  },
  { delay: 1500, type: 500, glitch: 400, color: "text-emerald-400", size: "text-sm",             mono: true  },
  { delay: 2300, type: 950, glitch: 650, color: "text-white",       size: "text-2xl sm:text-3xl", mono: false },
  { delay: 3500, type: 550, glitch: 400, color: "text-violet-400",  size: "text-xs",             mono: true  },
];

const GLITCH_CHARS = "█▓▒░⣿⠿⡟╋┼╬▪◈◆⬡✦✧⋆∴∵";

function useDecipherText(target, { startDelay = 0, glitchDuration = 500, typeDuration = 700, onDone } = {}) {
  const [display, setDisplay] = useState("");
  const [phase,   setPhase]   = useState("idle");

  useEffect(() => {
    let raf, timeout;
    timeout = setTimeout(() => {
      setPhase("glitch");
      const glitchStart = performance.now();
      const glitchLoop = (now) => {
        const elapsed  = now - glitchStart;
        const progress = Math.min(elapsed / glitchDuration, 1);
        const fixedCount = Math.floor(progress * target.length * 0.45);
        const fixed      = target.slice(0, fixedCount);
        const rest       = Array.from({ length: target.length - fixedCount }, () =>
          Math.random() > 0.3 ? GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)] : " "
        ).join("");
        setDisplay(fixed + rest);
        if (progress < 1) {
          raf = requestAnimationFrame(glitchLoop);
        } else {
          setPhase("type");
          let i = 0;
          const interval = typeDuration / target.length;
          const typeNext = () => {
            i++;
            setDisplay(target.slice(0, i));
            if (i < target.length) {
              timeout = setTimeout(typeNext, interval + (Math.random() - 0.5) * interval * 0.35);
            } else {
              setPhase("done");
              onDone?.();
            }
          };
          timeout = setTimeout(typeNext, 80);
        }
      };
      raf = requestAnimationFrame(glitchLoop);
    }, startDelay);
    return () => { cancelAnimationFrame(raf); clearTimeout(timeout); };
  }, [target, startDelay, glitchDuration, typeDuration]);

  return { display, phase };
}

function SpaceBg() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth; canvas.height = window.innerHeight;
    const nebulae = Array.from({ length: 4 }, () => ({
      x: Math.random(), y: Math.random(), r: 100 + Math.random() * 180,
      color: Math.random() > 0.5 ? [56,100,200] : [100,50,180],
      alpha: 0.02 + Math.random() * 0.025,
    }));
    const offscreen = document.createElement("canvas");
    offscreen.width = canvas.width; offscreen.height = canvas.height;
    const offCtx = offscreen.getContext("2d");
    nebulae.forEach((n) => {
      const g = offCtx.createRadialGradient(n.x*offscreen.width,n.y*offscreen.height,0,n.x*offscreen.width,n.y*offscreen.height,n.r);
      g.addColorStop(0,`rgba(${n.color.join(",")},${n.alpha})`); g.addColorStop(1,`rgba(${n.color.join(",")},0)`);
      offCtx.beginPath(); offCtx.arc(n.x*offscreen.width,n.y*offscreen.height,n.r,0,Math.PI*2); offCtx.fillStyle=g; offCtx.fill();
    });
    const stars = Array.from({ length: 140 }, () => {
      const depth = Math.random();
      return { x:Math.random(),y:Math.random(),r:depth*1.0+0.1,speed:0.0008+depth*0.002,phase:Math.random()*Math.PI*2,
        color:Math.random()>0.88?"rgba(56,189,248,":Math.random()>0.75?"rgba(167,139,250,":"rgba(200,210,240,",
        minAlpha:0.05+Math.random()*0.1,maxAlpha:0.3+depth*0.45 };
    });
    class Comet {
      constructor(initial=false){this.reset(initial);}
      reset(initial=false){
        const roll=Math.random();this.type=roll<0.55?0:roll<0.85?1:2;
        const rng=(a,b)=>a+Math.random()*(b-a);
        const sizes=[{len:[25,55],speed:[1.2,2.5],width:[0.3,0.55],op:[0.1,0.22]},{len:[80,150],speed:[2.5,4.0],width:[0.6,1.1],op:[0.25,0.42]},{len:[170,260],speed:[3.5,5.5],width:[1.1,1.9],op:[0.42,0.68]}];
        const s=sizes[this.type];
        this.x=Math.random()*canvas.width*1.5-canvas.width*0.25;this.y=initial?Math.random()*canvas.height*-1:-60;
        this.len=rng(...s.len);this.speed=rng(...s.speed);this.angle=Math.PI/4+(Math.random()-0.5)*0.45;
        this.width=rng(...s.width);this.opacity=rng(...s.op);
        this.hue=["220,235,255","230,240,255","210,228,248"][Math.floor(Math.random()*3)];
        this.active=!initial;this.timer=0;this.delay=initial?Math.floor(Math.random()*400):300+Math.floor(Math.random()*1000);
      }
      update(){if(!this.active){this.timer++;if(this.timer>=this.delay)this.active=true;return;}this.x+=Math.cos(this.angle)*this.speed;this.y+=Math.sin(this.angle)*this.speed;if(this.x>canvas.width+130||this.y>canvas.height+130)this.reset(false);}
      draw(){
        if(!this.active)return;
        const tx=this.x-Math.cos(this.angle)*this.len;const ty=this.y-Math.sin(this.angle)*this.len;
        const g=ctx.createLinearGradient(tx,ty,this.x,this.y);
        g.addColorStop(0,`rgba(${this.hue},0)`);g.addColorStop(0.55,`rgba(${this.hue},${(this.opacity*0.3).toFixed(3)})`);g.addColorStop(1,`rgba(${this.hue},${this.opacity.toFixed(3)})`);
        ctx.beginPath();ctx.moveTo(tx,ty);ctx.lineTo(this.x,this.y);ctx.strokeStyle=g;ctx.lineWidth=this.width;ctx.lineCap="round";ctx.stroke();
        if(this.type>0){const gr=this.width*(this.type===2?5.5:3.5);const gw=ctx.createRadialGradient(this.x,this.y,0,this.x,this.y,gr);gw.addColorStop(0,`rgba(${this.hue},${(this.opacity*0.9).toFixed(3)})`);gw.addColorStop(1,`rgba(${this.hue},0)`);ctx.beginPath();ctx.arc(this.x,this.y,gr,0,Math.PI*2);ctx.fillStyle=gw;ctx.fill();}
      }
    }
    const comets=Array.from({length:4},()=>new Comet(true));
    let raf;let fc=0;
    const draw=(t)=>{raf=requestAnimationFrame(draw);fc++;if(fc%2!==0)return;ctx.clearRect(0,0,canvas.width,canvas.height);ctx.drawImage(offscreen,0,0);
      stars.forEach((s)=>{const a=s.minAlpha+(s.maxAlpha-s.minAlpha)*(0.5+0.5*Math.sin(t*s.speed*60+s.phase));ctx.beginPath();ctx.arc(s.x*canvas.width,s.y*canvas.height,s.r,0,Math.PI*2);ctx.fillStyle=`${s.color}${a.toFixed(3)})`;ctx.fill();});
      comets.forEach((c)=>{c.update();c.draw();});
    };
    raf=requestAnimationFrame(draw);
    return ()=>cancelAnimationFrame(raf);
  }, []);
  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
}

function TextLine({ text, delay, typeDuration, glitchDuration, color, size, mono, onDone }) {
  const { display, phase } = useDecipherText(text, { startDelay: delay, glitchDuration, typeDuration, onDone });
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: phase === "idle" ? 0 : 1 }} transition={{ duration: 0.1 }}
      className={`${mono ? "font-mono" : "font-syne"} ${size} ${color} leading-relaxed tracking-wider`}
    >
      {display}
      {(phase === "glitch" || phase === "type") && (
        <motion.span className="inline-block w-[2px] h-[1em] bg-current ml-[2px] align-middle"
          animate={{ opacity: [1, 0, 1] }} transition={{ duration: 0.45, repeat: Infinity }} />
      )}
    </motion.div>
  );
}

export default function WelcomeScreen({ onDone }) {
  // ── Hook de tradução
  // O idioma já foi escolhido no Loader — as linhas aparecem traduzidas automaticamente
  // t("welcome.lines.0") → linha 0 no idioma atual
  const { t } = useTranslation();

  // ── LINES dinâmico: config de estilo/timing + texto traduzido do JSON
  const LINES = LINES_CONFIG.map((cfg, i) => ({
    ...cfg,
    text: t(`welcome.lines.${i}`),
  }));

  const [visible,  setVisible]  = useState(true);
  const [exiting,  setExiting]  = useState(false);
  const exitScheduled = useRef(false);

  const welcomeAudioRef = useRef(null);
  useEffect(() => {
    const audio = new Audio("/assets/audio/welcome_sound.wav");
    audio.preload = "auto"; audio.volume = 0.5; audio.load();
    welcomeAudioRef.current = audio;
    const timer = setTimeout(() => {
      try { audio.currentTime = 0; audio.play(); }
      catch (e) { console.warn("Erro ao reproduzir som de boas-vindas:", e); }
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (exitScheduled.current) return;
      exitScheduled.current = true;
      setExiting(true);
      setTimeout(() => setVisible(false), 800);
    }, EXIT_DELAY);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence onExitComplete={onDone}>
      {visible && (
        <motion.div key="welcome"
          className="fixed inset-0 z-[9998] flex flex-col items-center justify-center bg-slate-950 overflow-hidden"
          exit={{ opacity: 0, scale: 1.03 }}
          transition={{ duration: 0.75, ease: [0.4, 0, 0.2, 1] }}
        >
          <SpaceBg />

          <div className="pointer-events-none absolute inset-0 opacity-[0.03]"
            style={{ backgroundImage: `linear-gradient(rgba(56,189,248,1) 1px, transparent 1px), linear-gradient(90deg, rgba(56,189,248,1) 1px, transparent 1px)`, backgroundSize: "55px 55px" }} />

          <div className="pointer-events-none absolute rounded-full"
            style={{ width:700,height:700,background:"radial-gradient(circle, rgba(56,189,248,0.055) 0%, rgba(139,92,246,0.035) 40%, transparent 70%)",filter:"blur(45px)",top:"50%",left:"50%",transform:"translate(-50%,-50%)" }} />

          <motion.div className="pointer-events-none absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-sky-400/25 to-transparent"
            animate={{ top: ["8%","92%","8%"] }} transition={{ duration:7,repeat:Infinity,ease:"linear" }} />

          {["top-5 left-5 border-t-2 border-l-2","top-5 right-5 border-t-2 border-r-2","bottom-5 left-5 border-b-2 border-l-2","bottom-5 right-5 border-b-2 border-r-2"].map((cls,i)=>(
            <motion.div key={i} className={`absolute w-7 h-7 border-sky-400/35 ${cls}`}
              initial={{opacity:0,scale:0.4}} animate={{opacity:1,scale:1}}
              transition={{delay:0.15+i*0.07,duration:0.4,ease:[0.34,1.56,0.64,1]}} />
          ))}

          {/* Coordenadas e ONLINE — termos técnicos/fixos, não traduzem */}
          <motion.div className="absolute bottom-5 left-8 font-mono text-[10px] text-slate-700 tracking-widest"
            initial={{opacity:0}} animate={{opacity:1}} transition={{delay:1.2}}>
            23°32'S 46°38'W · SETOR: FRONT-END
          </motion.div>

          <motion.div className="absolute top-5 right-10 flex items-center gap-1.5 font-mono text-[10px] text-slate-600 tracking-widest"
            initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.8}}>
            <motion.span className="w-1.5 h-1.5 rounded-full bg-emerald-500"
              animate={{opacity:[0.4,1,0.4]}} transition={{duration:1.8,repeat:Infinity}} />
            ONLINE
          </motion.div>

          {/* ── Terminal central */}
          <motion.div className="relative z-10 w-full max-w-lg px-5"
            initial={{opacity:0,y:24}} animate={{opacity:1,y:0}}
            transition={{duration:0.5,delay:0.1,ease:[0.16,1,0.3,1]}}>
            <div className="border border-sky-400/18 rounded-xl bg-slate-950/85 backdrop-blur-sm overflow-hidden"
              style={{boxShadow:"0 0 50px rgba(56,189,248,0.05), inset 0 0 40px rgba(56,189,248,0.015)"}}>

              {/* Barra do terminal — nome próprio, não traduz */}
              <div className="flex items-center gap-2 px-4 py-2.5 border-b border-slate-800/80 bg-slate-900/50">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/55" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/55" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/55" />
                <span className="ml-2 font-mono text-[10px] text-slate-600 tracking-widest select-none">
                  PORTFOLIO_OS v1.0 — ISMAEL MOURA
                </span>
              </div>

              {/* Corpo do terminal — linhas já traduzidas via t() */}
              <div className="px-5 py-5 flex flex-col gap-2.5 min-h-[160px]">
                {LINES.map((line, i) => (
                  <TextLine
                    key={i}
                    text={line.text}
                    delay={line.delay}
                    typeDuration={line.type}
                    glitchDuration={line.glitch}
                    color={line.color}
                    size={line.size}
                    mono={line.mono}
                    onDone={() => {}}
                  />
                ))}
              </div>

              {/* Barra de progresso de saída */}
              <div className="px-5 pb-4">
                <div className="h-[2px] w-full bg-slate-800 rounded-full overflow-hidden">
                  <motion.div className="h-full rounded-full bg-gradient-to-r from-sky-400 via-violet-400 to-emerald-400"
                    initial={{ width: "0%" }}
                    animate={{ width: exiting ? "100%" : "0%" }}
                    transition={{ duration: 0.75, ease: "easeIn" }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}