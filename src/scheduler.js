import { schedule } from 'node-cron';
import { generateSnapshot } from './generate-calendar-snapshot';

console.log('📅 Life Calendar Snapshot Scheduler Started');
console.log('⏰ Snapshot will be generated daily at midnight (00:00)');
console.log('---------------------------------------------------');

// Schedule task to run every day at midnight (00:00)
schedule('0 0 * * *', async () => {
  const now = new Date();
  console.log(`\n🕐 [${now.toISOString()}] Running scheduled snapshot generation...`);
  
  try {
    await generateSnapshot();
    console.log('✅ Scheduled snapshot completed successfully!');
  } catch (error) {
    console.error('❌ Error in scheduled snapshot:', error);
  }
}, {
  scheduled: true,
  timezone: "America/New_York" // Change this to your timezone
});

// Optional: Generate one immediately on startup for testing
console.log('\n🚀 Generating initial snapshot...');
generateSnapshot()
  .then(() => {
    console.log('✅ Initial snapshot completed!');
    console.log('\n⏳ Waiting for next scheduled run at midnight...');
  })
  .catch(error => {
    console.error('❌ Error generating initial snapshot:', error);
  });

// Keep the process running
// eslint-disable-next-line no-undef
process.on('SIGINT', () => {
  console.log('\n\n👋 Scheduler stopped. Goodbye!');
  // eslint-disable-next-line no-undef
  process.exit(0);
});

console.log('\nℹ️  Press Ctrl+C to stop the scheduler');