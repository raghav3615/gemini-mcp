# 🚀 Gemini API Server - Complete Setup

## Overview
You now have **two ways** to use Google Gemini AI:

1. **MCP Server** (`mcp.js`) - For integration with Claude Desktop and other MCP clients
2. **REST API Server** (`api-server.js`) - For web applications and HTTP-based integrations

## 📁 Project Structure
```
c:\Users\dadhi\ml\
├── mcp.js                    # MCP Server (original)
├── api-server.js             # NEW: REST API Server
├── package.json              # Dependencies for both servers
├── demo.html                 # NEW: Web demo interface
├── test_api.js               # NEW: API test script
├── API_DOCUMENTATION.md      # NEW: Complete API docs
├── USAGE_GUIDE.md            # MCP usage guide
├── STATUS.md                 # Setup status
└── Config files:
    ├── mcp_config.json
    ├── claude_desktop_config.json
    └── .env.example
```

## 🎯 Quick Start

### Option 1: REST API Server (Web/HTTP)
```bash
# Start the API server
npm run api

# Test the API
npm run test:api

# Open demo in browser
# Open demo.html in your browser
```

### Option 2: MCP Server (Claude Desktop)
```bash
# Start the MCP server
npm start

# Use with Claude Desktop (see USAGE_GUIDE.md)
```

## 🌐 REST API Server Features

### ✅ What's Working:
- **HTTP REST API** on `http://localhost:3000`
- **4 Main Endpoints**: `/chat`, `/vision`, `/code`, `/functions`
- **CORS enabled** for web applications
- **Error handling** and validation
- **JSON responses** with metadata
- **Health checks** and documentation

### 📋 API Endpoints:

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/` | GET | API documentation |
| `/health` | GET | Server health check |
| `/chat` | POST | Chat with Gemini |
| `/vision` | POST | Analyze images |
| `/code` | POST | Execute Python code |
| `/functions` | POST | Function calling |

### 🧪 Testing:
```bash
# Run all API tests
npm run test:api

# Start server and open demo
npm run api
# Then open demo.html in browser
```

## 🔧 API Usage Examples

### JavaScript/Fetch:
```javascript
// Chat example
const response = await fetch('http://localhost:3000/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message: 'Hello, Gemini!',
    model: 'gemini-1.5-flash'
  })
});
const result = await response.json();
console.log(result.data.response);
```

### Python/requests:
```python
import requests

response = requests.post('http://localhost:3000/chat', json={
    'message': 'Explain quantum computing',
    'temperature': 0.7
})
result = response.json()
print(result['data']['response'])
```

### cURL:
```bash
curl -X POST http://localhost:3000/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello from cURL!"}'
```

## 🎨 Web Demo

Open `demo.html` in your browser for a complete interactive demo with:
- ✅ Real-time server status
- 💬 Chat interface
- 👁️ Image analysis
- 💻 Code execution
- 🔧 Function calling

## 🔐 Security Setup

### Environment Variables:
```bash
# Required
GEMINI_API_KEY=your_api_key_here

# Optional
PORT=3000
```

### For Production:
1. **Use HTTPS** instead of HTTP
2. **Implement rate limiting**
3. **Add authentication** if needed
4. **Restrict CORS** to specific domains
5. **Use environment-specific configs**

## 📊 Server Comparison

| Feature | MCP Server | API Server |
|---------|------------|------------|
| **Use Case** | Claude Desktop, MCP clients | Web apps, mobile apps, any HTTP client |
| **Protocol** | JSON-RPC over stdio | REST HTTP |
| **Integration** | Direct with compatible tools | Universal HTTP |
| **Setup** | Add to Claude config | Start server + make requests |
| **Best For** | AI assistant workflows | Custom applications |

## 🚀 Deployment Options

### Local Development:
```bash
# API Server
npm run api

# MCP Server
npm start
```

### Production (PM2):
```bash
npm install -g pm2

# Start API server with PM2
pm2 start api-server.js --name "gemini-api"

# Start MCP server with PM2
pm2 start mcp.js --name "gemini-mcp"

pm2 startup
pm2 save
```

### Docker:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "run", "api"]
```

## 🛠️ Development Scripts

```bash
# MCP Server
npm start              # Start MCP server
npm run dev            # Start MCP server (alias)

# API Server  
npm run api            # Start REST API server
npm run api:dev        # Start REST API server (alias)

# Testing
npm run test:api       # Test all API endpoints

# Dependencies
npm install            # Install all dependencies
```

## 📖 Documentation

- **`API_DOCUMENTATION.md`** - Complete REST API reference
- **`USAGE_GUIDE.md`** - MCP server usage with examples
- **`demo.html`** - Interactive web demo
- **`test_api.js`** - Comprehensive API tests

## 🎉 What You Can Build

### With the REST API:
- **Web applications** with Gemini chat
- **Mobile apps** with AI features
- **Chatbots** and virtual assistants
- **Image analysis tools**
- **Code execution platforms**
- **AI-powered APIs** for other services

### With the MCP Server:
- **Enhanced Claude Desktop** workflows
- **Custom MCP clients**
- **AI tool integrations**
- **Automated assistant tasks**

## 🆘 Troubleshooting

### API Server Issues:
```bash
# Check if server is running
curl http://localhost:3000/health

# Check logs
npm run api

# Test all endpoints
npm run test:api
```

### MCP Server Issues:
```bash
# Test MCP server
npm start

# Check Claude Desktop config
# See USAGE_GUIDE.md
```

### Common Problems:
1. **Port already in use**: Change `PORT` environment variable
2. **API key errors**: Check `GEMINI_API_KEY` is set correctly
3. **CORS issues**: Server allows all origins by default
4. **Import errors**: Ensure Node.js 18+ and `"type": "module"` in package.json

## 🎯 Next Steps

1. **Try the demo**: Open `demo.html` in your browser
2. **Read the docs**: Check `API_DOCUMENTATION.md` for detailed examples
3. **Build something**: Use the API in your own projects
4. **Deploy**: Follow deployment guides for production use

Your Gemini AI servers are now fully operational! 🚀✨
