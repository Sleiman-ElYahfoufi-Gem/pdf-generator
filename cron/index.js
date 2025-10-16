import cron from 'node-cron';
import { CRON_SCHEDULES, CRON_SETTINGS } from './config/cron.config.js';
import { logCronStart, logCronComplete, logCronError } from './utils/cron-helpers.js';
import logger from '../utils/logger.js';

// Import cron jobs (will be created in next phases)
let dateFilterJob, statusFilterJob, combinedFilterJob;

/**
 * Initialize all cron jobs
 */
export const initializeCronJobs = async () => {
  try {
    logger.info('🔧 Initializing cron jobs...', {
      environment: process.env.NODE_ENV || 'development',
      enabledJobs: {
        dateFilter: CRON_SETTINGS.ENABLE_DATE_FILTER,
        statusFilter: CRON_SETTINGS.ENABLE_STATUS_FILTER,
        combinedFilter: CRON_SETTINGS.ENABLE_COMBINED_FILTER
      }
    });

    // Initialize Cron Job 1: Date Filter (T+90)
    if (CRON_SETTINGS.ENABLE_DATE_FILTER) {
      dateFilterJob = cron.schedule(
        CRON_SCHEDULES.DATE_FILTER,
        async () => {
          try {
            logCronStart('Date Filter (T+90)');
            // Will import and execute date filter cron job
            const { executeDateFilterCron } = await import('./jobs/date-filter.cron.js');
            await executeDateFilterCron();
            logCronComplete('Date Filter (T+90)');
          } catch (error) {
            logCronError('Date Filter (T+90)', error);
          }
        },
        {
          scheduled: false, // Don't start automatically
          timezone: 'UTC'
        }
      );

      logger.info('Date Filter cron job initialized', {
        schedule: CRON_SCHEDULES.DATE_FILTER,
        description: 'Daily at 2:00 AM UTC - T+90 date filter'
      });
    }

    // Initialize Cron Job 2: Status Filter Only
    if (CRON_SETTINGS.ENABLE_STATUS_FILTER) {
      statusFilterJob = cron.schedule(
        CRON_SCHEDULES.STATUS_FILTER,
        async () => {
          try {
            logCronStart('Status Filter Only');
            // Will import and execute status filter cron job
            const { executeStatusFilterCron } = await import('./jobs/status-filter.cron.js');
            await executeStatusFilterCron();
            logCronComplete('Status Filter Only');
          } catch (error) {
            logCronError('Status Filter Only', error);
          }
        },
        {
          scheduled: false,
          timezone: 'UTC'
        }
      );

      logger.info('Status Filter cron job initialized', {
        schedule: CRON_SCHEDULES.STATUS_FILTER,
        description: 'Every 6 hours - Status filter only'
      });
    }

    // Initialize Cron Job 3: Combined Filter
    if (CRON_SETTINGS.ENABLE_COMBINED_FILTER) {
      combinedFilterJob = cron.schedule(
        CRON_SCHEDULES.COMBINED_FILTER,
        async () => {
          try {
            logCronStart('Combined Filter (Status + T+90)');
            // Will import and execute combined filter cron job
            const { executeCombinedFilterCron } = await import('./jobs/combined-filter.cron.js');
            await executeCombinedFilterCron();
            logCronComplete('Combined Filter (Status + T+90)');
          } catch (error) {
            logCronError('Combined Filter (Status + T+90)', error);
          }
        },
        {
          scheduled: false,
          timezone: 'UTC'
        }
      );

      logger.info('Combined Filter cron job initialized', {
        schedule: CRON_SCHEDULES.COMBINED_FILTER,
        description: 'Daily at 3:00 AM UTC - Status + T+90 combined filter'
      });
    }

    logger.info('All cron jobs initialized successfully');
  } catch (error) {
    logger.error('Failed to initialize cron jobs', {
      error: error.message,
      stack: error.stack
    });
    throw error;
  }
};

/**
 * Start all cron jobs
 */
export const startCronJobs = async () => {
  try {
    logger.info('Starting cron jobs...');

    if (dateFilterJob && CRON_SETTINGS.ENABLE_DATE_FILTER) {
      dateFilterJob.start();
      logger.info('Date Filter cron job started');
    }

    if (statusFilterJob && CRON_SETTINGS.ENABLE_STATUS_FILTER) {
      statusFilterJob.start();
      logger.info('Status Filter cron job started');
    }

    if (combinedFilterJob && CRON_SETTINGS.ENABLE_COMBINED_FILTER) {
      combinedFilterJob.start();
      logger.info('Combined Filter cron job started');
    }

    logger.info('All cron jobs started successfully');
  } catch (error) {
    logger.error('Failed to start cron jobs', {
      error: error.message,
      stack: error.stack
    });
    throw error;
  }
};

/**
 * Stop all cron jobs
 */
export const stopCronJobs = async () => {
  try {
    logger.info('Stopping cron jobs...');

    if (dateFilterJob) {
      dateFilterJob.stop();
      logger.info('Date Filter cron job stopped');
    }

    if (statusFilterJob) {
      statusFilterJob.stop();
      logger.info('Status Filter cron job stopped');
    }

    if (combinedFilterJob) {
      combinedFilterJob.stop();
      logger.info('Combined Filter cron job stopped');
    }

    logger.info('All cron jobs stopped successfully');
  } catch (error) {
    logger.error('Failed to stop cron jobs', {
      error: error.message,
      stack: error.stack
    });
    throw error;
  }
};

/**
 * Get status of all cron jobs
 */
export const getCronJobStatus = () => {
  return {
    dateFilter: {
      scheduled: dateFilterJob?.getDates().length > 0,
      running: dateFilterJob?.running || false,
      schedule: CRON_SCHEDULES.DATE_FILTER,
      enabled: CRON_SETTINGS.ENABLE_DATE_FILTER
    },
    statusFilter: {
      scheduled: statusFilterJob?.getDates().length > 0,
      running: statusFilterJob?.running || false,
      schedule: CRON_SCHEDULES.STATUS_FILTER,
      enabled: CRON_SETTINGS.ENABLE_STATUS_FILTER
    },
    combinedFilter: {
      scheduled: combinedFilterJob?.getDates().length > 0,
      running: combinedFilterJob?.running || false,
      schedule: CRON_SCHEDULES.COMBINED_FILTER,
      enabled: CRON_SETTINGS.ENABLE_COMBINED_FILTER
    }
  };
};

/**
 * Graceful shutdown handler
 */
export const gracefulShutdown = async () => {
  try {
    logger.info('Gracefully shutting down cron jobs...');
    await stopCronJobs();
    logger.info('Graceful shutdown completed');
  } catch (error) {
    logger.error('Error during graceful shutdown', {
      error: error.message,
      stack: error.stack
    });
  }
};