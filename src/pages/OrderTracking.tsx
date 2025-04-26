import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  Steps, 
  StepperRoot, 
  StepperItem, 
  StepperConnector, 
  StepperItemIndicator,
  StepperItemText,
  StepperItemDescription
} from '@/components/ui/stepper';
import { ArrowLeft, Phone, MessageSquare, Clock, CheckCircle, Star, Loader2 } from 'lucide-react';
import MapComponent from '@/components/MapComponent';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { restaurantsData } from '@/data/restaurants';

// Status timeline steps with timing
const statusSteps = [
  { 
    key: 'placed', 
    label: 'Order Placed', 
    description: 'Restaurant received your order',
    duration: 2 * 60 * 1000 // 2 minutes
  },
  { 
    key: 'preparing', 
    label: 'Preparing', 
    description: 'Food is being prepared',
    duration: 15 * 60 * 1000 // 15 minutes
  },
  { 
    key: 'picked_up', 
    label: 'Picked Up', 
    description: 'Dabbawala picked up your order',
    duration: 5 * 60 * 1000 // 5 minutes
  },
  { 
    key: 'in_transit', 
    label: 'On the Way', 
    description: 'Your order is on the way',
    duration: 20 * 60 * 1000 // 20 minutes
  },
  { 
    key: 'delivered', 
    label: 'Delivered', 
    description: 'Enjoy your meal!',
    duration: 0
  },
];

// Restaurant coordinates mapping
const RESTAURANT_COORDINATES = {
  'Maharaja Thali House': {
    latitude: 19.2967,
    longitude: 72.8504
  },
  'Mumbai Tiffin Service': {
    latitude: 59.2967,
    longitude: 42.8504
  },
  'Vada Pav Corner': {
    latitude: 19.1467,
    longitude: 72.8489
  },
  'Punjabi Dhaba': {
    latitude: 19.0176,
    longitude: 72.8285
  }
};

// Default coordinates (Mumbai)
const DEFAULT_COORDINATES = {
  latitude: 19.0760,
  longitude: 72.8777
};

