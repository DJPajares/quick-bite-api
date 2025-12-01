import { Request, Response, NextFunction } from 'express';
import MenuItem from '../models/MenuItem';
import { CreateMenuItemRequest, UpdateMenuItemRequest } from '../types';

/**
 * Get all menu items (admin)
 * GET /api/admin/menu
 */
export const getAllMenuItems = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { category, available } = req.query;

    const filter: any = {};

    if (category) {
      filter.category = category;
    }

    if (available !== undefined) {
      filter.available = available === 'true';
    }

    const menuItems = await MenuItem.find(filter).sort({
      category: 1,
      name: 1
    });

    res.status(200).json({
      success: true,
      count: menuItems.length,
      data: menuItems
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create new menu item
 * POST /api/admin/menu
 */
export const createMenuItem = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const menuItemData: CreateMenuItemRequest = req.body;

    // Validate required fields
    const { name, description, price, category } = menuItemData;

    if (!name || !description || price === undefined || !category) {
      res.status(400).json({
        success: false,
        error: 'Name, description, price, and category are required'
      });
      return;
    }

    // Validate price
    if (price < 0) {
      res.status(400).json({
        success: false,
        error: 'Price must be a positive number'
      });
      return;
    }

    const menuItem = await MenuItem.create(menuItemData);

    res.status(201).json({
      success: true,
      message: 'Menu item created successfully',
      data: menuItem
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update menu item
 * PATCH /api/admin/menu/:id
 */
export const updateMenuItem = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData: UpdateMenuItemRequest = req.body;

    // Validate price if provided
    if (updateData.price !== undefined && updateData.price < 0) {
      res.status(400).json({
        success: false,
        error: 'Price must be a positive number'
      });
      return;
    }

    const menuItem = await MenuItem.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true
    });

    if (!menuItem) {
      res.status(404).json({
        success: false,
        error: 'Menu item not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Menu item updated successfully',
      data: menuItem
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete menu item
 * DELETE /api/admin/menu/:id
 */
export const deleteMenuItem = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const menuItem = await MenuItem.findByIdAndDelete(id);

    if (!menuItem) {
      res.status(404).json({
        success: false,
        error: 'Menu item not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Menu item deleted successfully',
      data: { id: menuItem._id, name: menuItem.name }
    });
  } catch (error) {
    next(error);
  }
};
