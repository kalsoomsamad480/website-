import * as orderService from '../services/orderService.js';
import asyncHandler from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/apiResponse.js';

export const createOrder = asyncHandler(async (req, res) => {
  const order = await orderService.createOrder(req.user, req.body);
  sendSuccess(res, {
    statusCode: 201,
    message: `Order ${order.orderNumber} placed.`,
    data: order,
  });
});

export const listMyOrders = asyncHandler(async (req, res) => {
  const orders = await orderService.listMyOrders(req.user);
  sendSuccess(res, { data: orders });
});

export const listOrders = asyncHandler(async (req, res) => {
  const orders = await orderService.listOrders(req.query);
  sendSuccess(res, { data: orders });
});

export const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await orderService.updateOrderStatus(req.params.id, req.body.status);
  sendSuccess(res, {
    message: `Order ${order.orderNumber} is now ${order.status}.`,
    data: order,
  });
});
