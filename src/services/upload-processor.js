import { countCsvRows, processCsvFileStream } from './csv-parser.js';
import { validateRow } from './row-validation.js';
import { setUploadStatus } from '../storage/upload-status.js';
import { setUploadStatusInRedis } from '../storage/redis.js';
import limit from '../utils/concurrency-limiter.js';
import logger from '../utils/logger.js';

const initializeUploadStatus = async (uploadId, totalRecords) => {
  const initialStatus = {
    status: 'processing',
    totalRecords,
    processedRecords: 0,
    failedRecords: 0,
    progress: '0%',
    details: [],
  };

  setUploadStatus(uploadId, initialStatus);
  await setUploadStatusInRedis(uploadId, initialStatus);
};

const updateProgress = (uploadId, processedCount, totalRecords) => {
  const progress = Math.round((processedCount / totalRecords) * 100);

  setUploadStatus(uploadId, {
    status: 'processing',
    totalRecords,
    processedRecords: processedCount,
    progress: `${progress}%`,
  });
};

const buildFinalStatus = (totalRecords, processedCount, failedResults) => {
  return {
    status: 'completed',
    totalRecords,
    processedRecords: processedCount - failedResults.length,
    failedRecords: failedResults.length,
    progress: '100%',
    details: failedResults,
  };
};

const finalizeUploadStatus = async (uploadId, statusData) => {
  setUploadStatus(uploadId, statusData);
  await setUploadStatusInRedis(uploadId, statusData);
};

export const processUpload = async (uploadId, filePath) => {
  logger.info(`Starting processing for upload ${uploadId}`);

  const totalRecords = await countCsvRows(filePath);

  await initializeUploadStatus(uploadId, totalRecords);

  let processedCount = 0;
  const failedResults = [];

  await processCsvFileStream(filePath, async (record) => {
    await limit(async () => {
      processedCount++;

      const validationError = await validateRow(record);

      if (validationError) {
        failedResults.push({
          name: record.name,
          email: record.email,
          error: validationError,
        });
      }

      updateProgress(uploadId, processedCount, totalRecords);
    });
  });

  const finalStatus = buildFinalStatus(totalRecords, processedCount, failedResults);

  await finalizeUploadStatus(uploadId, finalStatus);

  logger.info(`Completed processing for upload ${uploadId}`);

  return finalStatus;
};
