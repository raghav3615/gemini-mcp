#!/usr/bin/env node

import { spawn } from 'child_process';

// Test a specific tool call
async function testToolCall() {
  console.log('🧪 Testing tool call...');
  
  const server = spawn('node', ['build/index.js'], {
    stdio: ['pipe', 'pipe', 'pipe']
  });

  // Test email tool
  const toolCallRequest = {
    jsonrpc: '2.0',
    id: 2,
    method: 'tools/call',
    params: {
      name: 'send-email',
      arguments: {
        to: 'test@example.com',
        subject: 'Test Email',
        body: 'This is a test email from the MCP server!'
      }
    }
  };

  console.log('📨 Testing send-email tool...');
  server.stdin.write(JSON.stringify(toolCallRequest) + '\n');

  server.stdout.on('data', (data) => {
    try {
      const response = JSON.parse(data.toString());
      console.log('✅ Tool response:');
      console.log(JSON.stringify(response, null, 2));
    } catch (error) {
      console.log('📦 Raw response:', data.toString());
    }
  });

  server.stderr.on('data', (data) => {
    console.log('🔍 Server log:', data.toString().trim());
  });

  setTimeout(() => {
    server.kill();
    console.log('\n✨ Test completed!');
    process.exit(0);
  }, 5000);
}

testToolCall().catch(console.error);
