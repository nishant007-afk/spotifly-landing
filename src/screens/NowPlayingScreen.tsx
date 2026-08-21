import React, { useRef, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Animated, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING } from '../theme/colors';
import { usePlayer } from '../context/PlayerContext';
const { width } = Dimensions.get('window');
export default function NowPlayingScreen() {
  const { currentTrack, isPlaying, position, duration, lyrics, currentLyricIndex, isLiked, isShuffled, repeatMode, togglePlay, next, previous, toggleLike, toggleShuffle, toggleRepeat, hidePlayer } = usePlayer();
  const [activeTab, setActiveTab] = useState('lyrics');
  const scrollRef = useRef<FlatList<any>>(null);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    if (isPlaying) { Animated.loop(Animated.sequence([Animated.timing(scaleAnim, {toValue:1.05,duration:1000,useNativeDriver:true}),Animated.timing(scaleAnim, {toValue:1,duration:1000,useNativeDriver:true})])).start(); }
    else { scaleAnim.setValue(1); }
  }, [isPlaying]);
  useEffect(() => { if (lyrics.length > 0 && currentLyricIndex >= 0) { scrollRef.current?.scrollToIndex({index:currentLyricIndex,animated:true,viewPosition:0.4}); } }, [currentLyricIndex]);
  if (!currentTrack) return null;
  const fmt = (s: number) => Math.floor(s/60)+':'+(Math.floor(s%60)<10?'0':'')+Math.floor(s%60);
  const prog = duration > 0 ? position/duration : 0;
  return (
    <LinearGradient colors={[COLORS.gradientStart,COLORS.background,COLORS.background]} style={st.c}>
      <View style={st.hdr}>
        <TouchableOpacity onPress={hidePlayer} style={st.hdrB}><Ionicons name="chevron-down" size={28} color={COLORS.textPrimary} /></TouchableOpacity>
        <View style={st.hdrC}><Text style={st.hdrL}>PLAYING FROM</Text><Text style={st.hdrS}>Queue</Text></View>
        <TouchableOpacity style={st.hdrB}><Ionicons name="ellipsis-vertical" size={24} color={COLORS.textPrimary} /></TouchableOpacity>
      </View>
      <View style={st.artC}>
        <Animated.Image source={{uri:currentTrack.coverBig||currentTrack.cover}} style={[st.art,{transform:[{scale:scaleAnim}]}]} />
      </View>
      <View style={st.tI}>
        <View style={st.tT}><Text style={st.tTi} numberOfLines={1}>{currentTrack.title}</Text><Text style={st.tA} numberOfLines={1}>{currentTrack.artist}</Text></View>
        <TouchableOpacity onPress={toggleLike}><Ionicons name={isLiked?'heart':'heart-outline'} size={28} color={isLiked?COLORS.like:COLORS.textSecondary} /></TouchableOpacity>
      </View>
      <View style={st.pC}><View style={st.pB}><View style={[st.pF,{width: ((prog*100)+'%') as any}]} /></View>
        <View style={st.pR}><Text style={st.pT}>{fmt(position)}</Text><Text style={st.pT}>{fmt(duration)}</Text></View></View>
      <View style={st.ct}>
        <TouchableOpacity onPress={toggleShuffle}><Ionicons name="shuffle" size={22} color={isShuffled?COLORS.primary:COLORS.textSecondary} /></TouchableOpacity>
        <TouchableOpacity onPress={previous}><Ionicons name="play-skip-back" size={32} color={COLORS.textPrimary} /></TouchableOpacity>
        <TouchableOpacity style={st.pb} onPress={togglePlay}><Ionicons name={isPlaying?'pause':'play'} size={36} color={COLORS.background} style={!isPlaying?{marginLeft:3}:undefined} /></TouchableOpacity>
        <TouchableOpacity onPress={next}><Ionicons name="play-skip-forward" size={32} color={COLORS.textPrimary} /></TouchableOpacity>
        <TouchableOpacity onPress={toggleRepeat}><Ionicons name={repeatMode==='one'?'repeat':'repeat-outline'} size={22} color={repeatMode!=='off'?COLORS.primary:COLORS.textSecondary} /></TouchableOpacity>
      </View>
      <View style={st.ls}>
        <View style={st.tb}>
          <TouchableOpacity onPress={()=>setActiveTab('lyrics')}><Text style={[st.tB,activeTab==='lyrics'&&st.tA2]}>Lyrics</Text></TouchableOpacity>
          <TouchableOpacity onPress={()=>setActiveTab('credits')}><Text style={[st.tB,activeTab==='credits'&&st.tA2]}>Credits</Text></TouchableOpacity>
        </View>
        {activeTab==='lyrics'?(lyrics.length>0?(
          <FlatList ref={scrollRef} data={lyrics} keyExtractor={(_,i)=>String(i)} showsVerticalScrollIndicator={false} style={st.lL} contentContainerStyle={st.lC}
            renderItem={({item,index})=><Text style={[st.lLi,index===currentLyricIndex&&st.lA,index<currentLyricIndex&&st.lP]}>{item.text}</Text>}
            getItemLayout={(_,index)=>({length:40,offset:40*index,index})} />
        ):<View style={st.nL}><Ionicons name="document-text-outline" size={40} color={COLORS.textMuted} /><Text style={st.nL2}>No lyrics available</Text></View>)
        :<View style={st.cr}><View style={st.cR}><Text style={st.cL}>Artist</Text><Text style={st.cV}>{currentTrack.artist}</Text></View>
          <View style={st.cR}><Text style={st.cL}>Album</Text><Text style={st.cV}>{currentTrack.album}</Text></View></View>}
      </View>
    </LinearGradient>
  );
}
const st = StyleSheet.create({
  c:{flex:1,paddingTop:50},hdr:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',paddingHorizontal:SPACING.lg},hdrB:{padding:SPACING.sm},hdrC:{alignItems:'center'},hdrL:{fontSize:10,color:COLORS.textSecondary,letterSpacing:1.5},hdrS:{fontSize:13,fontWeight:'600',color:COLORS.textPrimary,marginTop:2},
  artC:{alignItems:'center',marginTop:SPACING.xl,flex:0.38},art:{width:width*0.78,height:width*0.78,borderRadius:12,elevation:10},
  tI:{flexDirection:'row',alignItems:'center',paddingHorizontal:SPACING.xl,marginTop:SPACING.xl},tT:{flex:1,marginRight:SPACING.md},tTi:{fontSize:20,fontWeight:'bold',color:COLORS.textPrimary},tA:{fontSize:16,color:COLORS.textSecondary,marginTop:4},
  pC:{paddingHorizontal:SPACING.xl,marginTop:SPACING.lg},pB:{height:4,backgroundColor:COLORS.surfaceHighlight,borderRadius:2,overflow:'hidden'},pF:{height:100,backgroundColor:COLORS.textPrimary,borderRadius:2},pR:{flexDirection:'row',justifyContent:'space-between',marginTop:SPACING.xs},pT:{fontSize:12,color:COLORS.textSecondary},
  ct:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',paddingHorizontal:SPACING.xxl,marginTop:SPACING.lg},pb:{width:64,height:64,borderRadius:32,backgroundColor:COLORS.textPrimary,justifyContent:'center',alignItems:'center'},
  ls:{flex:1,marginTop:SPACING.lg},tb:{flexDirection:'row',gap:SPACING.xl,paddingHorizontal:SPACING.xl,marginBottom:SPACING.md},tB:{fontSize:14,fontWeight:'600',color:COLORS.textMuted},tA2:{color:COLORS.textPrimary,textDecorationLine:'underline'},
  lL:{flex:1},lC:{paddingHorizontal:SPACING.xl,paddingBottom:100},lLi:{fontSize:22,fontWeight:'700',color:COLORS.textMuted,marginBottom:10,lineHeight:36},lA:{color:COLORS.textPrimary,fontSize:24},lP:{color:COLORS.textSecondary},
  nL:{flex:1,alignItems:'center',justifyContent:'center',paddingBottom:100},nL2:{fontSize:18,fontWeight:'600',color:COLORS.textSecondary,marginTop:SPACING.md},
  cr:{paddingHorizontal:SPACING.xl},cR:{paddingVertical:SPACING.md,borderBottomWidth:1,borderBottomColor:COLORS.surfaceHighlight},cL:{fontSize:12,color:COLORS.textMuted,letterSpacing:1},cV:{fontSize:16,color:COLORS.textPrimary,marginTop:4},
});
