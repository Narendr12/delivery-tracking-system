'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useSocket } from '@/contexts/SocketContext';
import { orders } from '@/services/api';
import { Order } from '@/types';
import Map from '@/components/Map';

export default function TrackOrder() {
  const params = useParams();
  const { socket, trackOrder } = useSocket();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
    if (params.orderId) {
      trackOrder(params.orderId as string);
    }
  }, [params.orderId]);

  useEffect(() => {
    if (socket) {
      socket.on('location-updated', (data) => {
        setOrder((prevOrder) => {
          if (!prevOrder) return null;
          return {
            ...prevOrder,
            currentLocation: {
              latitude: data.latitude,
              longitude: data.longitude,
              timestamp: new Date()
            }
          };
        });
      });

      return () => {
        socket.off('location-updated');
      };
    }
  }, [socket]);

  const fetchOrder = async () => {
    try {
      if (!params.orderId) return;
      const data = await orders.getOrder(params.orderId as string);
      setOrder(data);
    } catch (error) {
      console.error('Error fetching order:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Order Not Found</h1>
          <p className="text-gray-600">
            The order you are looking for does not exist or you do not have permission to view it.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-2xl font-bold mb-2">
                Tracking Order #{order._id.slice(-6)}
              </h1>
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

          <div className="mb-6">
            <Map
              pickupLocation={order.pickupLocation}
              deliveryLocation={order.deliveryLocation}
              currentLocation={order.currentLocation}
              className="h-[400px] w-full rounded-lg"
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-semibold mb-2">Pickup Location</h2>
              <p className="text-gray-600">
                Latitude: {order.pickupLocation.latitude}
                <br />
                Longitude: {order.pickupLocation.longitude}
              </p>
            </div>
            <div>
              <h2 className="text-lg font-semibold mb-2">Delivery Location</h2>
              <p className="text-gray-600">
                Latitude: {order.deliveryLocation.latitude}
                <br />
                Longitude: {order.deliveryLocation.longitude}
              </p>
            </div>
          </div>

          {order.currentLocation && (
            <div className="mt-6">
              <h2 className="text-lg font-semibold mb-2">Current Location</h2>
              <p className="text-gray-600">
                Latitude: {order.currentLocation.latitude}
                <br />
                Longitude: {order.currentLocation.longitude}
                <br />
                Last Updated:{' '}
                {new Date(order.currentLocation.timestamp).toLocaleTimeString()}
              </p>
            </div>
          )}

          <div className="mt-6 pt-6 border-t border-gray-200">
            <h2 className="text-lg font-semibold mb-2">Delivery Partner</h2>
            {typeof order.deliveryPartnerId === 'object' ? (
              <p className="text-gray-600">{order.deliveryPartnerId.name}</p>
            ) : (
              <p className="text-gray-600">Not yet assigned</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 