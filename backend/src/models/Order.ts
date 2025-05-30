import mongoose from 'mongoose';
import { Order } from '../types';

const locationSchema = new mongoose.Schema({
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now }
});

const orderSchema = new mongoose.Schema({
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  deliveryPartnerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: {
    type: String,
    enum: ['pending', 'assigned', 'in_progress', 'delivered'],
    default: 'pending'
  },
  pickupLocation: { type: locationSchema, required: true },
  deliveryLocation: { type: locationSchema, required: true },
  currentLocation: locationSchema
}, {
  timestamps: true
});

export const OrderModel = mongoose.model<Order & mongoose.Document>('Order', orderSchema); 