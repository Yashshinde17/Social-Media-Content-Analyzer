import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';

const API_URL = 'http://127.0.0.1:3001/api';

async function testUploadEndpoint() {
  console.log('🧪 Testing Upload API...\n');

  // Test 1: Health Check
  try {
    console.log('1️⃣ Testing health endpoint...');
    const healthResponse = await axios.get(`${API_URL}/health`);
    console.log('✅ Health check passed:', healthResponse.data);
  } catch (error: any) {
    console.error('❌ Health check failed:', error.message);
    return;
  }

  // Test 2: Upload without file (should fail)
  try {
    console.log('\n2️⃣ Testing upload without file (should fail)...');
    await axios.post(`${API_URL}/upload`);
    console.log('❌ Should have failed but passed!');
  } catch (error: any) {
    if (error.response?.status === 400) {
      console.log('✅ Correctly rejected upload without file');
    } else {
      console.log('⚠️ Unexpected error:', error.message);
    }
  }

  console.log('\n✨ Basic API tests completed!');
  console.log('\nℹ️  To test file upload, use:');
  console.log('   curl -X POST http://localhost:3001/api/upload -F "file=@path/to/your/file.pdf"');
}

testUploadEndpoint();
