import { createClient } from 'redis';
import logger from '../utils/logger.js';

const redisClient = createClient({
  socket: {
    host: process.env.REDIS_HOST || 'redis',
    port: process.env.REDIS_PORT || 6379,
    connectTimeout: 5000,
  },
});

redisClient.on('error', (err) => {
  logger.error('Redis client error:', err.message);
});

redisClient.on('connect', () => {
  logger.info('Connected to Redis');
});

export const connectRedis = async () => {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
};

export const setUploadStatusInRedis = async (uploadId, status) => {
  try {
    await connectRedis();
    await redisClient.set(
      `upload:${uploadId}`,
      JSON.stringify(status),
      { EX: 3600 }
    );
  } catch (error) {
    logger.error('Error setting upload status in Redis:', error.message);
  }
};

export const getUploadStatusFromRedis = async (uploadId) => {
  try {
    await connectRedis();
    const data = await redisClient.get(`upload:${uploadId}`);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    logger.error('Error getting upload status from Redis:', error.message);
    return null;
  }
};

export default redisClient;
