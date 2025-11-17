import mongoose, { Schema, Model } from 'mongoose';
import { IOrder, IOrderItem, IOrderModel } from '../types';

const orderItemSchema = new Schema<IOrderItem>(
  {
    menuItem: {
      type: Schema.Types.ObjectId,
      ref: 'MenuItem',
      required: true
    },
    name: {
      type: String,
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    price: {
      type: Number,
      required: true
    },
    specialInstructions: {
      type: String,
      default: ''
    }
  },
  { _id: false }
);

const orderSchema = new Schema<IOrder>(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true
    },
    sessionId: {
      type: String,
      required: true,
      ref: 'Session'
    },
    tableNumber: {
      type: Number,
      required: true
    },
    items: [orderItemSchema],
    subtotal: {
      type: Number,
      required: true
    },
    tax: {
      type: Number,
      required: true
    },
    serviceFee: {
      type: Number,
      required: true
    },
    total: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: [
        'pending',
        'confirmed',
        'preparing',
        'ready',
        'served',
        'cancelled'
      ],
      default: 'pending'
    },
    notes: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

// Indexes for faster queries
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ sessionId: 1 });
orderSchema.index({ tableNumber: 1, createdAt: -1 });
orderSchema.index({ status: 1 });

// Generate order number
orderSchema.statics.generateOrderNumber = function (): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `ORD-${timestamp}-${random}`;
};

const Order: Model<IOrder> & IOrderModel = mongoose.model<
  IOrder,
  Model<IOrder> & IOrderModel
>('Order', orderSchema);

export default Order;
