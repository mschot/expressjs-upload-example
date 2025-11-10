import { validateRow } from '../../src/services/row-validation.js';

describe('Row Validation Service', () => {
  test('should validate correct name and email', async () => {
    const result = await validateRow({ name: 'John Doe', email: 'test@example.com' });
    expect(result).toBeNull();
  });

  test('should return error for missing name', async () => {
    const result = await validateRow({ name: '', email: 'test@example.com' });
    expect(result).toBe('Missing name');
  });

  test('should return error for missing email', async () => {
    const result = await validateRow({ name: 'John Doe', email: '' });
    expect(result).toBe('Missing email');
  });

  test('should return error for invalid email format', async () => {
    const result = await validateRow({ name: 'John Doe', email: 'invalid-email' });
    expect(result).toBe('Invalid email format');
  });

  test('should return error for email without domain', async () => {
    const result = await validateRow({ name: 'John Doe', email: 'test@' });
    expect(result).toBe('Invalid email format');
  });
});
