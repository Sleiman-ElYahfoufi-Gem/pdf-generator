import logger from '../utils/logger.js';
import * as logRepository from '../repositories/log.repository.js';
import { SENSITIVE_FIELDS, MAX_RESPONSE_BODY_SIZE } from '../utils/constants.js';

// Sanitize sensitive data from objects
const sanitizeSensitiveData = (data) => {
  if (!data || typeof data !== 'object') {
    return data;
  }

  // Create a deep copy
  const sanitized = JSON.parse(JSON.stringify(data));

  // Recursively remove sensitive fields
  const redact = (obj) => {
    if (!obj || typeof obj !== 'object') return;

    Object.keys(obj).forEach(key => {
      // Check if field is sensitive
      if (SENSITIVE_FIELDS.some(field => 
        key.toLowerCase().includes(field.toLowerCase())
      )) {
        obj[key] = '***REDACTED***';
      } else if (typeof obj[key] === 'object') {
        redact(obj[key]); // Recursively check nested objects
      }
    });
  };

  redact(sanitized);
  return sanitized;
};

// Check if response is too large to log
const sanitizeResponseBody = (body) => {
  if (!body) return null;

  // If it's a Buffer (file/PDF)
  if (Buffer.isBuffer(body)) {
    return {
      type: 'binary',
      size: body.length,
      message: 'Binary data not logged'
    };
  }

  // If it's a string (HTML, text, etc.) - wrap it
  if (typeof body === 'string') {
    // If it's HTML or very long text
    if (body.startsWith('<') || body.length > MAX_RESPONSE_BODY_SIZE) {
      return {
        type: 'html',
        size: body.length,
        preview: body.substring(0, 100) + '...',
        message: 'HTML/Text response not fully logged'
      };
    }
    // Short text - wrap it in object for JSONB
    return {
      type: 'text',
      content: body
    };
  }

  // If response is too large
  const bodyString = JSON.stringify(body);
  if (bodyString.length > MAX_RESPONSE_BODY_SIZE) {
    return {
      message: 'Response too large to log',
      size: bodyString.length
    };
  }

  return sanitizeSensitiveData(body);
};

// Log request - Two separate actions: Winston (console) + Database
export const logRequest = (logData) => {
  try {
    // Sanitize data
    const sanitizedData = {
      ...logData,
      requestBody: sanitizeSensitiveData(logData.requestBody),
      queryParams: sanitizeSensitiveData(logData.queryParams),
      requestHeaders: sanitizeSensitiveData(logData.requestHeaders)
    };

    // 1. Log to console via Winston
    logger.info('Request received', {
      requestId: logData.requestId,
      method: logData.method,
      url: logData.url,
      userId: logData.userId,
      body: sanitizedData.requestBody  
    });

    // 2. Log to database (async, fire and forget)
    logRepository.insertRequestLog(sanitizedData).catch(err => {
      logger.error('Failed to insert request log to database', { error: err.message });
    });
  } catch (error) {
    logger.error('Error in logRequest', { error: error.message });
  }
};

// Log response - Two separate actions: Winston (console) + Database
export const logResponse = (logData) => {
  try {
    // Sanitize data
    const sanitizedData = {
      ...logData,
      responseBody: sanitizeResponseBody(logData.responseBody)
    };

    // 1. Log to console via Winston
    const logLevel = logData.responseStatusCode >= 400 ? 'error' : 'info';
    logger[logLevel]('Response sent', {
      requestId: logData.requestId,
      statusCode: logData.responseStatusCode,
      responseTime: `${logData.responseTimeMs}ms`
    });

    // 2. Log to database (async, fire and forget)
    logRepository.updateResponseLog(sanitizedData).catch(err => {
  
      
      logger.error('Failed to update response log in database', { 
        error: err.message,
        stack: err.stack,
        requestId: logData.requestId,
        data: sanitizedData
      });
    });
  } catch (error) {
    logger.error('Error in logResponse', { error: error.message });
  }
};