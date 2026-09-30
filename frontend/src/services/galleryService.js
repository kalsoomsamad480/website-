import api from './api';
import { cached } from '../utils/resource';

export const getGallery = () =>
  cached('gallery', () => api.get('/gallery').then((res) => res.data));
