
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface CategoryTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  restaurantCount: number;
}

const CategoryTabs = ({ activeTab, setActiveTab, restaurantCount }: CategoryTabsProps) => {
  return (
    <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="mb-6">
      <TabsList className="bg-gray-100 p-1">
        <TabsTrigger value="popular" className="data-[state=active]:bg-bhoj-primary data-[state=active]:text-white">
          Popular
        </TabsTrigger>
        <TabsTrigger value="new" className="data-[state=active]:bg-bhoj-primary data-[state=active]:text-white">
          New
        </TabsTrigger>
        <TabsTrigger value="veg" className="data-[state=active]:bg-bhoj-primary data-[state=active]:text-white">
          Veg
        </TabsTrigger>
        <TabsTrigger value="non-veg" className="data-[state=active]:bg-bhoj-primary data-[state=active]:text-white">
          Non-Veg
        </TabsTrigger>
        <TabsTrigger value="tiffin" className="data-[state=active]:bg-bhoj-primary data-[state=active]:text-white">
          Tiffin Services
        </TabsTrigger>
      </TabsList>

      <div className="flex justify-between items-center my-4">
        <p className="text-sm text-gray-500">
          {restaurantCount} results found
        </p>
        <TabsContent value={activeTab} className="mt-0 flex-1" />
      </div>
    </Tabs>
  );
};

export default CategoryTabs;
