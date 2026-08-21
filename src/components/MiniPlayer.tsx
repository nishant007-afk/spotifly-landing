import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING } from '../theme/colors';
import { usePlayer } from '../context/PlayerContext';

export default function MiniPlayer({ onPress }: { onPress: () => void }) {
  const { currentTrack, isPlaying, togglePlay, next } = usePlayer();
  if (!currentTrack) return null;

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.9}>
      <Image source={{ uri: currentTrack.cover }} style={styles.cover} />
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>{currentTrack.title}</Text>
        <Text style={styles.artist} numberOfLines={1}>{currentTrack.artist}</Text>
      </View>
      <TouchableOpacity style={styles.playBtn} onPress={togglePlay}>
        <Ionicons name={isPlaying ? 'pause' : 'play'} size={24} color={COLORS.textPrimary} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.nextBtn} onPress={next}>
        <Ionicons name="play-skip-forward" size={22} color={COLORS.textPrimary} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surfaceHighlight, marginHorizontal: SPACING.sm, marginBottom: SPACING.xs, borderRadius: 8, padding: SPACING.sm, gap: SPACING.sm },
  cover: { width: 40, height: 40, borderRadius: 4 },
  info: { flex: 1 },
  title: { fontSize: 14, fontWeight: '600', color: COLORS.textPrimary },
  artist: { fontSize: 12, color: COLORS.textSecondary },
  playBtn: { padding: SPACING.sm },
  nextBtn: { padding: SPACING.sm },
});
