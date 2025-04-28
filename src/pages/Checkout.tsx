import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { ArrowLeft, Plus, Minus, Bike, ShoppingBag, UtensilsCrossed, CreditCard, Wallet, BanknoteIcon } from 'lucide-react';
import GooglePayPayment from '@/components/Payment/GooglePayPayment';
import MapComponent from '@/components/MapComponent';
import styles from './Checkout.module.css';

// MapTiler API key
const MAPTILER_API_KEY = 'nBGyxyC6zgNRG9zTuW5B';

const deliveryOptions = [
  { id: 'dabbawala', name: 'Dabbawala Delivery', icon: <Bike className="h-5 w-5" />, description: 'Delivered by our trusted dabbawala network' },
  { id: 'takeaway', name: 'Takeaway', icon: <ShoppingBag className="h-5 w-5" />, description: 'Pickup from the restaurant' },
  { id: 'dine-in', name: 'Dine-In', icon: <UtensilsCrossed className="h-5 w-5" />, description: 'Book a table at the restaurant' }
];

const paymentOptions = [
  { id: 'card', name: 'Credit/Debit Card', icon: <CreditCard className="h-5 w-5" /> },
  { id: 'upi', name: 'UPI', icon: <Wallet className="h-5 w-5" /> },
  { id: 'cod', name: 'Cash on Delivery', icon: <BanknoteIcon className="h-5 w-5" /> }
];

