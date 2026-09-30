import api from './api';
import { cached } from '../utils/resource';

export const getTestimonials = () =>
  cached('testimonials', () => api.get('/testimonials').then((res) => res.data));
