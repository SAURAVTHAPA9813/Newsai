require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

console.log('Testing AI Summary Service...\n');

// Check environment variables
console.log('1. Environment Variables:');
console.log('   GEMINI_API_KEY exists:', !!process.env.GEMINI_API_KEY);
console.log('   Key starts with:', process.env.GEMINI_API_KEY?.substring(0, 15) + '...\n');

// Test Gemini API connection
async function testGeminiAPI() {
  try {
    console.log('2. Testing Gemini API connection...');

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = 'Say "Hello, AI Summary Service is working!" in one sentence.';
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log('   ✅ Gemini API Response:', text);
    console.log('   Status: SUCCESS\n');

    return true;
  } catch (error) {
    console.error('   ❌ Gemini API Error:', error.message);
    console.log('   Status: FAILED\n');
    return false;
  }
}

// Test AI Summary generation
async function testAISummary() {
  try {
    console.log('3. Testing AI Summary Generation...');

    const aiSummaryService = require('./services/aiSummaryService');

    const testArticle = {
      title: 'Tech Giants Announce New AI Partnership',
      description: 'Major technology companies have announced a groundbreaking partnership to develop next-generation artificial intelligence systems.',
      content: 'In a historic move, leading tech companies are joining forces to advance AI technology...'
    };

    const preferences = {
      depth: 'standard',
      summaryStyle: 'brief',
      tone: 'neutral'
    };

    console.log('   Article:', testArticle.title);
    console.log('   Preferences:', preferences);

    const enhancedArticle = await aiSummaryService.generatePersonalizedSummary(testArticle, preferences);

    console.log('   ✅ AI Summary:', enhancedArticle.aiSummary);
    console.log('   Enhanced By:', enhancedArticle.enhancedBy);
    console.log('   Status: SUCCESS\n');

    return true;
  } catch (error) {
    console.error('   ❌ AI Summary Error:', error.message);
    console.error('   Stack:', error.stack);
    console.log('   Status: FAILED\n');
    return false;
  }
}

// Run all tests
async function runTests() {
  console.log('========================================');
  console.log('AI Summary Service Test Suite');
  console.log('========================================\n');

  const apiTest = await testGeminiAPI();
  const summaryTest = await testAISummary();

  console.log('========================================');
  console.log('Test Results:');
  console.log('========================================');
  console.log('Gemini API:', apiTest ? '✅ PASS' : '❌ FAIL');
  console.log('AI Summary:', summaryTest ? '✅ PASS' : '❌ FAIL');
  console.log('========================================\n');

  if (apiTest && summaryTest) {
    console.log('🎉 All tests passed! AI Summary service is ready.\n');
  } else {
    console.log('⚠️  Some tests failed. Check the errors above.\n');
  }
}

runTests();
