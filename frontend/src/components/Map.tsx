'use client';

import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Location } from '@/types';

interface MapProps {
  deliveryLocation: Location;
  pickupLocation: Location;
  currentLocation?: Location;
  className?: string;
}

const Map = ({ deliveryLocation, pickupLocation, currentLocation, className = 'h-[400px]' }: MapProps) => {
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{
    delivery?: L.Marker;
    pickup?: L.Marker;
    current?: L.Marker;
  }>({});

  useEffect(() => {
    // Initialize map
    if (!mapRef.current) {
      mapRef.current = L.map('map').setView(
        [deliveryLocation.latitude, deliveryLocation.longitude],
        13
      );

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapRef.current);

      // Custom icons
      const deliveryIcon = L.icon({
        iconUrl: '/marker-delivery.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
      });

      const pickupIcon = L.icon({
        iconUrl: '/marker-pickup.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
      });

      const currentIcon = L.icon({
        iconUrl: '/marker-current.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
      });

      // Add markers
      markersRef.current.delivery = L.marker(
        [deliveryLocation.latitude, deliveryLocation.longitude],
        { icon: deliveryIcon }
      ).addTo(mapRef.current);

      markersRef.current.pickup = L.marker(
        [pickupLocation.latitude, pickupLocation.longitude],
        { icon: pickupIcon }
      ).addTo(mapRef.current);

      if (currentLocation) {
        markersRef.current.current = L.marker(
          [currentLocation.latitude, currentLocation.longitude],
          { icon: currentIcon }
        ).addTo(mapRef.current);
      }

      // Fit bounds to show all markers
      const bounds = L.latLngBounds([
        [deliveryLocation.latitude, deliveryLocation.longitude],
        [pickupLocation.latitude, pickupLocation.longitude],
      ]);
      if (currentLocation) {
        bounds.extend([currentLocation.latitude, currentLocation.longitude]);
      }
      mapRef.current.fitBounds(bounds);
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Update current location marker
  useEffect(() => {
    if (mapRef.current && currentLocation) {
      if (markersRef.current.current) {
        markersRef.current.current.setLatLng([
          currentLocation.latitude,
          currentLocation.longitude,
        ]);
      } else {
        const currentIcon = L.icon({
          iconUrl: '/marker-current.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
        });

        markersRef.current.current = L.marker(
          [currentLocation.latitude, currentLocation.longitude],
          { icon: currentIcon }
        ).addTo(mapRef.current);
      }
    }
  }, [currentLocation]);

  return <div id="map" className={className} />;
};

export default Map; 