import api from './api';

export const getAvailability = (date, seatType) =>
  api
    .get('/reservations/availability', { params: { date, seatType } })
    .then((response) => response.data);

export const createReservation = (details) =>
  api.post('/reservations', details).then((response) => response.data);

export const getMyReservations = () =>
  api.get('/reservations/my').then((response) => response.data);

export const cancelReservation = (id) =>
  api.patch(`/reservations/${id}/cancel`).then((response) => response.data);
