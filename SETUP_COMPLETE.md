# 🎉 MCP Automation Server - Complete Setup

## ✅ Your MCP Server is Ready!

I've successfully created a comprehensive MCP (Model Context Protocol) server with email automation, Google Calendar scheduling, and Spotify song recommendations. Here's what you have:

## 🚀 What's Included

### 📧 Email Automation Features
- **Send emails instantly** via Gmail
- **Schedule emails** for future delivery  
- **HTML and plain text** support
- **Gmail integration** with app passwords

### 📅 Google Calendar Features  
- **Create calendar events** with attendees
- **List upcoming events** with filtering
- **Update existing events**
- **Delete events**
- **Full timezone support**

### 🎵 Spotify Features
- **Get song recommendations** based on mood, energy, genres
- **Search music** (tracks, artists, albums, playlists)
- **Audio features analysis** (energy, valence, danceability)
- **Genre-based filtering**

## 🔑 API Keys You Need

### 1. Gmail Setup
```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

**How to get Gmail App Password:**
1. Enable 2FA on your Google account
2. Go to Google Account → Security → App passwords
3. Generate password for "Mail" application

### 2. Google Calendar API  
```env
GOOGLE_CLIENT_ID=your-client-id.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_REFRESH_TOKEN=your-refresh-token
```

**How to get Google Calendar credentials:**
1. **Google Cloud Console**: https://console.cloud.google.com/
2. **Create project** and enable Calendar API
3. **Create OAuth 2.0 credentials** (Desktop application)
4. **Generate refresh token** using OAuth playground: https://developers.google.com/oauthplayground/

### 3. Spotify Web API
```env
SPOTIFY_CLIENT_ID=your-spotify-client-id
SPOTIFY_CLIENT_SECRET=your-spotify-client-secret
```

**How to get Spotify credentials:**
1. **Spotify Developer Dashboard**: https://developer.spotify.com/dashboard
2. **Create app** with any name
3. **Copy Client ID and Secret**

## 🛠️ Quick Setup Commands

```bash
# 1. Configure environment
cp .env.template .env
# Edit .env with your API keys

# 2. Build and run
npm run build
npm start

# 3. Test individual components
npm run dev
```

## 📋 Available MCP Tools

Your server provides **11 powerful tools**:

### Email Tools
- `send-email` - Send instant emails
- `schedule-email` - Schedule future emails

### Calendar Tools  
- `create-calendar-event` - Create new events
- `list-calendar-events` - List upcoming events
- `update-calendar-event` - Modify existing events
- `delete-calendar-event` - Remove events

### Spotify Tools
- `get-song-recommendations` - AI-powered music suggestions
- `search-spotify` - Search music database  
- `create-spotify-playlist` - Create playlists (requires user auth)
- `get-user-playlists` - Access user playlists (requires user auth)

## 🎯 How to Use with Claude Desktop

Add this to your Claude Desktop config file:

**Windows** (`%APPDATA%\Claude\claude_desktop_config.json`):
```json
{
  "mcpServers": {
    "automation": {
      "command": "node",
      "args": ["C:\\Users\\dadhi\\ml\\build\\index.js"]
    }
  }
}
```

**macOS** (`~/Library/Application Support/Claude/claude_desktop_config.json`):
```json
{
  "mcpServers": {
    "automation": {
      "command": "node", 
      "args": ["/full/path/to/ml/build/index.js"]
    }
  }
}
```

## 💡 Example Commands for Claude

Once connected, you can ask Claude:

**Email Examples:**
- "Send an email to john@example.com about the meeting tomorrow"
- "Schedule a reminder email for Friday at 9am about the project deadline"

**Calendar Examples:**  
- "Create a team meeting for tomorrow 2-3pm with john@company.com"
- "Show me my calendar events for next week"
- "Update my 3pm meeting to include jane@company.com"

**Spotify Examples:**
- "Find me some energetic pop songs for working out"
- "Search for relaxing acoustic songs" 
- "Recommend songs similar to jazz and blues"

## 📁 Project Structure

```
automation-mcp-server/
├── src/
│   ├── index.ts              # Main MCP server
│   └── services/
│       ├── email.ts          # Gmail integration
│       ├── calendar.ts       # Google Calendar API
│       └── spotify.ts        # Spotify Web API
├── build/                    # Compiled JavaScript
├── .env.template            # Environment template
├── .env                     # Your API keys (create this)
├── API_SETUP.md            # Detailed API setup guide
├── README.md               # Full documentation
└── .vscode/
    ├── mcp.json            # VS Code MCP config
    └── tasks.json          # Build tasks
```

## 🚨 Important Security Notes

1. **Never commit `.env` file** to version control
2. **Use app passwords** for Gmail (not regular password)
3. **Rotate API keys** regularly
4. **Set minimal permissions** for Google APIs
5. **Keep credentials secure**

## 🐛 Troubleshooting

**Build Issues:**
- Run `npm install` if dependencies missing
- Check Node.js version (requires 18+)

**Email Issues:** 
- Verify 2FA enabled on Gmail
- Use app password, not regular password
- Check email and password in `.env`

**Calendar Issues:**
- Ensure Calendar API enabled in Google Cloud
- Verify OAuth consent screen configured  
- Check refresh token hasn't expired

**Spotify Issues:**
- Verify client credentials in developer dashboard
- Check for rate limits (30 seconds between requests)
- Ensure app isn't in development mode restrictions

## 🎊 You're All Set!

Your MCP automation server is ready to revolutionize your productivity! The server will handle email automation, calendar management, and music discovery through simple natural language commands in Claude.

**Need help?** Check `API_SETUP.md` for detailed credential setup or `README.md` for full documentation.

**Ready to test?** Run `npm start` and connect with Claude Desktop to start automating! 🚀
