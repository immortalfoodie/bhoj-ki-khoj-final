
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Settings, Bell, Globe, FileText, Tag } from "lucide-react";

const AppSettings = () => {
  const { toast } = useToast();

  const handleSaveSettings = (settingType: string) => {
    toast({
      title: "Settings saved",
      description: `${settingType} settings have been saved successfully.`,
    });
  };

  // Mock food categories
  const categories = [
    { id: 1, name: 'North Indian', restaurants: 12, active: true },
    { id: 2, name: 'South Indian', restaurants: 8, active: true },
    { id: 3, name: 'Gujarati', restaurants: 5, active: true },
    { id: 4, name: 'Bengali', restaurants: 4, active: true },
    { id: 5, name: 'Punjabi', restaurants: 7, active: true },
    { id: 6, name: 'Maharashtrian', restaurants: 6, active: true },
    { id: 7, name: 'Chinese', restaurants: 3, active: false },
    { id: 8, name: 'Continental', restaurants: 2, active: false },
  ];

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-green-800">App Settings</h1>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-4 mb-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="terms">Terms & Privacy</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Basic application settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="appName">Application Name</Label>
                <Input id="appName" defaultValue="Bhoj-ki-Khoj" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="supportEmail">Support Email</Label>
                <Input id="supportEmail" defaultValue="support@bhojkikhoj.com" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="supportPhone">Support Phone</Label>
                <Input id="supportPhone" defaultValue="+91 9876543210" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="commissionRate">Restaurant Commission Rate (%)</Label>
                  <Input id="commissionRate" type="number" defaultValue="10" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="dabbawalaCommission">Dabbawala Commission Rate (%)</Label>
                  <Input id="dabbawalaCommission" type="number" defaultValue="80" />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="maintenanceMode" />
                <Label htmlFor="maintenanceMode">Maintenance Mode</Label>
              </div>

              <div className="flex justify-end">
                <Button 
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => handleSaveSettings('General')}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Save Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="categories" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Food Categories</CardTitle>
              <CardDescription>Manage food categories in the application</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex justify-end">
                <Button className="bg-green-600 hover:bg-green-700">
                  <Tag className="h-4 w-4 mr-2" />
                  Add New Category
                </Button>
              </div>

              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-green-50">
                      <TableHead>Category</TableHead>
                      <TableHead className="text-right">Restaurants</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {categories.map((category) => (
                      <TableRow key={category.id}>
                        <TableCell className="font-medium">{category.name}</TableCell>
                        <TableCell className="text-right">{category.restaurants}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Switch 
                              id={`category-${category.id}`} 
                              defaultChecked={category.active}
                            />
                            <Label 
                              htmlFor={`category-${category.id}`}
                              className="ml-2"
                            >
                              {category.active ? 'Active' : 'Inactive'}
                            </Label>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm">Edit</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="flex justify-end">
                <Button 
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => handleSaveSettings('Category')}
                >
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Configure notifications for users, restaurants and dabbawalas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <h3 className="font-semibold text-lg flex items-center">
                <Bell className="h-4 w-4 mr-2" />
                Customer Notifications
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Switch id="order-confirmation" defaultChecked />
                  <Label htmlFor="order-confirmation">Order Confirmation</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="order-status" defaultChecked />
                  <Label htmlFor="order-status">Order Status Updates</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="delivery-reminders" defaultChecked />
                  <Label htmlFor="delivery-reminders">Delivery Reminders</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="special-offers" defaultChecked />
                  <Label htmlFor="special-offers">Special Offers</Label>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <h3 className="font-semibold text-lg flex items-center">
                  <Bell className="h-4 w-4 mr-2" />
                  Restaurant Notifications
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  <div className="flex items-center space-x-2">
                    <Switch id="new-orders" defaultChecked />
                    <Label htmlFor="new-orders">New Orders</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="order-cancellations" defaultChecked />
                    <Label htmlFor="order-cancellations">Order Cancellations</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="low-inventory" defaultChecked />
                    <Label htmlFor="low-inventory">Low Inventory Alerts</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="dabbawala-assigned" defaultChecked />
                    <Label htmlFor="dabbawala-assigned">Dabbawala Assigned</Label>
                  </div>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <h3 className="font-semibold text-lg flex items-center">
                  <Bell className="h-4 w-4 mr-2" />
                  Dabbawala Notifications
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  <div className="flex items-center space-x-2">
                    <Switch id="pickup-alerts" defaultChecked />
                    <Label htmlFor="pickup-alerts">Pickup Alerts</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="delivery-updates" defaultChecked />
                    <Label htmlFor="delivery-updates">Delivery Updates</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="route-changes" defaultChecked />
                    <Label htmlFor="route-changes">Route Changes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="earnings-updates" defaultChecked />
                    <Label htmlFor="earnings-updates">Earnings Updates</Label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button 
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => handleSaveSettings('Notification')}
                >
                  Save Notification Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="terms" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Terms & Privacy</CardTitle>
              <CardDescription>Manage terms of service and privacy policy</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="terms">Terms of Service</Label>
                <textarea 
                  id="terms" 
                  rows={10}
                  className="w-full p-3 border rounded-md resize-y"
                  defaultValue="Terms and conditions for Bhoj-ki-Khoj services..."
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="privacy">Privacy Policy</Label>
                <textarea 
                  id="privacy" 
                  rows={10}
                  className="w-full p-3 border rounded-md resize-y"
                  defaultValue="Privacy policy for Bhoj-ki-Khoj application..."
                />
              </div>
              
              <div className="flex justify-end">
                <Button 
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => handleSaveSettings('Terms & Privacy')}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Update Legal Documents
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AppSettings;
