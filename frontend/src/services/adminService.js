import api from './api';
import { invalidate } from '../utils/resource';

const data = (request) => request.then((response) => response.data);

// Public pages cache menu, offers, and testimonials; clear them after admin edits
const afterMenuChange = (result) => {
  invalidate('menu');
  invalidate('categories');
  return result;
};

export const getStats = () => data(api.get('/admin/stats'));

// Orders
export const getOrders = (status) => data(api.get('/orders', { params: status ? { status } : {} }));
export const updateOrderStatus = (id, status) =>
  data(api.patch(`/orders/${id}/status`, { status }));

// Reservations
export const getReservations = (params = {}) => data(api.get('/reservations', { params }));
export const updateReservationStatus = (id, status) =>
  data(api.patch(`/reservations/${id}/status`, { status }));
export const rescheduleReservation = (id, date, time) =>
  data(api.patch(`/reservations/${id}/reschedule`, { date, time }));

// Menu and categories
export const getAdminMenu = () => data(api.get('/menu'));
export const getAdminCategories = () => data(api.get('/categories'));
export const createMenuItem = (item) => data(api.post('/menu', item)).then(afterMenuChange);
export const updateMenuItem = (id, item) =>
  data(api.put(`/menu/${id}`, item)).then(afterMenuChange);
export const setMenuAvailability = (id, isAvailable) =>
  data(api.patch(`/menu/${id}/availability`, { isAvailable })).then(afterMenuChange);
export const deleteMenuItem = (id) => data(api.delete(`/menu/${id}`)).then(afterMenuChange);
export const createCategory = (category) =>
  data(api.post('/categories', category)).then(afterMenuChange);
export const updateCategory = (id, category) =>
  data(api.put(`/categories/${id}`, category)).then(afterMenuChange);
export const deleteCategory = (id) => data(api.delete(`/categories/${id}`)).then(afterMenuChange);

// Offers
const afterOffers = (result) => {
  invalidate('offers');
  return result;
};
export const getAllOffers = () => data(api.get('/offers/all'));
export const createOffer = (offer) => data(api.post('/offers', offer)).then(afterOffers);
export const updateOffer = (id, offer) => data(api.put(`/offers/${id}`, offer)).then(afterOffers);
export const deleteOffer = (id) => data(api.delete(`/offers/${id}`)).then(afterOffers);

// Testimonials
const afterTestimonials = (result) => {
  invalidate('testimonials');
  return result;
};
export const getAllTestimonials = () => data(api.get('/testimonials/all'));
export const createTestimonial = (item) =>
  data(api.post('/testimonials', item)).then(afterTestimonials);
export const updateTestimonial = (id, item) =>
  data(api.put(`/testimonials/${id}`, item)).then(afterTestimonials);
export const deleteTestimonial = (id) =>
  data(api.delete(`/testimonials/${id}`)).then(afterTestimonials);

// Contact messages
export const getMessages = () => data(api.get('/contact'));
export const setMessageRead = (id, isRead) => data(api.patch(`/contact/${id}/read`, { isRead }));
export const deleteMessage = (id) => data(api.delete(`/contact/${id}`));
