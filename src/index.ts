#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import { EmailService } from "./services/email.js";
import { CalendarService } from "./services/calendar.js";
import { SpotifyService } from "./services/spotify.js";

// Environment validation
const envSchema = z.object({
  EMAIL_USER: z.string().optional(),
  EMAIL_PASS: z.string().optional(),
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  GOOGLE_REFRESH_TOKEN: z.string().optional(),
  SPOTIFY_CLIENT_ID: z.string().optional(),
  SPOTIFY_CLIENT_SECRET: z.string().optional(),
});

const env = envSchema.parse(process.env);

// Create MCP server instance
const server = new Server({
  name: "automation-mcp-server",
  version: "1.0.0",
}, {
  capabilities: {
    tools: {},
  },
});

// Initialize services
const emailService = new EmailService(env.EMAIL_USER, env.EMAIL_PASS);
const calendarService = new CalendarService(
  env.GOOGLE_CLIENT_ID,
  env.GOOGLE_CLIENT_SECRET,
  env.GOOGLE_REFRESH_TOKEN
);
const spotifyService = new SpotifyService(
  env.SPOTIFY_CLIENT_ID,
  env.SPOTIFY_CLIENT_SECRET
);

// Setup tool handlers
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "send-email",
        description: "Send an email to a recipient",
        inputSchema: {
          type: "object",
          properties: {
            to: {
              type: "string",
              description: "Recipient email address",
            },
            subject: {
              type: "string", 
              description: "Email subject",
            },
            body: {
              type: "string",
              description: "Email body content",
            },
            html: {
              type: "boolean",
              description: "Whether body is HTML formatted",
              default: false,
            },
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
            to: {
              type: "string",
              description: "Recipient email address",
            },
            subject: {
              type: "string",
              description: "Email subject",
            },
            body: {
              type: "string",
              description: "Email body content",
            },
            scheduleTime: {
              type: "string",
              description: "ISO date string for when to send",
            },
            html: {
              type: "boolean",
              description: "Whether body is HTML formatted",
              default: false,
            },
          },
          required: ["to", "subject", "body", "scheduleTime"],
        },
      },
      {
        name: "create-calendar-event",
        description: "Create a new calendar event",
        inputSchema: {
          type: "object",
          properties: {
            summary: {
              type: "string",
              description: "Event title/summary",
            },
            description: {
              type: "string",
              description: "Event description",
            },
            startTime: {
              type: "string",
              description: "ISO date string for event start",
            },
            endTime: {
              type: "string",
              description: "ISO date string for event end",
            },
            attendees: {
              type: "array",
              items: { type: "string" },
              description: "Array of attendee email addresses",
            },
            location: {
              type: "string",
              description: "Event location",
            },
          },
          required: ["summary", "startTime", "endTime"],
        },
      },
      {
        name: "list-calendar-events",
        description: "List upcoming calendar events",
        inputSchema: {
          type: "object",
          properties: {
            timeMin: {
              type: "string",
              description: "ISO date string for earliest event time",
            },
            timeMax: {
              type: "string",
              description: "ISO date string for latest event time",
            },
            maxResults: {
              type: "number",
              description: "Maximum number of events to return",
              default: 10,
            },
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
            eventId: {
              type: "string",
              description: "Calendar event ID",
            },
            summary: {
              type: "string",
              description: "Updated event title/summary",
            },
            description: {
              type: "string",
              description: "Updated event description",
            },
            startTime: {
              type: "string",
              description: "Updated ISO date string for event start",
            },
            endTime: {
              type: "string",
              description: "Updated ISO date string for event end",
            },
            location: {
              type: "string",
              description: "Updated event location",
            },
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
            eventId: {
              type: "string",
              description: "Calendar event ID",
            },
          },
          required: ["eventId"],
        },
      },
      {
        name: "get-song-recommendations",
        description: "Get song recommendations based on preferences",
        inputSchema: {
          type: "object",
          properties: {
            seedGenres: {
              type: "array",
              items: { type: "string" },
              description: "Array of genre seeds",
            },
            seedArtists: {
              type: "array",
              items: { type: "string" },
              description: "Array of artist IDs",
            },
            seedTracks: {
              type: "array",
              items: { type: "string" },
              description: "Array of track IDs",
            },
            limit: {
              type: "number",
              description: "Number of recommendations to return",
              default: 20,
            },
            targetValence: {
              type: "number",
              description: "Target valence (happiness) 0.0-1.0",
            },
            targetEnergy: {
              type: "number",
              description: "Target energy level 0.0-1.0",
            },
            targetDanceability: {
              type: "number",
              description: "Target danceability 0.0-1.0",
            },
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
            query: {
              type: "string",
              description: "Search query",
            },
            type: {
              type: "string",
              enum: ["track", "artist", "album", "playlist"],
              description: "Type of content to search for",
            },
            limit: {
              type: "number",
              description: "Number of results to return",
              default: 20,
            },
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
            name: {
              type: "string",
              description: "Playlist name",
            },
            description: {
              type: "string",
              description: "Playlist description",
            },
            public: {
              type: "boolean",
              description: "Whether playlist should be public",
              default: false,
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
            limit: {
              type: "number",
              description: "Number of playlists to return",
              default: 20,
            },
          },
          required: [],
        },
      },
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case "send-email":
        await emailService.sendEmail(args.to as string, args.subject as string, args.body as string, (args.html as boolean) || false);
        return {
          content: [
            {
              type: "text",
              text: `Email sent successfully to ${args.to}`,
            },
          ],
        };

      case "schedule-email":
        await emailService.scheduleEmail(
          args.to as string,
          args.subject as string,
          args.body as string,
          new Date(args.scheduleTime as string),
          (args.html as boolean) || false
        );
        return {
          content: [
            {
              type: "text",
              text: `Email scheduled for ${args.scheduleTime} to ${args.to}`,
            },
          ],
        };

      case "create-calendar-event":
        const event = await calendarService.createEvent({
          summary: args.summary as string,
          description: args.description as string,
          start: new Date(args.startTime as string),
          end: new Date(args.endTime as string),
          attendees: args.attendees as string[],
          location: args.location as string,
        });
        return {
          content: [
            {
              type: "text",
              text: `Calendar event created: ${event.summary} on ${args.startTime}`,
            },
          ],
        };

      case "list-calendar-events":
        const events = await calendarService.listEvents(
          args.timeMin ? new Date(args.timeMin as string) : new Date(),
          args.timeMax ? new Date(args.timeMax as string) : undefined,
          (args.maxResults as number) || 10
        );
        
        const eventList = events.map(event => 
          `${event.summary} - ${event.start.toLocaleString()}`
        ).join('\n');
        
        return {
          content: [
            {
              type: "text",
              text: `Upcoming events:\n${eventList}`,
            },
          ],
        };

      case "update-calendar-event":
        const updates: any = {};
        if (args.summary) updates.summary = args.summary as string;
        if (args.description) updates.description = args.description as string;
        if (args.startTime) updates.start = new Date(args.startTime as string);
        if (args.endTime) updates.end = new Date(args.endTime as string);
        if (args.location) updates.location = args.location as string;
        
        const updatedEvent = await calendarService.updateEvent(args.eventId as string, updates);
        return {
          content: [
            {
              type: "text",
              text: `Calendar event updated: ${updatedEvent.summary}`,
            },
          ],
        };

      case "delete-calendar-event":
        await calendarService.deleteEvent(args.eventId as string);
        return {
          content: [
            {
              type: "text",
              text: `Calendar event deleted: ${args.eventId}`,
            },
          ],
        };

      case "get-song-recommendations":
        const recommendations = await spotifyService.getRecommendations({
          genres: args.seedGenres as string[],
          artists: args.seedArtists as string[],
          tracks: args.seedTracks as string[],
          limit: (args.limit as number) || 20,
          valence: args.targetValence as number,
          energy: args.targetEnergy as number,
          danceability: args.targetDanceability as number,
        });
        
        const songList = recommendations.map(track => 
          `${track.name} by ${track.artists.join(', ')}`
        ).join('\n');
        
        return {
          content: [
            {
              type: "text",
              text: `Song recommendations:\n${songList}`,
            },
          ],
        };

      case "search-spotify":
        const results = await spotifyService.search(args.query as string, args.type as "track" | "artist" | "album" | "playlist", (args.limit as number) || 20);
        
        let resultText: string;
        if (args.type === 'track') {
          resultText = results.map((track: any) => 
            `${track.name} by ${track.artists.join(', ')}`
          ).join('\n');
        } else if (args.type === 'artist') {
          resultText = results.map((artist: any) => 
            `${artist.name} (${artist.followers} followers)`
          ).join('\n');
        } else {
          resultText = results.map((item: any) => item.name).join('\n');
        }
        
        return {
          content: [
            {
              type: "text",
              text: `Search results for "${args.query}":\n${resultText}`,
            },
          ],
        };

      case "create-spotify-playlist":
        const playlist = await spotifyService.createPlaylist(args.name as string, args.description as string, (args.public as boolean) || false);
        return {
          content: [
            {
              type: "text",
              text: `Playlist created: ${playlist.name} (ID: ${playlist.id})`,
            },
          ],
        };

      case "get-user-playlists":
        const playlists = await spotifyService.getUserPlaylists((args.limit as number) || 20);
        
        const playlistList = playlists.map(playlist => 
          `${playlist.name} - ${playlist.trackCount} tracks`
        ).join('\n');
        
        return {
          content: [
            {
              type: "text",
              text: `Your playlists:\n${playlistList}`,
            },
          ],
        };
    }
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: `Error: ${error instanceof Error ? error.message : String(error)}`,
        },
      ],
      isError: true,
    };
  }
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Automation MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
