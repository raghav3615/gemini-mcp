`# How to Use the Gemini MCP Server

## Overview
This MCP (Model Context Protocol) server provides access to Google's Gemini AI models through a standardized interface. It can be used with any MCP-compatible client.

## Setup Complete ✅
Your server is now configured and ready to use with:
- **Server file**: `c:/Users/dadhi/ml/mcp.js`
- **Configuration**: `mcp_config.json`
- **API Key**: Already configured

## Using with MCP Clients

### 1. Claude Desktop (Recommended)
If you have Claude Desktop installed, you can add this server to your configuration:

**Location**: `%APPDATA%\Claude\claude_desktop_config.json`

Add this to your Claude Desktop config:
```json
{
  "mcpServers": {
    "gemini": {
      "command": "node",
      "args": ["c:/Users/dadhi/ml/mcp.js"],
      "env": {
        "GEMINI_API_KEY": "AIzaSyACpS3hQoqASRY4OEYGLfa31n1j65RDckQ"
      }
    }
  }
}
```

### 2. VS Code with MCP Extension
1. Install an MCP extension for VS Code
2. Configure it to use your `mcp_config.json` file
3. The server will be available as a tool provider

### 3. Command Line Testing
You can test the server directly using MCP client tools or by sending JSON-RPC messages over stdio.

## Available Tools

### 🤖 gemini_chat
Chat with Gemini AI models.

**Example usage:**
```json
{
  "method": "tools/call",
  "params": {
    "name": "gemini_chat",
    "arguments": {
      "message": "Hello, how are you?",
      "model": "gemini-1.5-flash",
      "temperature": 0.7,
      "maxTokens": 1000
    }
  }
}
```

**Parameters:**
- `message` (required): Your message to Gemini
- `model` (optional): `gemini-1.5-flash`, `gemini-1.5-pro`, or `gemini-1.0-pro`
- `temperature` (optional): 0.0-1.0 for response randomness
- `maxTokens` (optional): Maximum response length

### 👁️ gemini_vision
Analyze images with Gemini Vision.

**Example usage:**
```json
{
  "method": "tools/call",
  "params": {
    "name": "gemini_vision",
    "arguments": {
      "imageUrl": "https://example.com/image.jpg",
      "prompt": "What do you see in this image?",
      "model": "gemini-1.5-flash"
    }
  }
}
```

**Parameters:**
- `imageUrl` OR `imageBase64`: Image to analyze
- `prompt` (optional): Custom analysis prompt
- `model` (optional): Gemini model to use

### 💻 gemini_code_execution
Execute Python code using Gemini.

**Example usage:**
```json
{
  "method": "tools/call",
  "params": {
    "name": "gemini_code_execution",
    "arguments": {
      "code": "print('Hello, World!')\nresult = 2 + 2\nprint(f'2 + 2 = {result}')",
      "description": "Simple arithmetic calculation"
    }
  }
}
```

**Parameters:**
- `code` (required): Python code to execute
- `description` (optional): What the code does
- `language` (optional): Always "python" for now

### 🔧 gemini_function_calling
Use Gemini with custom function definitions.

**Example usage:**
```json
{
  "method": "tools/call",
  "params": {
    "name": "gemini_function_calling",
    "arguments": {
      "message": "What's the weather like?",
      "functions": [
        {
          "name": "get_weather",
          "description": "Get current weather for a location",
          "parameters": {
            "type": "object",
            "properties": {
              "location": {"type": "string"}
            },
            "required": ["location"]
          }
        }
      ]
    }
  }
}
```

## Manual Testing

You can test the server manually by running it and sending JSON-RPC messages:

1. **Start the server:**
   ```powershell
   cd "c:\Users\dadhi\ml"
   $env:GEMINI_API_KEY="AIzaSyACpS3hQoqASRY4OEYGLfa31n1j65RDckQ"
   node mcp.js
   ```

2. **Send test messages** (in another terminal or through a client)

## Troubleshooting

### Common Issues:
1. **"GEMINI_API_KEY not found"**: Make sure the API key is set in your environment or config
2. **Import errors**: Ensure you're using Node.js 18+ and the package.json has `"type": "module"`
3. **Connection issues**: Check that the server path in your config is correct

### Debug Mode:
Add error logging by modifying the server or check terminal output for detailed error messages.

## Integration Examples

### With AI Assistants
When integrated with Claude Desktop or other MCP clients, you can:
- Ask Claude to use Gemini for specific tasks
- Get different AI perspectives on problems
- Use Gemini's vision capabilities through Claude
- Execute code using Gemini's Python environment

### Example Conversation:
```
You: "Use the Gemini server to analyze this image and tell me what you see"
Claude: [Uses gemini_vision tool] "I used Gemini to analyze the image..."

You: "Now use Gemini to write and execute some Python code to calculate..."
Claude: [Uses gemini_code_execution tool] "I had Gemini execute this code..."
```

## Next Steps
1. **Configure your MCP client** (like Claude Desktop) to use this server
2. **Test the integration** with simple queries
3. **Explore advanced features** like function calling and vision analysis
4. **Build workflows** that combine multiple AI models through MCP

Your Gemini MCP server is now ready to use! 🚀
