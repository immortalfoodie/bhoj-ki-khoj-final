import React, { useState, lazy, Suspense, useCallback, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  ArrowLeft, Star, Clock, MapPin, Search, Plus, 
  Info, Heart, Share, ShoppingCart, Phone,
  Loader2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { restaurantsData } from '@/data/restaurants';
import NotFound from './NotFound';
import { useAuth } from '@/context/AuthContext';
import styles from './RestaurantDetail.module.css';

// Lazy load the MapComponent
const MapComponent = lazy(() => import('@/components/MapComponent'));

const RestaurantDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart, getCartItemCount } = useCart();
  const { toast } = useToast();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [vegOnly, setVegOnly] = useState(false);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingToCart, setIsAddingToCart] = useState<number | null>(null);
  const navigate = useNavigate();
  
  // Get restaurant data based on ID
  const restaurant = useMemo(() => restaurantsData[id || ""], [id]);
  
  // If restaurant not found, show 404
  if (!restaurant) {
    return <NotFound />;
  }
  
  const cartCount = getCartItemCount();
  
  // Get all menu items from all categories
  const allMenuItems = useMemo(() => 
    Object.values(restaurant.menu).flat(),
    [restaurant.menu]
  );
  
  // Filter menu items based on search, tab, and veg filter
  const filteredMenu = useMemo(() => 
    allMenuItems.filter(item => {
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
    }),
    [allMenuItems, vegOnly, activeTab, searchQuery]
  );
  
  // Group filtered items by category
  const groupedMenu = useMemo(() => 
    filteredMenu.reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    }, {} as { [key: string]: typeof filteredMenu }),
    [filteredMenu]
  );
  
  const handleAddToCart = useCallback(async (item: any) => {
    try {
      setIsAddingToCart(item.id);
      
      if (!user) {
        toast({
          title: "Please Login",
          description: "You need to be logged in to add items to cart.",
          variant: "destructive"
        });
        navigate('/login', { state: { from: `/restaurant/${id}` } });
        return;
      }

      await addToCart({
        id: item.id,
        name: item.name,
        price: item.price,
        restaurantId: parseInt(restaurant.id),
        restaurantName: restaurant.name,
        quantity: 1,
        restaurantCoordinates: restaurant.coordinates
      });
      
      toast({
        title: "Added to cart",
        description: `${item.name} added to your cart`,
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAddingToCart(null);
    }
  }, [addToCart, restaurant, user, toast, navigate, id]);

  // Handle map load error
  const handleMapError = useCallback((error: string) => {
    setError(error);
    console.error('Map error:', error);
  }, []);

  // Handle image load error
  const handleImageError = useCallback(() => {
    setError('Failed to load restaurant image');
  }, []);

  // Handle initial loading
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-bhoj-primary" />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Banner Image */}
      <div className={styles.bannerContainer}>
        <img 
          src={restaurant.bannerImage} 
          alt={restaurant.name}
          className={styles.bannerImage}
          onError={handleImageError}
        />
        <div className={styles.bannerOverlay}></div>
        <Link 
          to="/" 
          className={styles.backButton}
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className={styles.bannerContent}>
          <h1 className={styles.restaurantName}>{restaurant.name}</h1>
          <div className={styles.restaurantInfo}>
            <span className={styles.ratingContainer}>
              <Star className={styles.ratingIcon} />
              <span className="font-medium">{restaurant.rating}</span>
              <span className={styles.ratingCount}>({restaurant.ratingCount})</span>
            </span>
            <span className={styles.infoContainer}>
              <Clock className={styles.infoIcon} />
              {restaurant.deliveryTime}
            </span>
            <span className={styles.infoContainer}>
              <MapPin className={styles.infoIcon} />
              {restaurant.distance}
            </span>
          </div>
        </div>
      </div>
      
      {/* Map Section */}
      <div className={styles.mapContainer}>
        <div className={styles.mapWrapper}>
          <Suspense fallback={
            <div className={styles.mapLoading}>
              <p className="text-gray-500">Loading map...</p>
            </div>
          }>
            <div className="relative">
              {error ? (
                <div className={styles.mapError}>
                  <p>{error}</p>
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
                      title: restaurant.name,
                      type: "restaurant"
                    }
                  ]}
                  onLoad={() => setIsMapLoaded(true)}
                  onError={handleMapError}
                />
              )}
            </div>
          </Suspense>
        </div>
      </div>
      
      {/* Restaurant Info */}
      <div className="container mx-auto px-4 py-2">
        <div className={styles.infoHeader}>
          <div>
            <div className={styles.cuisineBadges}>
              {restaurant.cuisines.map((cuisine, index) => (
                <Badge key={index} variant="outline" className="rounded-full">
                  {cuisine}
                </Badge>
              ))}
              {restaurant.isVeg && (
                <Badge className={styles.vegBadge}>
                  Pure Veg
                </Badge>
              )}
            </div>
            <p className={styles.address}>{restaurant.address}</p>
            {restaurant.phone && (
              <p className={styles.phone}>
                <Phone className="h-4 w-4" />
                {restaurant.phone}
              </p>
            )}
            <p className={styles.costInfo}>₹{restaurant.costForTwo} for two • {restaurant.operatingHours}</p>
          </div>
          
          <div className={styles.actionButtons}>
            <Button variant="outline" size="sm" className={styles.actionButton}>
              <Info className="h-4 w-4" />
              <span className="hidden sm:inline">Info</span>
            </Button>
            <Button variant="outline" size="sm" className={styles.actionButton}>
              <Heart className="h-4 w-4" />
              <span className="hidden sm:inline">Save</span>
            </Button>
            <Button variant="outline" size="sm" className={styles.actionButton}>
              <Share className="h-4 w-4" />
              <span className="hidden sm:inline">Share</span>
            </Button>
          </div>
        </div>
        
        <div className="border-t border-b py-2 my-2 text-sm text-gray-600">
          <p>{restaurant.description}</p>
        </div>
      </div>
      
      {/* Menu Section */}
      <div className="container mx-auto px-4 mt-4">
        <div className={styles.menuHeader}>
          <h2 className={styles.menuTitle}>Menu</h2>
          
          <div className={styles.filterContainer}>
            <div className={styles.vegFilter}>
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
        <div className="relative mb-6 z-50">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <Input
            type="text"
            placeholder="Search menu items..."
            className="pl-10 w-full bg-white shadow-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        {/* Category Tabs */}
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-gray-100 p-1 mb-4 w-full flex space-x-1">
            <TabsTrigger 
              value="all" 
              className="flex-1 data-[state=active]:bg-bhoj-primary data-[state=active]:text-white"
            >
              All
            </TabsTrigger>
            <TabsTrigger 
              value="popular" 
              className="flex-1 data-[state=active]:bg-bhoj-primary data-[state=active]:text-white"
            >
              Popular
            </TabsTrigger>
          </TabsList>
          
          {/* Menu Items */}
          <div className="space-y-4">
            {Object.entries(groupedMenu).map(([category, items]) => (
              <div key={category} className="relative bg-white">
                <h3 className="text-lg font-semibold px-3 py-2 border-b">{category}</h3>
                <div className="grid gap-3 p-3">
                  {items.map((item) => (
                    <Card key={item.id} className="overflow-hidden">
                      <CardContent className="p-3">
                        <div className="flex justify-between items-start gap-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-0.5">
                              <h4 className="font-medium text-gray-900">{item.name}</h4>
                              {item.isPopular && (
                                <Badge variant="secondary" className="text-xs">
                                  Popular
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mb-1.5">{item.description}</p>
                            <div className="flex flex-wrap gap-1.5">
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
                              <p className="text-xs text-gray-500 mt-1">
                                {item.specialIngredients}
                              </p>
                            )}
                          </div>
                          <div className="flex flex-col items-end gap-1.5">
                            <span className="font-medium text-gray-900">₹{item.price}</span>
                            <Button
                              size="sm"
                              className="flex items-center gap-1"
                              onClick={() => handleAddToCart(item)}
                              disabled={isAddingToCart === item.id}
                            >
                              {isAddingToCart === item.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Plus className="h-4 w-4" />
                              )}
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
        <div className={styles.cartButton}>
          <Button 
            className={styles.cartButton}
            onClick={() => navigate('/checkout')}
          >
            <ShoppingCart className={styles.cartIcon} />
            View Cart ({cartCount} items)
          </Button>
        </div>
      )}
    </div>
  );
};

export default RestaurantDetail;