const Checkout = () => {
  const { items, updateQuantity, removeFromCart, clearCart, getCartTotal } = useCart();
  const { user, profile, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [deliveryCoordinates, setDeliveryCoordinates] = useState<[number, number] | null>(null);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userData, setUserData] = useState<{ user: any; profile: any } | null>(null);
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  
  const form = useForm({
    defaultValues: {
      deliveryOption: 'dabbawala',
      paymentMethod: 'card',
      address: '',
      notes: ''
    }
  });
  
  // Get restaurant coordinates from the first item in cart
  const restaurantCoordinates = items[0]?.restaurantCoordinates || {
    latitude: 19.0760,
    longitude: 72.8777
  };

  // Scroll to top and lock scroll when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.style.overflow = 'hidden';
    
    // Cleanup function to restore scroll when component unmounts
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  // Effect to sync user data
  useEffect(() => {
    if (user && profile) {
      setUserData({ user, profile });
      console.log('User data synced:', { user, profile });
    }
  }, [user, profile]);

  // Effect to check authentication on mount
  useEffect(() => {
    if (!isAuthenticated) {
      console.log('User not authenticated, redirecting to login');
      navigate('/login', { state: { from: '/checkout' } });
    }
  }, [isAuthenticated, navigate]);

  // Function to get user's current location
  const getUserLocation = () => {
    setIsFetchingLocation(true);
    if ("geolocation" in navigator) {
      // First fetch
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          try {
            // Get address from MapTiler
            const response = await fetch(
              `https://api.maptiler.com/geocoding/${longitude},${latitude}.json?key=${MAPTILER_API_KEY}`
            );
            const data = await response.json();
            
            if (data.features && data.features.length > 0) {
              const address = data.features[0].place_name;
              form.setValue('address', address);
              setDeliveryCoordinates([latitude, longitude]);
            }

            // Second fetch (same high accuracy)
            navigator.geolocation.getCurrentPosition(
              async (position) => {
                const { latitude, longitude } = position.coords;
                
                try {
                  // Get address from MapTiler
                  const response = await fetch(
                    `https://api.maptiler.com/geocoding/${longitude},${latitude}.json?key=${MAPTILER_API_KEY}`
                  );
                  const data = await response.json();
                  
                  if (data.features && data.features.length > 0) {
                    const address = data.features[0].place_name;
                    form.setValue('address', address);
                    setDeliveryCoordinates([latitude, longitude]);
                    // Only show success toast after second fetch
                    toast({
                      title: "Location Found",
                      description: "Your delivery address has been set to your current location.",
                    });
                  }
                } catch (error) {
                  console.error("Error getting address:", error);
                  toast({
                    title: "Error",
                    description: "Could not get your address. Please enter it manually.",
                    variant: "destructive"
                  });
                } finally {
                  setIsFetchingLocation(false);
                }
              },
              (error) => {
                console.error("Geolocation error:", error);
                toast({
                  title: "Location Error",
                  description: "Please enable location access in your browser settings.",
                  variant: "destructive"
                });
                setIsFetchingLocation(false);
              },
              {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
              }
            );
          } catch (error) {
            console.error("Error getting address:", error);
            toast({
              title: "Error",
              description: "Could not get your address. Please enter it manually.",
              variant: "destructive"
            });
            setIsFetchingLocation(false);
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
          toast({
            title: "Location Error",
            description: "Please enable location access in your browser settings.",
            variant: "destructive"
          });
          setIsFetchingLocation(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    } else {
      toast({
        title: "Location Not Available",
        description: "Your browser doesn't support geolocation. Please enter your address manually.",
        variant: "destructive"
      });
      setIsFetchingLocation(false);
    }
  };

  // Function to geocode the delivery address
  const geocodeAddress = async (address: string) => {
    try {
      setIsGeocoding(true);
      setError(null);
      const response = await fetch(
        `https://api.maptiler.com/geocoding/${encodeURIComponent(address)}.json?key=${MAPTILER_API_KEY}`
      );
      const data = await response.json();
      
      if (data.features && data.features.length > 0) {
        const [longitude, latitude] = data.features[0].center;
        setDeliveryCoordinates([latitude, longitude]);
        return [latitude, longitude];
      }
      setError('Could not find the address. Please check and try again.');
      return null;
    } catch (error) {
      console.error('Error geocoding address:', error);
      setError('Error finding address. Please try again.');
      return null;
    } finally {
      setIsGeocoding(false);
    }
  };

  // Watch for address changes
  useEffect(() => {
    const address = form.watch('address');
    if (address && form.watch('deliveryOption') === 'dabbawala') {
      const timeoutId = setTimeout(() => {
        geocodeAddress(address);
      }, 1000); // Debounce for 1 second
      return () => clearTimeout(timeoutId);
    }
  }, [form.watch('address')]);

  if (!user || !profile) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Please Login</h1>
        <p className="text-gray-600 mb-6">You need to be logged in to proceed with checkout.</p>
        <Link to="/login">
          <Button className="bg-bhoj-primary hover:bg-bhoj-dark">
            Login
          </Button>
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Your Cart is Empty</h1>
        <p className="text-gray-600 mb-6">Add some delicious items to your cart and come back!</p>
        <Link to="/">
          <Button className="bg-bhoj-primary hover:bg-bhoj-dark">
            Browse Restaurants
          </Button>
        </Link>
      </div>
    );
  }
  
  const restaurantName = items[0]?.restaurantName || "Restaurant";
  const subtotal = getCartTotal();
  const deliveryFee = 40;
  const taxes = Math.round(subtotal * 0.05);
  const total = subtotal + deliveryFee + taxes;
  
  const handleIncreaseQuantity = (itemId: number) => {
    const item = items.find(i => i.id === itemId);
    if (item) {
      updateQuantity(itemId, item.quantity + 1);
    }
  };
  
  const handleDecreaseQuantity = (itemId: number) => {
    const item = items.find(i => i.id === itemId);
    if (item && item.quantity > 1) {
      updateQuantity(itemId, item.quantity - 1);
    } else {
      removeFromCart(itemId);
    }
  };
  
  const handlePaymentSuccess = async (paymentId: string) => {
    try {
      setIsProcessing(true);
      setError(null);

      // Debug user data
      console.log('User data in handlePaymentSuccess:', { user, profile, userData });
      
      // Validate required data with more detailed error messages
      if (!user || !userData?.user) {
        console.error('User is null or undefined');
        throw new Error('User data is missing. Please log in again.');
      }
      
      if (!profile || !userData?.profile) {
        console.error('Profile is null or undefined');
        throw new Error('User profile is missing. Please log in again.');
      }

      if (!items.length) {
        throw new Error('Cart is empty');
      }

      if (form.getValues('deliveryOption') === 'dabbawala' && !form.getValues('address')) {
        throw new Error('Delivery address is required');
      }

      // Create order on backend with validated user data
      const orderData = {
        id: Math.floor(Math.random() * 10000),
        status: 'placed',
        placedAt: new Date(),
        estimatedDelivery: new Date(Date.now() + 20 * 60000),
        restaurant: {
          id: items[0]?.restaurantId,
          name: items[0]?.restaurantName,
          phone: '+91 98765 43210',
          coordinates: items[0]?.restaurantCoordinates || {
            latitude: 19.0760,
            longitude: 72.8777
          }
        },
        dabbawala: {
          id: 'D123',
          name: 'Ramesh Patel',
          phone: '+91 87654 32109',
          rating: 4.8,
          photo: 'https://i.pravatar.cc/150?img=59',
          coordinates: {
            latitude: 19.0755,
            longitude: 72.8775
          }
        },
        deliveryAddress: {
          address: form.getValues('address'),
          coordinates: deliveryCoordinates || {
            latitude: 19.0750,
            longitude: 72.8770
          }
        },
        items: items.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          restaurantId: item.restaurantId,
          restaurantName: item.restaurantName,
          image: item.image,
          description: item.description,
          isVeg: item.isVeg,
          spiceLevel: item.spiceLevel,
          portionSize: item.portionSize,
          specialIngredients: item.specialIngredients
        })),
        subtotal: subtotal,
        deliveryFee: deliveryFee,
        taxes: taxes,
        total: total,
        paymentMethod: form.getValues('paymentMethod'),
        paymentId: paymentId,
        userId: userData.user.id,
        userProfile: {
          name: userData.profile.name,
          email: userData.profile.email,
          phone: userData.profile.phone
        },
        notes: form.getValues('notes') || '',
        deliveryOption: form.getValues('deliveryOption')
      };

      // Validate order data
      if (!orderData.restaurant.id || !orderData.restaurant.name) {
        throw new Error('Restaurant information is missing');
      }

      if (!orderData.items.length) {
        throw new Error('Order items are missing');
      }

      if (!orderData.userId || !orderData.userProfile.name) {
        throw new Error('User information is missing');
      }

      // For test environment, we'll simulate order creation
      // In production, this would be an API call
      const createdOrder = {
        ...orderData,
        id: Math.floor(Math.random() * 10000),
        status: 'placed',
        placedAt: new Date().toISOString(),
        estimatedDelivery: new Date(Date.now() + 20 * 60000).toISOString()
      };
      
      // Clear cart and update state
      clearCart();
      setIsProcessing(false);
      setShowPayment(false);

      // Show success message
      toast({
        title: "Order Placed Successfully",
        description: "Your order has been placed and is being processed.",
      });

      // Navigate to order tracking
      navigate(`/track/${createdOrder.id}`, { state: { orderData: createdOrder } });
    } catch (error) {
      console.error('Error creating order:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to create order. Please try again.';
      setError(errorMessage);
      setIsProcessing(false);
      setShowPayment(false);
      toast({
        title: "Order Failed",
        description: errorMessage,
        variant: "destructive"
      });
    }
  };

  const handlePaymentError = (error: string) => {
    setIsProcessing(false);
    setShowPayment(false);
    setError(error);
    toast({
      title: "Payment Failed",
      description: error,
      variant: "destructive"
    });
  };

  const onSubmit = async (data: any) => {
    try {
      setError(null);
      
      // Validate delivery address
      if (data.deliveryOption === 'dabbawala' && !data.address.trim()) {
        toast({
          title: "Delivery Address Required",
          description: "Please enter your delivery address to continue.",
          variant: "destructive"
        });
        return;
      }

      if (data.deliveryOption === 'dabbawala' && !deliveryCoordinates) {
        toast({
          title: "Invalid Address",
          description: "Please enter a valid delivery address.",
          variant: "destructive"
        });
        return;
      }

      // Validate cart
      if (!items.length) {
        toast({
          title: "Empty Cart",
          description: "Your cart is empty. Please add items before proceeding.",
          variant: "destructive"
        });
        return;
      }

      // Validate user data
      if (!user || !profile) {
        toast({
          title: "Authentication Required",
          description: "Please log in to complete your order.",
          variant: "destructive"
        });
        navigate('/login', { state: { from: '/checkout' } });
        return;
      }

      setIsProcessing(true);

      // Handle different payment methods
      switch (data.paymentMethod) {
        case 'upi':
          // Show Google Pay payment modal
          setShowPayment(true);
          setIsProcessing(false);
          return;
        case 'card':
          // Simulate card payment
          // try {
          //   await new Promise(resolve => setTimeout(resolve, 2000));
          //   const mockPaymentId = `CARD_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          //   await handlePaymentSuccess(mockPaymentId);
          // } catch (error) {
          //   handlePaymentError('Card payment failed. Please try again.');
          // }
          // break;

          setShowPayment(true);
          setIsProcessing(false);
          return;

        case 'cod':
          // Handle cash on delivery
          try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            const mockPaymentId = `COD_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            await handlePaymentSuccess(mockPaymentId);
          } catch (error) {
            handlePaymentError('Failed to process cash on delivery order.');
          }
          break;
        default:
          handlePaymentError('Invalid payment method selected.');
      }
    } catch (error) {
      console.error('Error in form submission:', error);
      setError('An error occurred. Please try again.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 h-screen">
      <Link to="/" className="inline-flex items-center text-bhoj-primary mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Continue Shopping
      </Link>
      
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}
      
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          {/* Cart Items */}
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Your Order</span>
                <span className="text-bhoj-primary text-sm">{restaurantName}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="mr-4">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 rounded-full p-0"
                        onClick={() => handleDecreaseQuantity(item.id)}
                        disabled={isProcessing}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="mx-2 text-center inline-block w-4">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 rounded-full p-0"
                        onClick={() => handleIncreaseQuantity(item.id)}
                        disabled={isProcessing}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-500">₹{item.price}</p>
                    </div>
                  </div>
                  <p className="font-medium">₹{item.price * item.quantity}</p>
                </div>
              ))}
            </CardContent>
          </Card>
          
          {/* Delivery Options */}
          <Card>
            <CardHeader>
              <CardTitle>Delivery Options</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="deliveryOption"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="space-y-3"
                          disabled={isProcessing}
                        >
                          {deliveryOptions.map((option) => (
                            <FormItem key={option.id} className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value={option.id} />
                              </FormControl>
                              <FormLabel className="font-normal flex items-center cursor-pointer">
                                <div className="bg-bhoj-light p-2 rounded-full mr-2">
                                  {option.icon}
                                </div>
                                <div>
                                  <p className="font-medium">{option.name}</p>
                                  <p className="text-sm text-gray-500">{option.description}</p>
                                </div>
                              </FormLabel>
                            </FormItem>
                          ))}
                        </RadioGroup>
                      </FormItem>
                    )}
                  />
                  
                  {form.watch('deliveryOption') === 'dabbawala' && (
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Delivery Address <span className="text-red-500">*</span></FormLabel>
                            <div className="flex gap-2">
                              <FormControl>
                                <Textarea
                                  placeholder="Enter your full address"
                                  className="resize-none"
                                  {...field}
                                  disabled={isProcessing}
                                />
                              </FormControl>
                              <Button
                                type="button"
                                variant="outline"
                                onClick={getUserLocation}
                                className="whitespace-nowrap bg-bhoj-primary text-white hover:bg-bhoj-dark"
                                disabled={isFetchingLocation}
                              >
                                {isFetchingLocation ? (
                                  <div className="flex items-center">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Fetching...
                                  </div>
                                ) : (
                                  "Use My Location"
                                )}
                              </Button>
                            </div>
                          </FormItem>
                        )}
                      />
                      
                      {/* Map Component */}
                      <div className={styles.mapWrapper}>
                        <div className={styles.mapContainer}>
                          <MapComponent
                            initialViewState={{
                              longitude: restaurantCoordinates.longitude,
                              latitude: restaurantCoordinates.latitude,
                              zoom: 14
                            }}
                            markers={[
                              {
                                longitude: restaurantCoordinates.longitude,
                                latitude: restaurantCoordinates.latitude,
                                title: items[0]?.restaurantName || "Restaurant Location",
                                type: "restaurant" as const
                              },
                              ...(deliveryCoordinates ? [{
                                longitude: deliveryCoordinates[1],
                                latitude: deliveryCoordinates[0],
                                title: "Delivery Address",
                                type: "delivery" as const
                              }] : [])
                            ]}
                            route={deliveryCoordinates ? {
                              start: [restaurantCoordinates.latitude, restaurantCoordinates.longitude],
                              end: [deliveryCoordinates[0], deliveryCoordinates[1]]
                            } : undefined}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Additional Notes</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Any special instructions..."
                            className="resize-none"
                            {...field}
                            disabled={isProcessing}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  {/* Payment Method */}
                  <div className="space-y-3">
                    <h3 className="font-medium">Payment Method</h3>
                    <FormField
                      control={form.control}
                      name="paymentMethod"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="space-y-3"
                            disabled={isProcessing}
                          >
                            {paymentOptions.map((option) => (
                              <FormItem key={option.id} className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value={option.id} />
                                </FormControl>
                                <FormLabel className="font-normal flex items-center cursor-pointer">
                                  <div className="bg-gray-100 p-2 rounded-full mr-2">
                                    {option.icon}
                                  </div>
                                  <span>{option.name}</span>
                                </FormLabel>
                              </FormItem>
                            ))}
                          </RadioGroup>
                        </FormItem>
                      )}
                    />
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
        
        {/* Order Summary */}
        <div>
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Delivery Fee</span>
                <span>₹{deliveryFee}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Taxes</span>
                <span>₹{taxes}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>₹{total}</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full bg-bhoj-primary hover:bg-bhoj-dark"
                onClick={form.handleSubmit(onSubmit)}
                disabled={isProcessing || (form.watch('deliveryOption') === 'dabbawala' && !form.watch('address').trim())}
              >
                {isProcessing ? "Processing..." : "Place Order"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* Google Pay Payment Modal */}
      {showPayment && (form.watch('paymentMethod') === 'upi' || form.watch('paymentMethod') === 'card') && user && profile && (
        <div className="fixed inset-0 z-50">
          <GooglePayPayment
            amount={total}
            onSuccess={handlePaymentSuccess}
            onError={handlePaymentError}
            userData={{
              name: profile.name,
              email: profile.email,
              phone: profile.phone
            }}
            paymentMethod={form.watch('paymentMethod')}
          />
        </div>
      )}
    </div>
  );
};

export default Checkout;
