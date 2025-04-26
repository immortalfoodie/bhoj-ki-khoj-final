
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, X, Search, MapPin, Truck, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock dabbawalas data
const mockDabbawalas = [
  {
    id: 1,
    name: 'Ramesh Yadav',
    area: 'Dadar-Parel',
    phone: '9876543210',
    rating: 4.9,
    deliveries: 342,
    onTime: '98%',
    status: 'active',
    verified: true
  },
  {
    id: 2,
    name: 'Suresh Patil',
    area: 'Andheri-Bandra',
    phone: '9876543211',
    rating: 4.7,
    deliveries: 287,
    onTime: '95%',
    status: 'active',
    verified: true
  },
  {
    id: 3,
    name: 'Mahesh Gupta',
    area: 'Matunga-Sion',
    phone: '9876543212',
    rating: 4.8,
    deliveries: 320,
    onTime: '97%',
    status: 'active',
    verified: true
  },
  {
    id: 4,
    name: 'Dinesh Kumar',
    area: 'Churchgate-CST',
    phone: '9876543213',
    rating: 4.5,
    deliveries: 192,
    onTime: '94%',
    status: 'suspended',
    verified: true
  },
  {
    id: 5,
    name: 'Rajesh Sharma',
    area: 'Kurla-Ghatkopar',
    phone: '9876543214',
    rating: 4.6,
    deliveries: 276,
    onTime: '96%',
    status: 'active',
    verified: true
  },
  {
    id: 6,
    name: 'Prakash Joshi',
    area: 'Borivali-Kandivali',
    phone: '9876543215',
    rating: null,
    deliveries: 0,
    onTime: '-',
    status: 'pending',
    verified: false
  },
];

// Mock coverage areas
const coverageAreas = [
  { area: 'Dadar-Parel', dabbawalas: 8, restaurants: 12, coverage: 'High' },
  { area: 'Andheri-Bandra', dabbawalas: 10, restaurants: 18, coverage: 'High' },
  { area: 'Matunga-Sion', dabbawalas: 6, restaurants: 9, coverage: 'Medium' },
  { area: 'Churchgate-CST', dabbawalas: 9, restaurants: 14, coverage: 'High' },
  { area: 'Kurla-Ghatkopar', dabbawalas: 7, restaurants: 11, coverage: 'Medium' },
  { area: 'Borivali-Kandivali', dabbawalas: 5, restaurants: 8, coverage: 'Low' },
];

