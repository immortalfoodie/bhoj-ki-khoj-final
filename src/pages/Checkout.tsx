import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { ArrowLeft, Plus, Minus, Bike, ShoppingBag, UtensilsCrossed, CreditCard, Wallet, BanknoteIcon } from 'lucide-react';

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
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  
  const form = useForm({
    defaultValues: {
      deliveryOption: 'dabbawala',
      paymentMethod: 'card',
      address: '',
      notes: ''
    }
  });
  
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
  
  const onSubmit = (data: any) => {
    setIsProcessing(true);
    
    // Simulate order processing
    setTimeout(() => {
      const orderId = Math.floor(Math.random() * 10000);
      clearCart();
      setIsProcessing(false);
      
      toast({
        title: "Order Placed Successfully!",
        description: `Your order #${orderId} has been placed`,
      });
      
      navigate(`/track/${orderId}`);
    }, 2000);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <Link to="/" className="inline-flex items-center text-bhoj-primary mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Continue Shopping
      </Link>
      
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>
      
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
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="mx-2 text-center inline-block w-4">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 rounded-full p-0"
                        onClick={() => handleIncreaseQuantity(item.id)}
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
                    <div className="space-y-3">
                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Delivery Address</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Enter your full address"
                                className="resize-none"
                                {...field}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
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
                disabled={isProcessing}
              >
                {isProcessing ? "Processing..." : "Place Order"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
