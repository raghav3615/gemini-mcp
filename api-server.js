#!/usr/bin/env node

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

class GeminiAPIServer {
  constructor() {
    this.genAI = null;
    this.initialize();
    this.setupRoutes();
  }

  async initialize() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is required');
    }
    
    this.genAI = new GoogleGenerativeAI(apiKey);
    console.log('✅ Gemini API initialized');
  }

  setupRoutes() {
    // Health check endpoint
    app.get('/health', (req, res) => {
      res.json({ 
        status: 'healthy', 
        timestamp: new Date().toISOString(),
        server: 'Gemini API Server',
        version: '1.0.0'
      });
    });

    // Get available endpoints
    app.get('/', (req, res) => {
      res.json({
        message: 'Gemini API Server',
        version: '1.0.0',
        endpoints: {
          'GET /': 'This help message',
          'GET /health': 'Health check',
          'POST /chat': 'Chat with Gemini AI',
          'POST /vision': 'Analyze images with Gemini Vision',
          'POST /code': 'Execute Python code with Gemini',
          'POST /functions': 'Use Gemini with function calling'
        },
        documentation: 'See README.md for detailed usage examples'
      });
    });

    // Chat endpoint
    app.post('/chat', async (req, res) => {
      try {
        const result = await this.handleChat(req.body);
        res.json(result);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // Vision endpoint
    app.post('/vision', async (req, res) => {
      try {
        const result = await this.handleVision(req.body);
        res.json(result);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // Code execution endpoint
    app.post('/code', async (req, res) => {
      try {
        const result = await this.handleCodeExecution(req.body);
        res.json(result);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // Function calling endpoint
    app.post('/functions', async (req, res) => {
      try {
        const result = await this.handleFunctionCalling(req.body);
        res.json(result);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // Error handling middleware
    app.use((error, req, res, next) => {
      console.error('API Error:', error);
      res.status(500).json({ 
        error: 'Internal server error',
        message: error.message 
      });
    });

    // 404 handler
    app.use((req, res) => {
      res.status(404).json({ 
        error: 'Endpoint not found',
        message: `${req.method} ${req.path} is not a valid endpoint`
      });
    });
  }

  async handleChat(body) {
    const { 
      message, 
      model = 'gemini-1.5-flash', 
      temperature = 0.7, 
      maxTokens = 1000 
    } = body;

    if (!message) {
      throw new Error('Message is required');
    }

    const geminiModel = this.genAI.getGenerativeModel({ 
      model,
      generationConfig: {
        temperature,
        maxOutputTokens: maxTokens,
      }
    });

    const result = await geminiModel.generateContent(message);
    const response = await result.response;
    
    return {
      success: true,
      data: {
        response: response.text(),
        model: model,
        metadata: {
          temperature,
          maxTokens,
          timestamp: new Date().toISOString()
        }
      }
    };
  }

  async handleVision(body) {
    const { 
      imageUrl, 
      imageBase64, 
      prompt = 'Describe this image in detail', 
      model = 'gemini-1.5-flash' 
    } = body;
    
    if (!imageUrl && !imageBase64) {
      throw new Error('Either imageUrl or imageBase64 must be provided');
    }

    const geminiModel = this.genAI.getGenerativeModel({ model });

    let imagePart;
    if (imageBase64) {
      // Extract mime type from base64 string if present
      const mimeTypeMatch = imageBase64.match(/^data:([^;]+);base64,/);
      const mimeType = mimeTypeMatch ? mimeTypeMatch[1] : 'image/jpeg';
      const base64Data = imageBase64.replace(/^data:[^;]+;base64,/, '');
      
      imagePart = {
        inlineData: {
          data: base64Data,
          mimeType: mimeType,
        },
      };
    } else {
      // For URL, we need to fetch the image
      const response = await fetch(imageUrl);
      const arrayBuffer = await response.arrayBuffer();
      const base64Data = Buffer.from(arrayBuffer).toString('base64');
      
      imagePart = {
        inlineData: {
          data: base64Data,
          mimeType: response.headers.get('content-type') || 'image/jpeg',
        },
      };
    }

    const result = await geminiModel.generateContent([prompt, imagePart]);
    const response = await result.response;

    return {
      success: true,
      data: {
        response: response.text(),
        prompt,
        model,
        metadata: {
          imageSource: imageUrl ? 'url' : 'base64',
          timestamp: new Date().toISOString()
        }
      }
    };
  }

  async handleCodeExecution(body) {
    const { 
      code, 
      language = 'python', 
      description 
    } = body;
    
    if (!code) {
      throw new Error('Code is required');
    }

    if (language !== 'python') {
      throw new Error('Only Python is currently supported for code execution');
    }

    const geminiModel = this.genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      tools: [{ codeExecution: {} }]
    });

    const prompt = description 
      ? `${description}\n\nExecute this ${language} code:\n\`\`\`${language}\n${code}\n\`\`\``
      : `Execute this ${language} code:\n\`\`\`${language}\n${code}\n\`\`\``;

    const result = await geminiModel.generateContent(prompt);
    const response = await result.response;

    return {
      success: true,
      data: {
        response: response.text(),
        code,
        language,
        description,
        metadata: {
          timestamp: new Date().toISOString()
        }
      }
    };
  }

  async handleFunctionCalling(body) {
    const { message, functions } = body;
    
    if (!message) {
      throw new Error('Message is required');
    }

    if (!functions || !Array.isArray(functions)) {
      throw new Error('Functions array is required');
    }
    
    // Convert function definitions to Gemini format
    const tools = functions.map(func => ({
      functionDeclarations: [{
        name: func.name,
        description: func.description,
        parameters: func.parameters
      }]
    }));

    const geminiModel = this.genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      tools: tools
    });

    const result = await geminiModel.generateContent(message);
    const response = await result.response;

    return {
      success: true,
      data: {
        response: response.text(),
        message,
        functionsProvided: functions.length,
        metadata: {
          timestamp: new Date().toISOString()
        }
      }
    };
  }

  start() {
    app.listen(PORT, () => {
      console.log(`🚀 Gemini API Server running on http://localhost:${PORT}`);
      console.log(`📖 API Documentation: http://localhost:${PORT}`);
      console.log(`❤️  Health Check: http://localhost:${PORT}/health`);
      console.log(`\n📋 Available endpoints:`);
      console.log(`   POST /chat - Chat with Gemini`);
      console.log(`   POST /vision - Analyze images`);
      console.log(`   POST /code - Execute Python code`);
      console.log(`   POST /functions - Function calling`);
    });
  }
}

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n🛑 Received SIGINT, shutting down...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Received SIGTERM, shutting down...');
  process.exit(0);
});

// Start the server
const server = new GeminiAPIServer();
server.start();

export default GeminiAPIServer;
