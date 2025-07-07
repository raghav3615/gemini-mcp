# Automation MCP Server

A Model Context Protocol (MCP) server that provides email automation, Google Calendar scheduling, and Spotify song recommendation capabilities.

## Features

### 📧 Email Automation
- Send emails instantly
- Schedule emails for future delivery
- HTML and plain text support
- Gmail integration

### 📅 Google Calendar
- Create calendar events
- List upcoming events
- Update existing events
- Delete events
- Support for attendees and locations

### 🎵 Spotify Integration
- Get song recommendations based on preferences
- Search for tracks, artists, albums, and playlists
- Get available genres
- Get track audio features

## Installation

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy the environment template and configure your API keys:
   ```bash
   cp .env.template .env
   ```
4. Build the project:
   ```bash
   npm run build
   ```

## Configuration

### Email (Gmail)
1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password: https://support.google.com/accounts/answer/185833
3. Set `EMAIL_USER` and `EMAIL_PASS` in your `.env` file

### Google Calendar
1. Go to the Google Cloud Console: https://console.cloud.google.com/
2. Create a new project or select an existing one
3. Enable the Google Calendar API
4. Create OAuth 2.0 credentials:
   - Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
   - Choose "Desktop application"
   - Download the credentials JSON file
5. Generate a refresh token using the OAuth 2.0 playground or a script
6. Set `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, and `GOOGLE_REFRESH_TOKEN` in your `.env` file

### Spotify
1. Go to Spotify Developer Dashboard: https://developer.spotify.com/dashboard
2. Create a new app
3. Get your Client ID and Client Secret
4. Set `SPOTIFY_CLIENT_ID` and `SPOTIFY_CLIENT_SECRET` in your `.env` file

## Usage

### Running the MCP Server

```bash
npm start
```

### Available Tools

#### Email Tools
- `send-email`: Send an email immediately
- `schedule-email`: Schedule an email for future delivery

#### Calendar Tools
- `create-calendar-event`: Create a new calendar event
- `list-calendar-events`: List upcoming events
- `update-calendar-event`: Update an existing event
- `delete-calendar-event`: Delete an event

#### Spotify Tools
- `get-song-recommendations`: Get personalized song recommendations
- `search-spotify`: Search for music content
- `create-spotify-playlist`: Create a new playlist (requires user auth)
- `get-user-playlists`: Get user's playlists (requires user auth)

### Using with Claude Desktop

Add this server to your Claude Desktop configuration:

**Windows:**
```json
{
  "mcpServers": {
    "automation": {
      "command": "node",
      "args": ["C:\\path\\to\\your\\project\\build\\index.js"]
    }
  }
}
```

**macOS/Linux:**
```json
{
  "mcpServers": {
    "automation": {
      "command": "node",
      "args": ["/path/to/your/project/build/index.js"]
    }
  }
}
```

## API Reference

### Email API

#### Send Email
```typescript
{
  "name": "send-email",
  "arguments": {
    "to": "recipient@example.com",
    "subject": "Hello World",
    "body": "This is the email content",
    "html": false
  }
}
```

#### Schedule Email
```typescript
{
  "name": "schedule-email",
  "arguments": {
    "to": "recipient@example.com",
    "subject": "Scheduled Email",
    "body": "This will be sent later",
    "scheduleTime": "2024-12-25T10:00:00Z",
    "html": false
  }
}
```

### Calendar API

#### Create Calendar Event
```typescript
{
  "name": "create-calendar-event",
  "arguments": {
    "summary": "Team Meeting",
    "description": "Weekly team sync",
    "start": "2024-07-08T14:00:00Z",
    "end": "2024-07-08T15:00:00Z",
    "attendees": ["john@example.com", "jane@example.com"],
    "location": "Conference Room A"
  }
}
```

#### List Calendar Events
```typescript
{
  "name": "list-calendar-events",
  "arguments": {
    "startDate": "2024-07-08T00:00:00Z",
    "endDate": "2024-07-15T00:00:00Z",
    "maxResults": 10
  }
}
```

### Spotify API

#### Get Song Recommendations
```typescript
{
  "name": "get-song-recommendations",
  "arguments": {
    "genres": ["pop", "rock"],
    "limit": 10,
    "energy": 0.7,
    "valence": 0.8,
    "danceability": 0.6
  }
}
```

#### Search Spotify
```typescript
{
  "name": "search-spotify",
  "arguments": {
    "query": "Bohemian Rhapsody",
    "type": "track",
    "limit": 5
  }
}
```

## Development

### Scripts
- `npm run build`: Compile TypeScript to JavaScript
- `npm start`: Run the compiled server
- `npm run dev`: Build and run in development mode

### Project Structure
```
src/
├── index.ts              # Main MCP server
├── services/
│   ├── email.ts          # Email service
│   ├── calendar.ts       # Google Calendar service
│   └── spotify.ts        # Spotify service
build/                    # Compiled JavaScript
.vscode/
└── mcp.json             # MCP configuration for VS Code
```

## Troubleshooting

1. **Email not sending**: Check your Gmail app password and 2FA settings
2. **Calendar API errors**: Verify your Google Cloud project has the Calendar API enabled
3. **Spotify rate limits**: The service uses client credentials flow with rate limits
4. **Build errors**: Make sure all dependencies are installed with `npm install`

## License

MIT License - see LICENSE file for details.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request
