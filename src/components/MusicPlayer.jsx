import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useDragControls } from "framer-motion";
import { useTranslation } from "react-i18next"; // ← hook de tradução

const MUSIC_SRC   = "/assets/audio/Study_with_me.wav";
const MUSIC_TITLE = "Ismael Moura"; // nome próprio — não traduz

// ── Visualizador de barras animado via Web Audio API
function AudioVisualizer({ analyser, playing }) {
  const canvasRef = useRef(null);
  const rafRef    = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !analyser) return;
    const ctx         = canvas.getContext("2d");
    const bufferLength = analyser.frequencyBinCount;
    const dataArray   = new Uint8Array(bufferLength);
    const W = canvas.width; const H = canvas.height;
    const BAR_COUNT = 28; const BAR_W = 2.5;
    const GAP = (W - BAR_COUNT * BAR_W) / (BAR_COUNT + 1);

    const draw = () => {
      rafRef.current = requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);
      ctx.clearRect(0, 0, W, H);
      for (let i = 0; i < BAR_COUNT; i++) {
        const dataIndex = Math.floor((i / BAR_COUNT) * bufferLength * 0.7);
        const value = playing ? dataArray[dataIndex] : 0;
        const minH  = playing ? 2 : 1 + Math.sin(Date.now() * 0.003 + i * 0.5) * 1;
        const barH  = Math.max(minH, (value / 255) * H * 0.85);
        const x = GAP + i * (BAR_W + GAP); const y = (H - barH) / 2;
        const hue = 200 + (i / BAR_COUNT) * 120;
        const alpha = 0.5 + (value / 255) * 0.5;
        const grad = ctx.createLinearGradient(x, y + barH, x, y);
        grad.addColorStop(0,   `hsla(${hue},90%,60%,${alpha.toFixed(2)})`);
        grad.addColorStop(0.5, `hsla(${hue+30},95%,75%,${Math.min(1, alpha+0.2).toFixed(2)})`);
        grad.addColorStop(1,   `hsla(${hue+60},80%,55%,${alpha.toFixed(2)})`);
        ctx.beginPath(); ctx.roundRect(x, y, BAR_W, barH, 1.5);
        ctx.fillStyle = grad; ctx.fill();
      }
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, [analyser, playing]);

  return <canvas ref={canvasRef} width={110} height={32} className="opacity-90" />;
}

