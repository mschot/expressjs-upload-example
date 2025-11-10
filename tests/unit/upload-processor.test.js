import { processUpload } from '../../src/services/upload-processor.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('Upload Processor Service', () => {
  test('should process CSV with all valid emails', async () => {
    const filePath = path.join(__dirname, '../fixtures/valid-users.csv');
    const result = await processUpload('test-upload-1', filePath);

    expect(result.status).toBe('completed');
    expect(result.totalRecords).toBe(4);
    expect(result.processedRecords).toBe(4);
    expect(result.failedRecords).toBe(0);
  }, 10000);

  test('should process CSV with invalid emails', async () => {
    const filePath = path.join(__dirname, '../fixtures/invalid-users.csv');
    const result = await processUpload('test-upload-2', filePath);

    expect(result.status).toBe('completed');
    expect(result.totalRecords).toBe(4);
    expect(result.failedRecords).toBeGreaterThan(0);
    expect(result.details).toBeInstanceOf(Array);
  }, 10000);
});
