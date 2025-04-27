
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, Clock, X, AlertCircle, Package, Bike, Home } from 'lucide-react';

// Mock order data
const mockOrders = [
  {
    id: "ORD10021",
    date: "Today, 2:30 PM",
    restaurant: "Mama's Kitchen",
    items: ["Paneer Butter Masala", "Butter Naan (2)", "Jeera Rice"],
    total: 450,
    status: "Delivered",
    address: "123 Main St, Mumbai"
  },
  {
    id: "ORD10020",
    date: "Yesterday, 1:15 PM",
    restaurant: "Gujarati Tiffin",
    items: ["Thali", "Sweet Dish"],
    total: 220,
    status: "In Progress",
    address: "456 Market Ave, Mumbai"
  },
  {
    id: "ORD10018",
    date: "15 Apr 2023",
    restaurant: "South Indian Homemade",
    items: ["Masala Dosa", "Idli (4)", "Sambhar"],
    total: 280,
    status: "Cancelled",
    address: "789 Park Rd, Mumbai"
  },
  {
    id: "ORD10015",
    date: "10 Apr 2023",
    restaurant: "Bengali Home Foods",
    items: ["Fish Curry", "Rice", "Rasgulla (2)"],
    total: 350,
    status: "Delivered",
    address: "321 Lake View, Mumbai"
  }
];

// Function to get badge color based on status
const getStatusBadgeColor = (status: string) => {
  switch (status) {
    case "Delivered": return "bg-green-100 text-green-800";
    case "In Progress": return "bg-yellow-100 text-yellow-800";
    case "Cancelled": return "bg-red-100 text-red-800";
    default: return "bg-gray-100 text-gray-800";
  }
};

// Function to get status icon
const getStatusIcon = (status: string) => {
  switch (status) {
    case "Delivered": return <Check className="w-4 h-4" />;
    case "In Progress": return <Clock className="w-4 h-4" />;
    case "Cancelled": return <X className="w-4 h-4" />;
    default: return <AlertCircle className="w-4 h-4" />;
  }
};

const Orders = () => {
  const [filter, setFilter] = useState("all");
  
  // Filter orders based on selected tab
  const filteredOrders = filter === "all" 
    ? mockOrders 
    : mockOrders.filter(order => 
        filter === "delivered" ? order.status === "Delivered" : 
        filter === "active" ? order.status === "In Progress" : 
        order.status === "Cancelled"
      );

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>
      
      <Tabs defaultValue="all" className="w-full mb-6" onValueChange={setFilter}>
        <TabsList className="grid grid-cols-4 w-full md:w-auto">
          <TabsTrigger value="all">All Orders</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="delivered">Delivered</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
        </TabsList>
      </Tabs>
      
      <div className="space-y-4">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))
        ) : (
          <div className="text-center py-10">
            <Package className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">No orders found</h3>
            <p className="mt-1 text-gray-500">You don't have any orders in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
};

interface OrderProps {
  order: {
    id: string;
    date: string;
    restaurant: string;
    items: string[];
    total: number;
    status: string;
    address: string;
  };
}

const OrderCard = ({ order }: OrderProps) => {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-lg">{order.restaurant}</h3>
              <p className="text-sm text-gray-500">{order.date}</p>
            </div>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(order.status)}`}>
              {getStatusIcon(order.status)}
              <span className="ml-1">{order.status}</span>
            </span>
          </div>
          
          <div className="mt-3">
            <p className="text-sm text-gray-600 mb-1">Items:</p>
            <ul className="text-sm">
              {order.items.map((item, index) => (
                <li key={index} className="flex items-center">
                  <span className="w-1 h-1 bg-gray-500 rounded-full mr-2"></span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          
          <div className="flex justify-between items-center mt-3 pt-3 border-t">
            <div className="flex items-center text-sm text-gray-600">
              <Home className="w-4 h-4 mr-1" />
              <span className="truncate max-w-[150px]">{order.address}</span>
            </div>
            <div className="font-medium">₹{order.total}</div>
          </div>
          
          {order.status === "In Progress" && (
            <div className="mt-3 flex">
              <div className="flex-1 bg-green-100 rounded-l-md p-2 flex items-center justify-center text-green-800 text-xs font-medium">
                <Check className="w-3 h-3 mr-1" />
                Confirmed
              </div>
              <div className="flex-1 bg-yellow-100 p-2 flex items-center justify-center text-yellow-800 text-xs font-medium">
                <Bike className="w-3 h-3 mr-1" />
                On the way
              </div>
              <div className="flex-1 bg-gray-100 rounded-r-md p-2 flex items-center justify-center text-gray-500 text-xs font-medium">
                Delivered
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default Orders;
