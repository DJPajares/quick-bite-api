import { Request, Response, NextFunction } from 'express';
import MenuItem from '../models/MenuItem';

/**
 * Get all inventory items
 * GET /api/admin/inventory
 */
export const getAllInventory = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { category } = req.query;

    const filter: any = {};

    if (category) {
      filter.category = category;
    }

    // Note: MenuItem doesn't have a stockLevel field in the current schema
    // This is a placeholder implementation
    // You may want to add a stockLevel field to the MenuItem model
    const menuItems = await MenuItem.find(filter).sort({
      category: 1,
      name: 1
    });

    res.status(200).json({
      success: true,
      count: menuItems.length,
      data: menuItems.map((item) => ({
        _id: item._id,
        name: item.name,
        category: item.category,
        available: item.available,
        price: item.price,
        // Placeholder for stock level - add this field to MenuItem model if needed
        stockLevel: 100,
        updatedAt: item.updatedAt
      }))
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update inventory stock level
 * PATCH /api/admin/inventory/:id
 */
export const updateInventoryStock = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { stockLevel } = req.body;

    if (stockLevel === undefined || stockLevel < 0) {
      res.status(400).json({
        success: false,
        error: 'Valid stock level (>= 0) is required'
      });
      return;
    }

    // Note: This updates the 'available' status based on stock level
    // If you add a stockLevel field to MenuItem, update this accordingly
    const menuItem = await MenuItem.findByIdAndUpdate(
      id,
      {
        available: stockLevel > 0
        // Add stockLevel field update here if you extend the model
      },
      { new: true, runValidators: true }
    );

    if (!menuItem) {
      res.status(404).json({
        success: false,
        error: 'Inventory item not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Inventory stock level updated successfully',
      data: {
        _id: menuItem._id,
        name: menuItem.name,
        available: menuItem.available,
        stockLevel: stockLevel // Return the updated stock level
      }
    });
  } catch (error) {
    next(error);
  }
};
