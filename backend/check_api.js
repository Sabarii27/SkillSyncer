require('dotenv').config({ path: './config/config.env' });

async function checkGeminiAPI() {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    console.log('❌ No API key found');
    return;
  }

  // Try to make a direct API call to check what models are available
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`);
    
    if (!response.ok) {
      console.log('❌ API call failed:', response.status, response.statusText);
      const errorText = await response.text();
      console.log('Error details:', errorText);
      return;
    }
    
    const data = await response.json();
    console.log('✅ Available models for your API key:');
    
    if (data.models && data.models.length > 0) {
      data.models.forEach(model => {
        console.log(`  - ${model.name} (${model.displayName || 'No display name'})`);
        if (model.supportedGenerationMethods) {
          console.log(`    Methods: ${model.supportedGenerationMethods.join(', ')}`);
        }
      });
    } else {
      console.log('❌ No models available for your API key');
    }
    
  } catch (error) {
    console.error('❌ Error checking API:', error.message);
  }
}

checkGeminiAPI();