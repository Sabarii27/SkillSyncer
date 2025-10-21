require('dotenv').config({ path: './config/config.env' });
const { GoogleGenerativeAI } = require('@google/generative-ai');

console.log('Environment check:');
console.log('GEMINI_API_KEY exists:', !!process.env.GEMINI_API_KEY);
console.log('GEMINI_API_KEY value:', process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.substring(0, 10) + '...' : 'undefined');

async function testGemini() {
  try {
    if (!process.env.GEMINI_API_KEY) {
      console.log('❌ No Gemini API key found in environment');
      return;
    }

    console.log('🔑 Initializing Google Generative AI...');
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    console.log('📋 Listing available models...');
    
    // Try to list models first
    try {
      const models = await genAI.listModels();
      console.log('✅ Available models:');
      models.forEach(model => {
        console.log(`  - ${model.name} (${model.displayName})`);
      });
    } catch (listError) {
      console.log('❌ Could not list models:', listError.message);
    }

    // Try different model names
    const modelsToTry = [
      'gemini-1.5-flash',
      'gemini-1.5-pro',
      'gemini-pro',
      'models/gemini-1.5-flash',
      'models/gemini-pro'
    ];

    for (const modelName of modelsToTry) {
      try {
        console.log(`\n🧪 Testing model: ${modelName}`);
        const model = genAI.getGenerativeModel({ model: modelName });
        
        const result = await model.generateContent('Hello, how are you?');
        const response = await result.response;
        const text = response.text();
        
        console.log(`✅ ${modelName} works! Response:`, text.substring(0, 100) + '...');
        break; // If one works, we're good
      } catch (error) {
        console.log(`❌ ${modelName} failed:`, error.message);
      }
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testGemini();