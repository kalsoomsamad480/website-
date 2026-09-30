import * as menuService from '../services/menuService.js';
import asyncHandler from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/apiResponse.js';

export const listMenu = asyncHandler(async (req, res) => {
  const items = await menuService.listMenuItems(req.query);
  sendSuccess(res, { message: `${items.length} items found.`, data: items });
});

export const getMenuItem = asyncHandler(async (req, res) => {
  const item = await menuService.getMenuItem(req.params.idOrSlug);
  sendSuccess(res, { data: item });
});

export const createMenuItem = asyncHandler(async (req, res) => {
  const item = await menuService.createMenuItem(req.body);
  sendSuccess(res, {
    statusCode: 201,
    message: 'Menu item created.',
    data: item,
  });
});

export const updateMenuItem = asyncHandler(async (req, res) => {
  const item = await menuService.updateMenuItem(req.params.id, req.body);
  sendSuccess(res, { message: 'Menu item updated.', data: item });
});

export const setAvailability = asyncHandler(async (req, res) => {
  const result = await menuService.setAvailability(req.params.id, req.body?.isAvailable);
  sendSuccess(res, {
    message: result.isAvailable ? 'Item is now available.' : 'Item is now unavailable.',
    data: result,
  });
});

export const deleteMenuItem = asyncHandler(async (req, res) => {
  await menuService.deleteMenuItem(req.params.id);
  sendSuccess(res, { message: 'Menu item deleted.' });
});
