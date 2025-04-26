import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Star, Clock, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

export type Restaurant = {
  id: string;
  name: string;
  rating: number;
  rating_count: number;
  category: string[];
  cuisines: string[];
  delivery_time: string;
  distance: string;
  image_url: string;
  is_new: boolean;
  is_popular: boolean;
  description?: string; // Add description as optional property
};

interface RestaurantCardProps {
  restaurant: Restaurant;
}

const RestaurantCard = ({ restaurant }: RestaurantCardProps) => {
  return (
    <Link to={`/restaurant/${restaurant.id}`}>
      <motion.div
        whileHover={{ 
          scale: 1.05,
          y: -10,
          transition: { 
            type: "spring",
            stiffness: 400,
            damping: 15
          }
        }}
        className="transform-gpu"
      >
        <Card className="overflow-hidden shadow-md">
          <div className="relative h-48">
            <img 
              src={restaurant.image_url} 
              alt={restaurant.name}
              className="w-full h-full object-cover"
            />
            {restaurant.is_new && (
              <Badge className="absolute top-2 right-2 bg-bhoj-secondary text-black">
                NEW
              </Badge>
            )}
            {restaurant.category.includes("veg") && (
              <Badge className="absolute top-2 left-2 bg-green-500 text-white">
                VEG
              </Badge>
            )}
          </div>
          <CardContent className="pt-4">
            <div className="flex justify-between items-start">
              <h3 className="font-bold text-lg line-clamp-1">{restaurant.name}</h3>
              <div className="flex items-center bg-green-50 px-2 py-1 rounded text-sm">
                <Star className="h-3 w-3 text-bhoj-secondary fill-bhoj-secondary mr-1" />
                <span className="font-medium">{restaurant.rating}</span>
                <span className="text-gray-500 text-xs ml-1">({restaurant.rating_count})</span>
              </div>
            </div>
            <p className="text-gray-500 text-sm mt-1">
              {restaurant.cuisines.join(", ")}
            </p>
          </CardContent>
          <CardFooter className="pt-0 flex justify-between text-sm text-gray-500">
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              {restaurant.delivery_time}
            </div>
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-1" />
              {restaurant.distance}
            </div>
            <div className="flex items-center text-bhoj-primary">
              View Menu
              <ChevronRight className="h-4 w-4" />
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </Link>
  );
};

export default RestaurantCard;
