import React, { createContext, useContext, useState, useRef, useCallback, useEffect } from 'react';
import { Audio, AVPlaybackStatus } from 'expo-av';
import { Track, LyricLine } from '../types';
import { lyricsService } from '../services/lyrics';

interface PlayerContextType {
  currentTrack: Track | null;
  queue: Track[];
  queueIndex: number;
  isPlaying: boolean;
  position: number;
  duration: number;
  lyrics: LyricLine[];
  currentLyricIndex: number;
  isShuffled: boolean;
  repeatMode: 'off' | 'all' | 'one';
  isLiked: boolean;
  showPlayer: boolean;
  play: (track: Track, queue?: Track[]) => void;
  pause: () => void;
  resume: () => void;
  togglePlay: () => void;
  seekTo: (position: number) => void;
  next: () => void;
  previous: () => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  toggleLike: () => void;
  setQueue: (tracks: Track[], startIndex?: number) => void;
  hidePlayer: () => void;
}

const PlayerContext = createContext<PlayerContextType | null>(null);

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const soundRef = useRef<Audio.Sound | null>(null);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [queue, setQueueState] = useState<Track[]>([]);
  const [queueIndex, setQueueIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [lyrics, setLyrics] = useState<LyricLine[]>([]);
  const [currentLyricIndex, setCurrentLyricIndex] = useState(0);
  const [isShuffled, setIsShuffled] = useState(false);
  const [repeatMode, setRepeatMode] = useState<'off' | 'all' | 'one'>('off');
  const [likedTracks, setLikedTracks] = useState<Set<number>>(new Set());
  const [showPlayer, setShowPlayer] = useState(false);

  const loadLyrics = useCallback(async (track: Track) => {
    try {
      const l = await lyricsService.getSyncedLyrics(track.title, track.artist, track.duration);
      setLyrics(l);
      setCurrentLyricIndex(0);
    } catch {
      setLyrics([]);
    }
  }, []);

  const playTrack = useCallback(async (track: Track) => {
    try {
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
      }
      setCurrentTrack(track);
      setShowPlayer(true);
      setIsPlaying(true);
      setLyrics([]);
      setCurrentLyricIndex(0);

      if (!track.preview) return;

      const { sound } = await Audio.Sound.createAsync(
        { uri: track.preview },
        { shouldPlay: true },
        (status: AVPlaybackStatus) => {
          if (status.isLoaded) {
            setPosition(status.positionMillis / 1000);
            setDuration(status.durationMillis ? status.durationMillis / 1000 : 30);
            setIsPlaying(status.isPlaying);

            // Update current lyric index
            if (status.isPlaying) {
              const currentTime = status.positionMillis / 1000;
              setLyrics(prev => {
                for (let i = prev.length - 1; i >= 0; i--) {
                  if (currentTime >= prev[i].time) {
                    setCurrentLyricIndex(i);
                    break;
                  }
                }
                return prev;
              });
            }

            if (status.didJustFinish) {
              // Auto next
              setQueueState(q => {
                setQueueIndex(i => {
                  const nextIdx = i + 1;
                  if (nextIdx < q.length) {
                    setTimeout(() => playTrack(q[nextIdx]), 100);
                  }
                  return nextIdx;
                });
                return q;
              });
            }
          }
        }
      );
      soundRef.current = sound;

      // Load lyrics in parallel
      loadLyrics(track);
    } catch (e) {
      console.log('Play error:', e);
    }
  }, [loadLyrics]);

  const play = useCallback((track: Track, newQueue?: Track[]) => {
    if (newQueue) {
      setQueueState(newQueue);
      const idx = newQueue.findIndex(t => t.id === track.id);
      setQueueIndex(idx >= 0 ? idx : 0);
    }
    playTrack(track);
  }, [playTrack]);

  const pause = useCallback(async () => {
    if (soundRef.current) {
      await soundRef.current.pauseAsync();
      setIsPlaying(false);
    }
  }, []);

  const resume = useCallback(async () => {
    if (soundRef.current) {
      await soundRef.current.playAsync();
      setIsPlaying(true);
    }
  }, []);

  const togglePlay = useCallback(async () => {
    if (isPlaying) {
      await pause();
    } else {
      await resume();
    }
  }, [isPlaying, pause, resume]);

  const seekTo = useCallback(async (pos: number) => {
    if (soundRef.current) {
      await soundRef.current.setPositionAsync(pos * 1000);
      setPosition(pos);
    }
  }, []);

  const next = useCallback(() => {
    if (queue.length === 0) return;
    const nextIdx = isShuffled
      ? Math.floor(Math.random() * queue.length)
      : queueIndex + 1;

    if (repeatMode === 'one' && currentTrack) {
      playTrack(currentTrack);
      return;
    }

    if (nextIdx < queue.length) {
      setQueueIndex(nextIdx);
      playTrack(queue[nextIdx]);
    } else if (repeatMode === 'all') {
      setQueueIndex(0);
      playTrack(queue[0]);
    } else {
      setIsPlaying(false);
    }
  }, [queue, queueIndex, isShuffled, repeatMode, currentTrack, playTrack]);

  const previous = useCallback(() => {
    if (position > 3) {
      seekTo(0);
      return;
    }
    if (queueIndex > 0) {
      const prevIdx = queueIndex - 1;
      setQueueIndex(prevIdx);
      playTrack(queue[prevIdx]);
    }
  }, [queueIndex, position, queue, playTrack, seekTo]);

  const toggleShuffle = useCallback(() => setIsShuffled(p => !p), []);

  const toggleRepeat = useCallback(() => {
    setRepeatMode(mode => {
      if (mode === 'off') return 'all';
      if (mode === 'all') return 'one';
      return 'off';
    });
  }, []);

  const toggleLike = useCallback(() => {
    if (!currentTrack) return;
    setLikedTracks(prev => {
      const next = new Set(prev);
      if (next.has(currentTrack.id)) {
        next.delete(currentTrack.id);
      } else {
        next.add(currentTrack.id);
      }
      return next;
    });
  }, [currentTrack]);

  const setQueue = useCallback((tracks: Track[], startIndex = 0) => {
    setQueueState(tracks);
    setQueueIndex(startIndex);
  }, []);

  const hidePlayer = useCallback(() => setShowPlayer(false), []);

  useEffect(() => {
    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, []);

  return (
    <PlayerContext.Provider
      value={{
        currentTrack, queue, queueIndex, isPlaying, position, duration,
        lyrics, currentLyricIndex, isShuffled, repeatMode,
        isLiked: currentTrack ? likedTracks.has(currentTrack.id) : false,
        showPlayer,
        play, pause, resume, togglePlay, seekTo, next, previous,
        toggleShuffle, toggleRepeat, toggleLike, setQueue, hidePlayer,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (!context) throw new Error('usePlayer must be used within PlayerProvider');
  return context;
}
