import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet, Dimensions, RefreshControl, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING } from '../theme/colors';
import { deezerApi } from '../services/api';
import { usePlayer } from '../context/PlayerContext';
import { Track, Playlist, Album } from '../types';

const { width } = Dimensions.get('window');
const CW = width * 0.38;

export default function HomeScreen({ navigation }: any) {
  const { play, currentTrack, isPlaying } = usePlayer();
  const [charts, setCharts] = useState<Track[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    try {
      const [cd, pd, ad] = await Promise.all([deezerApi.getCharts(), deezerApi.getFeaturedPlaylists(), deezerApi.getRecommendations()]);
      setCharts(cd.map((t: any) => ({ id: t.id, title: t.title, artist: t.artist.name, artistId: t.artist.id, album: t.album.title, albumId: t.album.id, duration: t.duration, preview: t.preview, cover: t.album.cover_medium, coverBig: t.album.cover_big })));
      setPlaylists(pd.map((p: any) => ({ id: p.id, title: p.title, cover: p.picture_medium || p.picture, trackCount: p.nb_tracks, description: p.user?.name || '' })));
      setAlbums(ad.map((a: any) => ({ id: a.id, title: a.title, artist: a.artist.name, artistId: a.artist.id, cover: a.cover_medium, trackCount: a.nb_tracks })));
    } catch (e) { console.log(e); }
    setLoading(false); setRefreshing(false);
  };
  useEffect(() => { loadData(); }, []);
  const onRefresh = () => { setRefreshing(true); loadData(); };
  const greet = () => { const h = new Date().getHours(); return h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening'; };
  const handlePlay = (track: Track) => play(track, charts);

  if (loading) return <View style={s.ld}><ActivityIndicator size="large" color={COLORS.primary} /></View>;

  return (
    <View style={s.c}>
      <ScrollView style={s.sc} contentContainerStyle={s.scc} showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} colors={[COLORS.primary]} />}>
        <View style={s.hd}><Text style={s.gt}>{greet()}</Text>
          <View style={s.hi}><TouchableOpacity><Ionicons name="notifications-outline" size={24} color={COLORS.textPrimary} /></TouchableOpacity>
          <TouchableOpacity><Ionicons name="time-outline" size={24} color={COLORS.textPrimary} /></TouchableOpacity>
          <TouchableOpacity><Ionicons name="settings-outline" size={24} color={COLORS.textPrimary} /></TouchableOpacity></View>
        </View>
        {charts.length > 0 && <View style={s.qg}>{charts.slice(0, 6).map((t, i) => (
          <TouchableOpacity key={t.id} style={s.qc} onPress={() => handlePlay(t)} activeOpacity={0.7}>
            <Image source={{ uri: t.cover }} style={s.qi} />
            <Text style={s.qt} numberOfLines={1}>{t.title}</Text>
            {currentTrack?.id === t.id && isPlaying && <View style={s.pb}><Ionicons name="musical-notes" size={10} color={COLORS.primary} /></View>}
          </TouchableOpacity>
        ))}</View>}
        {playlists.length > 0 && <View style={s.sec}><Text style={s.st}>Made for you</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>{playlists.map((p) => (
            <TouchableOpacity key={p.id} style={s.cd} onPress={() => navigation.navigate('PlaylistDetail', { id: p.id, title: p.title })} activeOpacity={0.7}>
              <Image source={{ uri: p.cover }} style={s.ci} />
              <Text style={s.ct} numberOfLines={2}>{p.title}</Text>
            </TouchableOpacity>
          ))}</ScrollView></View>}
        {albums.length > 0 && <View style={s.sec}><Text style={s.st}>Popular albums</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>{albums.map((a) => (
            <TouchableOpacity key={a.id} style={s.cd} onPress={() => navigation.navigate('AlbumDetail', { id: a.id, title: a.title })} activeOpacity={0.7}>
              <Image source={{ uri: a.cover }} style={s.ci} />
              <Text style={s.ct} numberOfLines={2}>{a.title}</Text>
              <Text style={s.cs} numberOfLines={1}>{a.artist}</Text>
            </TouchableOpacity>
          ))}</ScrollView></View>}
        <View style={s.sec}><Text style={s.st}>Top 50</Text>
          {charts.slice(0, 10).map((t, i) => (
            <TouchableOpacity key={t.id} style={s.tr} onPress={() => handlePlay(t)} activeOpacity={0.7}>
              <Image source={{ uri: t.cover }} style={s.ti} />
              <View style={s.tn}><Text style={[s.tt, currentTrack?.id === t.id && { color: COLORS.primary }]} numberOfLines={1}>{t.title}</Text><Text style={s.ta} numberOfLines={1}>{t.artist}</Text></View>
              <Ionicons name="ellipsis-horizontal" size={20} color={COLORS.textMuted} />
            </TouchableOpacity>
          ))}</View>
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  c: { flex: 1, backgroundColor: COLORS.background },
  ld: { flex: 1, backgroundColor: COLORS.background, justifyContent: 'center', alignItems: 'center' },
  sc: { flex: 1 }, scc: { paddingTop: 50 },
  hd: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: SPACING.lg, marginBottom: SPACING.lg },
  gt: { fontSize: 24, fontWeight: 'bold', color: COLORS.textPrimary },
  hi: { flexDirection: 'row', gap: SPACING.sm },
  qg: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: SPACING.md, gap: SPACING.sm },
  qc: { width: CW, flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surfaceLight, borderRadius: 4, overflow: 'hidden', marginBottom: SPACING.xs },
  qi: { width: 48, height: 48 },
  qt: { flex: 1, paddingHorizontal: SPACING.sm, fontSize: 13, fontWeight: '600', color: COLORS.textPrimary },
  pb: { position: 'absolute', top: 2, right: 2, backgroundColor: COLORS.background, borderRadius: 10, padding: 2 },
  sec: { marginTop: SPACING.xxl },
  st: { fontSize: 18, fontWeight: 'bold', color: COLORS.textPrimary, paddingHorizontal: SPACING.lg, marginBottom: SPACING.md },
  cd: { width: CW, marginRight: SPACING.md, marginLeft: SPACING.lg },
  ci: { width: CW, height: CW, borderRadius: 4, marginBottom: SPACING.sm },
  ct: { fontSize: 13, fontWeight: '600', color: COLORS.textPrimary, lineHeight: 18 },
  cs: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  tr: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: SPACING.lg, paddingVertical: SPACING.sm, gap: SPACING.md },
  ti: { width: 48, height: 48, borderRadius: 4 },
  tn: { flex: 1 },
  tt: { fontSize: 15, fontWeight: '500', color: COLORS.textPrimary },
  ta: { fontSize: 13, color: COLORS.textSecondary, marginTop: 2 },
});
