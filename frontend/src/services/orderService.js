import api from './api';

/** items: [{ menuItem, quantity }]. The server calculates all prices. */
export const placeOrder = (order) => api.post('/orders', order).then((response) => response.data);

export const getMyOrders = () => api.get('/orders/my').then((response) => response.data);
