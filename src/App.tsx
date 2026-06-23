import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CinematicIntro } from './components/CinematicIntro';
import { Dashboard } from './components/Dashboard';
import { IntroSFXMonitor } from './components/IntroSFXMonitor';
import { AudioLog } from './types';

export default function App() {
  const [isIntroComplete, setIsIntroComplete] = useState<boolean>(false);
  const [logs, setLogs] = useState<AudioLog[]>([]);

  // Sound log generator
  const triggerSFX = (filename: string, description: string, type: 'intro' | 'ui' | 'music') => {
    // Print styled console log for the developer console
    const color = type === 'intro' ? '#a78bfa' : type === 'music' ? '#10b981' : '#3b82f6';
    console.log(
      `%c[SFX ENGINE] %c${filename}%c - ${description}`,
      `color: ${color}; font-weight: bold;`,
      'color: #ffffff; background-color: #121214; padding: 2px 6px; border-radius: 4px;',
      'color: #a3a3a3;'
    );

    const now = new Date();
    const ts = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    
    const newLog: AudioLog = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      timestamp: ts,
      filename,
      description,
      type
    };

    // Defer the parent state update to the next macro-task tick.
    // This allows the child components to finish rendering completely before the parent's logs state shifts,
    // which prevents "Cannot update a component while rendering a different component" warnings.
    setTimeout(() => {
      setLogs((prev) => {
        // Keep only last 10 logs to maintain superb rendering performance
        const kept = prev.slice(-9);
        return [...kept, newLog];
      });
    }, 0);
  };

  const clearLogs = () => {
    setLogs([]);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#030303]">
      
      <AnimatePresence mode="wait">
        {!isIntroComplete ? (
          <motion.div
            key="cinematic_intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05, filter: 'blur(8px)' }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute inset-0 w-full h-full z-45"
          >
            <CinematicIntro 
              onComplete={() => {
                setIsIntroComplete(true);
                triggerSFX(
                  "dashboard_mount.mp3",
                  "Cinematic sequence complete. Unlocked standard audio channels and workspace layers.",
                  "ui"
                );
              }}
              onTriggerSFX={triggerSFX}
            />
          </motion.div>
        ) : (
          <motion.div
            key="vault_dashboard"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="absolute inset-0 w-full h-full z-40"
          >
            <Dashboard 
              onTriggerSFX={triggerSFX}
              onLogout={() => {
                setIsIntroComplete(false);
                triggerSFX(
                  "intro_reloaded.mp3",
                  "Returning to Cinematic Intro Movie mode. Reloading timeline vectors.",
                  "ui"
                );
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
