#!/usr/bin/env node

/**
 * Test script for the Gemini API Server
 * This script tests all API endpoints
 */

import fetch from 'node-fetch';
import { setTimeout } from 'timers/promises';

const API_BASE_URL = 'http://localhost:3000';

class APITester {
  constructor(baseUrl = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  async makeRequest(endpoint, method = 'GET', body = null) {
    const url = `${this.baseUrl}${endpoint}`;
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(url, options);
      const data = await response.json();
      return { status: response.status, data };
    } catch (error) {
      return { status: 'ERROR', data: { error: error.message } };
    }
  }

  async testHealthCheck() {
    console.log('🏥 Testing health check endpoint...');
    const result = await this.makeRequest('/health');
    
    if (result.status === 200 && result.data.status === 'healthy') {
      console.log('✅ Health check passed');
      return true;
    } else {
      console.log('❌ Health check failed:', result);
      return false;
    }
  }

  async testRootEndpoint() {
    console.log('📖 Testing root documentation endpoint...');
    const result = await this.makeRequest('/');
    
    if (result.status === 200 && result.data.endpoints) {
      console.log('✅ Root endpoint working');
      console.log('📋 Available endpoints:', Object.keys(result.data.endpoints).length);
      return true;
    } else {
      console.log('❌ Root endpoint failed:', result);
      return false;
    }
  }

  async testChatEndpoint() {
    console.log('💬 Testing chat endpoint...');
    
    const testBody = {
      message: 'Hello! Please respond with exactly "API test successful" and nothing else.',
      model: 'gemini-1.5-flash',
      temperature: 0.1,
      maxTokens: 20
    };

    const result = await this.makeRequest('/chat', 'POST', testBody);
    
    if (result.status === 200 && result.data.success && result.data.data.response) {
      console.log('✅ Chat endpoint working');
      console.log('📝 Response preview:', result.data.data.response.substring(0, 100) + '...');
      return true;
    } else {
      console.log('❌ Chat endpoint failed:', result);
      return false;
    }
  }

  async testVisionEndpoint() {
    console.log('👁️  Testing vision endpoint...');
    
    // Using a simple test image URL (Wikipedia commons logo)
    const testBody = {
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Vd-Orig.svg/256px-Vd-Orig.svg.png',
      prompt: 'Describe this image briefly in one sentence.',
      model: 'gemini-1.5-flash'
    };

    const result = await this.makeRequest('/vision', 'POST', testBody);
    
    if (result.status === 200 && result.data.success && result.data.data.response) {
      console.log('✅ Vision endpoint working');
      console.log('📸 Analysis preview:', result.data.data.response.substring(0, 100) + '...');
      return true;
    } else {
      console.log('❌ Vision endpoint failed:', result);
      return false;
    }
  }

  async testCodeEndpoint() {
    console.log('💻 Testing code execution endpoint...');
    
    const testBody = {
      code: 'print("API test successful")\nresult = 1 + 1\nprint(f"1 + 1 = {result}")',
      language: 'python',
      description: 'Simple test calculation'
    };

    const result = await this.makeRequest('/code', 'POST', testBody);
    
    if (result.status === 200 && result.data.success && result.data.data.response) {
      console.log('✅ Code execution endpoint working');
      console.log('⚙️  Execution preview:', result.data.data.response.substring(0, 100) + '...');
      return true;
    } else {
      console.log('❌ Code execution endpoint failed:', result);
      return false;
    }
  }

  async testFunctionCallingEndpoint() {
    console.log('🔧 Testing function calling endpoint...');
    
    const testBody = {
      message: 'What would the get_test_result function return for a successful test?',
      functions: [
        {
          name: 'get_test_result',
          description: 'Get the result of a test execution',
          parameters: {
            type: 'object',
            properties: {
              test_name: {
                type: 'string',
                description: 'Name of the test'
              },
              status: {
                type: 'string',
                description: 'Test status (pass/fail)'
              }
            },
            required: ['test_name', 'status']
          }
        }
      ]
    };

    const result = await this.makeRequest('/functions', 'POST', testBody);
    
    if (result.status === 200 && result.data.success && result.data.data.response) {
      console.log('✅ Function calling endpoint working');
      console.log('🛠️  Response preview:', result.data.data.response.substring(0, 100) + '...');
      return true;
    } else {
      console.log('❌ Function calling endpoint failed:', result);
      return false;
    }
  }

  async testErrorHandling() {
    console.log('🚫 Testing error handling...');
    
    // Test missing required parameter
    const result = await this.makeRequest('/chat', 'POST', {});
    
    if (result.status === 500 && result.data.error) {
      console.log('✅ Error handling working correctly');
      return true;
    } else {
      console.log('❌ Error handling not working:', result);
      return false;
    }
  }

  async test404Handling() {
    console.log('🔍 Testing 404 handling...');
    
    const result = await this.makeRequest('/nonexistent-endpoint');
    
    if (result.status === 404 && result.data.error) {
      console.log('✅ 404 handling working correctly');
      return true;
    } else {
      console.log('❌ 404 handling not working:', result);
      return false;
    }
  }

  async runAllTests() {
    console.log('🧪 Starting API Tests for Gemini Server\n');
    console.log(`🌐 Testing API at: ${this.baseUrl}\n`);
    
    const tests = [
      { name: 'Health Check', fn: () => this.testHealthCheck() },
      { name: 'Root Endpoint', fn: () => this.testRootEndpoint() },
      { name: 'Error Handling', fn: () => this.testErrorHandling() },
      { name: '404 Handling', fn: () => this.test404Handling() },
      { name: 'Chat Endpoint', fn: () => this.testChatEndpoint() },
      { name: 'Vision Endpoint', fn: () => this.testVisionEndpoint() },
      { name: 'Code Execution', fn: () => this.testCodeEndpoint() },
      { name: 'Function Calling', fn: () => this.testFunctionCallingEndpoint() }
    ];

    let passed = 0;
    let failed = 0;

    for (const test of tests) {
      try {
        const result = await test.fn();
        if (result) {
          passed++;
        } else {
          failed++;
        }
      } catch (error) {
        console.log(`❌ ${test.name} threw an error:`, error.message);
        failed++;
      }
      
      // Add a small delay between tests
      await setTimeout(1000);
      console.log('');
    }

    console.log('📊 Test Results:');
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`📈 Success Rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%`);
    
    if (failed === 0) {
      console.log('\n🎉 All tests passed! Your API is working perfectly.');
    } else {
      console.log('\n⚠️  Some tests failed. Check the API server logs for details.');
    }

    return failed === 0;
  }
}

// Check if server is running first
async function checkServerRunning() {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    return response.ok;
  } catch (error) {
    return false;
  }
}

// Main execution
async function main() {
  console.log('🔌 Checking if API server is running...');
  
  const isRunning = await checkServerRunning();
  
  if (!isRunning) {
    console.log('❌ API server is not running!');
    console.log('📋 To start the server, run:');
    console.log('   npm run api');
    console.log('   or');
    console.log('   node api-server.js');
    console.log('\nThen run this test script again.');
    process.exit(1);
  }

  console.log('✅ API server is running!\n');
  
  const tester = new APITester();
  const success = await tester.runAllTests();
  
  process.exit(success ? 0 : 1);
}

// Handle errors
process.on('unhandledRejection', (error) => {
  console.error('❌ Unhandled error:', error.message);
  process.exit(1);
});

// Run the tests
main().catch(console.error);
