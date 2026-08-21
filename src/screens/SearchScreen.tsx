import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, Image, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING } from '../theme/colors';
import { deezerApi } from '../services/api';
import { usePlayer } from '../context/PlayerContext';
import { Track, Artist } from '../types';

const { width } = Dimensions.get('window');
const TILE = (width - SPACING.lg * 2 - SPACING.sm) / 2;
const CATS = [
  { id: 1, name: 'Pop', color: '#E8115B' }, { id: 2, name: 'Hip-Hop', color: '#BA5D07' },
  { id: 3, name: 'Rock', color: '#E13300' }, { id: 4, name: 'Latin', color: '#148A08' },
  { id: 5, name: 'Mood', color: '#509BF5' }, { id: 6, name: 'Electronic', color: '#7358FF' },
  { id: 7, name: 'Indie', color: '#1E3264' }, { id: 8, name: 'Workout', color: '#DC148C' },
  { id: 9, name: 'R&B', color: '#8D67AB' }, { id: 10, name: 'Country', color: '#BA5D07' },
  { id: 11, name: 'Jazz', color: '#1E3264' }, { id: 12, name: 'Classical', color: '#148A08' },
];

export default function SearchScreen({ navigation }: any) {
  const { play } = usePlayer();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Track[]>([]);
  const [artistResults, setArtistResults] = useState<Artist[]>([]);
  const [searching, setSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = useCallback(async (text: string) => {
    setQuery(text);
    if (text.length < 2) { setResults([]); setArtistResults([]); setHasSearched(false); return; }
    setSearching(true);
    try {
      const [tracks, artists] = await Promise.all([deezerApi.search(text), deezerApi.searchArtists(text)]);
      setResults(tracks.map((t: any) => ({
        id: t.id, title: t.title, artist: t.artist.name, artistId: t.artist.id,
        album: t.album.title, albumId: t.album.id, duration: t.duration,
        preview: t.preview, cover: t.album.cover_medium, coverBig: t.album.cover_big,
      })));
      setArtistResults(artists.slice(0, 5).map((a: any) => ({ id: a.id, name: a.name, picture: a.picture_medium })));
      setHasSearched(true);
    } catch (e) { console.log(e); }
    setSearching(false);
  }, []);

  return (
    <View style={st.c}>
      <View style={st.h}><View style={st.sb}>
        <Ionicons name="search" size={20} color={COLORS.textSecondary} />
        <TextInput style={st.si} placeholder="What do you want to listen to?"
          placeholderTextColor={COLORS.textMuted} value={query} onChangeText={handleSearch} autoCorrect={false} />
        {query.length > 0 && <TouchableOpacity onPress={() => { setQuery(''); setResults([]); setArtistResults([]); setHasSearched(false); }}>
          <Ionicons name="close-circle" size={20} color={COLORS.textSecondary} /></TouchableOpacity>}
      </View></View>
      <ScrollView style={st.scroll} showsVerticalScrollIndicator={false}>
        {searching && <ActivityIndicator size="small" color={COLORS.primary} style={{marginTop:20}} />}
        {artistResults.length > 0 && <View style={st.sec}><Text style={st.secT}>Artists</Text>
          {artistResults.map(a => <TouchableOpacity key={a.id} style={st.aRow}
            onPress={() => navigation.navigate('ArtistDetail', {id: a.id, name: a.name})}>
            <Image source={{uri: a.picture}} style={st.aImg} />
            <Text style={st.aName}>{a.name}</Text></TouchableOpacity>)}</View>}
        {results.length > 0 && <View style={st.sec}><Text style={st.secT}>Songs</Text>
          {results.slice(0, 20).map(track => <TouchableOpacity key={track.id} style={st.tRow}
            onPress={() => play(track, results.slice(0, 20))}>
            <Image source={{uri: track.cover}} style={st.tImg} />
            <View style={st.tInfo}><Text style={st.tTitle} numberOfLines={1}>{track.title}</Text>
            <Text style={st.tArtist} numberOfLines={1}>{track.artist}</Text></View>
          </TouchableOpacity>)}</View>}
        {!hasSearched && !searching && <View style={st.grid}>
          {CATS.map(cat => <TouchableOpacity key={cat.id} style={[st.tile, {backgroundColor: cat.color}]} activeOpacity={0.8}>
            <Text style={st.tileT}>{cat.name}</Text></TouchableOpacity>)}</View>}
        <View style={{height:100}} />
      </ScrollView>
    </View>
  );
}

const st = StyleSheet.create({
  c: {flex: 1, backgroundColor: COLORS.background},
  h: {paddingTop: 50, paddingHorizontal: SPACING.lg, paddingBottom: SPACING.sm},
  sb: {flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surfaceLight, borderRadius: 8, paddingHorizontal: SPACING.md, height: 44, gap: SPACING.sm},
  si: {flex: 1, fontSize: 16, color: COLORS.textPrimary},
  scroll: {flex: 1},
  sec: {marginTop: SPACING.lg, paddingHorizontal: SPACING.lg},
  secT: {fontSize: 18, fontWeight: 'bold', color: COLORS.textPrimary, marginBottom: SPACING.md},
  aRow: {flexDirection: 'row', alignItems: 'center', gap: SPACING.md, paddingVertical: SPACING.sm},
  aImg: {width: 44, height: 44, borderRadius: 22},
  aName: {fontSize: 15, color: COLORS.textPrimary, fontWeight: '500'},
  tRow: {flexDirection: 'row', alignItems: 'center', paddingVertical: SPACING.sm, gap: SPACING.md},
  tImg: {width: 48, height: 48, borderRadius: 4},
  tInfo: {flex: 1},
  tTitle: {fontSize: 15, fontWeight: '500', color: COLORS.textPrimary},
  tArtist: {fontSize: 13, color: COLORS.textSecondary, marginTop: 2},
  grid: {flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: SPACING.lg, gap: SPACING.sm, marginTop: SPACING.lg},
  tile: {width: TILE, height: TILE * 0.65, borderRadius: 8, padding: SPACING.md, overflow: 'hidden'},
  tileT: {fontSize: 16, fontWeight: 'bold', color: COLORS.textPrimary},
});
