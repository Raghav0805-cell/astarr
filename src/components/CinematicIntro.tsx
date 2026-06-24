import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  SkipForward, 
  Activity,
  Sliders,
  Sparkles,
  Music,
  Shield,
  Play
} from 'lucide-react';

interface CinematicIntroProps {
  onComplete: () => void;
  onTriggerSFX: (filename: string, description: string, type: 'intro' | 'ui' | 'music') => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    }
  }
};

const letterVariants = {
  hidden: { opacity: 0, y: 15, scale: 0.8 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      damping: 12,
      stiffness: 150
    }
  }
};

const subtitleContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.03,
      delayChildren: 0.6,
    }
  }
};

const subtitleLetterVariants = {
  hidden: { opacity: 0, y: 5 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  }
};

export const CinematicIntro: React.FC<CinematicIntroProps> = ({ onComplete, onTriggerSFX }) => {
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    "ASTARR COLD START: INITIALIZING LOSSLESS DSP ENGINE",
    "NODE CONNECTIONS: SEOUL-DELHI ROUTING STABILIZED [OK]",
    "SOUND ENGINE PRE-HEAT: GOLDEN MUSTARD SPECTRAL MATRIX INJECTED"
  ]);

  const totalDuration = 5.0; // Faster elegant duration of 5 seconds
  const timerRef = useRef<number | null>(null);
  const triggeredSFXRef = useRef<Record<string, boolean>>({});

  useEffect(() => {
    if (isPlaying) {
      const intervalMs = 50;
      timerRef.current = window.setInterval(() => {
        setElapsedTime((prev) => {
          const nextTime = prev + intervalMs / 1000;
          if (nextTime >= totalDuration) {
            clearInterval(timerRef.current!);
            setIsPlaying(false);
            setTimeout(() => {
              onComplete();
            }, 300);
            return totalDuration;
          }
          return nextTime;
        });
      }, intervalMs);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, onComplete]);

  // Timed sounds and logs
  useEffect(() => {
    // 0.2s: Warm tube hum
    if (elapsedTime >= 0.2 && elapsedTime < 0.4) {
      const key = "warm_hum";
      if (!triggeredSFXRef.current[key]) {
        triggeredSFXRef.current[key] = true;
        onTriggerSFX(
          "analog_tube_hum.mp3",
          "Initializing vacuum state logic. Generating lossless acoustic filters.",
          "intro"
        );
      }
    }

    // 2.2s: Sweep filter
    if (elapsedTime >= 2.2 && elapsedTime < 2.4) {
      const key = "filter_sweep";
      if (!triggeredSFXRef.current[key]) {
        triggeredSFXRef.current[key] = true;
        onTriggerSFX(
          "crossover_sweep_highs.mp3",
          "Acoustic crossover active. Normalizing signal feedback.",
          "intro"
        );
      }
    }

    // 3.8s: Golden reveal blast preview
    if (elapsedTime >= 3.8 && elapsedTime < 4.0) {
      const key = "grand_reveal";
      if (!triggeredSFXRef.current[key]) {
        triggeredSFXRef.current[key] = true;
        onTriggerSFX(
          "grand_reveal_unlocked.mp3",
          "PREMIUM STALLION SYSTEM READY: Releasing Raghav Sharma's master control panel.",
          "music"
        );
      }
    }

    // Logs progression
    if (elapsedTime >= 1.2 && terminalLogs.length === 3) {
      setTerminalLogs(prev => [
        ...prev,
        "ALLOCATING PRE-ROUTED CACHE BUFFER: 256MB LOCK",
        "LOSSLESS STREAM DECK MODE: STABLE"
      ]);
    }
    if (elapsedTime >= 3.0 && terminalLogs.length === 5) {
      setTerminalLogs(prev => [
        ...prev,
        "STALLION POWER COEFFICIENT: 100% EXCELLENCE",
        "LAUNCHING ULTIMATE HIGH-RESOLUTION EXPERIENCE..."
      ]);
    }
  }, [elapsedTime]);

  const handleSkipIntro = () => {
    onTriggerSFX(
      "fast_bypass.mp3",
      "Bypassing intro instantly. Deploying premium glass workstation.",
      "ui"
    );
    onComplete();
  };

  return (
    <div className="relative w-full h-full bg-[#070709] text-white flex flex-col justify-between items-center overflow-hidden font-sans select-none p-4 md:p-8">
      
      {/* Decorative Silver-Gray Premium Laser Grid Pattern */}
      <div 
        className="absolute inset-0 bg-[linear-gradient(rgba(224,231,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(224,231,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none"
        style={{
          maskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,1), transparent 85%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,1), transparent 85%)'
        }}
      />

      {/* Atmospheric Silver Platinum Aura Backglow - Ultra Smooth Blend */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/[0.04] rounded-full blur-[140px] pointer-events-none animate-pulse" style={{ animationDuration: '5s' }} />

      {/* Header Bar with Satin Matte Glass Fusion */}
      <header className="w-full max-w-5xl flex items-center justify-between border border-white/10 bg-white/[0.01] backdrop-blur-xl px-5 py-3 rounded-2xl z-20 shadow-[0_8px_32px_rgba(0,0,0,0.7)] shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)]">
        <div className="flex items-center gap-3">
          <div className="px-3 py-1 rounded-full bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-300 text-black text-[10px] font-mono font-black uppercase tracking-widest shadow-lg shadow-white/10 border border-white/20">
            ASTARR LABS
          </div>
          <div className="hidden sm:flex items-center gap-1.5 text-[10px] font-mono text-neutral-400 font-bold">
            <span className="w-2 h-2 rounded-full bg-neutral-300 animate-ping" />
            <span>STALLION ENGINE 4.0</span>
          </div>
        </div>

        <button
          onClick={handleSkipIntro}
          className="px-4 py-2 rounded-xl bg-white/5 hover:bg-neutral-100 border border-white/10 hover:border-transparent text-[10px] font-mono text-neutral-300 hover:text-black font-extrabold uppercase tracking-widest transition-all cursor-pointer flex items-center gap-1.5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] active:scale-95"
        >
          <span>ENTER WORKSPACE</span>
          <SkipForward className="w-3.5 h-3.5" />
        </button>
      </header>

      {/* Massive Elegant Typography Stage (Absolutely majestic with matte slab & glossy glass reflections) */}
      <main className="w-full max-w-4xl flex-1 flex flex-col items-center justify-center relative z-10 my-6">
        
        {/* Main Matte Panel containing Diagonal Glossy Sweep Reflection */}
        <div className="relative w-full max-w-2xl bg-gradient-to-br from-[#111114] to-[#070709] border border-white/10 rounded-3xl p-8 md:p-12 shadow-[0_25px_60px_rgba(0,0,0,0.95)] overflow-hidden gloss-sweep">
          
          {/* Subtle Silver Ambient Edge Glow */}
          <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/25 to-transparent" />
          <div className="absolute bottom-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          
          {/* Glass Highlight Corners */}
          <div className="absolute top-2 left-2 w-12 h-12 border-t border-l border-white/10 rounded-tl-xl pointer-events-none" />
          <div className="absolute bottom-2 right-2 w-12 h-12 border-b border-r border-white/10 rounded-br-xl pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center">
            
            {/* Crown Shield Minimal Emblem in premium highly polished platinum look */}
            <div className="mb-5 p-3 rounded-2xl bg-gradient-to-br from-white via-neutral-100 to-neutral-300 text-black shadow-[0_8px_25px_rgba(255,255,255,0.15)] flex items-center justify-center border border-white/30">
              <Shield className="w-6 h-6 stroke-[2.5]" />
            </div>

            {/* Giant ASTARR! branding in display typography - Heavy Metal Chrome-plated */}
            <motion.h1 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="text-7xl sm:text-8xl md:text-9xl font-black tracking-[0.22em] uppercase pl-[0.22em] text-center select-none leading-none relative chrome-plated-text flex flex-wrap justify-center items-center"
            >
              {"ASTARR".split("").map((char, index) => (
                <motion.span
                  key={index}
                  variants={letterVariants}
                  className="inline-block"
                >
                  {char}
                </motion.span>
              ))}
            </motion.h1>

            {/* Subtitle brand alignment with elegant look */}
            <div className="mt-6 flex flex-col items-center gap-2 text-center">
              <motion.p 
                variants={subtitleContainerVariants}
                initial="hidden"
                animate="visible"
                className="text-[11px] uppercase tracking-[0.55em] text-neutral-300 font-extrabold pl-[0.55em] flex flex-wrap justify-center items-center gap-x-[0.55em]"
              >
                {"THE ULTIMATE FORCED FIDELITY DECK".split(" ").map((word, wordIndex) => (
                  <span key={wordIndex} className="inline-flex">
                    {word.split("").map((char, charIndex) => (
                      <motion.span
                        key={charIndex}
                        variants={subtitleLetterVariants}
                        className="inline-block"
                      >
                        {char}
                      </motion.span>
                    ))}
                  </span>
                ))}
              </motion.p>
              
              <motion.div 
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 192, opacity: 1 }}
                transition={{ delay: 1.4, duration: 0.8, ease: "easeOut" }}
                className="h-[2px] w-48 bg-gradient-to-r from-transparent via-neutral-500/40 to-transparent my-1" 
              />
              
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.8, duration: 0.6 }}
                className="text-[10px] text-neutral-400 font-mono uppercase tracking-[0.25em] pl-[0.25em] max-w-md leading-relaxed font-bold"
              >
                Raghav Sharma Custom Workspace 
              </motion.p>
            </div>

          </div>

          {/* Decorative matte grid indicator in corner */}
          <div className="absolute bottom-4 left-6 text-[8px] font-mono text-neutral-500 uppercase tracking-widest hidden sm:block">
            STALLION CH-1 // DUAL ACCORD
          </div>
          <div className="absolute bottom-4 right-6 text-[8px] font-mono text-neutral-500 uppercase tracking-widest hidden sm:block">
            DSP DIRECT: BYPASS ACTIVE
          </div>

        </div>

      </main>

      {/* Footer Status Logs with High Contrast Frosted Panel */}
      <footer className="w-full max-w-5xl flex flex-col md:flex-row items-center justify-between border border-white/10 bg-black/70 backdrop-blur-xl p-4 rounded-2xl z-20 gap-4 shadow-[0_8px_32px_rgba(0,0,0,0.7)] shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)]">
        
        {/* Real-time terminal log outputs */}
        <div className="flex-1 w-full max-w-xl">
          <div className="text-[9px] font-mono text-neutral-400 uppercase mb-1.5 flex items-center gap-1.5 font-bold">
            <Sliders className="w-3.5 h-3.5 text-neutral-300 animate-pulse" />
            <span>SIGNAL BOOT METRICS</span>
          </div>
          
          <div className="bg-neutral-950/90 border border-white/5 rounded-xl p-3 h-14 overflow-y-auto flex flex-col gap-1 select-none text-[10px] font-mono text-neutral-400 scrollbar-none antialiased">
            {terminalLogs.slice(-3).map((log, i) => (
              <div key={i} className="flex gap-2 items-center">
                <span className="text-white/60 font-bold">▸</span>
                <span className={i === 2 ? "text-white font-bold" : "text-neutral-400"}>{log}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Process percentage timeline meter */}
        <div className="w-full md:w-64 flex flex-col items-end gap-1.5 shrink-0">
          <div className="flex items-center justify-between w-full text-[10px] font-mono text-neutral-300 font-bold">
            <span>STALLION COMPRESSOR MODE</span>
            <span className="text-white font-extrabold">{Math.round((elapsedTime / totalDuration) * 100)}%</span>
          </div>
          
          {/* Progress bar tracks */}
          <div className="w-full h-1.5 bg-neutral-900 rounded-full overflow-hidden relative border border-white/5 shadow-inner">
            <div 
              className="absolute left-0 top-0 h-full bg-gradient-to-r from-neutral-500 via-neutral-100 to-white rounded-full transition-all shadow-[0_0_8px_rgba(255,255,255,0.4)]"
              style={{ width: `${(elapsedTime / totalDuration) * 100}%` }}
            />
          </div>
          
          <span className="text-[9px] text-neutral-500 font-mono uppercase tracking-wider font-bold">
            LATENCY BUFFER: DIRECT NODE INGRESS
          </span>
        </div>

      </footer>

    </div>
  );
};
