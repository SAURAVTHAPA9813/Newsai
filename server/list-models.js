require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function listModels() {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    console.log('Fetching available Gemini models...\n');

    // List all available models
    const models = await genAI.listModels();

    console.log('Available models that support generateContent:\n');

    for await (const model of models) {
      if (model.supportedGenerationMethods.includes('generateContent')) {
        console.log('Model Name:', model.name);
        console.log('Display Name:', model.displayName);
        console.log('Description:', model.description);
        console.log('---');
      }
    }
  } catch (error) {
    console.error('Error listing models:', error.message);
  }
}

listModels();
