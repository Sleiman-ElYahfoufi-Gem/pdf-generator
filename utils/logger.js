import winston from 'winston';

// Define log format
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

// Create Winston logger (Console only)
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: logFormat,
  defaultMeta: { service: 'pdf-generation-api' },
  transports: [
    // Console transport only (for development/monitoring)
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(({ level, message, timestamp, requestId, method, url, statusCode, responseTime, userId, body, ...meta }) => {
          const requestIdStr = requestId ? `[${requestId}]` : '';
          
          // Build info string with relevant details
          let info = '';
          if (method && url) {
            info += ` ${method} ${url}`;
          }
          if (userId) {
            info += ` | User: ${userId}`;
          }
          if (body && Object.keys(body).length > 0) {
            info += ` | Body: ${JSON.stringify(body)}`;
          }
          if (statusCode) {
            info += ` | Status: ${statusCode}`;
          }
          if (responseTime) {
            info += ` | Time: ${responseTime}`;
          }
          
          // Add other metadata in a prettier format
          const cleanMeta = { ...meta };
          delete cleanMeta.service; // Remove service name
          
          // Format common fields nicely
          if (cleanMeta.port) {
            info += ` | Port: ${cleanMeta.port}`;
            delete cleanMeta.port;
          }
          if (cleanMeta.templateId) {
            info += ` | Template: ${cleanMeta.templateId}`;
            delete cleanMeta.templateId;
          }
          if (cleanMeta.size) {
            info += ` | Size: ${cleanMeta.size} bytes`;
            delete cleanMeta.size;
          }
          if (cleanMeta.count) {
            info += ` | Count: ${cleanMeta.count}`;
            delete cleanMeta.count;
          }
          if (cleanMeta.error) {
            info += ` | Error: ${cleanMeta.error}`;
            delete cleanMeta.error;
          }
          
          // If there's still metadata left, show it as JSON
          if (Object.keys(cleanMeta).length > 0) {
            info += ` | ${JSON.stringify(cleanMeta)}`;
          }
          
          return `${timestamp} [${level}] ${requestIdStr}: ${message}${info}`;
        })
      )
    })
  ]
});

// Handle uncaught exceptions
logger.exceptions.handle(
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  })
);

// Handle unhandled promise rejections
logger.rejections.handle(
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  })
);

export default logger;