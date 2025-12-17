const mongoose = require('mongoose');
const ReadingSession = require('../models/ReadingSession');
const { UserStats } = require('../models/UserStats');
require('dotenv').config({ path: '../.env' });

/**
 * Cleanup script to remove invalid/fake session data
 * This will:
 * - Delete all existing ReadingSession documents
 * - Reset all UserStats reading metrics to 0
 * - Clear recentActivity arrays related to reading
 */
async function cleanupInvalidSessions() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/newsai', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ Connected to MongoDB');

    // Count existing sessions before deletion
    const sessionCount = await ReadingSession.countDocuments();
    console.log(`📊 Found ${sessionCount} existing reading sessions`);

    // Delete all reading sessions
    const deleteResult = await ReadingSession.deleteMany({});
    console.log(`🗑️  Deleted ${deleteResult.deletedCount} reading sessions`);

    // Count UserStats before reset
    const userStatsCount = await UserStats.countDocuments();
    console.log(`👥 Found ${userStatsCount} user stats documents`);

    // Reset all user reading stats
    const updateResult = await UserStats.updateMany(
      {},
      {
        $set: {
          'readingStats.articlesRead': 0,
          'readingStats.timeSpentReading': 0,
          'readingStats.articlesSaved': 0,
          'recentActivity': []
        }
      }
    );

    console.log(`🔄 Updated ${updateResult.modifiedCount} user stats documents`);
    console.log('✨ Cleanup complete!');
    console.log('');
    console.log('Next steps:');
    console.log('1. Restart your backend server');
    console.log('2. Refresh the Neural Analytics page');
    console.log('3. Read some articles to generate real data');

  } catch (error) {
    console.error('❌ Cleanup error:', error);
    console.error('Error stack:', error.stack);
    process.exit(1);
  } finally {
    // Close MongoDB connection
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    process.exit(0);
  }
}

// Run the cleanup
cleanupInvalidSessions();
