import { Outlet, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import BottomNav from "@/components/customer/BottomNav";
import SideNav from "@/components/customer/SideNav";
import ViewCartButton from "@/components/cart/ViewCartButton";
import { fadeIn, defaultTransition } from "@/utils/transitions";

const CustomerLayout = () => {
  const location = useLocation();

  return (
    <div className="flex y-auto bg-green-50">
      <SideNav />
      <div className="flex-1 flex flex-col min-h-screen" style={{overflow: 'auto', height: '100vh'}}>
        <div className="py-2 px-4 bg-white shadow-sm md:hidden">
          <h1 className="text-xl font-bold text-green-700">Customer Dashboard</h1>
        </div>
        <motion.main 
          className="flex-1  pt-2 pb-20 md:pb-8 px-4"
          initial="initial"
          animate="animate"
          exit="exit"
          variants={fadeIn}
          transition={defaultTransition}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </motion.main>
        <div className="relative">
          <ViewCartButton />
          <BottomNav />
        </div>
      </div>
    </div>
  );
};

export default CustomerLayout;
