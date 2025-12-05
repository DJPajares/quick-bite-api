import mongoose, { Schema, Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { SESSION_STATUS } from '../config/constants';
import { ISession, ICartItem } from '../types';

const cartItemSchema = new Schema<ICartItem>(
  {
    menuItem: {
      type: Schema.Types.ObjectId,
      ref: 'MenuItem',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1
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

const sessionSchema = new Schema<ISession>(
  {
    sessionId: {
      type: String,
      required: true,
      unique: true,
      default: uuidv4,
      index: true
    },
    tableNumber: {
      type: Number,
      required: true
    },
    cart: [cartItemSchema],
    status: {
      type: String,
      enum: Object.values(SESSION_STATUS),
      default: SESSION_STATUS.ACTIVE
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expireAfterSeconds: 0 }
    }
  },
  {
    timestamps: true
  }
);

// Index for faster lookups
sessionSchema.index({ tableNumber: 1, status: 1 });

// Calculate cart total
sessionSchema.methods.getCartTotal = function (this: ISession): number {
  return this.cart.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);
};

const Session: Model<ISession> = mongoose.model<ISession>(
  'Session',
  sessionSchema
);

export default Session;
