import request from 'supertest';
import app from '../../src/app.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('Upload API Integration Tests', () => {
  test('POST /upload should accept CSV file', async () => {
    const filePath = path.join(__dirname, '../fixtures/valid-users.csv');

    const response = await request(app)
      .post('/upload')
      .attach('file', filePath);

    expect(response.status).toBe(202);
    expect(response.body).toHaveProperty('uploadId');
    expect(response.body.message).toContain('Processing started');
  });

  test('POST /upload should reject non-CSV files', async () => {
    const response = await request(app)
      .post('/upload')
      .attach('file', Buffer.from('test'), 'test.txt');

    expect(response.status).toBe(500);
  });

  test('POST /upload should reject request without file', async () => {
    const response = await request(app).post('/upload');

    expect(response.status).toBe(400);
    expect(response.body.error).toContain('No file uploaded');
  });

  test('GET /status/:uploadId should return 404 for unknown ID', async () => {
    const response = await request(app).get('/status/unknown-id');

    expect(response.status).toBe(404);
    expect(response.body.error).toContain('Upload not found');
  });

  test('POST /upload should enforce rate limiting', async () => {
    const filePath = path.join(__dirname, '../fixtures/valid-users.csv');

    const requests = Array.from({ length: 11 }, () =>
      request(app).post('/upload').attach('file', filePath)
    );

    const responses = await Promise.all(requests);

    const successfulRequests = responses.filter((res) => res.status === 202);
    const rateLimitedRequests = responses.filter((res) => res.status === 429);

    expect(successfulRequests.length).toBeGreaterThanOrEqual(1);
    expect(successfulRequests.length).toBeLessThanOrEqual(10);
    expect(rateLimitedRequests.length).toBeGreaterThan(0);

    const rateLimitedResponse = rateLimitedRequests.find((res) => res.text);
    if (rateLimitedResponse) {
      expect(rateLimitedResponse.text).toContain('Too many upload requests');
    }
  }, 15000);
});
