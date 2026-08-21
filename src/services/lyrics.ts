import { LyricLine } from '../types';

// lrclib.net - Free synced lyrics API
const LRCLIB_BASE = 'https://lrclib.net/api';

export const lyricsService = {
  // Get synced lyrics by track info
  getSyncedLyrics: async (track: string, artist: string, duration?: number): Promise<LyricLine[]> => {
    try {
      const params = new URLSearchParams({ track_name: track, artist_name: artist });
      if (duration) params.append('duration', String(Math.floor(duration)));

      const res = await fetch(`${LRCLIB_BASE}/get?${params.toString()}`);
      if (!res.ok) return [];

      const data = await res.json();
      if (data.syncedLyrics) {
        return parseLRC(data.syncedLyrics);
      }
      // Fall back to plain lyrics
      if (data.plainLyrics) {
        return data.plainLyrics.split('\n').map((line: string, i: number) => ({
          time: i * 4, // approximate timing
          text: line,
        }));
      }
      return [];
    } catch (e) {
      console.log('Lyrics fetch error:', e);
      return [];
    }
  },

  // Search lyrics
  searchLyrics: async (track: string, artist: string) => {
    try {
      const params = new URLSearchParams({ q: `${track} ${artist}` });
      const res = await fetch(`${LRCLIB_BASE}/search?${params.toString()}`);
      if (!res.ok) return [];
      return await res.json();
    } catch {
      return [];
    }
  },
};

// Parse LRC format to our format
function parseLRC(lrc: string): LyricLine[] {
  const lines = lrc.split('\n');
  const result: LyricLine[] = [];

  for (const line of lines) {
    const match = line.match(/\[(\d{2}):(\d{2})\.(\d{2,3})\](.*)/);
    if (match) {
      const minutes = parseInt(match[1], 10);
      const seconds = parseInt(match[2], 10);
      const ms = parseInt(match[3].padEnd(3, '0'), 10);
      const time = minutes * 60 + seconds + ms / 1000;
      const text = match[4].trim();
      if (text) {
        result.push({ time, text });
      }
    }
  }

  return result.sort((a, b) => a.time - b.time);
}
