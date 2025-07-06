#!/usr/bin/env node

import 'dotenv/config';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { GoogleGenerativeAI } from '@google/generative-ai';

class GeminiMCPServer {
  constructor() {
    this.server = new Server(
      {
        name: 'gemini-mcp-server',
        version: '0.1.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.genAI = null;
    this.setupToolHandlers();
  }

  async initialize() {
    // Initialize Gemini AI
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is required');
    }
    
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  setupToolHandlers() {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'gemini_chat',
            description: 'Chat with Gemini AI model',
            inputSchema: {
              type: 'object',
              properties: {
                message: {
                  type: 'string',
                  description: 'The message to send to Gemini',
                },
                model: {
                  type: 'string',
                  description: 'Gemini model to use (default: gemini-1.5-flash)',
                  enum: ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-1.0-pro'],
                  default: 'gemini-1.5-flash'
                },
                temperature: {
                  type: 'number',
                  description: 'Temperature for response generation (0.0 to 1.0)',
                  minimum: 0.0,
                  maximum: 1.0,
                  default: 0.7
                },
                maxTokens: {
                  type: 'number',
                  description: 'Maximum tokens in response',
                  minimum: 1,
                  maximum: 8192,
                  default: 1000
                }
              },
              required: ['message'],
            },
          },
          {
            name: 'gemini_vision',
            description: 'Analyze images with Gemini Vision',
            inputSchema: {
              type: 'object',
              properties: {
                imageUrl: {
                  type: 'string',
                  description: 'URL of the image to analyze',
                },
                imageBase64: {
                  type: 'string',
                  description: 'Base64 encoded image data (alternative to imageUrl)',
                },
                prompt: {
                  type: 'string',
                  description: 'Optional prompt for image analysis',
                  default: 'Describe this image in detail'
                },
                model: {
                  type: 'string',
                  description: 'Gemini model to use (default: gemini-1.5-flash)',
                  enum: ['gemini-1.5-flash', 'gemini-1.5-pro'],
                  default: 'gemini-1.5-flash'
                }
              },
              required: [],
            },
          },
          {
            name: 'gemini_code_execution',
            description: 'Execute code with Gemini code execution capability',
            inputSchema: {
              type: 'object',
              properties: {
                code: {
                  type: 'string',
                  description: 'Python code to execute',
                },
                language: {
                  type: 'string',
                  description: 'Programming language (currently only Python supported)',
                  enum: ['python'],
                  default: 'python'
                },
                description: {
                  type: 'string',
                  description: 'Optional description of what the code does',
                }
              },
              required: ['code'],
            },
          },
          {
            name: 'gemini_function_calling',
            description: 'Use Gemini with function calling capabilities',
            inputSchema: {
              type: 'object',
              properties: {
                message: {
                  type: 'string',
                  description: 'The message/query for Gemini',
                },
                functions: {
                  type: 'array',
                  description: 'Array of function definitions',
                  items: {
                    type: 'object',
                    properties: {
                      name: { type: 'string' },
                      description: { type: 'string' },
                      parameters: { type: 'object' }
                    },
                    required: ['name', 'description', 'parameters']
                  }
                }
              },
              required: ['message', 'functions'],
            },
          }
        ],
      };
    });

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'gemini_chat':
            return await this.handleGeminiChat(args);
          case 'gemini_vision':
            return await this.handleGeminiVision(args);
          case 'gemini_code_execution':
            return await this.handleGeminiCodeExecution(args);
          case 'gemini_function_calling':
            return await this.handleGeminiFunctionCalling(args);
          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${error.message}`,
            },
          ],
          isError: true,
        };
      }
    });
  }

  async handleGeminiChat(args) {
    const { message, model = 'gemini-1.5-flash', temperature = 0.7, maxTokens = 1000 } = args;
    
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
      content: [
        {
          type: 'text',
          text: response.text(),
        },
      ],
    };
  }

  async handleGeminiVision(args) {
    const { imageUrl, imageBase64, prompt = 'Describe this image in detail', model = 'gemini-1.5-flash' } = args;
    
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
      content: [
        {
          type: 'text',
          text: response.text(),
        },
      ],
    };
  }

  async handleGeminiCodeExecution(args) {
    const { code, language = 'python', description } = args;
    
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
      content: [
        {
          type: 'text',
          text: response.text(),
        },
      ],
    };
  }

  async handleGeminiFunctionCalling(args) {
    const { message, functions } = args;
    
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
      content: [
        {
          type: 'text',
          text: response.text(),
        },
      ],
    };
  }

  async run() {
    await this.initialize();
    
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    
    console.error('Gemini MCP Server running on stdio');
  }
}

// Handle process termination
process.on('SIGINT', async () => {
  console.error('Received SIGINT, shutting down...');
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.error('Received SIGTERM, shutting down...');
  process.exit(0);
});

// Start the server
const server = new GeminiMCPServer();
server.run().catch(console.error);

export default GeminiMCPServer;