import mongoose, { Schema, Model } from 'mongoose';
import { IMenuItem } from '../types';

const menuItemSchema = new Schema<IMenuItem>({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    required: true,
    enum: ['appetizers', 'main-course', 'desserts', 'beverages', 'sides']
  },
  image: {
    type: String,
    default: ''
  },
  available: {
    type: Boolean,
    default: true
  },
  preparationTime: {
    type: Number, // in minutes
    default: 15
  },
  tags: [{
    type: String
  }]
}, {
  timestamps: true
});

// Index for faster queries
menuItemSchema.index({ category: 1, available: 1 });

const MenuItem: Model<IMenuItem> = mongoose.model<IMenuItem>('MenuItem', menuItemSchema);

export default MenuItem;
