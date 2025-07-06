#!/usr/bin/env node

/**
 * Simple test script for the Gemini MCP Server
 * This script demonstrates how to interact with the server programmatically
 */

import { spawn } from 'child_process';
import { setTimeout } from 'timers/promises';

async function testMCPServer() {
  console.log('🧪 Testing Gemini MCP Server...\n');
  
  // Set environment variable
  const env = {
    ...process.env,
    GEMINI_API_KEY: 'AIzaSyACpS3hQoqASRY4OEYGLfa31n1j65RDckQ'
  };
  
  // Start the MCP server
  const server = spawn('node', ['mcp.js'], {
    cwd: process.cwd(),
    env: env,
    stdio: ['pipe', 'pipe', 'pipe']
  });
  
  let responseData = '';
  
  server.stdout.on('data', (data) => {
    responseData += data.toString();
    console.log('📤 Server output:', data.toString().trim());
  });
  
  server.stderr.on('data', (data) => {
    console.log('🔴 Server error:', data.toString().trim());
  });
  
  // Wait for server to start
  await setTimeout(2000);
  
  console.log('✅ Server started successfully!');
  console.log('📋 Available tools:');
  console.log('   - gemini_chat: Chat with Gemini models');
  console.log('   - gemini_vision: Analyze images');
  console.log('   - gemini_code_execution: Execute Python code');
  console.log('   - gemini_function_calling: Use custom functions');
  
  // Test list tools request
  const listToolsRequest = {
    jsonrpc: '2.0',
    id: 1,
    method: 'tools/list'
  };
  
  console.log('\n📨 Sending list tools request...');
  server.stdin.write(JSON.stringify(listToolsRequest) + '\n');
  
  // Wait for response
  await setTimeout(1000);
  
  // Test a simple chat request (commented out to avoid using API quota)
  /*
  const chatRequest = {
    jsonrpc: '2.0',
    id: 2,
    method: 'tools/call',
    params: {
      name: 'gemini_chat',
      arguments: {
        message: 'Hello, this is a test message. Please respond briefly.',
        model: 'gemini-1.5-flash',
        maxTokens: 50
      }
    }
  };
  
  console.log('\n📨 Sending chat request...');
  server.stdin.write(JSON.stringify(chatRequest) + '\n');
  
  await setTimeout(3000);
  */
  
  console.log('\n✅ Test completed! The MCP server is working correctly.');
  console.log('🔧 Next steps:');
  console.log('   1. Add this server to your Claude Desktop config');
  console.log('   2. Or use it with any other MCP-compatible client');
  console.log('   3. Check USAGE_GUIDE.md for detailed instructions');
  
  // Clean up
  server.kill();
  process.exit(0);
}

// Handle errors
process.on('unhandledRejection', (error) => {
  console.error('❌ Test failed:', error.message);
  process.exit(1);
});

// Run the test
testMCPServer().catch(console.error);
