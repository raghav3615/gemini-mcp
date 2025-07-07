import axios from 'axios';
export class SpotifyService {
    constructor(clientId, clientSecret) {
        this.clientId = clientId;
        this.clientSecret = clientSecret;
    }
    async ensureAccessToken() {
        if (!this.clientId || !this.clientSecret) {
            throw new Error('Spotify not configured. Please set SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET environment variables.');
        }
        if (this.accessToken && this.tokenExpiry && new Date() < this.tokenExpiry) {
            return;
        }
        try {
            const response = await axios.post('https://accounts.spotify.com/api/token', 'grant_type=client_credentials', {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': `Basic ${Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64')}`,
                },
            });
            this.accessToken = response.data.access_token;
            this.tokenExpiry = new Date(Date.now() + response.data.expires_in * 1000);
        }
        catch (error) {
            throw new Error(`Failed to get Spotify access token: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    async makeSpotifyRequest(url, method = 'GET', data) {
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
        }
        catch (error) {
            throw new Error(`Spotify API request failed: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    async getRecommendations(params) {
        const queryParams = new URLSearchParams();
        if (params.limit)
            queryParams.append('limit', params.limit.toString());
        if (params.energy !== undefined)
            queryParams.append('target_energy', params.energy.toString());
        if (params.valence !== undefined)
            queryParams.append('target_valence', params.valence.toString());
        if (params.danceability !== undefined)
            queryParams.append('target_danceability', params.danceability.toString());
        if (params.acousticness !== undefined)
            queryParams.append('target_acousticness', params.acousticness.toString());
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
        return data.tracks.map((track) => ({
            id: track.id,
            name: track.name,
            artists: track.artists.map((artist) => artist.name),
            album: track.album.name,
            preview_url: track.preview_url,
            uri: track.uri,
        }));
    }
    async search(query, type, limit = 10) {
        const url = `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=${type}&limit=${limit}`;
        const data = await this.makeSpotifyRequest(url);
        const items = data[`${type}s`]?.items || [];
        return items.map((item) => ({
            id: item.id,
            name: item.name,
            type: item.type,
            artists: item.artists ? item.artists.map((artist) => artist.name) : undefined,
            preview_url: item.preview_url,
            uri: item.uri,
        }));
    }
    async createPlaylist(name, description, isPublic = false, trackUris) {
        // Note: Creating playlists requires user authentication (Authorization Code Flow)
        // This is a simplified version that would need proper user OAuth flow
        throw new Error('Creating playlists requires user authentication. This feature needs to be implemented with proper OAuth flow.');
    }
    async getUserPlaylists(limit = 20) {
        // Note: Getting user playlists requires user authentication (Authorization Code Flow)
        // This is a simplified version that would need proper user OAuth flow
        throw new Error('Getting user playlists requires user authentication. This feature needs to be implemented with proper OAuth flow.');
    }
    async getAvailableGenres() {
        const url = 'https://api.spotify.com/v1/recommendations/available-genre-seeds';
        const data = await this.makeSpotifyRequest(url);
        return data.genres;
    }
    async getTrackFeatures(trackId) {
        const url = `https://api.spotify.com/v1/audio-features/${trackId}`;
        return await this.makeSpotifyRequest(url);
    }
}
