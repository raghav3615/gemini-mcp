# Gemini API Server Documentation

## Overview
This REST API provides HTTP endpoints to access Google Gemini AI capabilities. It's a wrapper around the MCP server that makes it easy to integrate Gemini AI into web applications and other services.

## Starting the API Server

```bash
# Start the API server
npm run api

# Or directly
node api-server.js
```

The server will start on `http://localhost:3000` by default.

## Environment Variables

```bash
GEMINI_API_KEY=your_gemini_api_key_here
PORT=3000  # Optional, defaults to 3000
```

## API Endpoints

### Health Check
**GET** `/health`

Returns server status and health information.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-07-06T10:00:00.000Z",
  "server": "Gemini API Server",
  "version": "1.0.0"
}
```

### Chat with Gemini
**POST** `/chat`

Chat with Gemini AI models.

**Request Body:**
```json
{
  "message": "Hello, how are you?",
  "model": "gemini-1.5-flash",     // Optional
  "temperature": 0.7,              // Optional (0.0-1.0)
  "maxTokens": 1000               // Optional
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "response": "Hello! I'm doing well, thank you for asking...",
    "model": "gemini-1.5-flash",
    "metadata": {
      "temperature": 0.7,
      "maxTokens": 1000,
      "timestamp": "2025-07-06T10:00:00.000Z"
    }
  }
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:3000/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Write a short poem about coding",
    "temperature": 0.8
  }'
```

### Vision Analysis
**POST** `/vision`

Analyze images using Gemini Vision.

**Request Body:**
```json
{
  "imageUrl": "https://example.com/image.jpg",  // OR use imageBase64
  "imageBase64": "data:image/jpeg;base64,/9j/4AAQ...",  // Alternative to imageUrl
  "prompt": "What do you see in this image?",   // Optional
  "model": "gemini-1.5-flash"                  // Optional
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "response": "I can see a beautiful landscape with mountains...",
    "prompt": "What do you see in this image?",
    "model": "gemini-1.5-flash",
    "metadata": {
      "imageSource": "url",
      "timestamp": "2025-07-06T10:00:00.000Z"
    }
  }
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:3000/vision \
  -H "Content-Type: application/json" \
  -d '{
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Vd-Orig.svg/256px-Vd-Orig.svg.png",
    "prompt": "Describe this logo in detail"
  }'
```

### Code Execution
**POST** `/code`

Execute Python code using Gemini's code execution capability.

**Request Body:**
```json
{
  "code": "print('Hello, World!')\nresult = 2 + 2\nprint(f'2 + 2 = {result}')",
  "language": "python",                    // Optional, only "python" supported
  "description": "Simple arithmetic demo"  // Optional
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "response": "```\nHello, World!\n2 + 2 = 4\n```\n\nThe code executed successfully...",
    "code": "print('Hello, World!')...",
    "language": "python",
    "description": "Simple arithmetic demo",
    "metadata": {
      "timestamp": "2025-07-06T10:00:00.000Z"
    }
  }
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:3000/code \
  -H "Content-Type: application/json" \
  -d '{
    "code": "import math\nprint(f\"The value of pi is approximately {math.pi:.4f}\")",
    "description": "Calculate pi value"
  }'
```

### Function Calling
**POST** `/functions`

Use Gemini with custom function definitions.

**Request Body:**
```json
{
  "message": "What's the weather like in Paris?",
  "functions": [
    {
      "name": "get_weather",
      "description": "Get current weather for a location",
      "parameters": {
        "type": "object",
        "properties": {
          "location": {
            "type": "string",
            "description": "The city and country"
          }
        },
        "required": ["location"]
      }
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "response": "I'll help you get the weather for Paris...",
    "message": "What's the weather like in Paris?",
    "functionsProvided": 1,
    "metadata": {
      "timestamp": "2025-07-06T10:00:00.000Z"
    }
  }
}
```

## Error Handling

All endpoints return errors in the following format:

```json
{
  "error": "Error message description"
}
```

**Common HTTP Status Codes:**
- `200` - Success
- `400` - Bad Request (missing required parameters)
- `404` - Endpoint not found
- `500` - Internal server error

## JavaScript Client Example

```javascript
class GeminiAPIClient {
  constructor(baseUrl = 'http://localhost:3000') {
    this.baseUrl = baseUrl;
  }

  async chat(message, options = {}) {
    const response = await fetch(`${this.baseUrl}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, ...options })
    });
    return response.json();
  }

  async analyzeImage(imageUrl, prompt) {
    const response = await fetch(`${this.baseUrl}/vision`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageUrl, prompt })
    });
    return response.json();
  }

  async executeCode(code, description) {
    const response = await fetch(`${this.baseUrl}/code`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, description })
    });
    return response.json();
  }
}

// Usage
const client = new GeminiAPIClient();

// Chat example
const chatResult = await client.chat("Hello, Gemini!");
console.log(chatResult.data.response);

// Vision example
const visionResult = await client.analyzeImage(
  "https://example.com/image.jpg",
  "What's in this image?"
);
console.log(visionResult.data.response);
```

## Python Client Example

```python
import requests
import json

class GeminiAPIClient:
    def __init__(self, base_url="http://localhost:3000"):
        self.base_url = base_url
    
    def chat(self, message, **options):
        response = requests.post(
            f"{self.base_url}/chat",
            json={"message": message, **options}
        )
        return response.json()
    
    def analyze_image(self, image_url=None, image_base64=None, prompt=None):
        data = {"prompt": prompt}
        if image_url:
            data["imageUrl"] = image_url
        if image_base64:
            data["imageBase64"] = image_base64
            
        response = requests.post(f"{self.base_url}/vision", json=data)
        return response.json()
    
    def execute_code(self, code, description=None):
        response = requests.post(
            f"{self.base_url}/code",
            json={"code": code, "description": description}
        )
        return response.json()

# Usage
client = GeminiAPIClient()

# Chat example
result = client.chat("Explain quantum computing in simple terms")
print(result["data"]["response"])

# Code execution example
result = client.execute_code("""
import matplotlib.pyplot as plt
import numpy as np

x = np.linspace(0, 10, 100)
y = np.sin(x)

plt.plot(x, y)
plt.title('Sine Wave')
plt.xlabel('x')
plt.ylabel('sin(x)')
plt.grid(True)
plt.show()
""", "Create a sine wave plot")
print(result["data"]["response"])
```

## Testing the API

You can test all endpoints using the included test script:

```bash
node test_api.js
```

## Security Considerations

1. **API Key Protection**: Never expose your `GEMINI_API_KEY` in client-side code
2. **Rate Limiting**: Consider implementing rate limiting for production use
3. **Input Validation**: The API validates inputs, but additional validation may be needed
4. **HTTPS**: Use HTTPS in production environments
5. **CORS**: The API allows all origins by default - restrict in production

## Deployment

### Local Development
```bash
npm run api
```

### Production with PM2
```bash
npm install -g pm2
pm2 start api-server.js --name "gemini-api"
pm2 startup
pm2 save
```

### Docker (Optional)
Create a `Dockerfile`:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "run", "api"]
```

Your Gemini API server is now ready for integration! 🚀
