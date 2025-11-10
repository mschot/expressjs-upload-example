import multer from 'multer';
import path from 'path';
import { MAX_FILE_SIZE, UPLOAD_DIR } from '../config/constants.js';

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => {
    callback(null, UPLOAD_DIR);
  },
  filename: (_req, file, callback) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    callback(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const fileFilter = (_req, file, callback) => {
  if (file.mimetype === 'text/csv' || path.extname(file.originalname) === '.csv') {
    callback(null, true);
  } else {
    callback(new Error('Only CSV files are allowed'), false);
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
});
