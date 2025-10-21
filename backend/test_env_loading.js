// Test environment loading exactly like the server does
const dotenv = require('dotenv');

console.log('🔍 Testing environment variable loading...\n');

// Load env vars exactly like server.js does
dotenv.config({ path: './config/config.env' });
// Also try .env file as fallback
if (!process.env.PORT) {
  console.log('PORT not found in config.env, loading from .env...');
  dotenv.config({ path: './.env' });
} else {
  console.log('✅ PORT found in config.env, using config.env');
}

console.log('Environment variables:');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('PORT:', process.env.PORT);
console.log('GEMINI_API_KEY exists:', !!process.env.GEMINI_API_KEY);
console.log('GEMINI_API_KEY value:', process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.substring(0, 10) + '...' : 'undefined');

// Test the AI initialization exactly like ai.js does
const { GoogleGenerativeAI } = require('@google/generative-ai');

let genAI = null;
if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here') {
  console.log('✅ Gemini API key detected, initializing GoogleGenerativeAI...');
  genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  console.log('✅ GoogleGenerativeAI initialized successfully');
} else {
  console.log('❌ Gemini API key not detected or is placeholder');
  console.log('   API Key:', process.env.GEMINI_API_KEY);
  console.log('   Is placeholder?', process.env.GEMINI_API_KEY === 'your_gemini_api_key_here');
}

console.log('\nTest complete!');