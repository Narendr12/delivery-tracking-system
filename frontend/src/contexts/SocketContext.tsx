'use client';

import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';

interface SocketContextType {
  socket: Socket | null;
  emitLocationUpdate: (data: { orderId: string; latitude: number; longitude: number }) => void;
  trackOrder: (orderId: string) => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export function SocketProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const socket = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000', {
    autoConnect: false,
  });

  useEffect(() => {
    if (user) {
      socket.connect();
    } else {
      socket.disconnect();
    }

    return () => {
      socket.disconnect();
    };
  }, [user]);

  const emitLocationUpdate = (data: { orderId: string; latitude: number; longitude: number }) => {
    if (socket) {
      socket.emit('location-update', data);
    }
  };

  const trackOrder = (orderId: string) => {
    if (socket) {
      socket.emit('track-order', orderId);
    }
  };

  return (
    <SocketContext.Provider value={{ socket, emitLocationUpdate, trackOrder }}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
} 