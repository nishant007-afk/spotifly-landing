import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING } from '../theme/colors';
import { deezerApi } from '../services/api';
import { usePlayer } from '../context/PlayerContext';
import { Track } from '../types';
const { width } = Dimensions.get('window');
export default function PlaylistDetailScreen({ route, navigation }: any) {
  const { id, title } = route.params;
  const { play, currentTrack } = usePlayer();
  const [tracks, setTracks] = useState<Track[]>([]);
  const [cover, setCover] = useState('');
  const [desc, setDesc] = useState('');
  const [loading, setLoading] = useState(true);
  useEffect(() => { (async () => { try { const [pl, td] = await Promise.all([deezerApi.getPlaylist(id), deezerApi.getPlaylistTracks(id)]); setCover(pl.picture_big || pl.picture_medium || ''); setDesc(pl.description || ''); setTracks(td.map((t: any) => ({ id: t.id, title: t.title, artist: t.artist.name, artistId: t.artist.id, album: t.album.title, albumId: t.album.id, duration: t.duration, preview: t.preview, cover: t.album.cover_medium, coverBig: t.album.cover_big }))); } catch (e) { console.log(e); } setLoading(false); })(); }, [id]);
  if (loading) return <View style={s.ld}><ActivityIndicator size="large" color={COLORS.primary} /></View>;
  return (
    <View style={s.c}><ScrollView showsVerticalScrollIndicator={false}>
      <LinearGradient colors={[COLORS.gradientStart, COLORS.background]} style={s.h}>
        <TouchableOpacity style={s.b} onPress={() => navigation.goBack()}><Ionicons name="chevron-back" size={28} color={COLORS.textPrimary} /></TouchableOpacity>
        {cover ? <Image source={{ uri: cover }} style={s.cv} /> : null}
        <Text style={s.t} numberOfLines={2}>{title}</Text>
        {desc ? <Text style={s.d} numberOfLines={2}>{desc}</Text> : null}
        <Text style={s.n}>{tracks.length} songs</Text>
        <TouchableOpacity style={s.pb} onPress={() => tracks.length > 0 && play(tracks[0], tracks)}><Ionicons name="play" size={24} color={COLORS.background} /></TouchableOpacity>
      </LinearGradient>
      <View style={s.tl}>{tracks.map((tr) => (
        <TouchableOpacity key={tr.id} style={s.tr} onPress={() => play(tr, tracks)}>
          <Image source={{ uri: tr.cover }} style={s.ti} />
          <View style={s.tn}><Text style={[s.tt, currentTrack?.id === tr.id && { color: COLORS.primary }]} numberOfLines={1}>{tr.title}</Text><Text style={s.ta} numberOfLines={1}>{tr.artist}</Text></View>
        </TouchableOpacity>
      ))}</View>
      <View style={{ height: 100 }} />
    </ScrollView></View>
  );
}
const s = StyleSheet.create({
  c:{flex:1,backgroundColor:COLORS.background},ld:{flex:1,backgroundColor:COLORS.background,justifyContent:'center',alignItems:'center'},
  h:{paddingTop:50,paddingBottom:SPACING.xl,alignItems:'center',paddingHorizontal:SPACING.lg},b:{position:'absolute',top:50,left:SPACING.md,padding:SPACING.sm,zIndex:1},
  cv:{width:width*0.55,height:width*0.55,borderRadius:8,marginTop:SPACING.xl},t:{fontSize:22,fontWeight:'bold',color:COLORS.textPrimary,marginTop:SPACING.lg,textAlign:'center'},
  d:{fontSize:13,color:COLORS.textSecondary,marginTop:SPACING.xs,textAlign:'center'},n:{fontSize:13,color:COLORS.textSecondary,marginTop:SPACING.sm},
  pb:{width:56,height:56,borderRadius:28,backgroundColor:COLORS.primary,justifyContent:'center',alignItems:'center',marginTop:SPACING.lg},
  tl:{marginTop:SPACING.md},tr:{flexDirection:'row',alignItems:'center',paddingHorizontal:SPACING.lg,paddingVertical:SPACING.sm,gap:SPACING.md},
  ti:{width:48,height:48,borderRadius:4},tn:{flex:1},tt:{fontSize:15,fontWeight:'500',color:COLORS.textPrimary},ta:{fontSize:13,color:COLORS.textSecondary,marginTop:2},
});
