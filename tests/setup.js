// Mock Redis storage using Map for tests
import { vi, beforeEach } from 'vitest';

const mockRedisStore = new Map();

vi.mock('../src/storage/redis.js', () => {
  return {
    setUploadStatusInRedis: vi.fn(async (uploadId, status) => {
      mockRedisStore.set(`upload:${uploadId}`, JSON.stringify(status));
    }),
    getUploadStatusFromRedis: vi.fn(async (uploadId) => {
      const data = mockRedisStore.get(`upload:${uploadId}`);
      return data ? JSON.parse(data) : null;
    }),
    connectRedis: vi.fn(async () => {}),
  };
});

beforeEach(() => {
  mockRedisStore.clear();
});
