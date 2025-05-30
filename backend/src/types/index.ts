export interface Location {
  latitude: number;
  longitude: number;
  timestamp: Date;
}

export interface User {
  _id: string;
  email: string;
  password: string;
  role: 'vendor' | 'delivery' | 'customer';
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Order {
  _id: string;
  vendorId: string;
  customerId: string;
  deliveryPartnerId?: string;
  status: 'pending' | 'assigned' | 'in_progress' | 'delivered';
  pickupLocation: Location;
  deliveryLocation: Location;
  currentLocation?: Location;
  createdAt: Date;
  updatedAt: Date;
}

export interface DeliveryPartner extends User {
  isAvailable: boolean;
  currentLocation?: Location;
  currentOrder?: string;
}

export interface Vendor extends User {
  storeName: string;
  storeLocation: Location;
}

export interface Customer extends User {
  addresses: Location[];
}

export interface JwtPayload {
  userId: string;
  role: string;
} 