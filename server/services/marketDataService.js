const axios = require('axios');

const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY;
const FINNHUB_BASE_URL = 'https://finnhub.io/api/v1';

// Cache market data for 5 minutes to avoid rate limits
let cachedData = null;
let cacheTimestamp = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Get real-time market data from Finnhub API
 * @returns {Promise<Object>} - Market data for S&P 500, Bitcoin, and VIX
 */
async function getRealTimeMarketData() {
  // Return cache if valid
  if (cachedData && cacheTimestamp && Date.now() - cacheTimestamp < CACHE_DURATION) {
    console.log('✅ Returning cached market data');
    return cachedData;
  }

  // Check if API key is configured
  if (!FINNHUB_API_KEY) {
    console.warn('⚠️ FINNHUB_API_KEY not configured, using fallback data');
    return getFallbackMarketData();
  }

  try {
    console.log('📊 Fetching real-time market data from Finnhub...');

    // Fetch all three market indicators in parallel
    const [sp500Response, btcResponse, vixResponse] = await Promise.all([
      // S&P 500 (using SPY ETF as proxy)
      axios.get(`${FINNHUB_BASE_URL}/quote`, {
        params: { symbol: 'SPY', token: FINNHUB_API_KEY }
      }).catch(err => {
        console.error('Error fetching SPY:', err.message);
        return null;
      }),

      // Bitcoin (using Binance BTC/USDT)
      axios.get(`${FINNHUB_BASE_URL}/quote`, {
        params: { symbol: 'BINANCE:BTCUSDT', token: FINNHUB_API_KEY }
      }).catch(err => {
        console.error('Error fetching BTC:', err.message);
        return null;
      }),

      // VIX (Volatility Index)
      axios.get(`${FINNHUB_BASE_URL}/quote`, {
        params: { symbol: 'VIX', token: FINNHUB_API_KEY }
      }).catch(err => {
        console.error('Error fetching VIX:', err.message);
        return null;
      })
    ]);

    // Check if we got valid responses
    if (!sp500Response || !btcResponse || !vixResponse) {
      console.warn('⚠️ Failed to fetch some market data, using fallback');
      return getFallbackMarketData();
    }

    const data = {
      sp500: {
        value: parseFloat((sp500Response.data.c * 10).toFixed(2)), // SPY * 10 ≈ S&P 500
        change: parseFloat(sp500Response.data.dp?.toFixed(2) || 0) // Percent change
      },
      btc: {
        value: parseFloat(btcResponse.data.c?.toFixed(2) || 0),
        change: parseFloat(btcResponse.data.dp?.toFixed(2) || 0)
      },
      vix: {
        value: parseFloat(vixResponse.data.c?.toFixed(2) || 0),
        change: parseFloat(vixResponse.data.dp?.toFixed(2) || 0)
      },
      isMarketOpen: isMarketHours(),
      lastUpdated: new Date().toISOString()
    };

    // Update cache
    cachedData = data;
    cacheTimestamp = Date.now();

    console.log('✅ Market data fetched successfully');
    return data;
  } catch (error) {
    console.error('❌ Market data fetch error:', error.message);
    // Fallback to simulated data
    return getFallbackMarketData();
  }
}

/**
 * Get fallback market data when API is unavailable
 * @returns {Object} - Simulated market data
 */
function getFallbackMarketData() {
  // Generate realistic-looking values with some randomness
  const baseValues = {
    sp500: 4520,
    btc: 43000,
    vix: 15.5
  };

  return {
    sp500: {
      value: parseFloat((baseValues.sp500 + Math.random() * 50 - 25).toFixed(2)),
      change: parseFloat((Math.random() * 2 - 1).toFixed(2))
    },
    btc: {
      value: parseFloat((baseValues.btc + Math.random() * 1000 - 500).toFixed(2)),
      change: parseFloat((Math.random() * 4 - 2).toFixed(2))
    },
    vix: {
      value: parseFloat((baseValues.vix + Math.random() * 2 - 1).toFixed(2)),
      change: parseFloat((Math.random() * 1 - 0.5).toFixed(2))
    },
    isMarketOpen: isMarketHours(),
    lastUpdated: new Date().toISOString(),
    isFallback: true
  };
}

/**
 * Check if current time is within market hours
 * Market hours: Monday-Friday, 9:30 AM - 4:00 PM ET (14:30 - 21:00 UTC)
 * @returns {boolean} - True if market is currently open
 */
function isMarketHours() {
  const now = new Date();
  const day = now.getUTCDay(); // 0 = Sunday, 6 = Saturday
  const hour = now.getUTCHours();
  const minute = now.getUTCMinutes();

  // Check if weekday (Monday-Friday)
  if (day === 0 || day === 6) {
    return false;
  }

  // Convert to decimal hours for easier comparison
  const currentTime = hour + minute / 60;

  // Market hours in UTC: 14:30 (9:30 AM ET) to 21:00 (4:00 PM ET)
  const marketOpen = 14.5; // 14:30 UTC
  const marketClose = 21.0; // 21:00 UTC

  return currentTime >= marketOpen && currentTime < marketClose;
}

/**
 * Clear the cache (useful for testing or manual refresh)
 */
function clearCache() {
  cachedData = null;
  cacheTimestamp = null;
  console.log('🗑️ Market data cache cleared');
}

module.exports = {
  getRealTimeMarketData,
  getFallbackMarketData,
  isMarketHours,
  clearCache
};
