import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const RouteMap = () => {
  type LatLng = [number, number]; // Explicitly define LatLng as a tuple of two numbers

  const deliveries = [
    {
      customerName: 'Vishal Gowda',
      address: 'Goregoan East, Mumbai',
      location: [19.1663 , 72.8526] as LatLng, // Explicitly typing the location as LatLng
    },
    {
      customerName: 'Priya Mehta',
      address: 'Bandra East, Mumbai',
      location: [19.0650, 72.8400] as LatLng, // Explicitly typing the location as LatLng
    },
    {
      customerName: 'Amit Verma',
      address: 'Powai, Mumbai',
      location: [19.1189, 72.9091] as LatLng, // Explicitly typing the location as LatLng
    },
  ];

  // Correctly map deliveries to LatLng[] type
  const deliveryPoints: LatLng[] = deliveries.map(delivery => delivery.location);

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
  }, [deliveryPoints]);

  // Custom icon for the Dabbawala 🚲
  const dabbawalaIcon = new L.Icon({
    iconUrl: 'https://cdni.iconscout.com/illustration/premium/thumb/indian-dabbawala-delivering-tiffin-boxes-on-cycle-illustration-download-in-svg-png-gif-file-formats--food-character-pack-people-illustrations-2210012.png', // A food delivery icon
    iconSize: [50, 50],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Route Map</h1>

      {/* Static Mumbai city map image */}
      <div className="mb-6">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Mumbai_Map.svg/1200px-Mumbai_Map.svg.png"
          alt="Mumbai Route Map"
          className="rounded-lg shadow-md w-full max-h-96 object-cover"
        />
        <p className="text-sm text-gray-500 mt-2">Sample delivery areas in Mumbai</p>
      </div>

      {/* Delivery points list */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <h2 className="text-lg font-semibold mb-4">Delivery Points</h2>
        <ul className="space-y-3">
          {deliveries.map((delivery, index) => (
            <li key={index} className="flex items-center justify-between">
              <span className="font-medium">{delivery.customerName}</span>
              <span className="text-gray-600 text-sm">{delivery.address}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="h-[500px] w-full rounded-lg overflow-hidden shadow-lg">
        <MapContainer center={deliveryPoints[0]} zoom={12} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="© OpenStreetMap contributors"
          />

          {/* Polyline connecting all points */}
          <Polyline positions={deliveryPoints} color="blue" />

          {/* Static markers at each delivery point */}
          {deliveries.map((delivery, index) => (
            <Marker key={index} position={delivery.location}>
              <Popup>{delivery.customerName} - {delivery.address}</Popup>
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

export default RouteMap;
