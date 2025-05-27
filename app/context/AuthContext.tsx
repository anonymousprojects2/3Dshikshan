import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

// Define user type
export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  phone: string;
  address: string;
  district: string;
  center: {
    id: string;
    name: string;
  };
  profileImage?: string;
}

// Define context type
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (
    name: string, 
    email: string, 
    password: string, 
    username?: string,
    phone?: string,
    address?: string,
    district?: string,
    centerId?: string,
    centerName?: string
  ) => Promise<boolean>;
  logout: () => Promise<void>;
  updateUserProfile: (userData: Partial<User>) => Promise<void>;
}

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  login: async () => false,
  signup: async () => false,
  logout: async () => {},
  updateUserProfile: async () => {},
});

// Create provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user data from storage on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          setUser(JSON.parse(userData));
        }
      } catch (error) {
        console.error('Failed to load user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // In a real app, you would validate credentials with an API
      // For demo purposes, we'll simulate a successful login with hardcoded values
      // or check against stored credentials
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Demo user - in a real app this would come from your backend
      const demoUser: User = {
        id: '1',
        name: 'Demo User',
        username: 'demouser',
        email: email,
        phone: '9876543210',
        address: '123 Demo Street, Demo City',
        district: 'Pune',
        center: {
          id: '1',
          name: 'Anantrao Pawar College of Engineering and Research (APCOER)'
        },
        profileImage: 'https://i.pravatar.cc/300',
      };
      
      // Save user to storage
      await AsyncStorage.setItem('user', JSON.stringify(demoUser));
      setUser(demoUser);
      
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Signup function
  const signup = async (
    name: string, 
    email: string, 
    password: string,
    username: string = '',
    phone: string = '',
    address: string = '',
    district: string = '',
    centerId: string = '',
    centerName: string = ''
  ): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // In a real app, you would register the user with an API
      // For demo purposes, we'll simulate a successful registration
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Create new user
      const newUser: User = {
        id: Date.now().toString(), // Generate a unique ID
        name,
        username: username || name.toLowerCase().replace(/\s+/g, '.'),
        email,
        phone: phone || '',
        address: address || '',
        district: district || '',
        center: {
          id: centerId || '',
          name: centerName || ''
        },
        profileImage: 'https://i.pravatar.cc/300',
      };
      
      // Save user to storage
      await AsyncStorage.setItem('user', JSON.stringify(newUser));
      setUser(newUser);
      
      return true;
    } catch (error) {
      console.error('Signup failed:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async (): Promise<void> => {
    try {
      setIsLoading(true);
      await AsyncStorage.removeItem('user');
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Update user profile
  const updateUserProfile = async (userData: Partial<User>): Promise<void> => {
    try {
      if (!user) return;
      
      const updatedUser = { ...user, ...userData };
      await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout, updateUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => useContext(AuthContext);

// Default export for the AuthContext
export default AuthProvider; 