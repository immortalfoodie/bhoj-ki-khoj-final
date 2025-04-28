
import { useState } from "react";
import BannerCarousel from "@/components/customer/BannerCarousel";
import CategoryFilter from "@/components/customer/CategoryFilter";
import RestaurantCard from "@/components/customer/RestaurantCard";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

// Sample restaurant data
const restaurants = [
  {
    id: "1",
    name: "Maharaja Thali House",
    image: "https://images.unsplash.com/photo-1680993032090-1ef7ea9b51e5?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    cuisine: ["North Indian", "Thali"],
    rating: 4.5,
    distance: "1.2 km",
    estimatedTime: "25-30 min",
    categories: ["all", "veg", "thali"]
  },
  {
    id: "2",
    name: "Mumbai Tiffin Service",
    image: "https://images.unsplash.com/photo-1567337710282-00832b415979?auto=format&q=75&fit=crop&w=600",
    cuisine: ["Maharashtra", "Home Style"],
    rating: 4.2,
    distance: "0.8 km",
    estimatedTime: "15-20 min",
    categories: ["all", "veg", "non-veg"]
  },
  {
    id: "3",
    name: "Vada Pav Corner",
    image: "https://images.pexels.com/photos/17433337/pexels-photo-17433337/free-photo-of-roll-with-fried-meat-and-green-chili.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    cuisine: ["Street Food", "Snacks"],
    rating: 4.7,
    distance: "0.5 km",
    estimatedTime: "10-15 min",
    categories: ["all", "veg", "snacks"]
  },
  {
    id: "4",
    name: "Punjabi Dhaba",
    image: "https://www.shoutlo.com/uploads/articles/header-img-punjabi-delicacies.jpg",
    cuisine: ["North Indian", "Curry"],
    rating: 4.0,
    distance: "1.5 km",
    estimatedTime: "30-40 min",
    categories: ["all", "non-veg"]
  },
];

const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  
  const filteredRestaurants = restaurants.filter((restaurant) => {
    const matchesSearch = restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      restaurant.cuisine.some(c => c.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = restaurant.categories.includes(selectedCategory);
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="container mx-auto max-w-5xl px-4 pb-20 md:pb-8">
      <div className="sticky top-0 pt-4 pb-2 bg-white z-10">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <Input
            type="search"
            placeholder="Search for restaurants, cuisines..."
            className="pl-10 py-2 md:py-1.5 border-gray-200 rounded-full bg-gray-50 focus-visible:ring-bhoj-primary"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <CategoryFilter onSelectCategory={setSelectedCategory} />
      </div>
      
      <div className="mt-4 mb-6">
        <BannerCarousel />
      </div>
      
      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-800">Popular Restaurants</h2>
        <p className="text-gray-500 text-sm">Discover the best food & drinks near you</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRestaurants.map((restaurant) => (
          <RestaurantCard
            key={restaurant.id}
            id={restaurant.id}
            name={restaurant.name}
            image={restaurant.image}
            cuisine={restaurant.cuisine}
            rating={restaurant.rating}
            distance={restaurant.distance}
            estimatedTime={restaurant.estimatedTime}
          />
        ))}
        
        {filteredRestaurants.length === 0 && (
          <div className="col-span-full text-center py-8">
            <p className="text-gray-500">No restaurants found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
