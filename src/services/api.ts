const BASE = 'https://api.deezer.com';

export const deezerApi = {
  // Search
  search: async (query: string) => {
    const res = await fetch(`${BASE}/search?q=${encodeURIComponent(query)}`);
    const data = await res.json();
    return data.data || [];
  },

  // Charts / Top tracks
  getCharts: async () => {
    const res = await fetch(`${BASE}/chart/0/tracks?limit=20`);
    const data = await res.json();
    return data.data || [];
  },

  // Get playlist tracks
  getPlaylistTracks: async (playlistId: number) => {
    const res = await fetch(`${BASE}/playlist/${playlistId}/tracks`);
    const data = await res.json();
    return data.data || [];
  },

  // Get playlist details
  getPlaylist: async (playlistId: number) => {
    const res = await fetch(`${BASE}/playlist/${playlistId}`);
    return await res.json();
  },

  // Get album tracks
  getAlbumTracks: async (albumId: number) => {
    const res = await fetch(`${BASE}/album/${albumId}/tracks`);
    const data = await res.json();
    return data.data || [];
  },

  // Get album details
  getAlbum: async (albumId: number) => {
    const res = await fetch(`${BASE}/album/${albumId}`);
    return await res.json();
  },

  // Get artist details
  getArtist: async (artistId: number) => {
    const res = await fetch(`${BASE}/artist/${artistId}`);
    return await res.json();
  },

  // Get artist top tracks
  getArtistTopTracks: async (artistId: number) => {
    const res = await fetch(`${BASE}/artist/${artistId}/top?limit=20`);
    const data = await res.json();
    return data.data || [];
  },

  // Get artist albums
  getArtistAlbums: async (artistId: number) => {
    const res = await fetch(`${BASE}/artist/${artistId}/albums`);
    const data = await res.json();
    return data.data || [];
  },

  // Featured playlists (editorial)
  getFeaturedPlaylists: async () => {
    const res = await fetch(`${BASE}/chart/0/playlists?limit=10`);
    const data = await res.json();
    return data.data || [];
  },

  // Get radio tracks
  getRadioTracks: async () => {
    const res = await fetch(`${BASE}/chart/0/tracks?limit=30`);
    const data = await res.json();
    return data.data || [];
  },

  // Get genres
  getGenres: async () => {
    const res = await fetch(`${BASE}/genre`);
    const data = await res.json();
    return data.data || [];
  },

  // Search albums
  searchAlbums: async (query: string) => {
    const res = await fetch(`${BASE}/search/album?q=${encodeURIComponent(query)}`);
    const data = await res.json();
    return data.data || [];
  },

  // Search artists
  searchArtists: async (query: string) => {
    const res = await fetch(`${BASE}/search/artist?q=${encodeURIComponent(query)}`);
    const data = await res.json();
    return data.data || [];
  },

  // Get recommendations (using editorials)
  getRecommendations: async () => {
    const res = await fetch(`${BASE}/chart/0/albums?limit=20`);
    const data = await res.json();
    return data.data || [];
  },
};
