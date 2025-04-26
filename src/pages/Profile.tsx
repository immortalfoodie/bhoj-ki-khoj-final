import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import AvatarUpload from '@/components/profile/AvatarUpload';
import { 
  User, Phone as PhoneIcon, Mail, MapPin, Shield, Bell, CreditCard, 
  LogOut, ChevronRight, Edit, Clock, ShoppingBag, Loader2
} from 'lucide-react';

// Mock order history data
const orderHistory = [
  {
    id: "ORD-10293",
    date: "Today, 12:30 PM",
    restaurant: "Gujarati Tiffin Service",
    items: 3,
    total: 440,
    status: "Delivered",
  },
  {
    id: "ORD-10254",
    date: "Yesterday, 7:45 PM",
    restaurant: "Bengali Home Foods",
    items: 2,
    total: 350,
    status: "Delivered",
  },
  {
    id: "ORD-10187",
    date: "20 Jun 2023, 1:15 PM",
    restaurant: "Home Spice Kitchen",
    items: 4,
    total: 620,
    status: "Delivered",
  },
  {
    id: "ORD-10122",
    date: "15 Jun 2023, 8:30 PM",
    restaurant: "South Indian Homemade",
    items: 2,
    total: 280,
    status: "Cancelled",
  }
];

// Mock saved addresses
const savedAddresses = [
  {
    id: 1,
    type: "Home",
    address: "123, Green Residency, Navrangpura, Ahmedabad - 380009",
    isDefault: true,
  },
  {
    id: 2,
    type: "Work",
    address: "456, Business Park, S.G. Highway, Ahmedabad - 380054",
    isDefault: false,
  }
];

