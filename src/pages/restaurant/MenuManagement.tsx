import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { PlusCircle, Edit, Trash, Upload, X } from 'lucide-react';
import { useForm } from "react-hook-form";
import { Badge } from "@/components/ui/badge";

// Sample menu items data
const initialMenuItems = [
  {
    id: 1,
    name: "Royal Maharaja Thali",
    description: "A grand thali with 4 curries, 2 breads, rice, dessert, and more",
    shortDescription: "Ghee-laced rotis, seasonal sabzis, served with lassi",
    price: 450,
    image: "https://source.unsplash.com/random/300x200/?thali",
    category: "thali",
    isVeg: true,
    isPopular: true,
    spiceLevel: "Medium",
    portionSize: "Full meal",
    isAvailable: true
  },
  {
    id: 2,
    name: "Dal Makhani",
    description: "Creamy black lentils cooked overnight with butter and cream",
    price: 180,
    image: "https://source.unsplash.com/random/300x200/?dal",
    category: "main",
    isVeg: true,
    isAvailable: true
  },
  {
    id: 3,
    name: "Veg Biryani",
    description: "Fragrant rice cooked with mixed vegetables and aromatic spices",
    price: 220,
    image: "https://source.unsplash.com/random/300x200/?biryani",
    category: "rice",
    isVeg: true,
    isAvailable: true
  },
  {
    id: 4,
    name: "Gulab Jamun",
    description: "Deep-fried milk solid balls soaked in sugar syrup",
    price: 120,
    image: "https://source.unsplash.com/random/300x200/?sweet",
    category: "dessert",
    isVeg: true,
    isAvailable: true
  }
];

