import { v4 as uuidv4 } from 'uuid';
import * as loggerService from '../services/logger.service.js';

// Generate unique request ID
const generateRequestId = () => {
  return `req_${Date.now()}_${uuidv4().split('-')[0]}`;
};

// Centralized logging middleware
export const loggerMiddleware = (req, res, next) => {
  // Generate unique request ID
  const requestId = generateRequestId();
  const startTime = Date.now();
  console.log('MIDDLEWARE HIT:', req.method, req.url);
  console.log('Request ID:', requestId);

  // Attach request ID to request object (useful for debugging)
  req.requestId = requestId;

  // ========== CAPTURE REQUEST DATA ==========
  const requestLog = {
    requestId,
    method: req.method,
    url: req.originalUrl || req.url,
    requestBody: req.body || {},
    queryParams: req.query || {},
    urlParams: req.params || {},
    requestHeaders: {
      'content-type': req.get('content-type'),
      'user-agent': req.get('user-agent'),
      'authorization': req.get('authorization') ? 'Bearer ***' : undefined
    },
    userId: req.user?.id || null, // If authenticated
    ipAddress: req.ip || req.connection.remoteAddress,
    userAgent: req.get('user-agent'),
    requestTimestamp: new Date()
  };

  // Log request (goes to PostgreSQL via Winston)
  loggerService.logRequest(requestLog);

  // ========== INTERCEPT RESPONSE ==========

  // Save original response methods
  const originalJson = res.json.bind(res);
  const originalSend = res.send.bind(res);

  // Override res.json to capture JSON responses
  res.json = function(data) {
    res.responseBody = data;
    return originalJson(data);
  };

  // Override res.send to capture other responses
  res.send = function(data) {
    res.responseBody = data;
    return originalSend(data);
  };

  // ========== LOG RESPONSE WHEN FINISHED ==========
  res.on('finish', () => {
    const responseTime = Date.now() - startTime;

    const responseLog = {
      requestId,
      responseStatusCode: res.statusCode,
      responseBody: res.responseBody || null,
      responseTimeMs: responseTime,
      responseTimestamp: new Date(),
      errorMessage: res.errorMessage || null,
      errorStack: res.errorStack || null
    };

    // Log response (goes to PostgreSQL via Winston)
    loggerService.logResponse(responseLog);
  });

  next();
};