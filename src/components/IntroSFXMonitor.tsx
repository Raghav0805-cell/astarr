/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Volume2, FileAudio, Radio, Disc, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AudioLog } from '../types';

interface IntroSFXMonitorProps {
  logs: AudioLog[];
  onClear: () => void;
}

export const IntroSFXMonitor: React.FC<IntroSFXMonitorProps> = ({ logs, onClear }) => {
  const getIcon = (filename: string) => {
    if (filename.includes('footsteps')) return <Volume2 className="w-4 h-4 text-amber-400" />;
    if (filename.includes('bluetooth') || filename.includes('pairing')) return <Radio className="w-4 h-4 text-blue-400" />;
    if (filename.includes('scratch') || filename.includes('slap')) return <Disc className="w-4 h-4 text-red-400 animate-spin" />;
    if (filename.includes('bass_drop') || filename.includes('cinematic')) return <FileAudio className="w-4 h-4 text-purple-400" />;
    return <Play className="w-4 h-4 text-green-400" />;
  };

  const latestLog = logs[logs.length - 1];

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm pointer-events-none font-mono">
      <AnimatePresence mode="popLayout">
        {latestLog && (
          <motion.div
            key={latestLog.id}
            initial={{ opacity: 0, y: 30, scale: 0.95, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -20, scale: 0.9, filter: 'blur(2px)' }}
            transition={{ type: 'spring', damping: 15, stiffness: 120 }}
            className="pointer-events-auto bg-neutral-950/90 border border-neutral-800/80 backdrop-blur-md rounded-lg p-3 shadow-2xl overflow-hidden"
          >
            {/* Top scanning accent border */}
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-cyan-500 via-amber-500 to-emerald-500 animate-pulse" />

            {/* Header info */}
            <div className="flex items-center justify-between gap-4 mb-2">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                </span>
                ASTARR! Audio Probe
              </div>
              <span className="text-[9px] text-neutral-500">{latestLog.timestamp}</span>
            </div>

            {/* Content info */}
            <div className="flex gap-2.5 items-start">
              <div className="p-2 rounded bg-neutral-900 border border-neutral-800 shrink-0">
                {getIcon(latestLog.filename)}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-semibold text-neutral-100 truncate flex items-center gap-1">
                  <span>{latestLog.filename}</span>
                </h4>
                <p className="text-[11px] text-neutral-400 mt-0.5 leading-relaxed">
                  {latestLog.description}
                </p>
                <div className="mt-1.5 flex items-center gap-1 text-[9px] text-neutral-500 italic">
                  <span>Code hook: console.log("Playing Sound: {latestLog.filename}")</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating total activity stream (condensed overlay) */}
      {logs.length > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 0.65 }}
          whileHover={{ opacity: 1 }}
          className="pointer-events-auto mt-2 bg-neutral-950/40 hover:bg-neutral-950/80 border border-neutral-900 rounded px-2.5 py-1.5 text-[9px] text-neutral-400 transition-colors flex items-center justify-between gap-4 select-none cursor-help"
          title="These triggers are printed directly in your browser's console and visual monitor. Perfect for raw audio hookups later!"
        >
          <span className="flex items-center gap-1.5">
            <Volume2 className="w-3 h-3 text-neutral-500" />
            <span>SFX Pipeline: {logs.length} events logged to console</span>
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClear();
            }}
            className="hover:text-red-400 text-neutral-500 transition-colors pointer-events-auto"
          >
            Clear
          </button>
        </motion.div>
      )}
    </div>
  );
};
