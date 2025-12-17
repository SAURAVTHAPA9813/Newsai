require('dotenv').config();
const { GoogleGenAI } = require('@google/genai');

async function testGoogleGenAI() {
  try {
    console.log('Testing @google/genai SDK...');
    console.log('API Key exists:', !!process.env.GEMINI_API_KEY);

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: 'Say hello in one short sentence.'
    });

    console.log('\n✅ SUCCESS! @google/genai is working!');
    console.log('Response:', response.text);

  } catch (error) {
    console.error('\n❌ FAILED! @google/genai error:');
    console.error('Error message:', error.message);
    console.error('Error details:', error);
  }
}

testGoogleGenAI();
