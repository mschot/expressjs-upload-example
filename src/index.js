import express from 'express';
import { createClient } from 'redis';

const app = express();
const PORT = process.env.PORT || 8335;

app.get('/test', async (_req, res) => {
  const client = createClient({
    socket: {
      host: process.env.REDIS_HOST || 'redis',
      port: process.env.REDIS_PORT || 6379,
      connectTimeout: 500,
      reconnectStrategy: false
    }
  });

  //don't crash when there is an error with redis
  client.on('error', () => {});

  try {
    await client.connect();
    await client.ping();
    await client.quit();

    res.send('successfully connected');
  } catch (error) {
    console.error('Redis connection error:', error.message);

    try {
      await client.disconnect();
    } catch (disconnectError) {}

    res.send('failed to connect');
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});
