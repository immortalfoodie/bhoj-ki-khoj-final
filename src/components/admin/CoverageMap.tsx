
import React from 'react';
import { MapPin } from 'lucide-react';

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
  return (
    <div className="h-full w-full rounded-lg bg-gray-100 relative p-4">
      <div className="text-center text-green-800 font-medium mb-4">
        Google Maps API integration would display coverage areas here
      </div>
      
      <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {areas.map(area => (
          <div key={area.id} className="bg-white p-3 rounded-md shadow-sm border border-green-100">
            <div className="flex items-center">
              <MapPin className="h-4 w-4 text-green-700 mr-2" />
              <span className="font-medium">{area.name}</span>
            </div>
            <div className="mt-2 flex justify-between">
              <div className="text-xs">
                <div>Restaurants: {area.restaurants}</div>
                <div>Dabbawalas: {area.dabbawalas}</div>
              </div>
              <div className={`text-xs px-2 py-1 rounded ${
                area.coverage === 'High' ? 'bg-green-100 text-green-800' :
                area.coverage === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {area.coverage}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 text-sm text-gray-500 text-center">
        To display the actual map, you'll need to integrate the Google Maps API
      </div>
    </div>
  );
};

export default CoverageMap;
