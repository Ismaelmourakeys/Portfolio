import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";

// ─────────────────────────────────────────────────────────────
// ── PLAYLIST — adicione novas músicas aqui
// ─────────────────────────────────────────────────────────────
const PLAYLIST = [
  {
    src:    "/assets/audio/Lo-Fi_Space.wav",
    title:  "Lo-Fi Space",
    artist: "Ismael Moura",
  },
  {
    src:    "/assets/audio/Study_with_me.wav",
    title:  "Study With Me",
    artist: "Ismael Moura",
  },
  // ── Adicione novas músicas aqui:
  // { src: "/assets/audio/nome.wav", title: "Título", artist: "Artista" },
];

// ─────────────────────────────────────────────────────────────
// Modos de reprodução
// loop     → repete a música atual
// shuffle  → ordem aleatória
// playlist → sequencial, para ao terminar
// ─────────────────────────────────────────────────────────────
const MODES = ["loop", "shuffle", "playlist"];
const MODE_ICONS = {
  loop: (
    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17 2l4 4-4 4"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/>
      <path d="M7 22l-4-4 4-4"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/>
      <circle cx="12" cy="12" r="1" fill="currentColor"/>
    </svg>
  ),
  shuffle: (
    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M16 3h5v5"/><path d="M4 20L21 3"/><path d="M21 16v5h-5"/>
      <path d="M15 15l5.1 5.1"/><path d="M4 4l5 5"/>
    </svg>
  ),
  playlist: (
    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17 2l4 4-4 4"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/>
      <path d="M7 22l-4-4 4-4"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/>
    </svg>
  ),
};