export default function MusicPlayer({ visible = true, autoUnlocked = false }) {
  // ── Hook de tradução
  // Só o subtítulo muda entre idiomas
  // t("music.subtitle") → "composição pessoal" / "personal composition" / "composición personal"
  const { t } = useTranslation();

  const audioRef    = useRef(null);
  const audioCtxRef = useRef(null);
  const analyserRef = useRef(null);
  const sourceRef   = useRef(null);

  const [playing,   setPlaying]   = useState(false);
  const [volume,    setVolume]    = useState(0.5);
  const [progress,  setProgress]  = useState(0);
  const [duration,  setDuration]  = useState(0);
  const [minimized, setMinimized] = useState(true);
  const [ready,     setReady]     = useState(false);

  // ── Drag: posição inicial no canto inferior direito
  // Salva a posição no state para persistir durante a sessão
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const dragConstraintsRef = useRef(null);

  const setupAudio = useCallback(() => {
    if (audioCtxRef.current) return;
    const audio = audioRef.current; if (!audio) return;
    const ctx     = new (window.AudioContext || window.webkitAudioContext)();
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 128; analyser.smoothingTimeConstant = 0.75;
    const source = ctx.createMediaElementSource(audio);
    source.connect(analyser); analyser.connect(ctx.destination);
    audioCtxRef.current = ctx; analyserRef.current = analyser; sourceRef.current = source;
  }, []);

  useEffect(() => {
    if (!visible || !ready || !autoUnlocked) return;
    const audio = audioRef.current; if (!audio) return;
    const timeout = setTimeout(async () => {
      setupAudio();
      if (audioCtxRef.current?.state === "suspended") await audioCtxRef.current.resume();
      try { await audio.play(); setPlaying(true); } catch { setPlaying(false); }
    }, 200);
    return () => clearTimeout(timeout);
  }, [visible, ready, autoUnlocked, setupAudio]);

  const togglePlay = async () => {
    const audio = audioRef.current; if (!audio) return;
    setupAudio();
    if (audioCtxRef.current?.state === "suspended") await audioCtxRef.current.resume();
    if (playing) { audio.pause(); setPlaying(false); }
    else { await audio.play(); setPlaying(true); }
  };

  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    if (!audio || !audio.duration) return;
    setProgress(audio.currentTime / audio.duration);
  };

  const handleSeek = (e) => {
    const audio = audioRef.current; if (!audio) return;
    const rect  = e.currentTarget.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    audio.currentTime = ratio * audio.duration; setProgress(ratio);
  };

  const handleVolumeChange = (e) => {
    const v = parseFloat(e.target.value);
    setVolume(v); if (audioRef.current) audioRef.current.volume = v;
  };

  const formatTime = (sec) => {
    if (!sec || isNaN(sec)) return "0:00";
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  if (!visible) return null;

  return (
    <>
      <audio ref={audioRef} src={MUSIC_SRC} loop preload="auto"
        onCanPlay={() => setReady(true)}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={(e) => setDuration(e.target.duration)}
        onEnded={() => setPlaying(false)}
      />

      {/*
        ── Área de drag: cobre a tela inteira (pointer-events-none para não bloquear cliques)
        O player é arrastado dentro dessa área
      */}
      <div
        ref={dragConstraintsRef}
        className="fixed inset-0 pointer-events-none z-[9989]"
      />

      <AnimatePresence>
        <motion.div
          // ── Posição padrão: canto inferior direito (bottom-6 right-6)
          className="fixed bottom-6 right-6 z-[9990] select-none"
          // ── Drag livre pela tela inteira
          drag
          dragConstraints={dragConstraintsRef}
          dragElastic={0.08}          // leve elasticidade nas bordas
          dragMomentum={false}        // para exatamente onde soltar
          whileDrag={{ scale: 1.02, cursor: "grabbing" }}
          style={{ cursor: "grab" }}
          // ── Animação de entrada
          initial={{ opacity: 0, y: 40, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.9 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div
            className="relative overflow-hidden rounded-2xl"
            style={{
              background: "rgba(2,8,30,0.75)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "1px solid rgba(56,189,248,0.15)",
              boxShadow: "0 0 30px rgba(56,189,248,0.08), 0 8px 32px rgba(0,0,0,0.5)",
            }}
            animate={{
              boxShadow: playing
                ? ["0 0 20px rgba(56,189,248,0.08), 0 8px 32px rgba(0,0,0,0.5)",
                   "0 0 40px rgba(99,102,241,0.15), 0 8px 32px rgba(0,0,0,0.5)",
                   "0 0 20px rgba(56,189,248,0.08), 0 8px 32px rgba(0,0,0,0.5)"]
                : "0 0 20px rgba(56,189,248,0.06), 0 8px 32px rgba(0,0,0,0.5)",
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            {/* aurora topo */}
            <div className="absolute top-0 left-0 right-0 h-px" style={{
              background: "linear-gradient(90deg, transparent, rgba(56,189,248,0.5), rgba(139,92,246,0.4), transparent)",
            }} />

            {/* partículas decorativas */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-20">
              {[...Array(6)].map((_, i) => (
                <motion.div key={i} className="absolute w-0.5 h-0.5 rounded-full bg-sky-400"
                  style={{ left: `${15 + i * 14}%`, top: `${20 + (i % 3) * 25}%` }}
                  animate={{ opacity: [0.2, 0.8, 0.2], scale: [1, 1.5, 1] }}
                  transition={{ duration: 2 + i * 0.4, repeat: Infinity, delay: i * 0.3 }}
                />
              ))}
            </div>

            <AnimatePresence mode="wait">
              {minimized ? (
                /* ── Versão minimizada */
                <motion.div key="mini" className="flex items-center gap-3 px-4 py-3"
                  initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }} transition={{ duration: 0.3 }}>

                  <button onClick={togglePlay}
                    className="w-8 h-8 rounded-full flex items-center justify-center
                      bg-secondary/20 border border-secondary/30 text-secondary
                      hover:bg-secondary/30 transition-colors duration-200 cursor-pointer">
                    {playing
                      ? <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M6 4h4v16H6zM14 4h4v16h-4z"/></svg>
                      : <svg className="w-3 h-3 ml-0.5" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>}
                  </button>

                  <div className="flex items-center gap-0.5 h-5">
                    {[...Array(5)].map((_, i) => (
                      <motion.div key={i} className="w-0.5 rounded-full bg-secondary/70"
                        animate={playing ? { height: ["4px", `${8 + i * 2}px`, "4px"] } : { height: "3px" }}
                        transition={{ duration: 0.6 + i * 0.1, repeat: Infinity, delay: i * 0.08 }}
                      />
                    ))}
                  </div>

                  <button onClick={() => setMinimized(false)}
                    className="text-slate-500 hover:text-slate-300 transition-colors cursor-pointer">
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
                    </svg>
                  </button>
                </motion.div>
              ) : (
                /* ── Versão completa */
                <motion.div key="full" className="p-4 w-72"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}>

                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <motion.div
                        className="w-8 h-8 rounded-lg bg-secondary/10 border border-secondary/20
                          flex items-center justify-center flex-shrink-0"
                        animate={playing ? { boxShadow: ["0 0 0px rgba(56,189,248,0)","0 0 12px rgba(56,189,248,0.3)","0 0 0px rgba(56,189,248,0)"] } : {}}
                        transition={{ duration: 2, repeat: Infinity }}>
                        <svg className="w-4 h-4 text-secondary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                          <path d="M9 18V5l12-2v13"/>
                          <circle cx="6" cy="18" r="3"/>
                          <circle cx="18" cy="16" r="3"/>
                        </svg>
                      </motion.div>
                      <div>
                        {/* Nome próprio — não traduz */}
                        <p className="font-mono text-xs font-semibold text-slate-100 tracking-wide leading-tight">
                          {MUSIC_TITLE}
                        </p>
                        {/* t("music.subtitle") → "composição pessoal" / "personal composition" / "composición personal" */}
                        <p className="font-mono text-[0.6rem] text-slate-500 tracking-widest">
                          {t("music.subtitle")}
                        </p>
                      </div>
                    </div>
                    <button onClick={() => setMinimized(true)}
                      className="w-5 h-5 rounded flex items-center justify-center
                        text-slate-600 hover:text-slate-400 transition-colors cursor-pointer mt-0.5">
                      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 12h14"/>
                      </svg>
                    </button>
                  </div>

                  <div className="flex items-center justify-center mb-3 h-8">
                    <AudioVisualizer analyser={analyserRef.current} playing={playing} />
                  </div>

                  <div className="relative h-1 bg-slate-800 rounded-full cursor-pointer mb-2 overflow-hidden"
                    onClick={handleSeek}>
                    <motion.div className="absolute top-0 left-0 h-full rounded-full"
                      style={{ background: "linear-gradient(90deg, #38bdf8, #818cf8, #34d399)", width: `${progress * 100}%` }} />
                    <motion.div className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-white shadow-lg"
                      style={{ left: `calc(${progress * 100}% - 5px)` }} />
                  </div>

                  <div className="flex justify-between mb-3">
                    <span className="font-mono text-[0.58rem] text-slate-600">{formatTime(audioRef.current?.currentTime)}</span>
                    <span className="font-mono text-[0.58rem] text-slate-600">{formatTime(duration)}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <motion.button onClick={togglePlay}
                      className="w-10 h-10 rounded-full flex items-center justify-center
                        bg-secondary/15 border border-secondary/25 text-secondary
                        hover:bg-secondary/25 transition-colors duration-200 cursor-pointer flex-shrink-0"
                      whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}
                      animate={playing ? { boxShadow: ["0 0 0px rgba(56,189,248,0)","0 0 16px rgba(56,189,248,0.25)","0 0 0px rgba(56,189,248,0)"] } : {}}
                      transition={{ duration: 2, repeat: Infinity }}>
                      {playing
                        ? <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M6 4h4v16H6zM14 4h4v16h-4z"/></svg>
                        : <svg className="w-4 h-4 ml-0.5" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>}
                    </motion.button>

                    <div className="flex items-center gap-2 flex-1">
                      <svg className="w-3 h-3 text-slate-500 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                        {volume > 0.5 && <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>}
                        {volume > 0 && volume <= 0.5 && <path d="M18.07 5.93a10 10 0 0 1 0 12.14"/>}
                      </svg>
                      <input type="range" min="0" max="1" step="0.01" value={volume}
                        onChange={handleVolumeChange}
                        className="flex-1 h-1 rounded-full appearance-none cursor-pointer"
                        style={{
                          background: `linear-gradient(to right, rgba(56,189,248,0.7) ${volume * 100}%, rgba(51,65,85,0.5) ${volume * 100}%)`,
                          outline: "none",
                        }}
                      />
                    </div>

                    {playing && (
                      <motion.div className="flex items-center gap-0.5" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        {[...Array(3)].map((_, i) => (
                          <motion.div key={i} className="w-0.5 rounded-full bg-secondary/60"
                            animate={{ height: ["3px", `${6 + i * 2}px`, "3px"] }}
                            transition={{ duration: 0.5 + i * 0.1, repeat: Infinity, delay: i * 0.1 }}
                          />
                        ))}
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* aurora base */}
            <div className="absolute bottom-0 left-0 right-0 h-px" style={{
              background: "linear-gradient(90deg, transparent, rgba(139,92,246,0.3), rgba(52,211,153,0.2), transparent)",
            }} />
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </>
  );
}