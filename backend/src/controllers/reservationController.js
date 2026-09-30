import * as reservationService from '../services/reservationService.js';
import asyncHandler from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/apiResponse.js';

export const getAvailability = asyncHandler(async (req, res) => {
  const slots = await reservationService.getAvailability(req.query.date, req.query.seatType);
  sendSuccess(res, { data: slots });
});

export const createReservation = asyncHandler(async (req, res) => {
  const source = req.fromAgent ? 'agent' : 'web';
  const reservation = await reservationService.createReservation(req.body, req.user, source);
  sendSuccess(res, {
    statusCode: 201,
    message: 'Reservation received. We will confirm it shortly.',
    data: reservation,
  });
});

export const listMyReservations = asyncHandler(async (req, res) => {
  const reservations = await reservationService.listMyReservations(req.user);
  sendSuccess(res, { data: reservations });
});

export const cancelMyReservation = asyncHandler(async (req, res) => {
  const reservation = await reservationService.cancelMyReservation(req.user, req.params.id);
  sendSuccess(res, { message: 'Reservation cancelled.', data: reservation });
});

export const listReservations = asyncHandler(async (req, res) => {
  const reservations = await reservationService.listReservations(req.query);
  sendSuccess(res, { data: reservations });
});

export const updateReservationStatus = asyncHandler(async (req, res) => {
  const reservation = await reservationService.updateReservationStatus(
    req.params.id,
    req.body.status,
  );
  sendSuccess(res, {
    message: `Reservation ${reservation.status}.`,
    data: reservation,
  });
});

export const rescheduleReservation = asyncHandler(async (req, res) => {
  const reservation = await reservationService.rescheduleReservation(req.params.id, req.body);
  sendSuccess(res, { message: 'Reservation rescheduled.', data: reservation });
});
