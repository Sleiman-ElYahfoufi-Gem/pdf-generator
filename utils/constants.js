// Path constants
export const PAGES_FOLDER = 'pages';
export const TEMPLATES_FOLDER = 'templates';
export const VIEWS_FOLDER = './views';

// JWT/Auth constants
export const TOKEN_EXPIRY = '24h';
export const COOKIE_MAX_AGE = 24 * 60 * 60 * 1000; // 24 hours in milliseconds


export const LOG_LEVELS = {
  ERROR: 'error',
  WARN: 'warn',
  INFO: 'info',
  DEBUG: 'debug'
};

export const SENSITIVE_FIELDS = [
  'password',
  'secretKey',
  'secret_key',
  'token',
  'accessToken',
  'refreshToken',
  'creditCard',
  'ssn',
  'apiKey',
  'api_key'
];

export const MAX_RESPONSE_BODY_SIZE = 10000; // 10KB - don't log responses larger than this