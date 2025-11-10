import express from 'express';
import { handleUpload } from '../controllers/upload.js';
import { handleGetStatus } from '../controllers/status.js';
import { upload } from '../middleware/upload.js';
import { uploadLimiter } from '../middleware/rate-limiter.js';

const router = express.Router();

router.use('/upload', uploadLimiter);

router.post('/upload', upload.single('file'), handleUpload);

router.get('/status/:uploadId', handleGetStatus);

export default router;
