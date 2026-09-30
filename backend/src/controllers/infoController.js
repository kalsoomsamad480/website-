import cafeInfo from '../data/cafeInfo.js';
import { sendSuccess } from '../utils/apiResponse.js';

export const getInfo = (_req, res) => {
  sendSuccess(res, { data: cafeInfo });
};
