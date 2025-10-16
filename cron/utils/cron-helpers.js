import logger from '../../utils/logger.js';

/**
 * Calculate T+90 days from current date
 * @returns {Date} - Date 90 days from now
 */
export const calculateTPlus90Date = () => {
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + 90);
  return targetDate;
};

/**
 * Format date for database queries (YYYY-MM-DD)
 * @param {Date} date - Date to format
 * @returns {string} - Formatted date string
 */
export const formatDateForQuery = (date) => {
  return date.toISOString().split('T')[0];
};

/**
 * Sleep/delay function for retry logic
 * @param {number} ms - Milliseconds to wait
 * @returns {Promise} - Promise that resolves after specified time
 */
export const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Log cron job start
 * @param {string} jobName - Name of the cron job
 * @param {Object} metadata - Additional metadata to log
 */
export const logCronStart = (jobName, metadata = {}) => {
  logger.info(`Starting cron job: ${jobName}`, {
    jobName,
    timestamp: new Date().toISOString(),
    ...metadata
  });
};

/**
 * Log cron job completion
 * @param {string} jobName - Name of the cron job
 * @param {Object} results - Results to log
 */
export const logCronComplete = (jobName, results = {}) => {
  logger.info(`Completed cron job: ${jobName}`, {
    jobName,
    timestamp: new Date().toISOString(),
    ...results
  });
};

/**
 * Log cron job error
 * @param {string} jobName - Name of the cron job
 * @param {Error} error - Error that occurred
 * @param {Object} metadata - Additional metadata to log
 */
export const logCronError = (jobName, error, metadata = {}) => {
  logger.error(`Cron job failed: ${jobName}`, {
    jobName,
    timestamp: new Date().toISOString(),
    error: error.message,
    stack: error.stack,
    ...metadata
  });
};

