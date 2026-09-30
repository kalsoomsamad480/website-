import api from './api';
import { cached } from '../utils/resource';

// The full menu is small (about 40 items), so it is loaded once and filtered in the browser
export const getMenu = () => cached('menu', () => api.get('/menu').then((res) => res.data));

export const getCategories = () =>
  cached('categories', () => api.get('/categories').then((res) => res.data));
