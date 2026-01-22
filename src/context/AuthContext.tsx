import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "@/types";
import { googleAuth, GoogleUser } from "@/lib/googleAuth";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://mcp-backend.officialchiragp1605.workers.dev';

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

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    console.log('🔐 AuthProvider: Initializing...');
    // Check for stored user data in localStorage
    const storedUser = localStorage.getItem("mcp-user");
    const storedToken = localStorage.getItem("auth-token");
    
    console.log('🔐 AuthProvider: Stored user exists:', !!storedUser);
    console.log('🔐 AuthProvider: Stored token exists:', !!storedToken);
    
    if (storedUser && storedToken) {
      const parsedUser = JSON.parse(storedUser);
      console.log('🔐 AuthProvider: Restored user:', parsedUser);
      setUser(parsedUser);
    }
    setIsLoading(false);
    console.log('🔐 AuthProvider: Initialization complete');
    
    // Listen for storage events (when localStorage is updated from other tabs/components)
    const handleStorageChange = () => {
      const updatedUser = localStorage.getItem("mcp-user");
      const updatedToken = localStorage.getItem("auth-token");
      if (updatedUser && updatedToken) {
        const parsedUser = JSON.parse(updatedUser);
        console.log('🔐 AuthProvider: User updated from storage:', parsedUser);
        setUser(parsedUser);
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const login = async (email: string, password: string) => {
    console.log('🔐 AuthProvider: Starting login for:', email);
    setIsLoading(true);
    try {
      console.log('🔐 AuthProvider: Making API call to:', `${API_BASE_URL}/auth/signin`);
      const response = await fetch(`${API_BASE_URL}/auth/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      console.log('🔐 AuthProvider: Login response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('🔐 AuthProvider: Login failed:', errorData);
        throw new Error(errorData.error || 'Login failed');
      }

      const { token, user: userData } = await response.json();
      console.log('🔐 AuthProvider: Login successful, user data:', userData);
      
      // Convert backend user format to frontend format
      const userWithCorrectFormat: User = {
        id: userData.id.toString(),
        name: userData.name,
        email: userData.email,
        role: "tenant", // All users are tenants in this system
        createdAt: new Date(userData.created_at),
      };
      
      setUser(userWithCorrectFormat);
      localStorage.setItem("mcp-user", JSON.stringify(userWithCorrectFormat));
      localStorage.setItem("auth-token", token);
      console.log('🔐 AuthProvider: User logged in and stored');
    } catch (error) {
      console.error("🔐 AuthProvider: Login failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signupWithEmail = async (name: string, email: string, password: string, companyName: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Signup failed');
      }

      const { token, user: userData } = await response.json();
      
      // Convert backend user format to frontend format
      const userWithCorrectFormat: User = {
        id: userData.id.toString(),
        name: userData.name,
        email: userData.email,
        role: "tenant", // All users are tenants in this system
        createdAt: new Date(userData.created_at),
      };
      
      setUser(userWithCorrectFormat);
      localStorage.setItem("mcp-user", JSON.stringify(userWithCorrectFormat));
      localStorage.setItem("auth-token", token);
    } catch (error) {
      console.error("Signup failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const authenticateWithGoogle = async (googleUser: GoogleUser): Promise<User> => {
    // Send Google user data to your backend for authentication/registration
    const response = await fetch(`${API_BASE_URL}/auth/google`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        credential: googleUser.credential, // The actual Google ID token
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Google authentication failed');
    }

    const { token, user: userData } = await response.json();
    
    // Store auth token
    localStorage.setItem("auth-token", token);
    
    // Convert backend user format to frontend format
    const userWithCorrectFormat: User = {
      id: userData.id.toString(),
      name: userData.name,
      email: userData.email,
      role: "tenant",
      createdAt: new Date(userData.created_at),
    };
    
    return userWithCorrectFormat;
  };

  const loginWithGoogle = async () => {
    setIsLoading(true);
    try {
      // Use real Google authentication
      const googleUser: GoogleUser = await googleAuth.signIn();
      
      // Authenticate with backend
      const user = await authenticateWithGoogle(googleUser);
      setUser(user);
      localStorage.setItem("mcp-user", JSON.stringify(user));
      
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
      // Use real Google authentication
      const googleUser: GoogleUser = await googleAuth.signIn();
      
      // Authenticate with backend (same endpoint handles both login and signup)
      const user = await authenticateWithGoogle(googleUser);
      setUser(user);
      localStorage.setItem("mcp-user", JSON.stringify(user));
      
    } catch (error) {
      console.error("Google signup failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    // Sign out from Google
    await googleAuth.signOut();
    
    // Clear local state
    setUser(null);
    localStorage.removeItem("mcp-user");
    localStorage.removeItem("auth-token");
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