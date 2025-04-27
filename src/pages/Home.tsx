
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import SearchBar from '@/components/home/SearchBar';
import CategoryTabs from '@/components/home/CategoryTabs';
import RestaurantList from '@/components/home/RestaurantList';
import { Restaurant } from '@/components/home/RestaurantCard';

const Home = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("popular");
  const [searchQuery, setSearchQuery] = useState("");
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRestaurants = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('restaurants')
          .select('*');

        if (error) throw error;
        setRestaurants(data || []);
      } catch (error) {
        console.error('Error fetching restaurants:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  // Filter restaurants based on active tab and search query
  const filteredRestaurants = restaurants.filter(restaurant => {
    // Filter by category
    if (activeTab === "popular" && !restaurant.is_popular) return false;
    if (activeTab === "new" && !restaurant.is_new) return false;
    if (activeTab === "veg" && !restaurant.category.includes("veg")) return false;
    if (activeTab === "non-veg" && !restaurant.category.includes("non-veg")) return false;
    if (activeTab === "tiffin" && !restaurant.category.includes("tiffin")) return false;
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        restaurant.name.toLowerCase().includes(query) ||
        restaurant.cuisines.some(cuisine => cuisine.toLowerCase().includes(query))
      );
    }
    
    return true;
  });

  const handleMapViewClick = () => {
    // Map view functionality will be implemented in future
    console.log('Map view clicked');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading restaurants...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Greeting and Search Section */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Hello, {user?.name || 'Guest'}! <span className="text-bhoj-primary">What's on your plate today?</span>
        </h1>
        
        <SearchBar 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      </div>
      
      {/* Category Tabs */}
      <CategoryTabs 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        restaurantCount={filteredRestaurants.length}
      />

      {/* Restaurant List */}
      <RestaurantList 
        restaurants={filteredRestaurants}
        onMapViewClick={handleMapViewClick}
      />
    </div>
  );
};

export default Home;
