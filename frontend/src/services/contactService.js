import api from './api';

export const sendContactMessage = (message) => api.post('/contact', message);
