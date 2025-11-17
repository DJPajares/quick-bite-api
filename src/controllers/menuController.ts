import { Request, Response, NextFunction } from 'express';
import MenuItem from '../models/MenuItem';

/**
 * Get all menu items
 * GET /api/menu
 */
export const getAllMenuItems = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { available } = req.query;

    const filter: { available?: boolean } = {};
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
 * Get menu items by category
 * GET /api/menu/category/:category
 */
export const getMenuByCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { category } = req.params;

    const menuItems = await MenuItem.find({
      category: category.toLowerCase(),
      available: true
    }).sort({ name: 1 });

    res.status(200).json({
      success: true,
      category,
      count: menuItems.length,
      data: menuItems
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single menu item
 * GET /api/menu/:id
 */
export const getMenuItem = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);

    if (!menuItem) {
      res.status(404).json({
        success: false,
        error: 'Menu item not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: menuItem
    });
  } catch (error) {
    next(error);
  }
};
