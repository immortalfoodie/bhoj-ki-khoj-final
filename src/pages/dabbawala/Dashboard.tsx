import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package, Clock, Navigation, Bike, DollarSign } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const DabbawalaDashboard = () => {
  const { toast } = useToast();
  const [activeDeliveries, setActiveDeliveries] = useState(3);
  const [completedDeliveries, setCompletedDeliveries] = useState(7);
  const [earnings, setEarnings] = useState(850);
  const [deliveryStatuses, setDeliveryStatuses] = useState<{[key: string]: string}>({
    "DEL-100": "ready_for_pickup",
    "DEL-101": "in_transit",
    "DEL-102": "assigned"
  });

  // Mock data - in a real app, these would come from backend
  const stats = [
    { 
      title: "Active Deliveries", 
      value: activeDeliveries.toString(), 
      icon: <Package className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" /> 
    },
    { 
      title: "Completed Today", 
      value: completedDeliveries.toString(), 
      icon: <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" /> 
    },
    { 
      title: "Today's Earnings", 
      value: `₹${earnings}`, 
      icon: <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" /> 
    }
  ];

  // Mock delivery requests
  const deliveryRequests = [
    {
      id: "DEL-100",
      customer: "Vishal Gowda",
      restaurant: "Punjabi Dhaba",
      pickupAddress: "Prabhadevi, Mumbai",
      deliveryAddress: "Goregoan East, Mumbai",
      items: 3,
      status: deliveryStatuses["DEL-100"],
      distance: "4.2 km",
      time: "15 mins ago"
    },
    {
      id: "DEL-101",
      customer: "Priya Patel",
      restaurant: "Gujarati Tiffin",
      pickupAddress: "Andheri East, Mumbai",
      deliveryAddress: "BKC, Mumbai",
      items: 2,
      status: deliveryStatuses["DEL-101"],
      distance: "5.8 km",
      time: "32 mins ago"
    },
    {
      id: "DEL-102",
      customer: "Amit Singh",
      restaurant: "Desi Kitchen",
      pickupAddress: "Rohini, Delhi",
      deliveryAddress: "Pitampura, Delhi",
      items: 1,
      status: deliveryStatuses["DEL-102"],
      distance: "3.5 km",
      time: "Just now"
    }
  ];

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'ready_for_pickup':
        return 'bg-yellow-100 text-yellow-800';
      case 'in_transit':
        return 'bg-blue-100 text-blue-800';
      case 'assigned':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    return status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const handleStartDelivery = (requestId: string) => {
    setDeliveryStatuses(prev => ({
      ...prev,
      [requestId]: "in_transit"
    }));
    toast({
      title: "Delivery Started",
      description: `You've started the delivery for order ${requestId}`,
    });
  };

  const handleNavigate = (requestId: string, address: string) => {
    // In a real app, this would integrate with a maps API
    toast({
      title: "Navigation Started",
      description: `Navigating to: ${address}`,
    });
  };

  return (
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-6 max-w-[100vw] overflow-x-hidden">
      <h1 className="text-xl sm:text-2xl font-bold">Dabbawala Dashboard</h1>
      
      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-3">
        {stats.map((stat, index) => (
          <Card key={index} className="border-l-4 border-bhoj-primary min-w-0 hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium truncate pr-2">{stat.title}</CardTitle>
              <div className="flex-shrink-0">
                {stat.icon}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold truncate">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="space-y-4">
        <h2 className="text-lg sm:text-xl font-medium">Active Delivery Requests</h2>
        
        <div className="space-y-3 sm:space-y-4">
          {deliveryRequests.map((request) => (
            <Card key={request.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
              <CardContent className="p-3 sm:p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                  <div className="space-y-2 min-w-0">
                    <div className="flex items-start justify-between sm:justify-start gap-2">
                      <span className="text-sm sm:text-base font-medium truncate">{request.id}</span>
                      <Badge className={`${getStatusBadgeColor(request.status)} transition-colors duration-200`}>
                        {getStatusText(request.status)}
                      </Badge>
                    </div>
                    
                    <div className="space-y-1">
                      <p className="text-xs sm:text-sm text-gray-600 truncate">
                        <span className="font-medium">Customer:</span> {request.customer}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-600 truncate">
                        <span className="font-medium">Restaurant:</span> {request.restaurant}
                      </p>
                      <div className="flex flex-col sm:flex-row gap-1 sm:gap-4">
                        <p className="text-xs sm:text-sm text-gray-600 truncate flex-1">
                          <span className="font-medium">Pickup:</span> {request.pickupAddress}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-600 truncate flex-1">
                          <span className="font-medium">Delivery:</span> {request.deliveryAddress}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
                      <span>{request.items} items</span>
                      <span>•</span>
                      <span>{request.distance}</span>
                      <span>•</span>
                      <span>{request.time}</span>
                    </div>
                  </div>
                  
                  <div className="flex sm:flex-col gap-2 sm:gap-3">
                    <Button 
                      size="sm" 
                      className="flex-1 sm:flex-none text-xs sm:text-sm h-8 sm:h-9 bg-bhoj-primary hover:bg-bhoj-dark transition-colors duration-200 active:scale-95 transform"
                      onClick={() => handleNavigate(request.id, request.status === "ready_for_pickup" ? request.pickupAddress : request.deliveryAddress)}
                    >
                      <Navigation className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                      Navigate
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1 sm:flex-none text-xs sm:text-sm h-8 sm:h-9 hover:bg-bhoj-primary hover:text-white transition-all duration-200 active:scale-95 transform"
                      onClick={() => handleStartDelivery(request.id)}
                      disabled={request.status === "in_transit"}
                    >
                      <Bike className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                      {request.status === "in_transit" ? "In Progress" : "Start"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DabbawalaDashboard;