const MenuManagement = () => {
  const [menuItems, setMenuItems] = useState(initialMenuItems);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  
  const form = useForm({
    defaultValues: {
      name: "",
      description: "",
      shortDescription: "",
      price: "",
      category: "main",
      isVeg: true,
      isPopular: false,
      spiceLevel: "Medium",
      portionSize: "Full meal",
      isAvailable: true,
      image: ""
    }
  });
  
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const handleAddItem = (data: any) => {
    const newItem = {
      id: menuItems.length + 1,
      ...data,
      price: parseFloat(data.price),
      image: selectedImage || "https://source.unsplash.com/random/300x200/?food"
    };
    
    setMenuItems([...menuItems, newItem]);
    setIsAddDialogOpen(false);
    setSelectedImage(null);
    form.reset();
    
    toast({
      title: "Menu Item Added",
      description: `${newItem.name} has been added to your menu.`,
    });
  };
  
  const handleEditItem = (item: any) => {
    setEditingItem(item);
    setSelectedImage(item.image);
    form.reset({
      name: item.name,
      description: item.description,
      price: item.price.toString(),
      category: item.category,
      isVeg: item.isVeg,
      isAvailable: item.isAvailable
    });
    setIsAddDialogOpen(true);
  };
  
  const handleUpdateItem = (data: any) => {
    const updatedItems = menuItems.map(item => 
      item.id === editingItem.id 
        ? { 
            ...item, 
            ...data, 
            price: parseFloat(data.price),
            image: selectedImage || item.image
          } 
        : item
    );
    
    setMenuItems(updatedItems);
    setIsAddDialogOpen(false);
    setEditingItem(null);
    setSelectedImage(null);
    form.reset();
    
    toast({
      title: "Menu Item Updated",
      description: `${data.name} has been updated.`,
    });
  };
  
  const handleDeleteItem = (id: number) => {
    setMenuItems(menuItems.filter(item => item.id !== id));
    
    toast({
      title: "Menu Item Deleted",
      description: "The menu item has been removed.",
      variant: "destructive"
    });
  };
  
  const handleToggleAvailability = (id: number) => {
    setMenuItems(menuItems.map(item => 
      item.id === id 
        ? { ...item, isAvailable: !item.isAvailable } 
        : item
    ));
  };
  
  const onSubmit = (data: any) => {
    if (editingItem) {
      handleUpdateItem(data);
    } else {
      handleAddItem(data);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Menu Management</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-bhoj-primary hover:bg-bhoj-dark">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Menu Item
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{editingItem ? "Edit Menu Item" : "Add New Menu Item"}</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                {/* Image Upload */}
                <FormItem>
                  <FormLabel>Item Image</FormLabel>
                  <FormControl>
                    <div className="flex flex-col items-center space-y-2">
                      {selectedImage ? (
                        <div className="relative">
                          <img
                            src={selectedImage}
                            alt="Preview"
                            className="w-full h-48 object-cover rounded-md"
                          />
                          <button
                            type="button"
                            onClick={handleRemoveImage}
                            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <div
                          onClick={() => fileInputRef.current?.click()}
                          className="w-full h-48 border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center cursor-pointer hover:border-bhoj-primary"
                        >
                          <Upload className="h-8 w-8 text-gray-400" />
                          <p className="mt-2 text-sm text-gray-500">Click to upload image</p>
                        </div>
                      )}
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </div>
                  </FormControl>
                </FormItem>

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium">Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter dish name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium">Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Enter dish description" className="min-h-[100px]" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium">Price (₹)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Enter price" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium">Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="starter">Starter</SelectItem>
                          <SelectItem value="main">Main Course</SelectItem>
                          <SelectItem value="rice">Rice & Breads</SelectItem>
                          <SelectItem value="dessert">Dessert</SelectItem>
                          <SelectItem value="beverage">Beverage</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="isVeg"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-1">
                        <FormLabel className="font-medium">Vegetarian</FormLabel>
                        <FormDescription className="text-sm text-gray-500">
                          Is this dish vegetarian?
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="isAvailable"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-1">
                        <FormLabel className="font-medium">Available</FormLabel>
                        <FormDescription className="text-sm text-gray-500">
                          Is this dish currently available?
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="shortDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium">Short Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Enter a brief description (e.g., serving style, accompaniments)" 
                          className="min-h-[60px]" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="isPopular"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-1">
                        <FormLabel className="font-medium">Popular Item</FormLabel>
                        <FormDescription className="text-sm text-gray-500">
                          Mark this item as popular?
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="spiceLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium">Spice Level</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select spice level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Low">Low</SelectItem>
                          <SelectItem value="Medium">Medium</SelectItem>
                          <SelectItem value="High">High</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="portionSize"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium">Portion Size</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select portion size" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Small">Small</SelectItem>
                          <SelectItem value="Regular">Regular</SelectItem>
                          <SelectItem value="Large">Large</SelectItem>
                          <SelectItem value="Full meal">Full meal</SelectItem>
                          <SelectItem value="6 pieces">6 pieces</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex justify-end">
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="mr-2"
                    onClick={() => {
                      setIsAddDialogOpen(false);
                      setEditingItem(null);
                      setSelectedImage(null);
                      form.reset();
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-bhoj-primary hover:bg-bhoj-dark">
                    {editingItem ? "Update" : "Add"} Item
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {menuItems.map((item) => (
          <Card key={item.id} className={`overflow-hidden ${!item.isAvailable ? 'opacity-70' : ''}`}>
            <div className="relative h-48 bg-gray-200">
              <img 
                src={item.image} 
                alt={item.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2 flex space-x-2">
                <button 
                  onClick={() => handleEditItem(item)}
                  className="bg-white p-2 rounded-full shadow hover:bg-gray-100"
                >
                  <Edit className="h-4 w-4 text-bhoj-primary" />
                </button>
                <button 
                  onClick={() => handleDeleteItem(item.id)}
                  className="bg-white p-2 rounded-full shadow hover:bg-gray-100"
                >
                  <Trash className="h-4 w-4 text-red-500" />
                </button>
              </div>
              <div className="absolute top-2 left-2">
                <div className={`w-4 h-4 rounded-full ${item.isVeg ? 'bg-green-500' : 'bg-red-500'}`} />
              </div>
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="flex justify-between items-center gap-2">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <span className="truncate text-base">{item.name}</span>
                  {item.isPopular && (
                    <Badge variant="secondary" className="bg-orange-500 text-white text-xs shrink-0">
                      Popular
                    </Badge>
                  )}
                </div>
                <span className="text-bhoj-primary font-bold whitespace-nowrap">₹{item.price}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <p className="text-sm text-gray-700 line-clamp-2 min-h-[2.5rem]">{item.description}</p>
                {item.shortDescription && (
                  <p className="text-sm text-gray-500 italic line-clamp-1">{item.shortDescription}</p>
                )}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {item.spiceLevel && (
                  <Badge variant="outline" className="text-xs px-2 py-0.5 truncate max-w-[8rem]">
                    {item.spiceLevel} Spice
                  </Badge>
                )}
                {item.portionSize && (
                  <Badge variant="outline" className="text-xs px-2 py-0.5 truncate max-w-[8rem]">
                    {item.portionSize}
                  </Badge>
                )}
                <Badge className={`text-xs px-2 py-0.5 truncate max-w-[8rem] ${item.isVeg ? "bg-green-500" : "bg-red-500"} text-white`}>
                  {item.isVeg ? "Veg" : "Non-Veg"}
                </Badge>
                <Badge variant="outline" className="text-xs px-2 py-0.5 truncate max-w-[8rem]">
                  {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                </Badge>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4">
              <div className="flex items-center justify-between w-full">
                <span className="text-sm text-gray-500">
                  {item.isAvailable ? 'Available' : 'Not Available'}
                </span>
                <Switch 
                  checked={item.isAvailable}
                  onCheckedChange={() => handleToggleAvailability(item.id)}
                />
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MenuManagement;
