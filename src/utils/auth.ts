
import { User } from "@/types/auth";

export const defaultRole = "user" as const;

export const storeUserInLocalStorage = (user: User) => {
  localStorage.setItem('bhoj_user', JSON.stringify(user));
};

export const getUserFromLocalStorage = (): User | null => {
  const storedUserJSON = localStorage.getItem('bhoj_user');
  if (storedUserJSON) {
    try {
      return JSON.parse(storedUserJSON);
    } catch (error) {
      console.error("Failed to parse stored user data:", error);
    }
  }
  return null;
};

export const removeUserFromLocalStorage = () => {
  localStorage.removeItem('bhoj_user');
};
