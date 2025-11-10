import { generateUploadId } from '../utils/generate-upload-id.js';
import { processUpload } from '../services/upload-processor.js';
import logger from '../utils/logger.js';

export const handleUpload = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const uploadId = generateUploadId();
  const filePath = req.file.path;

  logger.info(`File uploaded: ${uploadId}`);

  //ensure we run async but use await for catching the error
  (async () => {
    try {
      await processUpload(uploadId, filePath);
    } catch (error) {
      logger.error(`Background processing error for ${uploadId}:`, error.message);
    }
  })();

  res.status(202).json({
    uploadId,
    message: 'File uploaded successfully. Processing started.',
  });
};