// ── Visualizador de barras
function AudioVisualizer({ analyser, playing }) {
  const canvasRef = useRef(null);
  const rafRef    = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !analyser) return;
    const ctx          = canvas.getContext("2d");
    const bufferLength = analyser.frequencyBinCount;
    const dataArray    = new Uint8Array(bufferLength);
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
        const hue   = 200 + (i / BAR_COUNT) * 120;
        const alpha = 0.5 + (value / 255) * 0.5;
        const grad  = ctx.createLinearGradient(x, y + barH, x, y);
        grad.addColorStop(0,   `hsla(${hue},90%,60%,${alpha.toFixed(2)})`);
        grad.addColorStop(0.5, `hsla(${hue+30},95%,75%,${Math.min(1,alpha+0.2).toFixed(2)})`);
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
  const { t } = useTranslation();

  const audioRef     = useRef(null);
  const audioCtxRef  = useRef(null);
  const analyserRef  = useRef(null);
  const sourceRef    = useRef(null);
  const dragConstraintsRef = useRef(null);

  const [trackIndex, setTrackIndex] = useState(0);
  const [playing,    setPlaying]    = useState(false);
  const [volume,     setVolume]     = useState(0.5);
  const [progress,   setProgress]   = useState(0);
  const [duration,   setDuration]   = useState(0);
  const [minimized,  setMinimized]  = useState(true);
  const [ready,      setReady]      = useState(false);
  const [modeIndex,  setModeIndex]  = useState(0); // 0=loop, 1=shuffle, 2=playlist
  const [showPlaylist, setShowPlaylist] = useState(false);

  const mode  = MODES[modeIndex];
  const track = PLAYLIST[trackIndex];

  // ── Monta o Web Audio context
  const setupAudio = useCallback(() => {
    if (audioCtxRef.current) return;
    const audio = audioRef.current; if (!audio) return;
    const ctx      = new (window.AudioContext || window.webkitAudioContext)();
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 128; analyser.smoothingTimeConstant = 0.75;
    const source = ctx.createMediaElementSource(audio);
    source.connect(analyser); analyser.connect(ctx.destination);
    audioCtxRef.current = ctx; analyserRef.current = analyser; sourceRef.current = source;
  }, []);

  // ── Autoplay quando desbloqueado
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

  // ── Troca de faixa — recarrega o áudio e toca automaticamente se estava tocando
  const goToTrack = useCallback(async (index, shouldPlay = playing) => {
    const audio = audioRef.current; if (!audio) return;
    const wasPlaying = shouldPlay;
    audio.pause();
    setProgress(0); setDuration(0); setReady(false);
    setTrackIndex(index);
    audio.src = PLAYLIST[index].src;
    audio.load();
    if (wasPlaying) {
      audio.addEventListener("canplay", async () => {
        setupAudio();
        if (audioCtxRef.current?.state === "suspended") await audioCtxRef.current.resume();
        try { await audio.play(); setPlaying(true); } catch { setPlaying(false); }
      }, { once: true });
    }
  }, [playing, setupAudio]);

  // ── Próxima faixa — respeita o modo
  const nextTrack = useCallback(() => {
    if (mode === "shuffle") {
      let next;
      do { next = Math.floor(Math.random() * PLAYLIST.length); } while (next === trackIndex && PLAYLIST.length > 1);
      goToTrack(next);
    } else {
      const next = (trackIndex + 1) % PLAYLIST.length;
      goToTrack(next);
    }
  }, [mode, trackIndex, goToTrack]);

  // ── Faixa anterior
  const prevTrack = useCallback(() => {
    const audio = audioRef.current;
    // Se passou mais de 3s, volta ao início da música atual
    if (audio && audio.currentTime > 3) {
      audio.currentTime = 0; return;
    }
    const prev = (trackIndex - 1 + PLAYLIST.length) % PLAYLIST.length;
    goToTrack(prev);
  }, [trackIndex, goToTrack]);

  // ── Ao terminar a música
  const handleEnded = useCallback(() => {
    if (mode === "loop") {
      // loop já é tratado pelo atributo loop do <audio> — removemos e gerenciamos aqui
      const audio = audioRef.current; if (!audio) return;
      audio.currentTime = 0; audio.play().catch(() => {});
    } else if (mode === "shuffle") {
      nextTrack();
    } else {
      // playlist — para na última música
      if (trackIndex < PLAYLIST.length - 1) nextTrack();
      else setPlaying(false);
    }
  }, [mode, trackIndex, nextTrack]);

  const togglePlay = async () => {
    const audio = audioRef.current; if (!audio) return;
    setupAudio();
    if (audioCtxRef.current?.state === "suspended") await audioCtxRef.current.resume();
    if (playing) { audio.pause(); setPlaying(false); }
    else { await audio.play(); setPlaying(true); }
  };

  const cycleMode = () => setModeIndex((i) => (i + 1) % MODES.length);

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
      <audio
        ref={audioRef}
        src={track.src}
        preload="auto"
        onCanPlay={() => setReady(true)}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={(e) => setDuration(e.target.duration)}
        onEnded={handleEnded}
      />

      <div ref={dragConstraintsRef} className="fixed inset-0 pointer-events-none z-[9989]" />

      <AnimatePresence>
        <motion.div
          className="fixed bottom-6 right-6 z-[9990] select-none"
          drag
          dragConstraints={dragConstraintsRef}
          dragElastic={0.08}
          dragMomentum={false}
          whileDrag={{ scale: 1.02, cursor: "grabbing" }}
          style={{ cursor: "grab" }}
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
                  <div className="flex flex-col min-w-0">
                    <span className="font-mono text-[0.6rem] text-slate-300 truncate max-w-[80px]">{track.title}</span>
                  </div>
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

                  {/* Header: info da música + minimizar */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
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
                      <div className="min-w-0 flex-1">
                        <p className="font-mono text-xs font-semibold text-slate-100 tracking-wide leading-tight truncate">
                          {track.title}
                        </p>
                        <p className="font-mono text-[0.6rem] text-slate-500 tracking-widest truncate">
                          {track.artist}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 mt-0.5 flex-shrink-0">
                      {/* Botão playlist */}
                      <button
                        onClick={() => setShowPlaylist((v) => !v)}
                        className={`w-5 h-5 rounded flex items-center justify-center transition-colors cursor-pointer
                          ${showPlaylist ? "text-secondary" : "text-slate-600 hover:text-slate-400"}`}
                        title="Playlist"
                      >
                        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
                          <line x1="3" y1="10" x2="9" y2="10"/>
                        </svg>
                      </button>
                      {/* Minimizar */}
                      <button onClick={() => setMinimized(true)}
                        className="w-5 h-5 rounded flex items-center justify-center text-slate-600 hover:text-slate-400 transition-colors cursor-pointer">
                        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M5 12h14"/>
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Lista de músicas — expande ao clicar no ícone de playlist */}
                  <AnimatePresence>
                    {showPlaylist && (
                      <motion.div
                        className="mb-3 rounded-xl overflow-hidden border border-slate-700/50"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: [0.16,1,0.3,1] }}
                      >
                        {PLAYLIST.map((t, i) => (
                          <button key={i} onClick={() => goToTrack(i, true)}
                            className={`w-full flex items-center gap-2.5 px-3 py-2 text-left transition-colors cursor-pointer
                              ${i === trackIndex
                                ? "bg-secondary/10 text-secondary"
                                : "text-slate-400 hover:bg-white/5 hover:text-slate-200"}`}>
                            {i === trackIndex && playing
                              ? <motion.div className="flex items-center gap-0.5 w-4 flex-shrink-0">
                                  {[...Array(3)].map((_,j)=>(
                                    <motion.div key={j} className="w-0.5 rounded-full bg-secondary"
                                      animate={{height:["3px",`${5+j*2}px`,"3px"]}}
                                      transition={{duration:0.5+j*0.1,repeat:Infinity,delay:j*0.1}}
                                    />
                                  ))}
                                </motion.div>
                              : <span className="font-mono text-[0.55rem] text-slate-600 w-4 flex-shrink-0">{i + 1}</span>
                            }
                            <div className="min-w-0 flex-1">
                              <p className="font-mono text-[0.65rem] font-medium truncate">{t.title}</p>
                              <p className="font-mono text-[0.55rem] text-slate-600 truncate">{t.artist}</p>
                            </div>
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Visualizador */}
                  <div className="flex items-center justify-center mb-3 h-8">
                    <AudioVisualizer analyser={analyserRef.current} playing={playing} />
                  </div>

                  {/* Barra de progresso */}
                  <div className="relative h-1 bg-slate-800 rounded-full cursor-pointer mb-2 overflow-hidden"
                    onClick={handleSeek}>
                    <motion.div className="absolute top-0 left-0 h-full rounded-full"
                      style={{ background: "linear-gradient(90deg, #38bdf8, #818cf8, #34d399)", width: `${progress * 100}%` }} />
                    <motion.div className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-white shadow-lg"
                      style={{ left: `calc(${progress * 100}% - 5px)` }} />
                  </div>

                  {/* Tempo */}
                  <div className="flex justify-between mb-3">
                    <span className="font-mono text-[0.58rem] text-slate-600">{formatTime(audioRef.current?.currentTime)}</span>
                    <span className="font-mono text-[0.58rem] text-slate-600">{formatTime(duration)}</span>
                  </div>

                  {/* Controles — linha 1: modo + prev + play + next */}
                  <div className="flex items-center justify-between mb-2">
                    {/* Botão modo */}
                    <button onClick={cycleMode}
                      className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-200 cursor-pointer
                        ${mode !== "playlist" ? "text-secondary bg-secondary/10 border border-secondary/25" : "text-slate-500 hover:text-slate-300"}`}
                      title={mode === "loop" ? "Loop" : mode === "shuffle" ? "Aleatório" : "Sequencial"}
                    >
                      {MODE_ICONS[mode]}
                    </button>

                    <div className="flex items-center gap-3">
                      {/* Anterior */}
                      <button onClick={prevTrack}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-200 transition-colors cursor-pointer">
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
                        </svg>
                      </button>

                      {/* Play / Pause */}
                      <motion.button onClick={togglePlay}
                        className="w-10 h-10 rounded-full flex items-center justify-center
                          bg-secondary/15 border border-secondary/25 text-secondary
                          hover:bg-secondary/25 transition-colors duration-200 cursor-pointer"
                        whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}
                        animate={playing ? { boxShadow: ["0 0 0px rgba(56,189,248,0)","0 0 16px rgba(56,189,248,0.25)","0 0 0px rgba(56,189,248,0)"] } : {}}
                        transition={{ duration: 2, repeat: Infinity }}>
                        {playing
                          ? <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M6 4h4v16H6zM14 4h4v16h-4z"/></svg>
                          : <svg className="w-4 h-4 ml-0.5" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>}
                      </motion.button>

                      {/* Próximo */}
                      <button onClick={nextTrack}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-200 transition-colors cursor-pointer">
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/>
                        </svg>
                      </button>
                    </div>

                    {/* Espaço vazio para balancear */}
                    <div className="w-7" />
                  </div>

                  {/* Controles — linha 2: volume em largura total */}
                  <div className="flex items-center gap-2 w-full">
                    <svg className="w-3 h-3 text-slate-500 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                      {volume > 0.5 && <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>}
                      {volume > 0 && volume <= 0.5 && <path d="M18.07 5.93a10 10 0 0 1 0 12.14"/>}
                    </svg>
                    <input type="range" min="0" max="1" step="0.01" value={volume}
                      onChange={handleVolumeChange}
                      className="w-full h-1 rounded-full appearance-none cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, rgba(56,189,248,0.7) ${volume*100}%, rgba(51,65,85,0.5) ${volume*100}%)`,
                        outline: "none",
                      }}
                    />
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