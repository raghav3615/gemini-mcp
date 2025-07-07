"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpotifyService = void 0;
var axios_1 = require("axios");
var SpotifyService = /** @class */ (function () {
    function SpotifyService(clientId, clientSecret) {
        this.clientId = clientId;
        this.clientSecret = clientSecret;
    }
    SpotifyService.prototype.ensureAccessToken = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.clientId || !this.clientSecret) {
                            throw new Error('Spotify not configured. Please set SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET environment variables.');
                        }
                        if (this.accessToken && this.tokenExpiry && new Date() < this.tokenExpiry) {
                            return [2 /*return*/];
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, axios_1.default.post('https://accounts.spotify.com/api/token', 'grant_type=client_credentials', {
                                headers: {
                                    'Content-Type': 'application/x-www-form-urlencoded',
                                    'Authorization': "Basic ".concat(Buffer.from("".concat(this.clientId, ":").concat(this.clientSecret)).toString('base64')),
                                },
                            })];
                    case 2:
                        response = _a.sent();
                        this.accessToken = response.data.access_token;
                        this.tokenExpiry = new Date(Date.now() + response.data.expires_in * 1000);
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        throw new Error("Failed to get Spotify access token: ".concat(error_1 instanceof Error ? error_1.message : String(error_1)));
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    SpotifyService.prototype.makeSpotifyRequest = function (url_1) {
        return __awaiter(this, arguments, void 0, function (url, method, data) {
            var response, error_2;
            if (method === void 0) { method = 'GET'; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.ensureAccessToken()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, (0, axios_1.default)({
                                method: method,
                                url: url,
                                headers: {
                                    'Authorization': "Bearer ".concat(this.accessToken),
                                    'Content-Type': 'application/json',
                                },
                                data: data,
                            })];
                    case 3:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                    case 4:
                        error_2 = _a.sent();
                        throw new Error("Spotify API request failed: ".concat(error_2 instanceof Error ? error_2.message : String(error_2)));
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    SpotifyService.prototype.getRecommendations = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var queryParams, url, data;
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        queryParams = new URLSearchParams();
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
                        if (!((_a = params.genres) === null || _a === void 0 ? void 0 : _a.length) && !((_b = params.artists) === null || _b === void 0 ? void 0 : _b.length) && !((_c = params.tracks) === null || _c === void 0 ? void 0 : _c.length)) {
                            queryParams.append('seed_genres', 'pop,rock,electronic');
                        }
                        url = "https://api.spotify.com/v1/recommendations?".concat(queryParams.toString());
                        return [4 /*yield*/, this.makeSpotifyRequest(url)];
                    case 1:
                        data = _d.sent();
                        return [2 /*return*/, data.tracks.map(function (track) { return ({
                                id: track.id,
                                name: track.name,
                                artists: track.artists.map(function (artist) { return artist.name; }),
                                album: track.album.name,
                                preview_url: track.preview_url,
                                uri: track.uri,
                            }); })];
                }
            });
        });
    };
    SpotifyService.prototype.search = function (query_1, type_1) {
        return __awaiter(this, arguments, void 0, function (query, type, limit) {
            var url, data, items;
            var _a;
            if (limit === void 0) { limit = 10; }
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        url = "https://api.spotify.com/v1/search?q=".concat(encodeURIComponent(query), "&type=").concat(type, "&limit=").concat(limit);
                        return [4 /*yield*/, this.makeSpotifyRequest(url)];
                    case 1:
                        data = _b.sent();
                        items = ((_a = data["".concat(type, "s")]) === null || _a === void 0 ? void 0 : _a.items) || [];
                        return [2 /*return*/, items.map(function (item) { return ({
                                id: item.id,
                                name: item.name,
                                type: item.type,
                                artists: item.artists ? item.artists.map(function (artist) { return artist.name; }) : undefined,
                                preview_url: item.preview_url,
                                uri: item.uri,
                            }); })];
                }
            });
        });
    };
    SpotifyService.prototype.createPlaylist = function (name_1, description_1) {
        return __awaiter(this, arguments, void 0, function (name, description, isPublic, trackUris) {
            if (isPublic === void 0) { isPublic = false; }
            return __generator(this, function (_a) {
                // Note: Creating playlists requires user authentication (Authorization Code Flow)
                // This is a simplified version that would need proper user OAuth flow
                throw new Error('Creating playlists requires user authentication. This feature needs to be implemented with proper OAuth flow.');
            });
        });
    };
    SpotifyService.prototype.getUserPlaylists = function () {
        return __awaiter(this, arguments, void 0, function (limit) {
            if (limit === void 0) { limit = 20; }
            return __generator(this, function (_a) {
                // Note: Getting user playlists requires user authentication (Authorization Code Flow)
                // This is a simplified version that would need proper user OAuth flow
                throw new Error('Getting user playlists requires user authentication. This feature needs to be implemented with proper OAuth flow.');
            });
        });
    };
    SpotifyService.prototype.getAvailableGenres = function () {
        return __awaiter(this, void 0, void 0, function () {
            var url, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = 'https://api.spotify.com/v1/recommendations/available-genre-seeds';
                        return [4 /*yield*/, this.makeSpotifyRequest(url)];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, data.genres];
                }
            });
        });
    };
    SpotifyService.prototype.getTrackFeatures = function (trackId) {
        return __awaiter(this, void 0, void 0, function () {
            var url;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = "https://api.spotify.com/v1/audio-features/".concat(trackId);
                        return [4 /*yield*/, this.makeSpotifyRequest(url)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    return SpotifyService;
}());
exports.SpotifyService = SpotifyService;
