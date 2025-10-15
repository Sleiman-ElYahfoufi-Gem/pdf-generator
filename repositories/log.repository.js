import { Log } from '../models/index.js';

// Insert request log
export const insertRequestLog = async (logData) => {
  const {
    requestId,
    method,
    url,
    requestBody,
    queryParams,
    urlParams,
    requestHeaders,
    userId,
    ipAddress,
    userAgent,
    requestTimestamp
  } = logData;

  const log = await Log.create({
    requestId,
    method,
    url,
    requestBody,
    queryParams,
    urlParams,
    requestHeaders,
    userId,
    ipAddress,
    userAgent,
    requestTimestamp
  });

  return log;
};

// Update log with response data
export const updateResponseLog = async (logData) => {
  const {
    requestId,
    responseStatusCode,
    responseBody,
    responseTimeMs,
    responseTimestamp,
    errorMessage,
    errorStack
  } = logData;

  await Log.update(
    {
      responseStatusCode,
      responseBody,
      responseTimeMs,
      responseTimestamp,
      errorMessage,
      errorStack
    },
    {
      where: { requestId },
      returning: true
    }
  );

  // Find and return the updated log
  const updatedLog = await Log.findOne({ where: { requestId } });
  return updatedLog;
};

// Get logs by request ID
export const getLogByRequestId = async (requestId) => {
  const log = await Log.findOne({ where: { requestId } });
  return log;
};

// Get recent logs
export const getRecentLogs = async (limit = 100) => {
  const logs = await Log.findAll({
    order: [['requestTimestamp', 'DESC']],
    limit
  });
  return logs;
};

// Get logs by user
export const getLogsByUserId = async (userId, limit = 50) => {
  const logs = await Log.findAll({
    where: { userId },
    order: [['requestTimestamp', 'DESC']],
    limit
  });
  return logs;
};