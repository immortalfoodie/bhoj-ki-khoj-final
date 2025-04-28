import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import styles from './MapComponent.module.css';

// Replace with your MapTiler API key
const MAPTILER_API_KEY = 'nBGyxyC6zgNRG9zTuW5B';

// Default coordinates (Mumbai)
const DEFAULT_COORDINATES = {
  latitude: 19.0760,
  longitude: 72.8777
};

// Fix for default marker icon
const defaultIcon = L.icon({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Custom dabbawala motorcycle icon
const dabbawalaIcon = L.icon({
  iconUrl: 'https://png.pngtree.com/png-clipart/20220404/original/pngtree-big-isolated-motorcycle-vector-colorful-icons-set-flat-illustrations-of-various-png-image_7514346.png',
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16]
});

// Custom home icon for delivery address
const homeIcon = L.icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/25/25694.png',
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16]
});

L.Marker.prototype.options.icon = defaultIcon;

interface MapComponentProps {
  initialViewState?: {
    longitude: number;
    latitude: number;
    zoom: number;
  };
  markers?: Array<{
    longitude: number;
    latitude: number;
    title?: string;
    type?: 'restaurant' | 'delivery' | 'dabbawala';
  }>;
  route?: {
    start: [number, number];
    end: [number, number];
    waypoints?: Array<[number, number]>;
  };
  onLoad?: () => void;
}

const MapComponent: React.FC<MapComponentProps> = ({
  initialViewState = {
    longitude: DEFAULT_COORDINATES.longitude,
    latitude: DEFAULT_COORDINATES.latitude,
    zoom: 14
  },
  markers = [],
  route,
  onLoad
}) => {
  const [routePath, setRoutePath] = useState<[number, number][]>([]);

  useEffect(() => {
    if (onLoad) {
      onLoad();
    }
  }, [onLoad]);

  useEffect(() => {
    const fetchRoute = async () => {
      if (!route) return;

      try {
        // Validate coordinates
        const points = [
          route.start,
          ...(route.waypoints || []),
          route.end
        ].filter(point => point && point[0] !== undefined && point[1] !== undefined);

        if (points.length < 2) {
          console.warn('Not enough valid points for routing');
          return;
        }

        // Format coordinates for the API (longitude,latitude)
        const coordinates = points.map(point => `${point[1]},${point[0]}`).join(';');
        
        // Use the correct MapTiler Directions API endpoint
        const url = `https://api.maptiler.com/directions/v2/route?key=${MAPTILER_API_KEY}&geometries=geojson&alternatives=false&language=en&overview=full&steps=true&coordinates=${coordinates}&profile=driving`;

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        if (data.routes && data.routes[0]) {
          // Extract the route coordinates from the response
          const routeCoordinates = data.routes[0].geometry.coordinates.map((coord: number[]) => [coord[1], coord[0]]);
          setRoutePath(routeCoordinates);
        } else {
          // Fallback to straight line if no route found
          setRoutePath([route.start, ...(route.waypoints || []), route.end]);
        }
      } catch (error) {
        console.error('Error fetching route:', error);
        // Fallback to straight line if routing fails
        setRoutePath([route.start, ...(route.waypoints || []), route.end]);
      }
    };

    fetchRoute();
  }, [route]);

  // Function to get the appropriate icon based on marker type
  const getMarkerIcon = (type?: string) => {
    switch (type) {
      case 'dabbawala':
        return dabbawalaIcon;
      case 'delivery':
        return homeIcon;
      default:
        return defaultIcon;
    }
  };

  // Filter out markers with invalid coordinates
  const validMarkers = markers.filter(marker => 
    marker.latitude !== undefined && 
    marker.longitude !== undefined
  );

  return (
    <div className={styles.mapContainer}>
      <MapContainer
        center={[initialViewState.latitude, initialViewState.longitude]}
        zoom={initialViewState.zoom}
        style={{ width: '100%', height: '100%' }}
        scrollWheelZoom={true}
        zoomControl={true}
        attributionControl={true}
        minZoom={16}
        maxZoom={19}
      >
        <TileLayer
          url={`https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=${MAPTILER_API_KEY}`}
          attribution='<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'
          maxZoom={19}
          minZoom={12}
        />
        
        {/* Render markers */}
        {validMarkers.map((marker, index) => (
          <Marker
            key={index}
            position={[marker.latitude, marker.longitude]}
            icon={getMarkerIcon(marker.type)}
          >
            {marker.title && (
              <Popup className={styles.popup}>
                {marker.title}
              </Popup>
            )}
          </Marker>
        ))}

        {/* Render route if provided */}
        {routePath.length > 0 && (
          <Polyline
            positions={routePath}
            color="#10B981"
            weight={3}
            opacity={0.7}
            className={styles.route}
          />
        )}
      </MapContainer>
    </div>
  );
};

export default MapComponent; 