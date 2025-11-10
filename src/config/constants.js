export const MAX_CONCURRENT_VALIDATIONS = parseInt(process.env.MAX_CONCURRENT_VALIDATIONS) || 5;
export const EMAIL_VALIDATION_TIMEOUT = parseInt(process.env.EMAIL_VALIDATION_TIMEOUT) || 100;
export const MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024;
export const UPLOAD_DIR = process.env.UPLOAD_DIR || './uploads';
export const RATE_LIMIT_WINDOW_MS = parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 60000;
export const RATE_LIMIT_MAX_REQUESTS = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 10;
