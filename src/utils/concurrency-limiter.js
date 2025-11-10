import pLimit from 'p-limit';
import { MAX_CONCURRENT_VALIDATIONS } from '../config/constants.js';

const limit = pLimit(MAX_CONCURRENT_VALIDATIONS);

export default limit;
