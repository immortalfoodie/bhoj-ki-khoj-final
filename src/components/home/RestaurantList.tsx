
import React from 'react';
import RestaurantCard, { Restaurant } from './RestaurantCard';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';

interface RestaurantListProps {
  restaurants: Restaurant[];
  onMapViewClick: () => void;
}

const RestaurantList = ({ restaurants, onMapViewClick }: RestaurantListProps) => {
  return (
    <>
      <div className="flex justify-end my-4">
        <Button 
          variant="outline" 
          className="flex items-center gap-2 border-bhoj-primary text-bhoj-primary"
          onClick={onMapViewClick}
        >
          <MapPin className="h-4 w-4" />
          Map View
        </Button>
      </div>
      
      {restaurants.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {restaurants.map(restaurant => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium text-gray-600">No results found</h3>
          <p className="text-gray-500 mt-2">Try changing your search or filters</p>
        </div>
      )}
    </>
  );
};

export default RestaurantList;
