'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useSocket } from '@/contexts/SocketContext';
import { orders } from '@/services/api';
import { Order } from '@/types';
import Map from '@/components/Map';

export default function DeliveryDashboard() {
  const { user } = useAuth();
  const { emitLocationUpdate } = useSocket();
  const [deliveryOrders, setDeliveryOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [watchId, setWatchId] = useState<number | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await orders.getDeliveryOrders();
      setDeliveryOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const startDelivery = async (orderId: string) => {
    try {
      await orders.updateStatus(orderId, 'in_progress');
      
      // Start tracking location
      if ('geolocation' in navigator) {
        const id = navigator.geolocation.watchPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            emitLocationUpdate({ orderId, latitude, longitude });
          },
          (error) => {
            console.error('Error getting location:', error);
          },
          {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0,
          }
        );
        setWatchId(id);
      }

      fetchOrders();
    } catch (error) {
      console.error('Error starting delivery:', error);
    }
  };

  const completeDelivery = async (orderId: string) => {
    try {
      await orders.updateStatus(orderId, 'delivered');
      
      // Stop tracking location
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
        setWatchId(null);
      }

      fetchOrders();
    } catch (error) {
      console.error('Error completing delivery:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Delivery Dashboard</h1>
      <div className="grid gap-6">
        {deliveryOrders.map((order) => (
          <div
            key={order._id}
            className="bg-white rounded-lg shadow-md p-6 border border-gray-200"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-semibold mb-2">
                  Order #{order._id.slice(-6)}
                </h2>
                <p className="text-gray-600">
                  Status: <span className="font-medium">{order.status}</span>
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="mb-4">
              <Map
                pickupLocation={order.pickupLocation}
                deliveryLocation={order.deliveryLocation}
                currentLocation={order.currentLocation}
              />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <h3 className="font-medium mb-1">Pickup Location</h3>
                <p className="text-gray-600">
                  {order.pickupLocation.latitude}, {order.pickupLocation.longitude}
                </p>
              </div>
              <div>
                <h3 className="font-medium mb-1">Delivery Location</h3>
                <p className="text-gray-600">
                  {order.deliveryLocation.latitude},{' '}
                  {order.deliveryLocation.longitude}
                </p>
              </div>
            </div>

            {order.status === 'assigned' && (
              <button
                onClick={() => startDelivery(order._id)}
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
              >
                Start Delivery
              </button>
            )}

            {order.status === 'in_progress' && (
              <button
                onClick={() => completeDelivery(order._id)}
                className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition-colors"
              >
                Complete Delivery
              </button>
            )}
          </div>
        ))}

        {deliveryOrders.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No orders assigned. New orders will appear here.
          </div>
        )}
      </div>
    </div>
  );
} 