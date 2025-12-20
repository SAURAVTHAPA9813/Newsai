const axios = require("axios");
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config({ path: "./server/.env" });

async function testAPIKeys() {
  console.log("🔍 Testing API Keys...\n");

  // Test NewsAPI
  try {
    console.log("Testing NewsAPI...");
    const newsResponse = await axios.get(
      `https://newsapi.org/v2/top-headlines?country=us&apiKey=${process.env.NEWS_API_KEY}`
    );
    console.log(
      "✅ NewsAPI: OK -",
      newsResponse.data.articles?.length || 0,
      "articles fetched"
    );
  } catch (error) {
    console.log(
      "❌ NewsAPI: FAILED -",
      error.response?.data?.message || error.message
    );
  }

  // Test Gemini API
  try {
    console.log("Testing Gemini API...");
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent('Say "Hello" in one word.');
    const response = await result.response;
    const text = response.text();
    if (text.toLowerCase().includes("hello")) {
      console.log("✅ Gemini API: OK - Response received");
    } else {
      console.log("⚠️ Gemini API: Response received but unexpected:", text);
    }
  } catch (error) {
    console.log("❌ Gemini API: FAILED -", error.message);
  }

  // Test Guardian API
  try {
    console.log("Testing Guardian API...");
    const guardianResponse = await axios.get(
      `https://content.guardianapis.com/search?api-key=${process.env.GUARDIAN_API_KEY}&page-size=1`
    );
    console.log(
      "✅ Guardian API: OK -",
      guardianResponse.data.response?.results?.length || 0,
      "articles fetched"
    );
  } catch (error) {
    console.log(
      "❌ Guardian API: FAILED -",
      error.response?.data?.message || error.message
    );
  }

  // Test GNews API
  try {
    console.log("Testing GNews API...");
    const gnewsResponse = await axios.get(
      `https://gnews.io/api/v4/top-headlines?token=${process.env.GNEWS_API_KEY}&lang=en&max=1`
    );
    console.log(
      "✅ GNews API: OK -",
      gnewsResponse.data.articles?.length || 0,
      "articles fetched"
    );
  } catch (error) {
    console.log(
      "❌ GNews API: FAILED -",
      error.response?.data?.message || error.message
    );
  }

  // Test NewsData API
  try {
    console.log("Testing NewsData API...");
    const newsdataResponse = await axios.get(
      `https://newsdata.io/api/1/news?apikey=${process.env.NEWSDATA_API_KEY}&language=en&size=1`
    );
    console.log(
      "✅ NewsData API: OK -",
      newsdataResponse.data.results?.length || 0,
      "articles fetched"
    );
  } catch (error) {
    console.log(
      "❌ NewsData API: FAILED -",
      error.response?.data?.message || error.message
    );
  }

  // Test Currents API
  try {
    console.log("Testing Currents API...");
    const currentsResponse = await axios.get(
      `https://api.currentsapi.services/v1/latest-news?apiKey=${process.env.CURRENTS_API_KEY}&language=en&limit=1`
    );
    console.log(
      "✅ Currents API: OK -",
      currentsResponse.data.news?.length || 0,
      "articles fetched"
    );
  } catch (error) {
    console.log(
      "❌ Currents API: FAILED -",
      error.response?.data?.message || error.message
    );
  }

  console.log("\n🎯 API Key Testing Complete!");
}

testAPIKeys().catch(console.error);