const Profile = () => {
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("profile");
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Get user data from context
  const user = authContext?.user;
  
  // Form state
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });
  
  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleLogout = () => {
    if (!authContext) return;
    authContext.logout();
    navigate('/auth/login');
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
  };
  
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
      });
    } catch (error) {
      toast({
        title: "Update failed",
        description: "Could not update profile",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">My Profile</h1>
      
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-1">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center">
                <AvatarUpload />
                <h2 className="text-xl font-bold mt-4">{user?.name}</h2>
                <p className="text-gray-500">{user?.email}</p>
                
                {user?.phone && (
                  <p className="text-gray-500 mt-1">{user.phone}</p>
                )}
              </div>
              
              <Separator className="my-6" />
              
              <nav className="space-y-2">
                <button 
                  className={`flex items-center w-full p-2 rounded-md ${activeTab === "profile" ? "bg-bhoj-light text-bhoj-primary" : "hover:bg-gray-100"}`}
                  onClick={() => setActiveTab("profile")}
                >
                  <User className="mr-3 h-5 w-5" />
                  Personal Details
                </button>
                <button 
                  className={`flex items-center w-full p-2 rounded-md ${activeTab === "orders" ? "bg-bhoj-light text-bhoj-primary" : "hover:bg-gray-100"}`}
                  onClick={() => setActiveTab("orders")}
                >
                  <ShoppingBag className="mr-3 h-5 w-5" />
                  My Orders
                </button>
                <button 
                  className={`flex items-center w-full p-2 rounded-md ${activeTab === "addresses" ? "bg-bhoj-light text-bhoj-primary" : "hover:bg-gray-100"}`}
                  onClick={() => setActiveTab("addresses")}
                >
                  <MapPin className="mr-3 h-5 w-5" />
                  Saved Addresses
                </button>
                <button 
                  className={`flex items-center w-full p-2 rounded-md ${activeTab === "payments" ? "bg-bhoj-light text-bhoj-primary" : "hover:bg-gray-100"}`}
                  onClick={() => setActiveTab("payments")}
                >
                  <CreditCard className="mr-3 h-5 w-5" />
                  Payment Methods
                </button>
                <button 
                  className={`flex items-center w-full p-2 rounded-md ${activeTab === "notifications" ? "bg-bhoj-light text-bhoj-primary" : "hover:bg-gray-100"}`}
                  onClick={() => setActiveTab("notifications")}
                >
                  <Bell className="mr-3 h-5 w-5" />
                  Notifications
                </button>
                <button 
                  className={`flex items-center w-full p-2 rounded-md ${activeTab === "security" ? "bg-bhoj-light text-bhoj-primary" : "hover:bg-gray-100"}`}
                  onClick={() => setActiveTab("security")}
                >
                  <Shield className="mr-3 h-5 w-5" />
                  Security
                </button>
              </nav>
              
              <Separator className="my-6" />
              
              <Button 
                variant="destructive" 
                className="w-full"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              {activeTab === "profile" && <CardTitle>Personal Details</CardTitle>}
              {activeTab === "orders" && <CardTitle>Order History</CardTitle>}
              {activeTab === "addresses" && <CardTitle>Saved Addresses</CardTitle>}
              {activeTab === "payments" && <CardTitle>Payment Methods</CardTitle>}
              {activeTab === "notifications" && <CardTitle>Notification Settings</CardTitle>}
              {activeTab === "security" && <CardTitle>Security Settings</CardTitle>}
            </CardHeader>
            <CardContent>
              {/* Profile Tab */}
              {activeTab === "profile" && (
                <form onSubmit={handleProfileUpdate} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input 
                        id="name" 
                        name="name" 
                        value={formData.name} 
                        onChange={handleFormChange}
                        disabled={isUpdating}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        name="email" 
                        value={formData.email} 
                        disabled={true} 
                        className="bg-gray-50"
                      />
                      <p className="text-xs text-gray-500">Email cannot be changed</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input 
                        id="phone" 
                        name="phone" 
                        value={formData.phone} 
                        onChange={handleFormChange}
                        disabled={isUpdating}
                        placeholder="+91 9876543210"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="role">Role</Label>
                      <Input 
                        id="role" 
                        value={user?.role?.charAt(0).toUpperCase() + (user?.role?.slice(1) || '')} 
                        disabled={true}
                        className="bg-gray-50"
                      />
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <Button 
                      type="submit" 
                      className="bg-bhoj-primary hover:bg-bhoj-dark"
                      disabled={isUpdating}
                    >
                      {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      {isUpdating ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </form>
              )}
              
              {/* Orders Tab */}
              {activeTab === "orders" && (
                <div className="space-y-4">
                  {orderHistory.map((order) => (
                    <div key={order.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center">
                            <h3 className="font-medium">{order.restaurant}</h3>
                            <span className={`ml-2 text-xs px-2 py-1 rounded ${order.status === "Delivered" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                              {order.status}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">
                            <Clock className="inline h-3 w-3 mr-1" />
                            {order.date}
                          </p>
                          <p className="text-sm">
                            {order.items} items • ₹{order.total}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => navigate(`/track/${order.id}`)}
                          >
                            View Details
                          </Button>
                          {order.status === "Delivered" && (
                            <Button variant="outline" size="sm" className="text-bhoj-primary border-bhoj-primary">
                              Reorder
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Addresses Tab */}
              {activeTab === "addresses" && (
                <div className="space-y-4">
                  {savedAddresses.map((address) => (
                    <div key={address.id} className="border rounded-lg p-4">
                      <div className="flex justify-between">
                        <div>
                          <div className="flex items-center">
                            <h3 className="font-medium">{address.type}</h3>
                            {address.isDefault && (
                              <span className="ml-2 text-xs px-2 py-1 rounded bg-bhoj-light text-bhoj-primary">
                                Default
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{address.address}</p>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                  <Button className="w-full bg-bhoj-primary hover:bg-bhoj-dark">
                    Add New Address
                  </Button>
                </div>
              )}
              
              {/* Payments Tab */}
              {activeTab === "payments" && (
                <div className="space-y-4">
                  <p className="text-gray-500">No payment methods saved yet.</p>
                  <Button className="bg-bhoj-primary hover:bg-bhoj-dark">
                    Add Payment Method
                  </Button>
                </div>
              )}
              
              {/* Notifications Tab */}
              {activeTab === "notifications" && (
                <div className="space-y-4">
                  <p className="text-gray-500">Coming soon! You'll be able to manage your notification preferences here.</p>
                </div>
              )}
              
              {/* Security Tab */}
              {activeTab === "security" && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input 
                      id="currentPassword"
                      name="currentPassword"
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input 
                      id="newPassword"
                      name="newPassword"
                      type="password"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input 
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                    />
                  </div>
                  <Button 
                    className="bg-bhoj-primary hover:bg-bhoj-dark mt-2"
                    disabled={
                      !passwordData.currentPassword || 
                      !passwordData.newPassword || 
                      !passwordData.confirmPassword ||
                      passwordData.newPassword !== passwordData.confirmPassword
                    }
                  >
                    Update Password
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
