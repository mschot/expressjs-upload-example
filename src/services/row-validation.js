import { setTimeout } from 'timers/promises';
import { EMAIL_VALIDATION_TIMEOUT } from '../config/constants.js';
import logger from '../utils/logger.js';

const validateName = (name) => {
  if (!name || name.trim().length === 0) {
    return 'Missing name';
  }
  return null;
};

const mockValidateEmail = async (email) => {
  await setTimeout(EMAIL_VALIDATION_TIMEOUT);

  if (!email || email.trim().length === 0) {
    return 'Missing email';
  }

  const isValid = email.includes('@') && email.includes('.');

  logger.debug(`Email validation for ${email}: ${isValid ? 'valid' : 'invalid'}`);

  return isValid ? null : 'Invalid email format';
};

export const validateRow = async (record) => {
  const nameError = validateName(record.name);
  if (nameError) {
    return nameError;
  }

  const emailError = await mockValidateEmail(record.email);
  if (emailError) {
    return emailError;
  }

  return null;
};
