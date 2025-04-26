import React, { useState, lazy, Suspense } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  ArrowLeft, Star, Clock, MapPin, Search, Plus, 
  Info, Heart, Share, ShoppingCart, Phone
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { restaurantsData } from '@/data/restaurants';
import NotFound from './NotFound';

// Lazy load the MapComponent
const MapComponent = lazy(() => import('@/components/MapComponent'));

const RestaurantDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart, getCartItemCount } = useCart();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [vegOnly, setVegOnly] = useState(false);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Get restaurant data based on ID
  const restaurant = restaurantsData[id || ""];
  
  // If restaurant not found, show 404
  if (!restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">404</h1>
          <p className="text-xl text-gray-600 mb-4">Restaurant not found</p>
          <Link to="/" className="text-blue-500 hover:text-blue-700 underline">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }
  
  const cartCount = getCartItemCount();
  
  // Get all menu items from all categories
  const allMenuItems = Object.values(restaurant.menu).flat();
  
  // Filter menu items based on search, tab, and veg filter
  const filteredMenu = allMenuItems.filter(item => {
    if (vegOnly && !item.isVeg) return false;
    
    if (activeTab === "popular" && !item.isPopular) return false;
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        item.name.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query)
      );
    }
    
    return true;
  });
  
  // Group filtered items by category
  const groupedMenu = filteredMenu.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as { [key: string]: typeof filteredMenu });
  
  const handleAddToCart = (item: any) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      restaurantId: parseInt(restaurant.id),
      restaurantName: restaurant.name,
      quantity: 1
    });
    
    toast({
      title: "Added to cart",
      description: `${item.name} added to your cart`,
    });
  };

  // Handle map load error
  const handleMapError = (error: string) => {
    setError(error);
    console.error('Map error:', error);
  };

  return (
    <div className="pb-20">
      {/* Banner Image */}
      <div className="relative h-48 lg:h-64 overflow-hidden">
        <img 
          src={restaurant.bannerImage} 
          alt={restaurant.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <Link 
          to="/" 
          className="absolute top-4 left-4 bg-white rounded-full p-2 shadow-md"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="absolute bottom-4 left-4 right-4 text-white">
          <h1 className="text-2xl font-bold">{restaurant.name}</h1>
          <div className="flex items-center mt-1 space-x-4 text-sm">
            <span className="flex items-center">
              <Star className="h-4 w-4 text-bhoj-secondary fill-bhoj-secondary mr-1" />
              <span className="font-medium">{restaurant.rating}</span>
              <span className="text-gray-200 ml-1">({restaurant.ratingCount})</span>
            </span>
            <span className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              {restaurant.deliveryTime}
            </span>
            <span className="flex items-center">
              <MapPin className="h-4 w-4 mr-1" />
              {restaurant.distance}
            </span>
          </div>
        </div>
      </div>
      
      {/* Map Section */}
      <div className="container mx-auto px-4 py-4">
        <div className="rounded-lg overflow-hidden shadow-sm border border-gray-100">
          <Suspense fallback={
            <div className="w-full h-[300px] bg-gray-100 flex items-center justify-center">
              <p className="text-gray-500">Loading map...</p>
            </div>
          }>
            <div className="relative">
              {error ? (
                <div className="w-full h-[300px] bg-gray-100 flex items-center justify-center">
                  <p className="text-red-500">{error}</p>
                </div>
              ) : (
                <MapComponent
                  initialViewState={{
                    longitude: restaurant.coordinates.longitude,
                    latitude: restaurant.coordinates.latitude,
                    zoom: 14
                  }}
                  markers={[
                    {
                      longitude: restaurant.coordinates.longitude,
                      latitude: restaurant.coordinates.latitude,
                      title: restaurant.name
                    }
                  ]}
                  onLoad={() => setIsMapLoaded(true)}
                />
              )}
            </div>
          </Suspense>
        </div>
      </div>
      
      {/* Restaurant Info */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-wrap justify-between items-center">
          <div>
            <div className="flex flex-wrap gap-2 mb-2">
              {restaurant.cuisines.map((cuisine, index) => (
                <Badge key={index} variant="outline" className="rounded-full">
                  {cuisine}
                </Badge>
              ))}
              {restaurant.isVeg && (
                <Badge className="bg-green-500 text-white rounded-full">
                  Pure Veg
                </Badge>
              )}
            </div>
            <p className="text-sm text-gray-600">{restaurant.address}</p>
            {restaurant.phone && (
              <p className="text-sm text-gray-600 flex items-center gap-1">
                <Phone className="h-4 w-4" />
                {restaurant.phone}
              </p>
            )}
            <p className="text-sm text-gray-600">₹{restaurant.costForTwo} for two • {restaurant.operatingHours}</p>
          </div>
          
          <div className="flex space-x-2 mt-2 sm:mt-0">
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Info className="h-4 w-4" />
              <span className="hidden sm:inline">Info</span>
            </Button>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Heart className="h-4 w-4" />
              <span className="hidden sm:inline">Save</span>
            </Button>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Share className="h-4 w-4" />
              <span className="hidden sm:inline">Share</span>
            </Button>
          </div>
        </div>
        
        <div className="border-t border-b py-4 my-4">
          <p className="text-sm text-gray-600">{restaurant.description}</p>
        </div>
      </div>
      
      {/* Menu Section */}
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Menu</h2>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="veg-only" 
                checked={vegOnly} 
                onCheckedChange={() => setVegOnly(!vegOnly)}
              />
              <label htmlFor="veg-only" className="text-sm font-medium cursor-pointer">
                Veg Only
              </label>
            </div>
          </div>
        </div>
        
        {/* Search Bar */}
        <div className="relative mb-4">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <Input
            type="text"
            placeholder="Search menu items..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        {/* Category Tabs */}
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-gray-100 p-1 mb-6">
            <TabsTrigger 
              value="all" 
              className="data-[state=active]:bg-bhoj-primary data-[state=active]:text-white"
            >
              All
            </TabsTrigger>
            <TabsTrigger 
              value="popular" 
              className="data-[state=active]:bg-bhoj-primary data-[state=active]:text-white"
            >
              Popular
            </TabsTrigger>
          </TabsList>
          
          {/* Menu Items */}
          <div className="space-y-6">
            {Object.entries(groupedMenu).map(([category, items]) => (
              <div key={category}>
                <h3 className="text-lg font-semibold mb-3">{category}</h3>
                <div className="grid gap-4">
                  {items.map((item) => (
                    <Card key={item.id} className="overflow-hidden">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium">{item.name}</h4>
                              {item.isPopular && (
                                <Badge variant="secondary" className="text-xs">
                                  Popular
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant="outline" className="text-xs">
                                {item.spiceLevel} Spice
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {item.portionSize}
                              </Badge>
                              {item.isVeg ? (
                                <Badge className="bg-green-500 text-white text-xs">
                                  Veg
                                </Badge>
                              ) : (
                                <Badge className="bg-red-500 text-white text-xs">
                                  Non-Veg
                                </Badge>
                              )}
                            </div>
                            {item.specialIngredients && (
                              <p className="text-xs text-gray-500 mt-2">
                                {item.specialIngredients}
                              </p>
                            )}
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <span className="font-medium">₹{item.price}</span>
                            <Button
                              size="sm"
                              className="flex items-center gap-1"
                              onClick={() => handleAddToCart(item)}
                            >
                              <Plus className="h-4 w-4" />
                              Add
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Tabs>
      </div>
      
      {/* Cart Button */}
      {cartCount > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
          <div className="container mx-auto max-w-5xl">
            <Button className="w-full">
              <ShoppingCart className="h-4 w-4 mr-2" />
              View Cart ({cartCount} items)
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RestaurantDetail;
