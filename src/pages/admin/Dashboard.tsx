import React from 'react';
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Users, Utensils, Truck, ShoppingBag, TrendingUp, AlertTriangle, MapPin, Package, UtensilsCrossed, BarChart as LucideBarChart } from 'lucide-react';
import { Button } from "@/components/ui/button";

const AdminDashboard = () => {
  // Mock data - in a real app, these would come from backend
  const stats = [
    { 
      title: "Total Users", 
      value: "342", 
      change: "+22%",
      icon: <Users className="h-5 w-5 text-green-700" />,
      description: "Active users this month" 
    },
    { 
      title: "Restaurants", 
      value: "24", 
      change: "+5%",
      icon: <Utensils className="h-5 w-5 text-green-700" />,
      description: "Verified food providers" 
    },
    { 
      title: "Dabbawalas", 
      value: "38", 
      change: "+12%",
      icon: <Truck className="h-5 w-5 text-green-700" />,
      description: "Active delivery partners" 
    },
    { 
      title: "Total Orders", 
      value: "1,245", 
      change: "+18%",
      icon: <ShoppingBag className="h-5 w-5 text-green-700" />,
      description: "Orders processed this month" 
    }
  ];

  // Mock data for charts
  const orderTrendData = [
    { name: 'Jan', orders: 400 },
    { name: 'Feb', orders: 300 },
    { name: 'Mar', orders: 600 },
    { name: 'Apr', orders: 800 },
    { name: 'May', orders: 700 },
    { name: 'Jun', orders: 1000 },
    { name: 'Jul', orders: 1200 },
  ];

  const topRestaurantsData = [
    { name: 'Maa ki Rasoi', orders: 120 },
    { name: 'Ghar ka Khana', orders: 98 },
    { name: 'Apna Zaika', orders: 86 },
    { name: 'Desi Dhaba', orders: 72 },
    { name: 'Punjab Express', orders: 65 },
  ];

  const alertsData = [
    { id: 1, type: 'Restaurant Verification', message: 'New restaurant "Maa ki Rasoi" pending verification', time: '2 hours ago' },
    { id: 2, type: 'User Report', message: 'Multiple complaints about late delivery from "Desi Dhaba"', time: '5 hours ago' },
    { id: 3, type: 'Dabbawala Application', message: '3 new dabbawala applications pending review', time: '1 day ago' },
  ];

  // Add coverage area data for map visualization
  const coverageAreas = [
    { id: 1, area: "Dadar-Parel", restaurants: 12, dabbawalas: 8, coordinates: [72.8296, 19.0178] },
    { id: 2, area: "Andheri-Bandra", restaurants: 18, dabbawalas: 10, coordinates: [72.8479, 19.1071] },
    { id: 3, area: "Churchgate-CST", restaurants: 14, dabbawalas: 9, coordinates: [72.8347, 18.9389] },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">Last updated: Today, 10:30 AM</span>
          <button className="text-sm text-green-600 hover:text-green-800">
            Refresh Data
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Order Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">Manage and track all orders</p>
            <Link to="/admin/orders">
              <Button className="w-full bg-bhoj-primary hover:bg-bhoj-dark">
                View Orders
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UtensilsCrossed className="h-5 w-5" />
              Menu Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">Manage restaurant menus and items</p>
            <Link to="/admin/menus">
              <Button className="w-full bg-bhoj-primary hover:bg-bhoj-dark">
                Manage Menus
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              User Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">Manage users and permissions</p>
            <Link to="/admin/users">
              <Button className="w-full bg-bhoj-primary hover:bg-bhoj-dark">
                Manage Users
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LucideBarChart className="h-5 w-5" />
              Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">View sales and performance metrics</p>
            <Link to="/admin/analytics">
              <Button className="w-full bg-bhoj-primary hover:bg-bhoj-dark">
                View Analytics
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-6">
        {stats.map((stat, index) => (
          <Card key={index} className="border-green-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <div className="p-2 bg-green-50 rounded-full">
                {stat.icon}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center">
                <span className="text-xs text-green-600">{stat.change}</span>
                <p className="text-xs text-muted-foreground ml-2">
                  {stat.description}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Analytics Tabs */}
      <Tabs defaultValue="orders" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-4 mb-4">
          <TabsTrigger value="orders">Order Trends</TabsTrigger>
          <TabsTrigger value="restaurants">Top Restaurants</TabsTrigger>
          <TabsTrigger value="activity">User Activity</TabsTrigger>
          <TabsTrigger value="coverage">Coverage Map</TabsTrigger>
        </TabsList>
        
        <TabsContent value="orders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Order Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={orderTrendData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="orders" 
                      stroke="#10B981" 
                      strokeWidth={2} 
                      dot={{ stroke: '#10B981', strokeWidth: 2, r: 4 }}
                      activeDot={{ stroke: '#059669', strokeWidth: 2, r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="restaurants" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Restaurants</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topRestaurantsData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar 
                      dataKey="orders" 
                      fill="#10B981"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Activity Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Activity metrics will be available once data collection is enabled.
              </p>
              <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm">
                Enable Activity Tracking
              </button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="coverage" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Delivery Coverage Areas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80 w-full rounded-lg bg-gray-100 relative p-4 flex flex-col">
                <div className="text-center text-green-800 font-medium mb-4">
                  Google Maps API integration would display coverage areas here
                </div>
                <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                  {coverageAreas.map(area => (
                    <div key={area.id} className="bg-white p-3 rounded-md shadow-sm border border-green-100">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 text-green-700 mr-2" />
                        <span className="font-medium">{area.area}</span>
                      </div>
                      <div className="mt-2 text-xs text-gray-600">
                        <div>Restaurants: {area.restaurants}</div>
                        <div>Dabbawalas: {area.dabbawalas}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-auto pt-4">
                  <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm w-full md:w-auto">
                    View Detailed Map
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Alerts and Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Alerts</CardTitle>
              <AlertTriangle className="h-4 w-4 text-amber-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {alertsData.map(alert => (
                <div key={alert.id} className="flex items-start border-b border-gray-100 pb-3 last:border-0">
                  <div className="w-2 h-2 mt-1.5 bg-amber-400 rounded-full mr-3"></div>
                  <div>
                    <p className="text-sm font-medium">{alert.type}</p>
                    <p className="text-sm text-muted-foreground mt-1">{alert.message}</p>
                    <p className="text-xs text-gray-400 mt-1">{alert.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <button className="w-full text-left px-3 py-2 rounded-md hover:bg-green-50 text-sm font-medium flex items-center text-green-700">
                <Utensils className="h-4 w-4 mr-2" />
                Verify New Restaurants
              </button>
              <button className="w-full text-left px-3 py-2 rounded-md hover:bg-green-50 text-sm font-medium flex items-center text-green-700">
                <Truck className="h-4 w-4 mr-2" />
                Approve Dabbawala Applications
              </button>
              <button className="w-full text-left px-3 py-2 rounded-md hover:bg-green-50 text-sm font-medium flex items-center text-green-700">
                <TrendingUp className="h-4 w-4 mr-2" />
                View Full Analytics
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
