// index.mjs
import 'dotenv/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error('Missing GEMINI_API_KEY in .env');
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

async function main() {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = 'Explain what News AI could do as a personal news assistant in 3 bullet points.';

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    console.log('\nGemini response:\n');
    console.log(text);
  } catch (err) {
    console.error('Error calling Gemini:', err.message || err);
  }
}

main();
