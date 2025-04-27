import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const Navigation = () => {
  type LatLng = [number, number];

  const deliveryPoints: LatLng[] = [
    [19.0544, 72.8295], // Maharaja Thali House - Bandra West
    [19.1197, 72.8468], // Rahul Sharma - Andheri West
    [19.0650, 72.8400], // Priya Mehta - Bandra East
    [19.1189, 72.9091], // Amit Verma - Powai
  ];

  const [currentPosition, setCurrentPosition] = useState<LatLng>(deliveryPoints[0]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % deliveryPoints.length;
        setCurrentPosition(deliveryPoints[nextIndex]);
        return nextIndex;
      });
    }, 5000); // Move every 5 seconds

    return () => clearInterval(interval);
  }, []);

  // Custom icon for the Dabbawala 🚲
  const dabbawalaIcon = new L.Icon({
    iconUrl: 'https://cdni.iconscout.com/illustration/premium/thumb/indian-dabbawala-delivering-tiffin-boxes-on-cycle-illustration-download-in-svg-png-gif-file-formats--food-character-pack-people-illustrations-2210012.png', // A food delivery icon
    iconSize: [50, 50],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Navigation</h1>
      <div className="h-[500px] w-full rounded-lg overflow-hidden shadow-lg">
        <MapContainer center={deliveryPoints[0]} zoom={12} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="© OpenStreetMap contributors"
          />

          {/* Polyline connecting all points */}
          <Polyline positions={deliveryPoints} color="blue" />

          {/* Static markers at each delivery point */}
          {deliveryPoints.map((position, index) => (
            <Marker key={index} position={position}>
              <Popup>Delivery Point {index + 1}</Popup>
            </Marker>
          ))}

          {/* Moving Dabbawala marker */}
          <Marker position={currentPosition} icon={dabbawalaIcon}>
            <Popup>Dabbawala is here!</Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
};

export default Navigation;
