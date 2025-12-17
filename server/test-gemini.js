require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function testGemini() {
  try {
    console.log('Testing Gemini API...');
    console.log('API Key exists:', !!process.env.GEMINI_API_KEY);
    console.log('API Key starts with:', process.env.GEMINI_API_KEY?.substring(0, 10) + '...');

    // Test gemini-1.5-flash
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const result = await model.generateContent('Say hello in one short sentence.');
    const response = await result.response;
    const text = response.text();

    console.log('\n✅ SUCCESS! Gemini API is working!');
    console.log('Response:', text);

  } catch (error) {
    console.error('\n❌ FAILED! Gemini API error:');
    console.error('Error message:', error.message);
    console.error('Error details:', error);
  }
}

testGemini();
