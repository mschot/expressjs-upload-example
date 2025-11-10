import { countCsvRows, processCsvFileStream } from '../../src/services/csv-parser.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('CSV Parser Service', () => {
  test('should parse valid CSV file', async () => {
    const filePath = path.join(__dirname, '../fixtures/valid-users.csv');
    const records = [];

    await processCsvFileStream(filePath, async (record) => {
      records.push(record);
    });

    expect(records).toHaveLength(4);
    expect(records[0]).toEqual({
      name: 'John Doe',
      email: 'john@example.com',
    });
  });

  test('should handle CSV with invalid rows', async () => {
    const filePath = path.join(__dirname, '../fixtures/invalid-users.csv');
    const records = [];

    await processCsvFileStream(filePath, async (record) => {
      records.push(record);
    });

    expect(records).toHaveLength(4);
    expect(records[1].email).toBe('invalid-email');
  });

  test('should count valid CSV rows', async () => {
    const filePath = path.join(__dirname, '../fixtures/valid-users.csv');
    const count = await countCsvRows(filePath);

    expect(count).toBe(4);
  });

  test('should process CSV file with streaming', async () => {
    const filePath = path.join(__dirname, '../fixtures/valid-users.csv');
    const records = [];

    await processCsvFileStream(filePath, async (record) => {
      records.push(record);
    });

    expect(records).toHaveLength(4);
    expect(records[0]).toEqual({
      name: 'John Doe',
      email: 'john@example.com',
    });
  });
});
