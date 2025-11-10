import fs from 'fs';
import csvParser from 'csv-parser';
import logger from '../utils/logger.js';

export const countCsvRows = async (filePath) => {
  let count = 0;

  try {
    const stream = fs.createReadStream(filePath).pipe(csvParser());

    for await (const _row of stream) {
        count++;
    }

    logger.info(`Counted ${count} rows in CSV`);
    return count;
  } catch (error) {
    logger.error('Error counting CSV rows:', error.message);
    throw new Error('Failed to count CSV rows');
  }
};

export const processCsvFileStream = async (filePath, onRow) => {
  const processingPromises = [];
  let stream;

  try {
    stream = fs.createReadStream(filePath).pipe(csvParser());
   } catch (error) {
    logger.error('Error processing CSV stream:', error.message);
    throw new Error('Failed to process CSV file');
  }

  for await (const row of stream) {
    const promise = onRow({
      name: row.name.trim(),
      email: row.email.trim(),
    });
    processingPromises.push(promise);
  }

  await Promise.all(processingPromises);
  logger.info('Finished processing CSV stream');
};
