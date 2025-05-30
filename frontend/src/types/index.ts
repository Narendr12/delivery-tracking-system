export interface Location {
  latitude: number;
  longitude: number;
  timestamp?: Date;
}

export interface User {
  _id: string;
  email: string;
  name: string;
  role: 'vendor' | 'delivery' | 'customer';
  storeName?: string;
  storeLocation?: Location;
  currentLocation?: Location;
  currentOrder?: string;
  isAvailable?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Order {
  _id: string;
  vendorId: string | User;
  customerId: string | User;
  deliveryPartnerId?: string | User;
  status: 'pending' | 'assigned' | 'in_progress' | 'delivered';
  pickupLocation: Location;
  deliveryLocation: Location;
  currentLocation?: Location;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface ApiError {
  error: string;
} 