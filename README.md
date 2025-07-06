# Gemini MCP Server

A Model Context Protocol (MCP) server that provides access to Google's Gemini AI models.

## Features

- **Gemini Chat**: Chat with various Gemini models (1.5-flash, 1.5-pro, 1.0-pro)
- **Gemini Vision**: Analyze images using Gemini's vision capabilities
- **Code Execution**: Execute Python code using Gemini's code execution feature
- **Function Calling**: Use Gemini with custom function definitions

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Get a Gemini API key:**
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a new API key
   - Copy the API key

3. **Set the environment variable:**
   
   **Windows (PowerShell):**
   ```powershell
   $env:GEMINI_API_KEY="your_api_key_here"
   ```
   
   **Windows (Command Prompt):**
   ```cmd
   set GEMINI_API_KEY=your_api_key_here
   ```
   
   **Linux/macOS:**
   ```bash
   export GEMINI_API_KEY="your_api_key_here"
   ```

   Or create a `.env` file (copy from `.env.example` and update):
   ```
   GEMINI_API_KEY=your_actual_api_key_here
   ```

## Running the Server

```bash
npm start
```

The server will run on stdio and can be used with MCP-compatible clients.

## Available Tools

### 1. gemini_chat
Chat with Gemini AI models.

**Parameters:**
- `message` (required): The message to send
- `model` (optional): Model to use (default: gemini-1.5-flash)
- `temperature` (optional): Response randomness 0.0-1.0 (default: 0.7)
- `maxTokens` (optional): Maximum response tokens (default: 1000)

### 2. gemini_vision
Analyze images with Gemini Vision.

**Parameters:**
- `imageUrl` or `imageBase64`: Image to analyze
- `prompt` (optional): Analysis prompt (default: "Describe this image in detail")
- `model` (optional): Model to use (default: gemini-1.5-flash)

### 3. gemini_code_execution
Execute Python code using Gemini.

**Parameters:**
- `code` (required): Python code to execute
- `language` (optional): Programming language (default: python)
- `description` (optional): Description of what the code does

### 4. gemini_function_calling
Use Gemini with function calling capabilities.

**Parameters:**
- `message` (required): The query for Gemini
- `functions` (required): Array of function definitions

## Example Usage

The server is designed to be used with MCP-compatible clients. Once running, the tools can be called through the MCP protocol.
