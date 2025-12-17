const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function testGemini() {
  try {
    console.log('Testing NEW Gemini SDK...');
    console.log('API Key exists:', !!process.env.GEMINI_API_KEY);

    // Test gemini-2.5-flash
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: 'Say hello in one short sentence.'
    });

    console.log('\n✅ SUCCESS! New Gemini SDK is working!');
    console.log('Response:', response.text);

  } catch (error) {
    console.error('\n❌ FAILED! Gemini API error:');
    console.error('Error message:', error.message);
    console.error('Full error:', error);
  }
}

testGemini();
