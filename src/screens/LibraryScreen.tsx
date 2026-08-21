import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, SPACING } from "../theme/colors";

const ITEMS = [
  { id: "liked", title: "Liked Songs", icon: "heart", color: COLORS.like },
  { id: "recently", title: "Recently Played", icon: "time", color: "#1E3264" },
  { id: "discover", title: "Discover Weekly", icon: "compass", color: "#7358FF" },
  { id: "release", title: "Release Radar", icon: "radio", color: "#148A08" },
  { id: "chill", title: "Chill Vibes", icon: "leaf", color: "#509BF5" },
  { id: "workout", title: "Workout Mix", icon: "flash", color: "#E13300" },
  { id: "focus", title: "Deep Focus", icon: "bulb", color: "#BA5D07" },
  { id: "party", title: "Party Starters", icon: "musical-notes", color: "#DC148C" },
];

export default function LibraryScreen() {
  const [filter, setFilter] = useState("All");
  const filters = ["All", "Playlists", "Artists", "Albums"];
  return (
    <View style={s.container}>
      <View style={s.header}>
        <Text style={s.title}>Your Library</Text>
        <View style={s.ha}>
          <TouchableOpacity style={s.hb}><Ionicons name="search" size={22} color={COLORS.textPrimary} /></TouchableOpacity>
          <TouchableOpacity style={s.hb}><Ionicons name="add" size={26} color={COLORS.textPrimary} /></TouchableOpacity>
        </View>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.fr} contentContainerStyle={s.fc}>
        {filters.map(f => (
          <TouchableOpacity key={f} style={[s.chip, filter===f && s.chipA]} onPress={()=>setFilter(f)}>
            <Text style={[s.chipT, filter===f && s.chipTA]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <ScrollView style={s.list} showsVerticalScrollIndicator={false}>
        {ITEMS.map(item => (
          <TouchableOpacity key={item.id} style={s.item} activeOpacity={0.7}>
            <View style={[s.itemIcon, {backgroundColor: item.color}]}><Ionicons name={item.icon as any} size={24} color="white" /></View>
            <View style={s.itemInfo}><Text style={s.itemTitle}>{item.title}</Text><Text style={s.itemSub}>Playlist</Text></View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.textMuted} />
          </TouchableOpacity>
        ))}
        <View style={{height:100}} />
      </ScrollView>
    </View>
  );
}
const s = StyleSheet.create({
  container:{flex:1,backgroundColor:COLORS.background},
  header:{flexDirection:"row",justifyContent:"space-between",alignItems:"center",paddingTop:50,paddingHorizontal:SPACING.lg},
  title:{fontSize:24,fontWeight:"bold",color:COLORS.textPrimary},
  ha:{flexDirection:"row",gap:SPACING.md},hb:{padding:SPACING.xs},
  fr:{marginTop:SPACING.md,maxHeight:50},fc:{paddingHorizontal:SPACING.lg,gap:SPACING.sm},
  chip:{paddingHorizontal:SPACING.md,paddingVertical:SPACING.sm,borderRadius:20,backgroundColor:COLORS.surfaceLight},
  chipA:{backgroundColor:COLORS.textPrimary},
  chipT:{fontSize:13,color:COLORS.textPrimary,fontWeight:"500"},chipTA:{color:COLORS.background},
  list:{flex:1,marginTop:SPACING.md},
  item:{flexDirection:"row",alignItems:"center",paddingHorizontal:SPACING.lg,paddingVertical:SPACING.md,gap:SPACING.md},
  itemIcon:{width:56,height:56,borderRadius:4,justifyContent:"center",alignItems:"center"},
  itemInfo:{flex:1},itemTitle:{fontSize:16,fontWeight:"600",color:COLORS.textPrimary},
  itemSub:{fontSize:13,color:COLORS.textSecondary,marginTop:2},
});