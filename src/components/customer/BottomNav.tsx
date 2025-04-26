import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, FileText, Search, User, ShoppingBag } from "lucide-react";
import { bounceTransition } from "@/utils/transitions";

const BottomNav = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const navItems = [
    { icon: Home, label: "Home", path: "/home" },
    { icon: FileText, label: "Orders", path: "/orders" },
    { icon: Search, label: "Search", path: "/search" },
    { icon: User, label: "Profile", path: "/profile" }
  ];

  return (
    <motion.div 
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-green-200"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", damping: 20 }}
    >
      <div className="grid grid-cols-4">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <motion.button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="flex flex-col items-center justify-center py-2"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
              transition={bounceTransition}
            >
              <motion.div
                className={`p-1.5 rounded-full ${
                  isActive ? "bg-green-100 text-green-700" : "text-gray-500"
                }`}
                initial={false}
                animate={{
                  scale: isActive ? 1.1 : 1,
                  backgroundColor: isActive ? "rgb(220 252 231)" : "transparent"
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <item.icon size={20} />
              </motion.div>
              <motion.span
                className={`text-xs mt-1 ${
                  isActive ? "text-green-700 font-medium" : "text-gray-500"
                }`}
                initial={false}
                animate={{
                  scale: isActive ? 1.05 : 1
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                {item.label}
              </motion.span>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
};

export default BottomNav;
