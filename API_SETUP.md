# Automation MCP Server - API Setup Guide

This guide will help you set up the API keys and authentication required for the MCP server.

## 🔑 API Keys Required

### 1. Gmail Email Configuration

**What you need:**
- Gmail account with 2-factor authentication enabled
- App-specific password

**Steps:**
1. Go to your Google Account settings: https://myaccount.google.com/
2. Navigate to Security → 2-Step Verification (enable if not already)
3. Go to Security → App passwords
4. Select "Mail" and "Other (custom name)"
5. Generate password and copy it

**Environment Variables:**
```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-16-character-app-password
```

### 2. Google Calendar API

**What you need:**
- Google Cloud Project
- OAuth 2.0 credentials
- Refresh token

**Steps:**
1. **Create Google Cloud Project:**
   - Go to: https://console.cloud.google.com/
   - Create new project or select existing one
   - Enable Google Calendar API

2. **Create OAuth 2.0 Credentials:**
   - Go to APIs & Services → Credentials
   - Click "Create Credentials" → "OAuth 2.0 Client IDs"
   - Choose "Desktop application"
   - Download the JSON file

3. **Generate Refresh Token:**
   - Use OAuth 2.0 Playground: https://developers.google.com/oauthplayground/
   - In settings (gear icon), check "Use your own OAuth credentials"
   - Enter your Client ID and Client Secret
   - Authorize Google Calendar API v3
   - Exchange authorization code for tokens
   - Copy the refresh token

**Environment Variables:**
```env
GOOGLE_CLIENT_ID=your-client-id.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_REFRESH_TOKEN=your-refresh-token
```

### 3. Spotify Web API

**What you need:**
- Spotify Developer account
- App registration

**Steps:**
1. Go to Spotify Developer Dashboard: https://developer.spotify.com/dashboard
2. Log in with your Spotify account
3. Click "Create App"
4. Fill in app details:
   - App name: "MCP Automation Server"
   - App description: "MCP server for music recommendations"
   - Redirect URI: http://localhost:8888/callback (for future user auth)
5. Copy Client ID and Client Secret

**Environment Variables:**
```env
SPOTIFY_CLIENT_ID=your-spotify-client-id
SPOTIFY_CLIENT_SECRET=your-spotify-client-secret
```

## 📋 Complete .env File Template

Create a `.env` file in your project root with:

```env
# Email Configuration (Gmail)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Google Calendar Configuration
GOOGLE_CLIENT_ID=your-google-client-id.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REFRESH_TOKEN=your-google-refresh-token

# Spotify Configuration
SPOTIFY_CLIENT_ID=your-spotify-client-id
SPOTIFY_CLIENT_SECRET=your-spotify-client-secret
```

## 🚀 Quick Setup Commands

```bash
# 1. Copy environment template
cp .env.template .env

# 2. Edit with your API keys
notepad .env  # Windows
# or
nano .env     # Linux/macOS

# 3. Build and test
npm run build
npm start
```

## 🔒 Security Notes

1. **Never commit your .env file to version control**
2. **Use environment variables in production**
3. **Rotate API keys regularly**
4. **Use least-privilege access for Google APIs**
5. **Keep your app passwords secure**

## ✅ Testing Your Setup

After configuration, test each service:

### Test Email:
```json
{
  "name": "send-email",
  "arguments": {
    "to": "test@example.com",
    "subject": "Test Email",
    "body": "Testing MCP email service"
  }
}
```

### Test Calendar:
```json
{
  "name": "list-calendar-events",
  "arguments": {
    "maxResults": 5
  }
}
```

### Test Spotify:
```json
{
  "name": "get-song-recommendations",
  "arguments": {
    "genres": ["pop"],
    "limit": 5
  }
}
```

## 🐛 Troubleshooting

### Email Issues:
- Ensure 2FA is enabled on Gmail
- Use App Password, not regular password
- Check if less secure apps is disabled (should be)

### Calendar Issues:
- Verify Calendar API is enabled in Google Cloud
- Check OAuth consent screen is configured
- Ensure refresh token hasn't expired

### Spotify Issues:
- Verify app is not in development mode restrictions
- Check rate limits (30 seconds for client credentials)
- Ensure client credentials flow is supported

## 📞 Support

If you encounter issues:
1. Check the error logs in the console
2. Verify all environment variables are set
3. Test API credentials independently
4. Review the troubleshooting section in README.md
