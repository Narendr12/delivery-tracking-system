import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { User } from '../types';

const locationSchema = new mongoose.Schema({
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now }
});

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['vendor', 'delivery', 'customer'], required: true },
  name: { type: String, required: true },
  isAvailable: { type: Boolean, default: true },
  currentLocation: locationSchema,
  currentOrder: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  storeName: String,
  storeLocation: locationSchema,
  addresses: [locationSchema]
}, {
  timestamps: true
});

userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export const UserModel = mongoose.model<User & mongoose.Document>('User', userSchema); 