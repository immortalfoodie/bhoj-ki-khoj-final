import { Star } from "lucide-react";
import { Link } from "react-router-dom";

interface RestaurantCardProps {
  id: string;
  name: string;
  image: string;
  cuisine: string[];
  rating: number;
  distance: string;
  estimatedTime: string;
}

const RestaurantCard = ({
  id,
  name,
  image,
  cuisine,
  rating,
  distance,
  estimatedTime
}: RestaurantCardProps) => {
  return (
    <Link to={`/restaurant/${id}`} className="block">
      <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        <div className="relative h-44 w-full">
          <img 
            src={image} 
            alt={name} 
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-2 right-2 bg-bhoj-primary text-white text-xs px-2 py-1 rounded-full">
            {estimatedTime}
          </div>
        </div>
        
        <div className="p-3">
          <div className="flex justify-between items-start">
            <h3 className="font-medium text-gray-800 truncate">{name}</h3>
            <div className="flex items-center bg-bhoj-primary/10 text-bhoj-primary px-1.5 py-0.5 rounded text-xs">
              <Star className="w-3 h-3 fill-bhoj-primary mr-0.5" />
              {rating.toFixed(1)}
            </div>
          </div>
          
          <div className="mt-1">
            <p className="text-xs text-gray-500 truncate">{cuisine.join(", ")}</p>
            <p className="text-xs text-gray-400 mt-1">{distance} away</p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default RestaurantCard;
