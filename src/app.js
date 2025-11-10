import express from 'express';
import uploadRoutes from './routes/upload.js';
import { errorHandler } from './middleware/error-handler.js';

const app = express();

app.use(express.json());

app.get('/test', async (_req, res) => {
  res.send('API is running');
});

app.use('/', uploadRoutes);

app.use(errorHandler);

export default app;
