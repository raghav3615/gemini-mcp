#!/usr/bin/env node
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
var index_1 = require("@modelcontextprotocol/sdk/server/index");
var stdio_1 = require("@modelcontextprotocol/sdk/server/stdio");
var zod_1 = require("zod");
var email_1 = require("./services/email");
var calendar_1 = require("./services/calendar");
var spotify_1 = require("./services/spotify");
// Environment validation
var envSchema = zod_1.z.object({
    EMAIL_USER: zod_1.z.string().optional(),
    EMAIL_PASS: zod_1.z.string().optional(),
    GOOGLE_CLIENT_ID: zod_1.z.string().optional(),
    GOOGLE_CLIENT_SECRET: zod_1.z.string().optional(),
    GOOGLE_REFRESH_TOKEN: zod_1.z.string().optional(),
    SPOTIFY_CLIENT_ID: zod_1.z.string().optional(),
    SPOTIFY_CLIENT_SECRET: zod_1.z.string().optional(),
});
var env = envSchema.parse(process.env);
// Create server instance
var server = new index_1.Server({
    name: "automation-mcp-server",
    version: "1.0.0",
}, {
    capabilities: {
        tools: {},
    },
});
// Initialize services
var emailService = new email_1.EmailService(env.EMAIL_USER, env.EMAIL_PASS);
var calendarService = new calendar_1.CalendarService(env.GOOGLE_CLIENT_ID, env.GOOGLE_CLIENT_SECRET, env.GOOGLE_REFRESH_TOKEN);
var spotifyService = new spotify_1.SpotifyService(env.SPOTIFY_CLIENT_ID, env.SPOTIFY_CLIENT_SECRET);
// Email Tools
server.setRequestHandler("tools/call", function (request) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, name, args, _b, schema, params, result, schema, params, result, schema, params, event_1, schema, params, events, eventList, schema, params, event_2, schema, params, schema, params, recommendations, trackList, schema, params_1, results, resultList, schema, params, playlist, schema, params, playlists, playlistList, error_1;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _a = request.params, name = _a.name, args = _a.arguments;
                _c.label = 1;
            case 1:
                _c.trys.push([1, 24, , 25]);
                _b = name;
                switch (_b) {
                    case "send-email": return [3 /*break*/, 2];
                    case "schedule-email": return [3 /*break*/, 4];
                    case "create-calendar-event": return [3 /*break*/, 6];
                    case "list-calendar-events": return [3 /*break*/, 8];
                    case "update-calendar-event": return [3 /*break*/, 10];
                    case "delete-calendar-event": return [3 /*break*/, 12];
                    case "get-song-recommendations": return [3 /*break*/, 14];
                    case "search-spotify": return [3 /*break*/, 16];
                    case "create-spotify-playlist": return [3 /*break*/, 18];
                    case "get-user-playlists": return [3 /*break*/, 20];
                }
                return [3 /*break*/, 22];
            case 2:
                schema = zod_1.z.object({
                    to: zod_1.z.string().email(),
                    subject: zod_1.z.string(),
                    body: zod_1.z.string(),
                    html: zod_1.z.boolean().optional().default(false),
                });
                params = schema.parse(args);
                return [4 /*yield*/, emailService.sendEmail(params.to, params.subject, params.body, params.html)];
            case 3:
                result = _c.sent();
                return [2 /*return*/, {
                        content: [
                            {
                                type: "text",
                                text: "Email sent successfully to ".concat(params.to),
                            },
                        ],
                    }];
            case 4:
                schema = zod_1.z.object({
                    to: zod_1.z.string().email(),
                    subject: zod_1.z.string(),
                    body: zod_1.z.string(),
                    scheduleTime: zod_1.z.string(), // ISO date string
                    html: zod_1.z.boolean().optional().default(false),
                });
                params = schema.parse(args);
                return [4 /*yield*/, emailService.scheduleEmail(params.to, params.subject, params.body, new Date(params.scheduleTime), params.html)];
            case 5:
                result = _c.sent();
                return [2 /*return*/, {
                        content: [
                            {
                                type: "text",
                                text: "Email scheduled for ".concat(params.scheduleTime, " to ").concat(params.to),
                            },
                        ],
                    }];
            case 6:
                schema = zod_1.z.object({
                    summary: zod_1.z.string(),
                    description: zod_1.z.string().optional(),
                    start: zod_1.z.string(), // ISO date string
                    end: zod_1.z.string(), // ISO date string
                    attendees: zod_1.z.array(zod_1.z.string().email()).optional(),
                    location: zod_1.z.string().optional(),
                });
                params = schema.parse(args);
                return [4 /*yield*/, calendarService.createEvent({
                        summary: params.summary,
                        description: params.description,
                        start: new Date(params.start),
                        end: new Date(params.end),
                        attendees: params.attendees,
                        location: params.location,
                    })];
            case 7:
                event_1 = _c.sent();
                return [2 /*return*/, {
                        content: [
                            {
                                type: "text",
                                text: "Calendar event created: ".concat(event_1.summary, " on ").concat(params.start),
                            },
                        ],
                    }];
            case 8:
                schema = zod_1.z.object({
                    startDate: zod_1.z.string().optional(),
                    endDate: zod_1.z.string().optional(),
                    maxResults: zod_1.z.number().optional().default(10),
                });
                params = schema.parse(args);
                return [4 /*yield*/, calendarService.listEvents(params.startDate ? new Date(params.startDate) : undefined, params.endDate ? new Date(params.endDate) : undefined, params.maxResults)];
            case 9:
                events = _c.sent();
                eventList = events.map(function (event) {
                    return "".concat(event.summary, " - ").concat(event.start, " to ").concat(event.end);
                }).join('\n');
                return [2 /*return*/, {
                        content: [
                            {
                                type: "text",
                                text: "Upcoming events:\n".concat(eventList),
                            },
                        ],
                    }];
            case 10:
                schema = zod_1.z.object({
                    eventId: zod_1.z.string(),
                    summary: zod_1.z.string().optional(),
                    description: zod_1.z.string().optional(),
                    start: zod_1.z.string().optional(),
                    end: zod_1.z.string().optional(),
                    location: zod_1.z.string().optional(),
                });
                params = schema.parse(args);
                return [4 /*yield*/, calendarService.updateEvent(params.eventId, {
                        summary: params.summary,
                        description: params.description,
                        start: params.start ? new Date(params.start) : undefined,
                        end: params.end ? new Date(params.end) : undefined,
                        location: params.location,
                    })];
            case 11:
                event_2 = _c.sent();
                return [2 /*return*/, {
                        content: [
                            {
                                type: "text",
                                text: "Calendar event updated: ".concat(event_2.summary),
                            },
                        ],
                    }];
            case 12:
                schema = zod_1.z.object({
                    eventId: zod_1.z.string(),
                });
                params = schema.parse(args);
                return [4 /*yield*/, calendarService.deleteEvent(params.eventId)];
            case 13:
                _c.sent();
                return [2 /*return*/, {
                        content: [
                            {
                                type: "text",
                                text: "Calendar event deleted: ".concat(params.eventId),
                            },
                        ],
                    }];
            case 14:
                schema = zod_1.z.object({
                    genres: zod_1.z.array(zod_1.z.string()).optional(),
                    artists: zod_1.z.array(zod_1.z.string()).optional(),
                    tracks: zod_1.z.array(zod_1.z.string()).optional(),
                    limit: zod_1.z.number().optional().default(10),
                    energy: zod_1.z.number().min(0).max(1).optional(),
                    valence: zod_1.z.number().min(0).max(1).optional(),
                    danceability: zod_1.z.number().min(0).max(1).optional(),
                    acousticness: zod_1.z.number().min(0).max(1).optional(),
                });
                params = schema.parse(args);
                return [4 /*yield*/, spotifyService.getRecommendations(params)];
            case 15:
                recommendations = _c.sent();
                trackList = recommendations.map(function (track) {
                    return "".concat(track.name, " by ").concat(track.artists.join(', '), " - ").concat(track.preview_url ? 'Preview available' : 'No preview');
                }).join('\n');
                return [2 /*return*/, {
                        content: [
                            {
                                type: "text",
                                text: "Song recommendations:\n".concat(trackList),
                            },
                        ],
                    }];
            case 16:
                schema = zod_1.z.object({
                    query: zod_1.z.string(),
                    type: zod_1.z.enum(['track', 'artist', 'album', 'playlist']),
                    limit: zod_1.z.number().optional().default(10),
                });
                params_1 = schema.parse(args);
                return [4 /*yield*/, spotifyService.search(params_1.query, params_1.type, params_1.limit)];
            case 17:
                results = _c.sent();
                resultList = results.map(function (item) {
                    var _a;
                    if (params_1.type === 'track') {
                        return "".concat(item.name, " by ").concat((_a = item.artists) === null || _a === void 0 ? void 0 : _a.join(', '), " - ").concat(item.preview_url ? 'Preview available' : 'No preview');
                    }
                    else {
                        return "".concat(item.name, " - ").concat(item.type);
                    }
                }).join('\n');
                return [2 /*return*/, {
                        content: [
                            {
                                type: "text",
                                text: "Search results for \"".concat(params_1.query, "\":\n").concat(resultList),
                            },
                        ],
                    }];
            case 18:
                schema = zod_1.z.object({
                    name: zod_1.z.string(),
                    description: zod_1.z.string().optional(),
                    public: zod_1.z.boolean().optional().default(false),
                    trackUris: zod_1.z.array(zod_1.z.string()).optional(),
                });
                params = schema.parse(args);
                return [4 /*yield*/, spotifyService.createPlaylist(params.name, params.description, params.public, params.trackUris)];
            case 19:
                playlist = _c.sent();
                return [2 /*return*/, {
                        content: [
                            {
                                type: "text",
                                text: "Playlist created: ".concat(playlist.name, " with ").concat(playlist.trackCount, " tracks"),
                            },
                        ],
                    }];
            case 20:
                schema = zod_1.z.object({
                    limit: zod_1.z.number().optional().default(20),
                });
                params = schema.parse(args);
                return [4 /*yield*/, spotifyService.getUserPlaylists(params.limit)];
            case 21:
                playlists = _c.sent();
                playlistList = playlists.map(function (playlist) {
                    return "".concat(playlist.name, " - ").concat(playlist.trackCount, " tracks");
                }).join('\n');
                return [2 /*return*/, {
                        content: [
                            {
                                type: "text",
                                text: "Your playlists:\n".concat(playlistList),
                            },
                        ],
                    }];
            case 22: throw new Error("Unknown tool: ".concat(name));
            case 23: return [3 /*break*/, 25];
            case 24:
                error_1 = _c.sent();
                return [2 /*return*/, {
                        content: [
                            {
                                type: "text",
                                text: "Error: ".concat(error_1 instanceof Error ? error_1.message : String(error_1)),
                            },
                        ],
                        isError: true,
                    }];
            case 25: return [2 /*return*/];
        }
    });
}); });
// List available tools
server.setRequestHandler("tools/list", function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, {
                tools: [
                    // Email tools
                    {
                        name: "send-email",
                        description: "Send an email to a recipient",
                        inputSchema: {
                            type: "object",
                            properties: {
                                to: { type: "string", description: "Recipient email address" },
                                subject: { type: "string", description: "Email subject" },
                                body: { type: "string", description: "Email body content" },
                                html: { type: "boolean", description: "Whether body is HTML formatted" },
                            },
                            required: ["to", "subject", "body"],
                        },
                    },
                    {
                        name: "schedule-email",
                        description: "Schedule an email to be sent at a specific time",
                        inputSchema: {
                            type: "object",
                            properties: {
                                to: { type: "string", description: "Recipient email address" },
                                subject: { type: "string", description: "Email subject" },
                                body: { type: "string", description: "Email body content" },
                                scheduleTime: { type: "string", description: "ISO date string for when to send" },
                                html: { type: "boolean", description: "Whether body is HTML formatted" },
                            },
                            required: ["to", "subject", "body", "scheduleTime"],
                        },
                    },
                    // Calendar tools
                    {
                        name: "create-calendar-event",
                        description: "Create a new calendar event",
                        inputSchema: {
                            type: "object",
                            properties: {
                                summary: { type: "string", description: "Event title" },
                                description: { type: "string", description: "Event description" },
                                start: { type: "string", description: "Start time (ISO date string)" },
                                end: { type: "string", description: "End time (ISO date string)" },
                                attendees: {
                                    type: "array",
                                    items: { type: "string" },
                                    description: "List of attendee email addresses"
                                },
                                location: { type: "string", description: "Event location" },
                            },
                            required: ["summary", "start", "end"],
                        },
                    },
                    {
                        name: "list-calendar-events",
                        description: "List upcoming calendar events",
                        inputSchema: {
                            type: "object",
                            properties: {
                                startDate: { type: "string", description: "Start date filter (ISO date string)" },
                                endDate: { type: "string", description: "End date filter (ISO date string)" },
                                maxResults: { type: "number", description: "Maximum number of events to return" },
                            },
                            required: [],
                        },
                    },
                    {
                        name: "update-calendar-event",
                        description: "Update an existing calendar event",
                        inputSchema: {
                            type: "object",
                            properties: {
                                eventId: { type: "string", description: "Event ID to update" },
                                summary: { type: "string", description: "Event title" },
                                description: { type: "string", description: "Event description" },
                                start: { type: "string", description: "Start time (ISO date string)" },
                                end: { type: "string", description: "End time (ISO date string)" },
                                location: { type: "string", description: "Event location" },
                            },
                            required: ["eventId"],
                        },
                    },
                    {
                        name: "delete-calendar-event",
                        description: "Delete a calendar event",
                        inputSchema: {
                            type: "object",
                            properties: {
                                eventId: { type: "string", description: "Event ID to delete" },
                            },
                            required: ["eventId"],
                        },
                    },
                    // Spotify tools
                    {
                        name: "get-song-recommendations",
                        description: "Get song recommendations based on preferences",
                        inputSchema: {
                            type: "object",
                            properties: {
                                genres: {
                                    type: "array",
                                    items: { type: "string" },
                                    description: "List of genres for recommendations"
                                },
                                artists: {
                                    type: "array",
                                    items: { type: "string" },
                                    description: "List of artist names for seed"
                                },
                                tracks: {
                                    type: "array",
                                    items: { type: "string" },
                                    description: "List of track IDs for seed"
                                },
                                limit: { type: "number", description: "Number of recommendations" },
                                energy: { type: "number", description: "Energy level (0-1)" },
                                valence: { type: "number", description: "Positiveness (0-1)" },
                                danceability: { type: "number", description: "Danceability (0-1)" },
                                acousticness: { type: "number", description: "Acousticness (0-1)" },
                            },
                            required: [],
                        },
                    },
                    {
                        name: "search-spotify",
                        description: "Search for tracks, artists, albums, or playlists on Spotify",
                        inputSchema: {
                            type: "object",
                            properties: {
                                query: { type: "string", description: "Search query" },
                                type: {
                                    type: "string",
                                    enum: ["track", "artist", "album", "playlist"],
                                    description: "Type of content to search for"
                                },
                                limit: { type: "number", description: "Number of results to return" },
                            },
                            required: ["query", "type"],
                        },
                    },
                    {
                        name: "create-spotify-playlist",
                        description: "Create a new Spotify playlist",
                        inputSchema: {
                            type: "object",
                            properties: {
                                name: { type: "string", description: "Playlist name" },
                                description: { type: "string", description: "Playlist description" },
                                public: { type: "boolean", description: "Whether playlist is public" },
                                trackUris: {
                                    type: "array",
                                    items: { type: "string" },
                                    description: "List of track URIs to add"
                                },
                            },
                            required: ["name"],
                        },
                    },
                    {
                        name: "get-user-playlists",
                        description: "Get user's Spotify playlists",
                        inputSchema: {
                            type: "object",
                            properties: {
                                limit: { type: "number", description: "Number of playlists to return" },
                            },
                            required: [],
                        },
                    },
                ],
            }];
    });
}); });
// Start the server
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var transport;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    transport = new stdio_1.StdioServerTransport();
                    return [4 /*yield*/, server.connect(transport)];
                case 1:
                    _a.sent();
                    console.error("Automation MCP Server running on stdio");
                    return [2 /*return*/];
            }
        });
    });
}
main().catch(function (error) {
    console.error("Fatal error in main():", error);
    process.exit(1);
});
