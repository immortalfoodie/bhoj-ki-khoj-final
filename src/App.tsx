import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import AdminLayout from "@/layouts/AdminLayout";
import CustomerLayout from "@/layouts/CustomerLayout";
import RestaurantLayout from "@/layouts/RestaurantLayout";
import DabbawalaLayout from "@/layouts/DabbawalaLayout";

// Pages
import Home from "@/pages/customer/Home";
import RestaurantDetail from "@/pages/RestaurantDetail";
import Checkout from "@/pages/Checkout";
import OrderTracking from "@/pages/OrderTracking";
import Profile from "@/pages/Profile";
import NotFound from "@/pages/NotFound";
import CustomerOrders from "@/pages/customer/Orders";
import Search from "@/pages/customer/Search";

// Auth Pages
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import ForgotPassword from "@/pages/auth/ForgotPassword";
import ResetPassword from "@/pages/auth/ResetPassword";

// Admin Pages
import AdminDashboard from "@/pages/admin/Dashboard";
import RestaurantManagement from "@/pages/admin/RestaurantManagement";
import DabbawalaManagement from "@/pages/admin/DabbawalaManagement";
import OrderManagement from "@/pages/admin/OrderManagement";
import MenuManagement from "@/pages/admin/MenuManagement";
import AppSettings from "@/pages/admin/AppSettings";
import Feedback from "@/pages/admin/Feedback";

// Restaurant Pages
import RestaurantDashboard from "@/pages/restaurant/Dashboard";
import RestaurantMenuManagement from "@/pages/restaurant/MenuManagement";
import RestaurantOrders from "@/pages/restaurant/Orders";

// Dabbawala Pages
import DabbawalaDashboard from "@/pages/dabbawala/Dashboard";
import AnalyticsPage from './pages/admin/Analytics';
import UsersPage from './pages/admin/Users';

const App = () => {
  // Create a client
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: false,
      },
    },
  });

  useEffect(() => {
    console.log('App component mounted');
    return () => {
      console.log('App component unmounted');
    };
  }, []);
  
  try {
    console.log('Rendering App component');
    return (
      <QueryClientProvider client={queryClient}>
        <Router>
          <AuthProvider>
            <CartProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <Routes>
                  {/* Auth Routes */}
                  <Route path="/auth">
                    <Route path="login" element={<Login />} />
                    <Route path="register" element={<Register />} />
                    <Route path="forgot-password" element={<ForgotPassword />} />
                    <Route path="reset-password" element={<ResetPassword />} />
                  </Route>
                  
                  {/* Admin Routes */}
                  <Route
                    path="/admin"
                    element={
                      <ProtectedRoute requiredRole="admin">
                        <AdminLayout />
                      </ProtectedRoute>
                    }
                  >
                    <Route index element={<AdminDashboard />} />
                    <Route path="restaurants" element={<RestaurantManagement />} />
                    <Route path="dabbawalas" element={<DabbawalaManagement />} />
                    <Route path="orders" element={<OrderManagement />} />
                    <Route path="menu" element={<MenuManagement />} />
                    <Route path="users" element={
                      <React.Suspense fallback={<div>Loading...</div>}>
                        <UsersPage />
                      </React.Suspense>
                    } />
                    <Route path="analytics" element={
                      <React.Suspense fallback={<div>Loading...</div>}>
                        <AnalyticsPage/>
                      </React.Suspense>
                    } />
                    <Route path="settings" element={<AppSettings />} />
                    <Route path="feedback" element={<Feedback />} />
                  </Route>
                  
                  {/* Restaurant Routes */}
                  <Route
                    path="/restaurant"
                    element={
                      <ProtectedRoute requiredRole="restaurant">
                        <RestaurantLayout />
                      </ProtectedRoute>
                    }
                  >
                    <Route index element={<RestaurantDashboard />} />
                    <Route path="menu" element={<RestaurantMenuManagement />} />
                    <Route path="orders" element={<RestaurantOrders />} />
                  </Route>

                  {/* Dabbawala Routes */}
                  <Route
                    path="/dabbawala"
                    element={
                      <ProtectedRoute requiredRole="dabbawala">
                        <DabbawalaLayout />
                      </ProtectedRoute>
                    }
                  >
                    <Route index element={<DabbawalaDashboard />} />
                  </Route>
                  
                  {/* Customer Routes */}
                  <Route
                    path="/"
                    element={
                      <ProtectedRoute>
                        <CustomerLayout />
                      </ProtectedRoute>
                    }
                  >
                    <Route index element={<Home />} />
                    <Route path="restaurant/:id" element={<RestaurantDetail />} />
                    <Route path="checkout" element={<Checkout />} />
                    <Route path="track/:orderId" element={<OrderTracking />} />
                    <Route path="profile" element={<Profile />} />
                    <Route path="orders" element={<CustomerOrders />} />
                    <Route path="search" element={<Search />} />
                  </Route>
                  
                  {/* Redirect legacy routes */}
                  <Route path="/login" element={<Navigate to="/auth/login" replace />} />
                  <Route path="/register" element={<Navigate to="/auth/register" replace />} />
                  <Route path="/home" element={<Navigate to="/" replace />} />
                  
                  {/* Not Found */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </TooltipProvider>
            </CartProvider>
          </AuthProvider>
        </Router>
      </QueryClientProvider>
    );
  } catch (error) {
    console.error('Error in App component:', error);
    throw error;
  }
};

export default App;
