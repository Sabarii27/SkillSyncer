const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config({ path: './config/config.env' });

async function listModels() {
  try {
    console.log('Listing available Gemini models...');
    
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
      console.log('❌ No valid Gemini API key found');
      return;
    }
    
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // Try to list models
    const models = await genAI.listModels();
    console.log('✅ Available models:');
    for (const model of models) {
      console.log(`- ${model.name} (${model.displayName})`);
    }
  } catch (error) {
    console.log('❌ Failed to list models:');
    console.error(error.message);
    
    // Let's try a simple approach - just use the original model name
    console.log('\nTrying with original gemini-pro model...');
    try {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
      
      const prompt = 'Hello, say hi back';
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      console.log('✅ gemini-pro works!');
      console.log('Response:', text);
    } catch (err) {
      console.log('❌ gemini-pro also failed:', err.message);
    }
  }
}

listModels();