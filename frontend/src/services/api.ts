import axios from 'axios';
import { AuthResponse, Order, User, Location } from '@/types';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const auth = {
  register: async (data: {
    email: string;
    password: string;
    name: string;
    role: string;
    storeName?: string;
    storeLocation?: Location;
  }): Promise<AuthResponse> => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  login: async (data: {
    email: string;
    password: string;
  }): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },
};

export const orders = {
  create: async (data: {
    vendorId: string;
    pickupLocation: Location;
    deliveryLocation: Location;
  }): Promise<Order> => {
    const response = await api.post('/orders', data);
    return response.data;
  },

  getVendorOrders: async (): Promise<Order[]> => {
    const response = await api.get('/orders/vendor');
    return response.data;
  },

  getDeliveryOrders: async (): Promise<Order[]> => {
    const response = await api.get('/orders/delivery');
    return response.data;
  },

  getCustomerOrders: async (): Promise<Order[]> => {
    const response = await api.get('/orders/customer');
    return response.data;
  },

  assignDeliveryPartner: async (orderId: string, deliveryPartnerId: string): Promise<Order> => {
    const response = await api.patch(`/orders/${orderId}/assign`, { deliveryPartnerId });
    return response.data;
  },

  updateStatus: async (orderId: string, status: Order['status']): Promise<Order> => {
    const response = await api.patch(`/orders/${orderId}/status`, { status });
    return response.data;
  },

  getOrder: async (orderId: string): Promise<Order> => {
    const response = await api.get(`/orders/${orderId}`);
    return response.data;
  },
};

export const location = {
  update: async (data: { latitude: number; longitude: number }): Promise<void> => {
    await api.post('/location/update', data);
  },

  getDeliveryPartnerLocation: async (deliveryPartnerId: string): Promise<User> => {
    const response = await api.get(`/location/${deliveryPartnerId}`);
    return response.data;
  },
}; 