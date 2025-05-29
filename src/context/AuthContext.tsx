import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "@/types";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signupWithEmail: (name: string, email: string, password: string, companyName: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  signupWithGoogle: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data for demonstration
const mockAdminUser: User = {
  id: "admin-1",
  name: "Admin User",
  email: "admin@mcpchat.com",
  role: "admin",
  createdAt: new Date(),
};

const mockTenantUser: User = {
  id: "tenant-1",
  name: "John Doe",
  email: "john@example.com",
  role: "tenant",
  createdAt: new Date(),
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check for stored user data in localStorage
    const storedUser = localStorage.getItem("mcp-user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Mock API call - in a real app, this would call your backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate login logic
      let loggedInUser;
      if (email === "admin@mcpchat.com") {
        loggedInUser = mockAdminUser;
      } else if (email === "john@example.com") {
        loggedInUser = mockTenantUser;
      } else {
        throw new Error("Invalid credentials");
      }
      
      setUser(loggedInUser);
      localStorage.setItem("mcp-user", JSON.stringify(loggedInUser));
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signupWithEmail = async (name: string, email: string, password: string, companyName: string) => {
    setIsLoading(true);
    try {
      // Mock API call - in a real app, this would call your backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create a new tenant user
      const newUser: User = {
        id: `tenant-${Date.now()}`,
        name,
        email,
        role: "tenant",
        createdAt: new Date(),
      };
      
      setUser(newUser);
      localStorage.setItem("mcp-user", JSON.stringify(newUser));
    } catch (error) {
      console.error("Signup failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setIsLoading(true);
    try {
      // Mock Google OAuth flow - in a real app, this would use a library like Firebase Auth
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate successful Google login
      setUser(mockTenantUser);
      localStorage.setItem("mcp-user", JSON.stringify(mockTenantUser));
    } catch (error) {
      console.error("Google login failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signupWithGoogle = async () => {
    setIsLoading(true);
    try {
      // Mock Google OAuth flow - in a real app, this would use a library like Firebase Auth
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate successful Google signup
      setUser(mockTenantUser);
      localStorage.setItem("mcp-user", JSON.stringify(mockTenantUser));
    } catch (error) {
      console.error("Google signup failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("mcp-user");
  };

  const value = {
    user,
    isLoading,
    login,
    signupWithEmail,
    loginWithGoogle,
    signupWithGoogle,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};