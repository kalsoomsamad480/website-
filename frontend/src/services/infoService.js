import api from './api';
import { cached } from '../utils/resource';

export const getInfo = () => cached('info', () => api.get('/info').then((res) => res.data));
