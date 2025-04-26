import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { ShoppingCart } from 'lucide-react';
import { slideUp, bounceTransition } from '@/utils/transitions';

const ViewCartButton = () => {
  const { items, getCartTotal } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Don't show the button if cart is empty or if we're on the checkout page
  if (items.length === 0 || location.pathname === '/checkout') {
    return null;
  }

  const totalItems = items.reduce((count, item) => count + item.quantity, 0);
  const total = getCartTotal();

  const handleViewCart = () => {
    if (isAuthenticated) {
      navigate('/checkout');
    } else {
      navigate('/auth/login', { state: { from: '/checkout' } });
    }
  };

  return (
    <AnimatePresence>
      <motion.div 
        className="fixed bottom-0 left-0 right-0 z-40 bg-gradient-to-b from-transparent to-white pb-[env(safe-area-inset-bottom)] md:pb-2"
        initial="initial"
        animate="animate"
        exit="exit"
        variants={slideUp}
      >
        <div className="px-4 py-1.5">
          <motion.button 
            onClick={handleViewCart}
            className="w-full bg-[#4CAF50] hover:bg-[#45a049] active:bg-[#3d8b40] text-white rounded-lg h-12 flex items-center justify-between px-4 transition-colors duration-200 shadow-md shadow-green-200/50"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={bounceTransition}
          >
            <div className="flex items-center gap-2">
              <div className="relative">
                <ShoppingCart className="h-5 w-5" />
                <motion.span 
                  key={totalItems}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="absolute -top-1.5 -right-1.5 bg-white text-[#4CAF50] text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center"
                >
                  {totalItems}
                </motion.span>
              </div>
              <span className="text-base font-medium">View Cart</span>
            </div>
            <div className="flex items-center gap-2">
              <motion.span 
                key={total}
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-base font-bold"
              >
                ₹{total}
              </motion.span>
              <span className="text-white/80 text-sm">•</span>
              <span className="text-white/80 text-sm">Checkout</span>
            </div>
          </motion.button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ViewCartButton;