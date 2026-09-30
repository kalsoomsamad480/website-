import api from './api';
import { cached } from '../utils/resource';

export const getOffers = () => cached('offers', () => api.get('/offers').then((res) => res.data));
