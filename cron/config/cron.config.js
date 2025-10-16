/**
 * Cron job configuration
 * Central place to manage all cron job schedules and settings
 */

// Cron schedules (using cron syntax)
export const CRON_SCHEDULES = {
  // Cron Job 1: Date Filter (T+90)
  DATE_FILTER: '49 * * * *', // At minute 46 (1 minute from now)

  // Cron Job 2: Status Filter Only
  STATUS_FILTER: '50 * * * *', // At minute 47 (2 minutes from now)

  // Cron Job 3: Combined Filter (Status + Date)
  COMBINED_FILTER: '51 * * * *' // At minute 48 (3 minutes from now)
};

// Cron job settings
export const CRON_SETTINGS = {
  // Enable/disable individual cron jobs
  ENABLE_DATE_FILTER: process.env.ENABLE_DATE_FILTER_CRON !== 'false',
  ENABLE_STATUS_FILTER: process.env.ENABLE_STATUS_FILTER_CRON !== 'false',
  ENABLE_COMBINED_FILTER: process.env.ENABLE_COMBINED_FILTER_CRON !== 'false',

  // T+90 days offset
  DAYS_OFFSET: 90,

  // API settings
  PREMIUM_API_TIMEOUT: 10000, // 10 seconds
  MAX_RETRIES: 3,

  // Logging
  ENABLE_CRON_LOGGING: process.env.ENABLE_CRON_LOGGING !== 'false'
};

// Policy status settings
export const POLICY_STATUS = {
  RATING_PENDING: 'Rating Pending'
};