const OrderTracking = () => {
  const { orderId } = useParams();
  const location = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [order, setOrder] = useState<any>(location.state?.orderData || null);
  const [activeStep, setActiveStep] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [estimatedDeliveryTime, setEstimatedDeliveryTime] = useState<Date | null>(null);
  
  // Get restaurant coordinates from our data
  const getRestaurantCoordinates = (restaurantName: string) => {
    const restaurant = Object.values(restaurantsData).find(r => r.name === restaurantName);
    return restaurant?.coordinates || null;
  };
  
  // Function to get current step index
  const getCurrentStepIndex = (status: string) => {
    return statusSteps.findIndex(step => step.key === status);
  };

  // Calculate total remaining time for delivery
  const calculateRemainingTime = (currentStep: number) => {
    return statusSteps
      .slice(currentStep)
      .reduce((total, step) => total + step.duration, 0);
  };

  // Update order status with simulated progress
  useEffect(() => {
    if (!order) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    // Set initial estimated delivery time
    if (!estimatedDeliveryTime) {
      const totalTime = calculateRemainingTime(0);
      const estimatedTime = new Date(Date.now() + totalTime);
      setEstimatedDeliveryTime(estimatedTime);
    }

    const currentStep = getCurrentStepIndex(order.status);
    setActiveStep(currentStep);

    // Don't continue if order is delivered
    if (order.status === 'delivered') {
      setIsLoading(false);
      return;
    }

    // Simulate order progress
    const timer = setTimeout(() => {
      const nextStep = currentStep + 1;
      if (nextStep < statusSteps.length) {
        const nextStatus = statusSteps[nextStep].key;
        setOrder(prev => ({
          ...prev,
          status: nextStatus,
          dabbawala: {
            ...prev.dabbawala,
            coordinates: simulateNewDabbawalaCordinates(prev, nextStep)
          }
        }));
      }
    }, statusSteps[currentStep].duration / 10); // Speed up simulation by factor of 10

    setIsLoading(false);

    return () => clearTimeout(timer);
  }, [order?.status]);

  // Simulate dabbawala movement
  const simulateNewDabbawalaCordinates = (currentOrder: any, step: number) => {
    const restaurantCoords = getRestaurantCoordinates(currentOrder.restaurant.name);
    const deliveryCoords = currentOrder.deliveryAddress.coordinates;
    
    if (!restaurantCoords || !deliveryCoords) return currentOrder.dabbawala.coordinates;

    // Calculate intermediate positions based on step
    const progress = (step - 2) / 2; // Steps 2-4 represent movement
    return {
      latitude: restaurantCoords.latitude + (deliveryCoords.latitude - restaurantCoords.latitude) * progress,
      longitude: restaurantCoords.longitude + (deliveryCoords.longitude - restaurantCoords.longitude) * progress
    };
  };

  // Fetch order data if not available in location state
  useEffect(() => {
    const fetchOrder = async () => {
      if (!location.state?.orderData && orderId) {
        try {
          setIsLoading(true);
          setError(null);
          const response = await fetch(`/api/orders/${orderId}`, {
            headers: {
              'Authorization': `Bearer ${user?.id}`
            }
          });

          if (!response.ok) {
            throw new Error('Failed to fetch order');
          }

          const orderData = await response.json();
          setOrder(orderData);
          setActiveStep(getCurrentStepIndex(orderData.status));
        } catch (error) {
          console.error('Error fetching order:', error);
          setError('Failed to load order details. Please try again.');
          toast({
            title: "Error",
            description: "Failed to load order details. Please try again.",
            variant: "destructive"
          });
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchOrder();
  }, [orderId, location.state?.orderData, user?.id, toast]);
  
  // Subscribe to real-time order updates
  useEffect(() => {
    if (order) {
      const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
      const ws = new WebSocket(`${protocol}://your-websocket-url/orders/${order.id}`);

      ws.onmessage = (event) => {
        const updatedOrder = JSON.parse(event.data);
        setOrder(updatedOrder);
        setActiveStep(getCurrentStepIndex(updatedOrder.status));
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      return () => {
        ws.close();
      };
    }
  }, [order?.id]);
  
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Error</h1>
        <p className="text-gray-600 mb-6">{error}</p>
        <Link to="/">
          <Button className="bg-bhoj-primary hover:bg-bhoj-dark">
            Back to Home
          </Button>
        </Link>
      </div>
    );
  }
  
  if (!order || isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-bhoj-primary" />
      </div>
    );
  }

  // Format dates safely
  const formatDate = (dateString: string | Date | undefined) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid Date';
      return new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
      }).format(date);
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid Date';
    }
  };
  
  const formattedDate = formatDate(order.placedAt);
  const estimatedTime = estimatedDeliveryTime 
    ? new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
      }).format(estimatedDeliveryTime)
    : 'Calculating...';

  return (
    <div className="container mx-auto px-4 py-6">
      <Link to="/" className="inline-flex items-center text-bhoj-primary mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Home
      </Link>
      
      <h1 className="text-2xl font-bold mb-6">Order Tracking</h1>
      
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-1 space-y-6">
          {/* Order Status */}
          <Card>
            <CardHeader>
              <CardTitle>Order Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <p className="text-sm text-gray-500">Order ID</p>
                    <p className="font-medium">#{order.id}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Placed at</p>
                    <p className="font-medium">{formattedDate}</p>
                  </div>
                </div>
                
                <div className="flex items-center mt-4">
                  <Clock className="h-5 w-5 text-bhoj-primary mr-2" />
                  <span>
                    Estimated delivery by <strong>{estimatedTime}</strong>
                  </span>
                </div>
              </div>
              
              {/* Status Timeline */}
              <Steps value={activeStep}>
                <StepperRoot>
                  {statusSteps.map((step, index) => (
                    <StepperItem key={index} value={index}>
                      <StepperItemIndicator>
                        {index < activeStep ? (
                          <CheckCircle className="h-5 w-5 text-bhoj-primary" />
                        ) : (
                          <div className={`h-3 w-3 rounded-full ${index === activeStep ? 'bg-bhoj-primary' : 'bg-gray-300'}`} />
                        )}
                      </StepperItemIndicator>
                      <StepperItemText style={{paddingLeft: '32px'}}>{step.label}</StepperItemText>
                      <StepperItemDescription style={{paddingLeft: '32px'}}>{step.description}</StepperItemDescription>
                      {index < statusSteps.length - 1 && <StepperConnector />}
                    </StepperItem>
                  ))}
                </StepperRoot>
              </Steps>
            </CardContent>
          </Card>
          
          {/* Dabbawala Details */}
          {activeStep >= 2 && (
            <Card>
              <CardHeader>
                <CardTitle>Your Dabbawala</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <img 
                    src={order.dabbawala.photo} 
                    alt={order.dabbawala.name}
                    className="w-16 h-16 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h3 className="font-medium">{order.dabbawala.name}</h3>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <span className="flex items-center">
                        <Star className="h-4 w-4 text-bhoj-secondary fill-bhoj-secondary mr-1" />
                        {order.dabbawala.rating}
                      </span>
                      <span className="mx-2">•</span>
                      <span>ID: {order.dabbawala.id}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex mt-4 space-x-2">
                  <Button variant="outline" className="flex-1 flex items-center justify-center">
                    <Phone className="h-4 w-4 mr-2" />
                    Call
                  </Button>
                  <Button variant="outline" className="flex-1 flex items-center justify-center">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Message
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Map Component */}
          <Card>
            <CardContent className="p-0">
              <MapComponent
                initialViewState={{
                  longitude: getRestaurantCoordinates(order?.restaurant?.name)?.longitude || DEFAULT_COORDINATES.longitude,
                  latitude: getRestaurantCoordinates(order?.restaurant?.name)?.latitude || DEFAULT_COORDINATES.latitude,
                  zoom: 14
                }}
                markers={[
                  {
                    longitude: getRestaurantCoordinates(order?.restaurant?.name)?.longitude || DEFAULT_COORDINATES.longitude,
                    latitude: getRestaurantCoordinates(order?.restaurant?.name)?.latitude || DEFAULT_COORDINATES.latitude,
                    title: order?.restaurant?.name || "Restaurant Location",
                    type: "restaurant" as const
                  },
                  {
                    longitude: order?.dabbawala?.coordinates.longitude || DEFAULT_COORDINATES.longitude,
                    latitude: order?.dabbawala?.coordinates.latitude || DEFAULT_COORDINATES.latitude,
                    title: `Dabbawala: ${order?.dabbawala?.name}`,
                    type: "dabbawala" as const
                  },
                  {
                    longitude: order?.deliveryAddress?.coordinates.longitude || DEFAULT_COORDINATES.longitude,
                    latitude: order?.deliveryAddress?.coordinates.latitude || DEFAULT_COORDINATES.latitude,
                    title: "Delivery Address",
                    type: "delivery" as const
                  }
                ]}
                route={order ? {
                  start: [
                    getRestaurantCoordinates(order?.restaurant?.name)?.latitude || DEFAULT_COORDINATES.latitude,
                    getRestaurantCoordinates(order?.restaurant?.name)?.longitude || DEFAULT_COORDINATES.longitude
                  ],
                  waypoints: [[
                    order?.dabbawala?.coordinates.latitude || DEFAULT_COORDINATES.latitude,
                    order?.dabbawala?.coordinates.longitude || DEFAULT_COORDINATES.longitude
                  ]],
                  end: [
                    order?.deliveryAddress?.coordinates.latitude || DEFAULT_COORDINATES.latitude,
                    order?.deliveryAddress?.coordinates.longitude || DEFAULT_COORDINATES.longitude
                  ]
                } : undefined}
              />
            </CardContent>
          </Card>
        </div>
        
        {/* Order Details */}
        <div className="md:col-span-2">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Order Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">{order.restaurant.name}</h3>
                <div className="space-y-3">
                  {order.items.map((item: any) => (
                    <div key={item.id} className="flex justify-between">
                      <div>
                        <span className="font-medium">{item.quantity}x</span> {item.name}
                      </div>
                      <span>₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>₹{order.subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery Fee</span>
                  <span>₹{order.deliveryFee}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Taxes</span>
                  <span>₹{order.taxes}</span>
                </div>
                <div className="flex justify-between font-bold mt-2">
                  <span>Total</span>
                  <span>₹{order.total}</span>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <div>
                  <p className="text-sm text-gray-500">Delivery Address</p>
                  <p className="mt-1">{order.deliveryAddress.text}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Payment Method</p>
                  <p className="mt-1">{order.paymentMethod}</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-2">
              <Button variant="outline" className="w-full">
                Need Help?
              </Button>
              <Link to="/" className="w-full">
                <Button variant="secondary" className="w-full">
                  Order More Food
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;