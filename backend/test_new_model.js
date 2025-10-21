require('dotenv').config({ path: './config/config.env' });
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testNewModel() {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    
    console.log('🧪 Testing gemini-2.5-flash model...');
    
    const result = await model.generateContent('Hello! Can you help me with my career?');
    const response = await result.response;
    const text = response.text();
    
    console.log('✅ SUCCESS! AI Response:');
    console.log(text);
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testNewModel();