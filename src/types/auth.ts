import { User as FirebaseUser } from "firebase/auth";

export interface Profile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar_url?: string;
  role: "user" | "admin" | "restaurant" | "dabbawala";
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: "user" | "admin" | "restaurant" | "dabbawala";
}

export interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isRestaurant: boolean;
  isDabbawala: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role?: string) => Promise<void>;
  logout: () => void;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
  uploadAvatar: (file: File) => Promise<string>;
  checkAdminAccess: () => boolean;
  checkRestaurantAccess: () => boolean;
  checkDabbawalaAccess: () => boolean;
}
