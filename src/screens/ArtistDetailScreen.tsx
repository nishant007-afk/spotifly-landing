import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING } from '../theme/colors';
import { deezerApi } from '../services/api';
import { usePlayer } from '../context/PlayerContext';
import { Track, Album } from '../types';
const { width } = Dimensions.get('window');
export default function ArtistDetailScreen({ route, navigation }: any) {
  const { id, name } = route.params;
  const { play, currentTrack } = usePlayer();
  const [tracks, setTracks] = useState<Track[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [picture, setPicture] = useState('');
  const [fans, setFans] = useState(0);
  const [loading, setLoading] = useState(true);
  useEffect(() => { (async () => { try { const [ad, tt, al] = await Promise.all([deezerApi.getArtist(id), deezerApi.getArtistTopTracks(id), deezerApi.getArtistAlbums(id)]); setPicture(ad.picture_big || ad.picture_medium || ''); setFans(ad.nb_fan || 0); setTracks(tt.map((t: any) => ({ id: t.id, title: t.title, artist: t.artist.name, artistId: t.artist.id, album: t.album.title, albumId: t.album.id, duration: t.duration, preview: t.preview, cover: t.album.cover_medium, coverBig: t.album.cover_big }))); setAlbums(al.map((a: any) => ({ id: a.id, title: a.title, artist: a.artist.name, artistId: a.artist.id, cover: a.cover_medium, trackCount: a.nb_tracks }))); } catch (e) { console.log(e); } setLoading(false); })(); }, [id]);
  if (loading) return <View style={s.ld}><ActivityIndicator size="large" color={COLORS.primary} /></View>;
  return (
    <View style={s.c}><ScrollView showsVerticalScrollIndicator={false}>
      <View style={s.hero}>
        <TouchableOpacity style={s.b} onPress={() => navigation.goBack()}><Ionicons name="chevron-back" size={28} color={COLORS.textPrimary} /></TouchableOpacity>
        {picture ? <Image source={{ uri: picture }} style={s.hi} /> : null}
        <View style={s.ov} /><Text style={s.an}>{name}</Text><Text style={s.fn}>{fans.toLocaleString()} monthly listeners</Text>
      </View>
      <View style={s.ac}><TouchableOpacity style={s.fb}><Text style={s.ft}>Follow</Text></TouchableOpacity>
        <TouchableOpacity style={s.sb} onPress={() => tracks.length > 0 && play(tracks[0], tracks)}><Ionicons name="shuffle" size={22} color={COLORS.textPrimary} /></TouchableOpacity></View>
      <View style={s.sc}><Text style={s.st}>Popular</Text>
        {tracks.slice(0, 5).map((tr, i) => (
          <TouchableOpacity key={tr.id} style={s.tr} onPress={() => play(tr, tracks)}>
            <Text style={s.tn}>{i + 1}</Text><Image source={{ uri: tr.cover }} style={s.ti} />
            <View style={s.tIn}><Text style={[s.tt, currentTrack?.id === tr.id && { color: COLORS.primary }]} numberOfLines={1}>{tr.title}</Text></View>
          </TouchableOpacity>
        ))}</View>
      {albums.length > 0 && <View style={s.sc}><Text style={s.st}>Discography</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {albums.slice(0, 10).map((al) => (
            <TouchableOpacity key={al.id} style={s.ac2} onPress={() => navigation.navigate('AlbumDetail', { id: al.id, title: al.title })}>
              <Image source={{ uri: al.cover }} style={s.acv} /><Text style={s.at} numberOfLines={2}>{al.title}</Text>
            </TouchableOpacity>
          ))}</ScrollView></View>}
      <View style={{ height: 100 }} />
    </ScrollView></View>
  );
}
const s = StyleSheet.create({
  c:{flex:1,backgroundColor:COLORS.background},ld:{flex:1,backgroundColor:COLORS.background,justifyContent:'center',alignItems:'center'},
  hero:{height:300,justifyContent:'flex-end',paddingHorizontal:SPACING.lg,paddingBottom:SPACING.lg},
  hi:{...StyleSheet.absoluteFill,width:'100%',height:'100%',opacity:0.6},ov:{...StyleSheet.absoluteFill,backgroundColor:'rgba(0,0,0,0.4)'},
  b:{position:'absolute',top:50,left:SPACING.md,padding:SPACING.sm,zIndex:2},an:{fontSize:32,fontWeight:'bold',color:COLORS.textPrimary,zIndex:1},fn:{fontSize:13,color:COLORS.textSecondary,marginTop:4,zIndex:1},
  ac:{flexDirection:'row',alignItems:'center',paddingHorizontal:SPACING.lg,paddingVertical:SPACING.md,gap:SPACING.xl},
  fb:{borderWidth:1,borderColor:COLORS.textSecondary,borderRadius:20,paddingHorizontal:SPACING.xl,paddingVertical:SPACING.sm},ft:{fontSize:13,fontWeight:'600',color:COLORS.textPrimary},sb:{padding:SPACING.sm},
  sc:{marginTop:SPACING.lg},st:{fontSize:18,fontWeight:'bold',color:COLORS.textPrimary,paddingHorizontal:SPACING.lg,marginBottom:SPACING.md},
  tr:{flexDirection:'row',alignItems:'center',paddingHorizontal:SPACING.lg,paddingVertical:SPACING.sm,gap:SPACING.md},
  tn:{fontSize:15,color:COLORS.textSecondary,width:20,textAlign:'center'},ti:{width:44,height:44,borderRadius:4},tIn:{flex:1},tt:{fontSize:15,fontWeight:'500',color:COLORS.textPrimary},
  ac2:{width:140,marginLeft:SPACING.lg},acv:{width:140,height:140,borderRadius:4},at:{fontSize:13,fontWeight:'500',color:COLORS.textPrimary,marginTop:SPACING.sm,lineHeight:18},
});
