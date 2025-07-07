import axios from 'axios';

export interface SpotifyTrack {
  id: string;
  name: string;
  artists: string[];
  album: string;
  preview_url?: string;
  uri: string;
}

export interface SpotifyPlaylist {
  id: string;
  name: string;
  description?: string;
  trackCount: number;
  uri: string;
}

export interface SpotifySearchResult {
  id: string;
  name: string;
  type: string;
  artists?: string[];
  preview_url?: string;
  uri: string;
}

export interface RecommendationParams {
  genres?: string[];
  artists?: string[];
  tracks?: string[];
  limit?: number;
  energy?: number;
  valence?: number;
  danceability?: number;
  acousticness?: number;
}

export class SpotifyService {
  private accessToken?: string;
  private tokenExpiry?: Date;

  constructor(
    private clientId?: string,
    private clientSecret?: string
  ) {}

  private async ensureAccessToken(): Promise<void> {
    if (!this.clientId || !this.clientSecret) {
      throw new Error('Spotify not configured. Please set SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET environment variables.');
    }

    if (this.accessToken && this.tokenExpiry && new Date() < this.tokenExpiry) {
      return;
    }

    try {
      const response = await axios.post(
        'https://accounts.spotify.com/api/token',
        'grant_type=client_credentials',
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64')}`,
          },
        }
      );

      this.accessToken = response.data.access_token;
      this.tokenExpiry = new Date(Date.now() + response.data.expires_in * 1000);
    } catch (error) {
      throw new Error(`Failed to get Spotify access token: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private async makeSpotifyRequest(url: string, method: 'GET' | 'POST' | 'PUT' = 'GET', data?: any): Promise<any> {
    await this.ensureAccessToken();

    try {
      const response = await axios({
        method,
        url,
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
        data,
      });

      return response.data;
    } catch (error) {
      throw new Error(`Spotify API request failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async getRecommendations(params: RecommendationParams): Promise<SpotifyTrack[]> {
    const queryParams = new URLSearchParams();
    
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.energy !== undefined) queryParams.append('target_energy', params.energy.toString());
    if (params.valence !== undefined) queryParams.append('target_valence', params.valence.toString());
    if (params.danceability !== undefined) queryParams.append('target_danceability', params.danceability.toString());
    if (params.acousticness !== undefined) queryParams.append('target_acousticness', params.acousticness.toString());

    // Add seed genres
    if (params.genres && params.genres.length > 0) {
      queryParams.append('seed_genres', params.genres.slice(0, 5).join(','));
    }

    // For this example, we'll use some default seed genres if none provided
    if (!params.genres?.length && !params.artists?.length && !params.tracks?.length) {
      queryParams.append('seed_genres', 'pop,rock,electronic');
    }

    const url = `https://api.spotify.com/v1/recommendations?${queryParams.toString()}`;
    const data = await this.makeSpotifyRequest(url);

    return data.tracks.map((track: any) => ({
      id: track.id,
      name: track.name,
      artists: track.artists.map((artist: any) => artist.name),
      album: track.album.name,
      preview_url: track.preview_url,
      uri: track.uri,
    }));
  }

  async search(query: string, type: 'track' | 'artist' | 'album' | 'playlist', limit: number = 10): Promise<SpotifySearchResult[]> {
    const url = `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=${type}&limit=${limit}`;
    const data = await this.makeSpotifyRequest(url);

    const items = data[`${type}s`]?.items || [];
    
    return items.map((item: any) => ({
      id: item.id,
      name: item.name,
      type: item.type,
      artists: item.artists ? item.artists.map((artist: any) => artist.name) : undefined,
      preview_url: item.preview_url,
      uri: item.uri,
    }));
  }

  async createPlaylist(
    name: string,
    description?: string,
    isPublic: boolean = false,
    trackUris?: string[]
  ): Promise<SpotifyPlaylist> {
    // Note: Creating playlists requires user authentication (Authorization Code Flow)
    // This is a simplified version that would need proper user OAuth flow
    throw new Error('Creating playlists requires user authentication. This feature needs to be implemented with proper OAuth flow.');
  }

  async getUserPlaylists(limit: number = 20): Promise<SpotifyPlaylist[]> {
    // Note: Getting user playlists requires user authentication (Authorization Code Flow)
    // This is a simplified version that would need proper user OAuth flow
    throw new Error('Getting user playlists requires user authentication. This feature needs to be implemented with proper OAuth flow.');
  }

  async getAvailableGenres(): Promise<string[]> {
    const url = 'https://api.spotify.com/v1/recommendations/available-genre-seeds';
    const data = await this.makeSpotifyRequest(url);
    return data.genres;
  }

  async getTrackFeatures(trackId: string): Promise<any> {
    const url = `https://api.spotify.com/v1/audio-features/${trackId}`;
    return await this.makeSpotifyRequest(url);
  }
}
