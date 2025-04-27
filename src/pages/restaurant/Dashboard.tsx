
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingBag, Utensils, DollarSign, Users } from 'lucide-react';

const RestaurantDashboard = () => {
  // Mock data - in a real app, these would come from backend
  const stats = [
    { 
      title: "Total Orders", 
      value: "128", 
      icon: <ShoppingBag className="h-4 w-4 text-muted-foreground" /> 
    },
    { 
      title: "Active Menu Items", 
      value: "24", 
      icon: <Utensils className="h-4 w-4 text-muted-foreground" /> 
    },
    { 
      title: "Weekly Revenue", 
      value: "₹32,450", 
      icon: <DollarSign className="h-4 w-4 text-muted-foreground" /> 
    },
    { 
      title: "Total Customers", 
      value: "86", 
      icon: <Users className="h-4 w-4 text-muted-foreground" /> 
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Restaurant Dashboard</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((order) => (
                <div key={order} className="flex items-center justify-between border-b pb-2">
                  <div>
                    <p className="font-medium">Order #{1000 + order}</p>
                    <p className="text-sm text-muted-foreground">₹{Math.floor(Math.random() * 1000)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">5 items</p>
                    <p className="text-xs text-muted-foreground">Just now</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Popular Dishes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {['Paneer Butter Masala', 'Dal Makhani', 'Veg Biryani', 'Chole Bhature'].map((dish, index) => (
                <div key={index} className="flex items-center justify-between border-b pb-2">
                  <div>
                    <p className="font-medium">{dish}</p>
                    <p className="text-sm text-muted-foreground">₹{150 + (index * 25)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{80 - (index * 10)} orders</p>
                    <div className="h-2 w-24 bg-gray-200 rounded-full mt-1">
                      <div 
                        className="h-2 bg-bhoj-primary rounded-full" 
                        style={{ width: `${100 - (index * 20)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RestaurantDashboard;
