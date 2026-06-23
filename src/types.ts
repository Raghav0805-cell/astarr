/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number; // in seconds
  coverUrl: string;
  genre: string;
  streamCount: string;
  releasedYear: number;
  lyrics: LyricLine[];
  tag?: string;
  colorTheme: string; // for custom visualizer effects
}

export interface LyricLine {
  time: number; // marker in seconds
  text: string;
}

export interface AudioLog {
  id: string;
  timestamp: string;
  filename: string;
  description: string;
  type: 'intro' | 'ui' | 'music';
}
