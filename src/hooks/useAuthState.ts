import { useState } from "react";
import { User, Profile } from "@/types/auth";

export const useAuthState = () => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const isAdmin = user?.role === "admin";
  const isRestaurant = user?.role === "restaurant";
  const isDabbawala = user?.role === "dabbawala";

  return {
    user,
    setUser,
    profile,
    setProfile,
    isAuthenticated,
    setIsAuthenticated,
    isAdmin,
    isRestaurant,
    isDabbawala,
    isLoading,
    setIsLoading,
  };
};
