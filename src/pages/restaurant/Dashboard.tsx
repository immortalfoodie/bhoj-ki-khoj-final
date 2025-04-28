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
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-6 max-w-[100vw] overflow-x-hidden">
      <h1 className="text-xl sm:text-2xl font-bold">Restaurant Dashboard</h1>
      
      <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index} className="border-l-4 border-bhoj-primary min-w-0">
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
      
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        <Card className="min-w-0">
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 sm:space-y-4">
              {[1, 2, 3, 4].map((order) => (
                <div key={order} className="flex items-center justify-between border-b pb-2">
                  <div className="min-w-0 flex-1 pr-4">
                    <p className="text-sm sm:text-base font-medium truncate">Order #{1000 + order}</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">₹{Math.floor(Math.random() * 1000)}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs sm:text-sm font-medium">5 items</p>
                    <p className="text-xs text-muted-foreground">Just now</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card className="min-w-0">
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">Popular Dishes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 sm:space-y-4">
              {['Paneer Butter Masala', 'Dal Makhani', 'Veg Biryani', 'Chole Bhature'].map((dish, index) => (
                <div key={index} className="flex items-center justify-between border-b pb-2">
                  <div className="min-w-0 flex-1 pr-4">
                    <p className="text-sm sm:text-base font-medium truncate">{dish}</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">₹{150 + (index * 25)}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs sm:text-sm font-medium">{80 - (index * 10)} orders</p>
                    <div className="h-1.5 sm:h-2 w-16 sm:w-24 bg-gray-200 rounded-full mt-1">
                      <div 
                        className="h-1.5 sm:h-2 bg-bhoj-primary rounded-full" 
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
