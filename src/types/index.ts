import { Document, Types } from 'mongoose';

export interface IMenuItem extends Document {
  name: string;
  description: string;
  price: number;
  category: 'appetizers' | 'main-course' | 'desserts' | 'beverages' | 'sides';
  image: string;
  available: boolean;
  preparationTime: number;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ICartItem {
  menuItem: Types.ObjectId | IMenuItem;
  quantity: number;
  price: number;
  specialInstructions: string;
}

export interface ISession extends Document {
  sessionId: string;
  tableNumber: number;
  cart: ICartItem[];
  status: 'active' | 'completed' | 'expired';
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
  getCartTotal(): number;
}

export interface IOrderItem {
  menuItem: Types.ObjectId | IMenuItem;
  name: string;
  quantity: number;
  price: number;
  specialInstructions: string;
}

export interface IOrder extends Document {
  orderNumber: string;
  sessionId: string;
  tableNumber: number;
  items: IOrderItem[];
  subtotal: number;
  tax: number;
  serviceFee: number;
  total: number;
  status:
    | 'pending'
    | 'confirmed'
    | 'preparing'
    | 'ready'
    | 'served'
    | 'cancelled';
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IOrderModel {
  generateOrderNumber(): string;
}

export interface IBillCalculation {
  subtotal: number;
  tax: number;
  taxRate: number;
  serviceFee: number;
  serviceFeeRate: number;
  total: number;
}
