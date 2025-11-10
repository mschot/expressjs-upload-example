const uploadStatusMap = new Map();

export const setUploadStatus = (uploadId, status) => {
  uploadStatusMap.set(uploadId, {
    ...status,
    lastUpdated: new Date().toISOString(),
  });
};

export const getUploadStatus = (uploadId) => {
  return uploadStatusMap.get(uploadId);
};
