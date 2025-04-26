import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from "react";
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
  User as FirebaseUser,
  AuthError
} from "firebase/auth";
import { auth } from "../integrations/firebase";

interface Profile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar_url?: string;
  role: "user" | "admin" | "restaurant" | "dabbawala"; 
  created_at?: string;
  updated_at?: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: "user" | "admin" | "restaurant" | "dabbawala"; 
  created_at?: string;
  updated_at?: string;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isRestaurant: boolean;
  isDabbawala: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role?: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
  uploadAvatar: (file: File) => Promise<string>;
  checkAdminAccess: () => boolean;
  checkRestaurantAccess: () => boolean;
  checkDabbawalaAccess: () => boolean;
  clearError: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const defaultRole: "user" | "admin" | "restaurant" | "dabbawala" = "user";

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('bhoj_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [profile, setProfile] = useState<Profile | null>(() => {
    const savedProfile = localStorage.getItem('bhoj_profile');
    return savedProfile ? JSON.parse(savedProfile) : null;
  });
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return !!localStorage.getItem('bhoj_user');
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const handleAuthError = useCallback((error: AuthError) => {
    let errorMessage = "An error occurred during authentication.";
    
    switch (error.code) {
      case 'auth/user-not-found':
        errorMessage = "No user found with this email.";
        break;
      case 'auth/wrong-password':
        errorMessage = "Incorrect password.";
        break;
      case 'auth/email-already-in-use':
        errorMessage = "Email is already in use.";
        break;
      case 'auth/weak-password':
        errorMessage = "Password is too weak.";
        break;
      case 'auth/invalid-email':
        errorMessage = "Invalid email address.";
        break;
      case 'auth/operation-not-allowed':
        errorMessage = "Operation not allowed.";
        break;
      case 'auth/too-many-requests':
        errorMessage = "Too many attempts. Please try again later.";
        break;
      default:
        errorMessage = error.message;
    }
    
    setError(errorMessage);
    toast({
      title: "Authentication Error",
      description: errorMessage,
      variant: "destructive"
    });
  }, [toast]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      try {
        setIsLoading(true);
        if (firebaseUser) {
          const storedUserJSON = localStorage.getItem('bhoj_user');
          let storedUser = null;
          
          if (storedUserJSON) {
            try {
              storedUser = JSON.parse(storedUserJSON);
            } catch (error) {
              console.error("Failed to parse stored user data:", error);
            }
          }
          
          const mappedUser: User = {
            id: firebaseUser.uid,
            name: firebaseUser.displayName || "",
            email: firebaseUser.email || "",
            phone: firebaseUser.phoneNumber || undefined,
            avatar: firebaseUser.photoURL || undefined,
            role: storedUser?.role || defaultRole,
            created_at: firebaseUser.metadata.creationTime,
            updated_at: firebaseUser.metadata.lastSignInTime
          };
          
          setUser(mappedUser);
          setProfile({
            id: mappedUser.id,
            name: mappedUser.name,
            email: mappedUser.email,
            phone: mappedUser.phone,
            avatar_url: mappedUser.avatar,
            role: mappedUser.role,
            created_at: mappedUser.created_at,
            updated_at: mappedUser.updated_at
          });
          setIsAuthenticated(true);
          
          // Save to localStorage
          localStorage.setItem('bhoj_user', JSON.stringify(mappedUser));
          localStorage.setItem('bhoj_profile', JSON.stringify({
            id: mappedUser.id,
            name: mappedUser.name,
            email: mappedUser.email,
            phone: mappedUser.phone,
            avatar_url: mappedUser.avatar,
            role: mappedUser.role,
            created_at: mappedUser.created_at,
            updated_at: mappedUser.updated_at
          }));
        } else {
          setUser(null);
          setProfile(null);
          setIsAuthenticated(false);
          localStorage.removeItem('bhoj_user');
          localStorage.removeItem('bhoj_profile');
        }
      } catch (error) {
        console.error("Auth state change error:", error);
        setError("Failed to update authentication state.");
      } finally {
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const isAdmin = user?.role === "admin";
  const isRestaurant = user?.role === "restaurant";
  const isDabbawala = user?.role === "dabbawala";

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      const storedUserJSON = localStorage.getItem('bhoj_user');
      let storedUser = null;
      let role = defaultRole;
      
      if (storedUserJSON) {
        try {
          storedUser = JSON.parse(storedUserJSON);
          if (storedUser && storedUser.id === firebaseUser.uid) {
            role = storedUser.role;
          }
        } catch (error) {
          console.error("Failed to parse stored user data:", error);
        }
      }
      
      const mappedUser: User = {
        id: firebaseUser.uid,
        name: firebaseUser.displayName || "",
        email: firebaseUser.email || "",
        phone: firebaseUser.phoneNumber || undefined,
        avatar: firebaseUser.photoURL || undefined,
        role: role,
        created_at: firebaseUser.metadata.creationTime,
        updated_at: firebaseUser.metadata.lastSignInTime
      };
      
      setUser(mappedUser);
      setProfile({
        id: mappedUser.id,
        name: mappedUser.name,
        email: mappedUser.email,
        phone: mappedUser.phone,
        avatar_url: mappedUser.avatar,
        role: mappedUser.role,
        created_at: mappedUser.created_at,
        updated_at: mappedUser.updated_at
      });
      setIsAuthenticated(true);
      
      // Save to localStorage
      localStorage.setItem('bhoj_user', JSON.stringify(mappedUser));
      localStorage.setItem('bhoj_profile', JSON.stringify({
        id: mappedUser.id,
        name: mappedUser.name,
        email: mappedUser.email,
        phone: mappedUser.phone,
        avatar_url: mappedUser.avatar,
        role: mappedUser.role,
        created_at: mappedUser.created_at,
        updated_at: mappedUser.updated_at
      }));

      toast({
        title: "Login Successful",
        description: "Welcome back!",
      });
    } catch (error) {
      handleAuthError(error as AuthError);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, role: string = "user") => {
    try {
      setIsLoading(true);
      setError(null);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      await updateProfile(firebaseUser, { displayName: name });
      
      const userRole = (role as "user" | "admin" | "restaurant" | "dabbawala") || defaultRole;
      
      const mappedUser: User = {
        id: firebaseUser.uid,
        name: name,
        email: firebaseUser.email || "",
        phone: firebaseUser.phoneNumber || undefined,
        avatar: firebaseUser.photoURL || undefined,
        role: userRole,
        created_at: firebaseUser.metadata.creationTime,
        updated_at: firebaseUser.metadata.lastSignInTime
      };
      
      setUser(mappedUser);
      setProfile({
        id: mappedUser.id,
        name: mappedUser.name,
        email: mappedUser.email,
        phone: mappedUser.phone,
        avatar_url: mappedUser.avatar,
        role: mappedUser.role,
        created_at: mappedUser.created_at,
        updated_at: mappedUser.updated_at
      });
      setIsAuthenticated(true);
      
      // Save to localStorage
      localStorage.setItem('bhoj_user', JSON.stringify(mappedUser));
      localStorage.setItem('bhoj_profile', JSON.stringify({
        id: mappedUser.id,
        name: mappedUser.name,
        email: mappedUser.email,
        phone: mappedUser.phone,
        avatar_url: mappedUser.avatar,
        role: mappedUser.role,
        created_at: mappedUser.created_at,
        updated_at: mappedUser.updated_at
      }));

      toast({
        title: "Registration Successful",
        description: "Welcome to Bhoj Basket!",
      });
    } catch (error) {
      handleAuthError(error as AuthError);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await signOut(auth);
      setUser(null);
      setProfile(null);
      setIsAuthenticated(false);
      localStorage.removeItem('bhoj_user');
      localStorage.removeItem('bhoj_profile');

      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
    } catch (error) {
      handleAuthError(error as AuthError);
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setIsLoading(true);
      setError(null);
      await sendPasswordResetEmail(auth, email);
      toast({
        title: "Password Reset Email Sent",
        description: "Please check your email for reset instructions.",
      });
    } catch (error) {
      handleAuthError(error as AuthError);
    } finally {
      setIsLoading(false);
    }
  };

  const updatePassword = async (password: string) => {
    try {
      setIsLoading(true);
      setError(null);
      if (!auth.currentUser) {
        throw new Error("No authenticated user");
      }
      await firebaseUpdatePassword(auth.currentUser, password);
      toast({
        title: "Password Updated",
        description: "Your password has been successfully updated.",
      });
    } catch (error) {
      handleAuthError(error as AuthError);
    } finally {
      setIsLoading(false);
    }
  };

  const uploadAvatar = async (file: File) => {
    try {
      setIsLoading(true);
      setError(null);
      if (!user) {
        throw new Error("No authenticated user");
      }

      // Here you would typically upload to a storage service
      // For now, we'll just create a local URL
      const avatarUrl = URL.createObjectURL(file);
      
      const updatedUser = {
        ...user,
        avatar: avatarUrl,
        updated_at: new Date().toISOString()
      };
      
      setUser(updatedUser);
      
      if (profile) {
        const updatedProfile = {
          ...profile,
          avatar_url: avatarUrl,
          updated_at: new Date().toISOString()
        };
        setProfile(updatedProfile);
        localStorage.setItem('bhoj_profile', JSON.stringify(updatedProfile));
      }
      
      localStorage.setItem('bhoj_user', JSON.stringify(updatedUser));

      toast({
        title: "Avatar Updated",
        description: "Your profile picture has been updated.",
      });

      return avatarUrl;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to upload avatar";
      setError(errorMessage);
      toast({
        title: "Upload Failed",
        description: errorMessage,
        variant: "destructive"
      });
      throw error;
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
        error,
        login,
        register,
        logout,
        resetPassword,
        updatePassword,
        uploadAvatar,
        checkAdminAccess,
        checkRestaurantAccess,
        checkDabbawalaAccess,
        clearError
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
