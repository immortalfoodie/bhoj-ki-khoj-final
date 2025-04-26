
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarSeparator, MenubarTrigger } from "@/components/ui/menubar";
import { Check, X, Search, Filter, MoreHorizontal, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock restaurant data
const mockRestaurants = [
  { 
    id: 1, 
    name: 'Maa ki Rasoi', 
    owner: 'Anjali Sharma', 
    location: 'Dadar, Mumbai',
    cuisines: ['North Indian', 'Home Style'],
    rating: 4.8,
    orders: 342,
    status: 'active',
    verified: true
  },
  { 
    id: 2, 
    name: 'Ghar ka Khana', 
    owner: 'Rajesh Patel', 
    location: 'Andheri, Mumbai',
    cuisines: ['Gujarati', 'Home Style'],
    rating: 4.6,
    orders: 287,
    status: 'active',
    verified: true
  },
  { 
    id: 3, 
    name: 'Apna Zaika', 
    owner: 'Mohammed Siddiqui', 
    location: 'Bandra, Mumbai',
    cuisines: ['Mughlai', 'Biryani'],
    rating: 4.5,
    orders: 268,
    status: 'active',
    verified: true
  },
  { 
    id: 4, 
    name: 'Desi Dhaba', 
    owner: 'Gurpreet Singh', 
    location: 'Chembur, Mumbai',
    cuisines: ['Punjabi', 'Street Food'],
    rating: 4.3,
    orders: 196,
    status: 'suspended',
    verified: true
  },
  { 
    id: 5, 
    name: 'South Express', 
    owner: 'Lakshmi Iyer', 
    location: 'Matunga, Mumbai',
    cuisines: ['South Indian', 'Tiffin'],
    rating: 4.7,
    orders: 231,
    status: 'active',
    verified: true
  },
  { 
    id: 6, 
    name: 'Mom\'s Kitchen', 
    owner: 'Priya Desai', 
    location: 'Juhu, Mumbai',
    cuisines: ['Maharashtrian', 'Home Style'],
    rating: null,
    orders: 0,
    status: 'pending',
    verified: false
  },
];

const RestaurantManagement = () => {
  const [restaurants, setRestaurants] = useState(mockRestaurants);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const { toast } = useToast();

  const handleStatusChange = (id: number, newStatus: 'active' | 'suspended' | 'pending') => {
    setRestaurants(prevRestaurants => 
      prevRestaurants.map(restaurant => 
        restaurant.id === id ? { ...restaurant, status: newStatus } : restaurant
      )
    );
    
    const restaurant = restaurants.find(r => r.id === id);
    
    toast({
      title: `Restaurant status updated`,
      description: `${restaurant?.name} is now ${newStatus}`,
      variant: newStatus === 'active' ? 'default' : newStatus === 'suspended' ? 'destructive' : 'default',
    });
  };

  const handleVerify = (id: number, verified: boolean) => {
    setRestaurants(prevRestaurants => 
      prevRestaurants.map(restaurant => 
        restaurant.id === id ? { ...restaurant, verified, status: verified ? 'active' : 'pending' } : restaurant
      )
    );
    
    const restaurant = restaurants.find(r => r.id === id);
    
    toast({
      title: verified ? 'Restaurant verified' : 'Verification removed',
      description: `${restaurant?.name} has been ${verified ? 'verified' : 'unverified'}`,
      variant: verified ? 'default' : 'destructive',
    });
  };

  const filteredRestaurants = restaurants.filter(restaurant => {
    const matchesSearch = restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         restaurant.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         restaurant.location.toLowerCase().includes(searchQuery.toLowerCase());
                         
    const matchesFilter = filterStatus === null || restaurant.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-green-800">Restaurant Management</h1>
        <Button className="bg-green-600 hover:bg-green-700">
          Add Restaurant
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Restaurant Listings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row justify-between mb-4 space-y-2 sm:space-y-0 sm:space-x-2">
            <div className="relative sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search restaurants..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
            
            <Menubar>
              <MenubarMenu>
                <MenubarTrigger className="flex items-center">
                  <Filter className="mr-2 h-4 w-4" />
                  <span>{filterStatus ? `Status: ${filterStatus}` : 'Filter by status'}</span>
                </MenubarTrigger>
                <MenubarContent>
                  <MenubarItem onClick={() => setFilterStatus(null)}>
                    All Statuses
                  </MenubarItem>
                  <MenubarSeparator />
                  <MenubarItem onClick={() => setFilterStatus('active')}>
                    Active
                  </MenubarItem>
                  <MenubarItem onClick={() => setFilterStatus('pending')}>
                    Pending
                  </MenubarItem>
                  <MenubarItem onClick={() => setFilterStatus('suspended')}>
                    Suspended
                  </MenubarItem>
                </MenubarContent>
              </MenubarMenu>
            </Menubar>
          </div>

          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-green-50">
                  <TableHead>Restaurant</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Cuisines</TableHead>
                  <TableHead className="text-right">Rating</TableHead>
                  <TableHead className="text-right">Orders</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRestaurants.map((restaurant) => (
                  <TableRow key={restaurant.id}>
                    <TableCell className="font-medium">
                      <div>
                        {restaurant.name}
                        <div className="text-xs text-gray-500">{restaurant.owner}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <MapPin className="h-3 w-3 mr-1 text-gray-400" />
                        <span className="text-sm">{restaurant.location}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {restaurant.cuisines.map((cuisine, i) => (
                          <Badge key={i} variant="outline" className="text-xs bg-green-50">
                            {cuisine}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      {restaurant.rating ? restaurant.rating : '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      {restaurant.orders}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        className={`
                          ${restaurant.status === 'active' ? 'bg-green-100 text-green-800' : ''}
                          ${restaurant.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                          ${restaurant.status === 'suspended' ? 'bg-red-100 text-red-800' : ''}
                        `}
                      >
                        {restaurant.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end space-x-2">
                        {restaurant.status === 'pending' && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="h-8 border-green-200 text-green-800 hover:bg-green-50"
                            onClick={() => handleVerify(restaurant.id, true)}
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Verify
                          </Button>
                        )}
                        
                        {restaurant.status === 'active' && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="h-8 border-red-200 text-red-800 hover:bg-red-50"
                            onClick={() => handleStatusChange(restaurant.id, 'suspended')}
                          >
                            <X className="h-4 w-4 mr-1" />
                            Suspend
                          </Button>
                        )}
                        
                        {restaurant.status === 'suspended' && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="h-8 border-green-200 text-green-800 hover:bg-green-50"
                            onClick={() => handleStatusChange(restaurant.id, 'active')}
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Reactivate
                          </Button>
                        )}
                        
                        <Button size="sm" variant="ghost" className="h-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RestaurantManagement;
