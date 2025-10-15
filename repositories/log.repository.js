import { query } from '../database/db.js';

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

  const result = await query(
    `INSERT INTO logs (
      request_id,
      method,
      url,
      request_body,
      query_params,
      url_params,
      request_headers,
      user_id,
      ip_address,
      user_agent,
      request_timestamp
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    RETURNING id`,
    [
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
    ]
  );

  return result.rows[0];
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

  const result = await query(
    `UPDATE logs 
    SET 
      response_status_code = $1,
      response_body = $2,
      response_time_ms = $3,
      response_timestamp = $4,
      error_message = $5,
      error_stack = $6
    WHERE request_id = $7
    RETURNING id`,
    [
      responseStatusCode,
      responseBody,
      responseTimeMs,
      responseTimestamp,
      errorMessage,
      errorStack,
      requestId
    ]
  );

  return result.rows[0];
};

// Get logs by request ID
export const getLogByRequestId = async (requestId) => {
  const result = await query(
    'SELECT * FROM logs WHERE request_id = $1',
    [requestId]
  );
  return result.rows[0] || null;
};

// Get recent logs
export const getRecentLogs = async (limit = 100) => {
  const result = await query(
    'SELECT * FROM logs ORDER BY request_timestamp DESC LIMIT $1',
    [limit]
  );
  return result.rows;
};

// Get logs by user
export const getLogsByUserId = async (userId, limit = 50) => {
  const result = await query(
    'SELECT * FROM logs WHERE user_id = $1 ORDER BY request_timestamp DESC LIMIT $2',
    [userId, limit]
  );
  return result.rows;
};