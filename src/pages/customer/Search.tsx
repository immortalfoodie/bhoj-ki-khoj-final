
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search as SearchIcon, Filter, MapPin } from 'lucide-react';

// Update Restaurant interface to include optional description
interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  location: string;
  rating: number;
  imageUrl?: string;
  description?: string;
}

const mockRestaurants: Restaurant[] = [
  {
    id: "1",
    name: "Mama's Kitchen",
    cuisine: "North Indian",
    location: "Andheri West",
    rating: 4.5,
    imageUrl: "https://content3.jdmagicbox.com/comp/def_content_category/moms-kitchen/gallery-3-moms-kitchen-19-f0hcg.jpg",
    description: "Homely North Indian dishes made with love and tradition."
  },
  {
    id: "2",
    name: "Gujarati Tiffin Service",
    cuisine: "Gujarati",
    location: "Borivali",
    rating: 4.2,
    imageUrl: "https://dynamic.tourtravelworld.com/blog_images/14-gujarati-dishes-that-you-must-try-when-you-visit-gujarat-20170927121204.jpg",
    description: "Authentic Gujarati thalis delivered fresh daily."
  },
  {
    id: "3",
    name: "Punjabi Dhaba",
    cuisine: "Punjabi",
    location: "Bandra",
    rating: 4.7,
    imageUrl: "https://content.jdmagicbox.com/v2/comp/mumbai/l5/022pxx22.xx22.200127191824.b5l5/catalogue/real-punjabi-dhaba-mumbai-restaurants-1zki5s09cy.jpg",
    description: "Rich and flavorful Punjabi cuisine with a homemade touch."
  },
  {
    id: "4",
    name: "South Indian Delight",
    cuisine: "South Indian",
    location: "Chembur",
    rating: 4.3,
    imageUrl: "https://sukhis.com/app/uploads/2022/04/image3-4.jpg",
    description: "Traditional South Indian dishes prepared with authentic spices."
  }
];

const Search = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>(mockRestaurants);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm) {
      setFilteredRestaurants(mockRestaurants);
      return;
    }

    const filtered = mockRestaurants.filter(restaurant => 
      restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      restaurant.cuisine.toLowerCase().includes(searchTerm.toLowerCase()) ||
      restaurant.location.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    setFilteredRestaurants(filtered);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Find Homemade Food</h1>
      
      <form onSubmit={handleSearch} className="mb-6">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <Input
            placeholder="Search by name, cuisine, or location..."
            className="pl-10 pr-4 py-2"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button type="submit" className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-green-600 hover:bg-green-700 h-8 px-3">
            Search
          </Button>
        </div>
      </form>
      
      <Tabs defaultValue="all" className="w-full mb-6">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="north">North Indian</TabsTrigger>
          <TabsTrigger value="south">South Indian</TabsTrigger>
          <TabsTrigger value="gujarati">Gujarati</TabsTrigger>
        </TabsList>
      </Tabs>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRestaurants.length > 0 ? (
          filteredRestaurants.map(restaurant => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))
        ) : (
          <div className="col-span-full text-center py-8">
            <p className="text-gray-500">No restaurants found. Try a different search term.</p>
          </div>
        )}
      </div>
    </div>
  );
};

interface RestaurantCardProps {
  restaurant: Restaurant;
}

const RestaurantCard = ({ restaurant }: RestaurantCardProps) => {
  return (
    <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="h-40 bg-gray-200">
        <img
          src={restaurant.imageUrl || '/placeholder.svg'}
          alt={restaurant.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-lg">{restaurant.name}</h3>
          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
            ★ {restaurant.rating}
          </span>
        </div>
        <p className="text-sm text-gray-600 mt-1">{restaurant.cuisine}</p>
        <div className="flex items-center text-gray-500 mt-2 text-sm">
          <MapPin size={14} className="mr-1" />
          {restaurant.location}
        </div>
        {restaurant.description && (
          <p className="text-sm mt-2 text-gray-700 line-clamp-2">{restaurant.description}</p>
        )}
        <Button
          variant="outline"
          className="w-full mt-3 border-green-600 text-green-600 hover:bg-green-50"
          onClick={() => {/* Navigate to restaurant detail */}}
        >
          View Menu
        </Button>
      </div>
    </div>
  );
};

export default Search;
