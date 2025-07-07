#!/usr/bin/env node

import { spawn } from 'child_process';

// Simple test to verify MCP server is responding
async function testMCPServer() {
  console.log('🚀 Testing Automation MCP Server...');
  
  const server = spawn('node', ['build/index.js'], {
    stdio: ['pipe', 'pipe', 'pipe']
  });

  // Test list tools request
  const listToolsRequest = {
    jsonrpc: '2.0',
    id: 1,
    method: 'tools/list'
  };

  console.log('📨 Sending list tools request...');
  server.stdin.write(JSON.stringify(listToolsRequest) + '\n');

  // Listen for response
  server.stdout.on('data', (data) => {
    try {
      const response = JSON.parse(data.toString());
      console.log('✅ Received response:');
      console.log(JSON.stringify(response, null, 2));
      
      if (response.result && response.result.tools) {
        console.log(`\n📋 Found ${response.result.tools.length} tools:`);
        response.result.tools.forEach(tool => {
          console.log(`   - ${tool.name}: ${tool.description}`);
        });
      }
    } catch (error) {
      console.log('📦 Raw response:', data.toString());
    }
  });

  server.stderr.on('data', (data) => {
    console.log('🔍 Server log:', data.toString().trim());
  });

  // Clean up after 3 seconds
  setTimeout(() => {
    server.kill();
    console.log('\n✨ Test completed!');
    process.exit(0);
  }, 3000);
}

testMCPServer().catch(console.error);
