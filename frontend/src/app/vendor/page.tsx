'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { orders } from '@/services/api';
import { Order } from '@/types';

export default function VendorDashboard() {
  const { user } = useAuth();
  const [vendorOrders, setVendorOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await orders.getVendorOrders();
      setVendorOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignDeliveryPartner = async (orderId: string, deliveryPartnerId: string) => {
    try {
      await orders.assignDeliveryPartner(orderId, deliveryPartnerId);
      fetchOrders();
    } catch (error) {
      console.error('Error assigning delivery partner:', error);
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
      <h1 className="text-3xl font-bold mb-8">Vendor Dashboard</h1>
      <div className="grid gap-6">
        {vendorOrders.map((order) => (
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

            {order.status === 'pending' && (
              <div className="mt-4">
                <h3 className="font-medium mb-2">Assign Delivery Partner</h3>
                <div className="flex gap-2">
                  <select
                    className="flex-1 rounded-md border border-gray-300 px-3 py-2"
                    onChange={(e) =>
                      handleAssignDeliveryPartner(order._id, e.target.value)
                    }
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Select a delivery partner
                    </option>
                    {/* Add available delivery partners here */}
                  </select>
                </div>
              </div>
            )}

            {order.deliveryPartnerId && (
              <div className="mt-4">
                <h3 className="font-medium mb-1">Delivery Partner</h3>
                <p className="text-gray-600">
                  {typeof order.deliveryPartnerId === 'object'
                    ? order.deliveryPartnerId.name
                    : 'Loading...'}
                </p>
              </div>
            )}
          </div>
        ))}

        {vendorOrders.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No orders found. New orders will appear here.
          </div>
        )}
      </div>
    </div>
  );
} 