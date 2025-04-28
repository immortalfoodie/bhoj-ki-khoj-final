import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin } from 'lucide-react';
import L from 'leaflet';

// Fix for default marker icons in Leaflet with Next.js
const icon = L.icon({
  iconUrl: '/marker-icon.png',
  iconRetinaUrl: '/marker-icon-2x.png',
  shadowUrl: '/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

type CoverageArea = {
  id: number;
  name: string;
  coordinates: [number, number];
  restaurants: number;
  dabbawalas: number;
  coverage: 'High' | 'Medium' | 'Low';
};

interface CoverageMapProps {
  areas: CoverageArea[];
}

const CoverageMap = ({ areas = [] }: CoverageMapProps) => {
  // Default center to Mumbai
  const defaultCenter: [number, number] = [19.0760, 72.8777];
  const defaultZoom = 11;

  return (
    <div className="h-[300px] sm:h-[400px] md:h-[500px] w-full rounded-lg overflow-hidden border border-gray-200">
      <MapContainer 
        center={defaultCenter} 
        zoom={defaultZoom} 
        style={{ height: '100%', width: '100%' }}
        zoomControl={false} // Disable default zoom control
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {areas.map((area) => (
          <Marker 
            key={area.id} 
            position={area.coordinates}
            icon={icon}
          >
            <Popup className="text-xs sm:text-sm">
              <div className="p-1 sm:p-2">
                <h3 className="font-medium text-green-800 text-sm sm:text-base">{area.name}</h3>
                <div className="mt-1 sm:mt-2 space-y-0.5">
                  <p>Restaurants: {area.restaurants}</p>
                  <p>Dabbawalas: {area.dabbawalas}</p>
                  <p className={`mt-1 px-2 py-0.5 rounded inline-block text-xs ${
                    area.coverage === 'High' ? 'bg-green-100 text-green-800' :
                    area.coverage === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {area.coverage} Coverage
                  </p>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default CoverageMap;
