import { getUploadStatus, setUploadStatus } from '../storage/upload-status.js';
import { getUploadStatusFromRedis } from '../storage/redis.js';

export const handleGetStatus = async (req, res) => {
  const { uploadId } = req.params;

  let status = getUploadStatus(uploadId);

  if (!status) {
    status = await getUploadStatusFromRedis(uploadId);
    status && setUploadStatus(uploadId, status);
  }

  if (!status) {
    return res.status(404).json({ error: 'Upload not found' });
  }

  res.json({
    uploadId,
    ...status,
  });
};