const DabbawalaManagement = () => {
  const [dabbawalas, setDabbawalas] = useState(mockDabbawalas);
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  const handleStatusChange = (id: number, newStatus: 'active' | 'suspended' | 'pending') => {
    setDabbawalas(prevDabbawalas => 
      prevDabbawalas.map(dabbawala => 
        dabbawala.id === id ? { ...dabbawala, status: newStatus } : dabbawala
      )
    );
    
    const dabbawala = dabbawalas.find(d => d.id === id);
    
    toast({
      title: `Dabbawala status updated`,
      description: `${dabbawala?.name} is now ${newStatus}`,
      variant: newStatus === 'active' ? 'default' : newStatus === 'suspended' ? 'destructive' : 'default',
    });
  };

  const handleVerify = (id: number, verified: boolean) => {
    setDabbawalas(prevDabbawalas => 
      prevDabbawalas.map(dabbawala => 
        dabbawala.id === id ? { ...dabbawala, verified, status: verified ? 'active' : 'pending' } : dabbawala
      )
    );
    
    const dabbawala = dabbawalas.find(d => d.id === id);
    
    toast({
      title: verified ? 'Dabbawala verified' : 'Verification removed',
      description: `${dabbawala?.name} has been ${verified ? 'verified' : 'unverified'}`,
      variant: verified ? 'default' : 'destructive',
    });
  };

  const filteredDabbawalas = dabbawalas.filter(dabbawala =>
    dabbawala.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dabbawala.area.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dabbawala.phone.includes(searchQuery)
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-green-800">Dabbawala Management</h1>
        <Button className="bg-green-600 hover:bg-green-700">
          Add Dabbawala
        </Button>
      </div>

      <Tabs defaultValue="dabbawalas" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2 mb-4">
          <TabsTrigger value="dabbawalas">Dabbawalas</TabsTrigger>
          <TabsTrigger value="coverage">Coverage Areas</TabsTrigger>
        </TabsList>
        
        <TabsContent value="dabbawalas" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Dabbawala Listings</CardTitle>
              <CardDescription>Manage delivery partners across Mumbai</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative sm:w-64 mb-4">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search dabbawalas..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>

              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-green-50">
                      <TableHead>Name</TableHead>
                      <TableHead>Area</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead className="text-right">Rating</TableHead>
                      <TableHead className="text-right">Deliveries</TableHead>
                      <TableHead className="text-right">On-Time</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDabbawalas.map((dabbawala) => (
                      <TableRow key={dabbawala.id}>
                        <TableCell className="font-medium">{dabbawala.name}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <MapPin className="h-3 w-3 mr-1 text-gray-400" />
                            <span className="text-sm">{dabbawala.area}</span>
                          </div>
                        </TableCell>
                        <TableCell>{dabbawala.phone}</TableCell>
                        <TableCell className="text-right">
                          {dabbawala.rating ? (
                            <div className="flex items-center justify-end">
                              <Star className="h-3 w-3 fill-amber-400 text-amber-400 mr-1" />
                              <span>{dabbawala.rating}</span>
                            </div>
                          ) : '-'}
                        </TableCell>
                        <TableCell className="text-right">{dabbawala.deliveries}</TableCell>
                        <TableCell className="text-right">{dabbawala.onTime}</TableCell>
                        <TableCell>
                          <Badge 
                            className={`
                              ${dabbawala.status === 'active' ? 'bg-green-100 text-green-800' : ''}
                              ${dabbawala.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                              ${dabbawala.status === 'suspended' ? 'bg-red-100 text-red-800' : ''}
                            `}
                          >
                            {dabbawala.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-end space-x-2">
                            {dabbawala.status === 'pending' && (
                              <Button 
                                size="sm" 
                                variant="outline"
                                className="h-8 border-green-200 text-green-800 hover:bg-green-50"
                                onClick={() => handleVerify(dabbawala.id, true)}
                              >
                                <Check className="h-4 w-4 mr-1" />
                                Verify
                              </Button>
                            )}
                            
                            {dabbawala.status === 'active' && (
                              <Button 
                                size="sm" 
                                variant="outline"
                                className="h-8 border-red-200 text-red-800 hover:bg-red-50"
                                onClick={() => handleStatusChange(dabbawala.id, 'suspended')}
                              >
                                <X className="h-4 w-4 mr-1" />
                                Suspend
                              </Button>
                            )}
                            
                            {dabbawala.status === 'suspended' && (
                              <Button 
                                size="sm" 
                                variant="outline"
                                className="h-8 border-green-200 text-green-800 hover:bg-green-50"
                                onClick={() => handleStatusChange(dabbawala.id, 'active')}
                              >
                                <Check className="h-4 w-4 mr-1" />
                                Reactivate
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="coverage" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Coverage Areas</CardTitle>
              <CardDescription>Dabbawala delivery areas across Mumbai</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-green-50">
                      <TableHead>Area</TableHead>
                      <TableHead className="text-right">Dabbawalas</TableHead>
                      <TableHead className="text-right">Restaurants</TableHead>
                      <TableHead>Coverage Level</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {coverageAreas.map((area, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">
                          <div className="flex items-center">
                            <MapPin className="h-3 w-3 mr-1 text-gray-400" />
                            <span>{area.area}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">{area.dabbawalas}</TableCell>
                        <TableCell className="text-right">{area.restaurants}</TableCell>
                        <TableCell>
                          <Badge 
                            className={`
                              ${area.coverage === 'High' ? 'bg-green-100 text-green-800' : ''}
                              ${area.coverage === 'Medium' ? 'bg-yellow-100 text-yellow-800' : ''}
                              ${area.coverage === 'Low' ? 'bg-red-100 text-red-800' : ''}
                            `}
                          >
                            {area.coverage}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-end">
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="h-8 border-green-200 text-green-800 hover:bg-green-50"
                            >
                              <Truck className="h-4 w-4 mr-1" />
                              View Map
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
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DabbawalaManagement;
