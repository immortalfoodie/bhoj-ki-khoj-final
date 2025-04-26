
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
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
import { ArrowLeft, Phone, MessageSquare, Clock, CheckCircle, Star } from 'lucide-react';

// Mock order data
const getOrderData = (orderId: string) => {
  return {
    id: orderId,
    status: 'in_transit', // 'placed', 'preparing', 'picked_up', 'in_transit', 'delivered'
    placedAt: new Date(Date.now() - 40 * 60000), // 40 minutes ago
    estimatedDelivery: new Date(Date.now() + 15 * 60000), // 15 minutes from now
    restaurant: {
      id: 1,
      name: 'Gujarati Tiffin Service',
      phone: '+91 98765 43210',
    },
    dabbawala: {
      id: 'D123',
      name: 'Ramesh Patel',
      phone: '+91 87654 32109',
      rating: 4.8,
      photo: 'https://i.pravatar.cc/150?img=59',
    },
    items: [
      { id: 101, name: 'Standard Gujarati Thali', quantity: 2, price: 150 },
      { id: 203, name: 'Dal Dhokli', quantity: 1, price: 140 },
    ],
    deliveryAddress: '123, Green Residency, Navrangpura, Ahmedabad - 380009',
    subtotal: 440,
    deliveryFee: 40,
    taxes: 22,
    total: 502,
    paymentMethod: 'UPI',
  };
};

// Status timeline steps
const statusSteps = [
  { key: 'placed', label: 'Order Placed', description: 'Restaurant received your order' },
  { key: 'preparing', label: 'Preparing', description: 'Food is being prepared' },
  { key: 'picked_up', label: 'Picked Up', description: 'Dabbawala picked up your order' },
  { key: 'in_transit', label: 'On the Way', description: 'Your order is on the way' },
  { key: 'delivered', label: 'Delivered', description: 'Enjoy your meal!' },
];

const OrderTracking = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<any>(null);
  const [activeStep, setActiveStep] = useState(0);
  
  // Function to get current step index
  const getCurrentStepIndex = (status: string) => {
    return statusSteps.findIndex(step => step.key === status);
  };
  
  // Get order data and set active step
  useEffect(() => {
    if (orderId) {
      const data = getOrderData(orderId);
      setOrder(data);
      setActiveStep(getCurrentStepIndex(data.status));
      
      // Simulate order progress for demo
      const timer = setTimeout(() => {
        const nextStatus = 
          data.status === 'placed' ? 'preparing' :
          data.status === 'preparing' ? 'picked_up' :
          data.status === 'picked_up' ? 'in_transit' :
          data.status === 'in_transit' ? 'delivered' :
          data.status;
        
        setOrder({...data, status: nextStatus});
        setActiveStep(getCurrentStepIndex(nextStatus));
      }, 20000);
      
      return () => clearTimeout(timer);
    }
  }, [orderId]);
  
  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p>Loading order details...</p>
      </div>
    );
  }
  
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  }).format(order.placedAt);
  
  const estimatedTime = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  }).format(order.estimatedDelivery);

  return (
    <div className="container mx-auto px-4 py-6">
      <Link to="/" className="inline-flex items-center text-bhoj-primary mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Home
      </Link>
      
      <h1 className="text-2xl font-bold mb-6">Order Tracking</h1>
      
      <div className="grid gap-6 md:grid-cols-5">
        <div className="md:col-span-3 space-y-6">
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
                      <StepperItemText>{step.label}</StepperItemText>
                      <StepperItemDescription>{step.description}</StepperItemDescription>
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
          
          {/* Map Placeholder (Would be replaced with actual Google Maps) */}
          <Card>
            <CardContent className="p-0">
              <div className="aspect-video bg-gray-200 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-gray-500">Map Placeholder</p>
                  <p className="text-sm text-gray-400">Google Maps would be integrated here</p>
                </div>
              </div>
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
                  <p className="mt-1">{order.deliveryAddress}</p>
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
