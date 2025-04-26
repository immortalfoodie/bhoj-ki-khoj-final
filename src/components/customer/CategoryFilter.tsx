import { useState } from "react";
import { cn } from "@/lib/utils";

const categories = [
  { id: "all", name: "All" },
  { id: "veg", name: "Vegetarian" },
  { id: "non-veg", name: "Non-Vegetarian" },
  { id: "thali", name: "Thali" },
  { id: "snacks", name: "Snacks" },
  { id: "dessert", name: "Dessert" }
];

interface CategoryFilterProps {
  onSelectCategory: (categoryId: string) => void;
}

const CategoryFilter = ({ onSelectCategory }: CategoryFilterProps) => {
  const [activeCategory, setActiveCategory] = useState("all");

  const handleCategoryClick = (categoryId: string) => {
    setActiveCategory(categoryId);
    onSelectCategory(categoryId);
  };

  return (
    <div className="overflow-x-auto py-3">
      <div className="flex space-x-2 min-w-max px-1">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategoryClick(category.id)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap",
              activeCategory === category.id
                ? "bg-bhoj-primary text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            )}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;
