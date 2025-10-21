const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config({ path: './config/config.env' });

async function testGeminiAPI() {
  try {
    console.log('Testing Gemini API...');
    console.log('API Key exists:', !!process.env.GEMINI_API_KEY);
    console.log('API Key (first 10 chars):', process.env.GEMINI_API_KEY?.substring(0, 10));
    
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
      console.log('❌ No valid Gemini API key found');
      return;
    }
    
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // Try different model names
    const modelsToTry = [
      'gemini-pro',
      'gemini-1.5-pro',
      'gemini-1.5-flash',
      'text-bison-001',
      'gemini-1.0-pro-latest'
    ];
    
    for (const modelName of modelsToTry) {
      try {
        console.log(`\nTrying model: ${modelName}`);
        const model = genAI.getGenerativeModel({ model: modelName });
        
        const prompt = 'Hello, can you help me with career guidance?';
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        console.log(`✅ ${modelName} works!`);
        console.log('Response:', text.substring(0, 100) + '...');
        return; // Stop on first success
      } catch (err) {
        console.log(`❌ ${modelName} failed:`, err.message.split('\n')[0]);
      }
    }
    
    console.log('\n❌ All models failed. Your API key might need different permissions.');
  } catch (error) {
    console.log('❌ General API test failed:');
    console.error(error.message);
  }
}

testGeminiAPI();