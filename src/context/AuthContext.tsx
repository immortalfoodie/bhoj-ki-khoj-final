import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";

import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail, 
  updatePassword as firebaseUpdatePassword,
  updateProfile,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "../integrations/firebase";

interface Profile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar_url?: string;
  role: "user" | "admin" | "restaurant" | "dabbawala"; 
}

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: "user" | "admin" | "restaurant" | "dabbawala"; 
}

interface AuthContextType {
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

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const defaultRole: "user" | "admin" | "restaurant" | "dabbawala" = "user";

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Try to get stored user data first
        const storedUserStr = localStorage.getItem('bhoj_user');
        let storedUser: User | null = null;
        
        if (storedUserStr) {
          try {
            storedUser = JSON.parse(storedUserStr);
          } catch (e) {
            console.error('Error parsing stored user:', e);
          }
        }
        
        const mappedUser: User = {
          id: firebaseUser.uid,
          name: firebaseUser.displayName || "",
          email: firebaseUser.email || "",
          phone: firebaseUser.phoneNumber || undefined,
          avatar: firebaseUser.photoURL || undefined,
          role: storedUser?.role || defaultRole,
        };
        
        setUser(mappedUser);
        setProfile({
          id: mappedUser.id,
          name: mappedUser.name,
          email: mappedUser.email,
          phone: mappedUser.phone,
          avatar_url: mappedUser.avatar,
          role: mappedUser.role,
        });
        setIsAuthenticated(true);
        localStorage.setItem('bhoj_user', JSON.stringify(mappedUser));
      } else {
        setUser(null);
        setProfile(null);
        setIsAuthenticated(false);
        localStorage.removeItem('bhoj_user');
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const isAdmin = user?.role === "admin";
  const isRestaurant = user?.role === "restaurant";
  const isDabbawala = user?.role === "dabbawala";

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      // Determine user role based on email
      let userRole: "admin" | "restaurant" | "dabbawala" | "user";
      
      if (email === "admin123@gmail.com" && password === "admin123456") {
        userRole = "admin";
      } else if (email === "restaurant@example.com" && password === "restaurant123") {
        userRole = "restaurant";
      } else if (email === "dabbawala@example.com" && password === "dabbawala123") {
        userRole = "dabbawala";
      } else {
        userRole = "user";
      }
      
      console.log("Setting user role to:", userRole);
      
      const mappedUser: User = {
        id: firebaseUser.uid,
        name: firebaseUser.displayName || "",
        email: firebaseUser.email || "",
        phone: firebaseUser.phoneNumber || undefined,
        avatar: firebaseUser.photoURL || undefined,
        role: userRole,
      };
      
      console.log("Mapped user data:", mappedUser);
      
      // Set user in state and localStorage
      setUser(mappedUser);
      setProfile({
        id: mappedUser.id,
        name: mappedUser.name,
        email: mappedUser.email,
        phone: mappedUser.phone,
        avatar_url: mappedUser.avatar,
        role: mappedUser.role,
      });
      setIsAuthenticated(true);

      // Ensure the user data is persisted
      localStorage.setItem('bhoj_user', JSON.stringify(mappedUser));
      
      // Return the user role so the login component can handle navigation
      return userRole;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, role: string = "user") => {
    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      await updateProfile(firebaseUser, { displayName: name });
      
      // Validate role
      let userRole: "user" | "admin" | "restaurant" | "dabbawala" = "user";
      if (role === "admin" || role === "restaurant" || role === "dabbawala" || role === "user") {
        userRole = role as "user" | "admin" | "restaurant" | "dabbawala";
      }

      const mappedUser: User = {
        id: firebaseUser.uid,
        name: name,
        email: firebaseUser.email || "",
        phone: firebaseUser.phoneNumber || undefined,
        avatar: firebaseUser.photoURL || undefined,
        role: userRole,
      };
      
      setUser(mappedUser);
      setProfile({
        id: mappedUser.id,
        name: mappedUser.name,
        email: mappedUser.email,
        phone: mappedUser.phone,
        avatar_url: mappedUser.avatar,
        role: mappedUser.role,
      });
      setIsAuthenticated(true);
      localStorage.setItem('bhoj_user', JSON.stringify(mappedUser));
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await signOut(auth);
      setUser(null);
      setProfile(null);
      setIsAuthenticated(false);
      localStorage.removeItem('bhoj_user');
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    setIsLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
    } finally {
      setIsLoading(false);
    }
  };

  const updatePassword = async (password: string) => {
    setIsLoading(true);
    try {
      if (!auth.currentUser) {
        throw new Error("No authenticated user");
      }
      await firebaseUpdatePassword(auth.currentUser, password);
    } finally {
      setIsLoading(false);
    }
  };

  const uploadAvatar = async (file: File) => {
    setIsLoading(true);
    try {
      return new Promise<string>((resolve, reject) => {
        setTimeout(() => {
          if (!user) {
            reject(new Error("No authenticated user"));
            return;
          }
          try {
            const avatarUrl = URL.createObjectURL(file);
            if (user) {
              setUser({
                ...user,
                avatar: avatarUrl
              });
              if (profile) {
                setProfile({
                  ...profile,
                  avatar_url: avatarUrl
                });
              }
              const storedUser = JSON.parse(localStorage.getItem('bhoj_user') || '{}');
              storedUser.avatar = avatarUrl;
              localStorage.setItem('bhoj_user', JSON.stringify(storedUser));
            }
            resolve(avatarUrl);
          } catch (error) {
            reject(error);
          }
        }, 1500);
      });
    } finally {
      setIsLoading(false);
    }
  };

  const checkAdminAccess = () => user?.role === "admin";
  const checkRestaurantAccess = () => user?.role === "restaurant";
  const checkDabbawalaAccess = () => user?.role === "dabbawala";

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isAuthenticated,
        isAdmin,
        isRestaurant,
        isDabbawala,
        isLoading,
        login,
        register,
        logout,
        resetPassword,
        updatePassword,
        uploadAvatar,
        checkAdminAccess,
        checkRestaurantAccess,
        checkDabbawalaAccess,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
