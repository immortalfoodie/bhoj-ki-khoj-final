import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  restaurantName: string;
  restaurantId: number;
  restaurantCoordinates?: {
    latitude: number;
    longitude: number;
  };
  image?: string;
  description?: string;
  isVeg?: boolean;
  spiceLevel?: string;
  portionSize?: string;
  specialIngredients?: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: CartItem) => Promise<void>;
  removeFromCart: (itemId: number) => void;
  updateQuantity: (itemId: number, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartItemCount: () => number;
  totalItems: number;
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    const savedCart = localStorage.getItem('bhoj_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('bhoj_cart', JSON.stringify(items));
  }, [items]);

  // Clear cart only when navigating to a different restaurant
  useEffect(() => {
    const isRestaurantPage = location.pathname.includes('/restaurant/');
    const isCartPage = location.pathname === '/cart';
    const isCheckoutPage = location.pathname === '/checkout';
    
    // Only clear if we're on a restaurant page and have items from a different restaurant
    if (isRestaurantPage && items.length > 0) {
      const currentRestaurantId = location.pathname.split('/').pop();
      if (currentRestaurantId && items[0].restaurantId.toString() !== currentRestaurantId) {
        toast({
          title: "Cart Cleared",
          description: "Your cart has been cleared as you're ordering from a different restaurant.",
        });
        clearCart();
      }
    }
  }, [location.pathname, items, toast]);

  const addToCart = async (item: CartItem) => {
    try {
      setIsLoading(true);
      setError(null);

      // Validate item
      if (!item.id || !item.name || !item.price || !item.quantity || !item.restaurantId || !item.restaurantName) {
        throw new Error("Invalid item data");
      }

      setItems(prevItems => {
        // Check if item from same restaurant
        if (prevItems.length > 0 && prevItems[0].restaurantId !== item.restaurantId) {
          // Replace cart with new item
          return [item];
        }
        
        // Check if item exists
        const existingItemIndex = prevItems.findIndex(i => i.id === item.id);
        
        if (existingItemIndex >= 0) {
          // Update quantity if item exists
          const updatedItems = [...prevItems];
          updatedItems[existingItemIndex].quantity += item.quantity;
          return updatedItems;
        } else {
          // Add new item
          return [...prevItems, item];
        }
      });

      toast({
        title: "Added to Cart",
        description: `${item.name} has been added to your cart.`,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to add item to cart";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromCart = (itemId: number) => {
    try {
      setError(null);
      const itemToRemove = items.find(item => item.id === itemId);
      
      setItems(prevItems => prevItems.filter(item => item.id !== itemId));

      if (itemToRemove) {
        toast({
          title: "Removed from Cart",
          description: `${itemToRemove.name} has been removed from your cart.`,
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to remove item from cart";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    }
  };

  const updateQuantity = (itemId: number, quantity: number) => {
    try {
      setError(null);
      if (quantity < 1) {
        throw new Error("Quantity must be at least 1");
      }

      setItems(prevItems => 
        prevItems.map(item => 
          item.id === itemId
            ? { ...item, quantity: Math.max(1, quantity) }
            : item
        )
      );
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to update quantity";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    }
  };

  const clearCart = () => {
    try {
      setError(null);
      setItems([]);
      localStorage.removeItem('bhoj_cart');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to clear cart";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    }
  };

  const getCartTotal = useCallback(() => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [items]);

  const getCartItemCount = useCallback(() => {
    return items.reduce((count, item) => count + item.quantity, 0);
  }, [items]);

  // Calculate totalItems property using useMemo
  const totalItems = useMemo(() => getCartItemCount(), [getCartItemCount]);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartItemCount,
        totalItems,
        isLoading,
        error,
        clearError
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
