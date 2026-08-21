export interface Track {
  id: number;
  title: string;
  artist: string;
  artistId?: number;
  album: string;
  albumId?: number;
  duration: number;
  preview: string;
  cover: string;
  coverBig?: string;
}

export interface Playlist {
  id: number;
  title: string;
  cover: string;
  description?: string;
  trackCount: number;
  tracks?: Track[];
  user?: { name: string; picture: string };
}

export interface Album {
  id: number;
  title: string;
  artist: string;
  artistId?: number;
  cover: string;
  coverBig?: string;
  trackCount: number;
  tracks?: Track[];
  releaseDate?: string;
}

export interface Artist {
  id: number;
  name: string;
  picture: string;
  pictureBig?: string;
  nbFans?: number;
}

export interface LyricLine {
  time: number;
  text: string;
}

export interface Category {
  id: number;
  name: string;
  color: string;
  picture?: string;
}
