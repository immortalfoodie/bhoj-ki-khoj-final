
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package, Clock, Navigation, Bike, DollarSign } from 'lucide-react';

const DabbawalaDashboard = () => {
  // Mock data - in a real app, these would come from backend
  const stats = [
    { 
      title: "Active Deliveries", 
      value: "3", 
      icon: <Package className="h-4 w-4 text-muted-foreground" /> 
    },
    { 
      title: "Completed Today", 
      value: "7", 
      icon: <Clock className="h-4 w-4 text-muted-foreground" /> 
    },
    { 
      title: "Today's Earnings", 
      value: "₹850", 
      icon: <DollarSign className="h-4 w-4 text-muted-foreground" /> 
    }
  ];

  // Mock delivery requests
  const deliveryRequests = [
    {
      id: "DEL-100",
      customer: "Rahul Sharma",
      restaurant: "Punjabi Dhaba",
      pickupAddress: "Sector 14, Gurugram",
      deliveryAddress: "Sector 45, Gurugram",
      items: 3,
      status: "ready_for_pickup",
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
      status: "in_transit",
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
      status: "assigned",
      distance: "3.5 km",
      time: "Just now"
    }
  ];

  // Helper function to get status badge
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'assigned':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Assigned</Badge>;
      case 'ready_for_pickup':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Ready for Pickup</Badge>;
      case 'in_transit':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">In Transit</Badge>;
      case 'delivered':
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Delivered</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  // Helper function to get action button based on status
  const getActionButton = (status: string, id: string) => {
    switch(status) {
      case 'assigned':
        return (
          <Button size="sm" className="bg-bhoj-primary hover:bg-bhoj-dark">
            Accept
          </Button>
        );
      case 'ready_for_pickup':
        return (
          <Button size="sm" className="bg-bhoj-primary hover:bg-bhoj-dark">
            Picked Up
          </Button>
        );
      case 'in_transit':
        return (
          <Button size="sm" className="bg-bhoj-primary hover:bg-bhoj-dark">
            Delivered
          </Button>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Dabbawala Dashboard</h1>
      
      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat, index) => (
          <Card key={index} className="border-l-4 border-bhoj-primary">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="space-y-4">
        <h2 className="text-xl font-medium">Active Delivery Requests</h2>
        
        <div className="space-y-4">
          {deliveryRequests.map((delivery) => (
            <Card key={delivery.id} className="overflow-hidden">
              <div className="flex flex-col md:flex-row">
                <div className="p-6 flex-1">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h3 className="text-lg font-medium">{delivery.restaurant}</h3>
                      <p className="text-sm text-gray-500">Order #{delivery.id}</p>
                    </div>
                    {getStatusBadge(delivery.status)}
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <Bike className="h-5 w-5 text-bhoj-primary mr-2 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Pickup</p>
                        <p className="text-sm text-gray-500">{delivery.pickupAddress}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <Navigation className="h-5 w-5 text-bhoj-primary mr-2 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Delivery</p>
                        <p className="text-sm text-gray-500">{delivery.deliveryAddress}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <Package className="h-5 w-5 text-bhoj-primary mr-2 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Order Details</p>
                        <p className="text-sm text-gray-500">{delivery.items} items • {delivery.distance}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-6 flex flex-col justify-between md:w-48">
                  <div>
                    <p className="text-sm font-medium">Customer</p>
                    <p className="text-sm text-gray-500">{delivery.customer}</p>
                    <p className="text-xs text-gray-400 mt-1">{delivery.time}</p>
                  </div>
                  <div className="mt-4">
                    {getActionButton(delivery.status, delivery.id)}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DabbawalaDashboard;
