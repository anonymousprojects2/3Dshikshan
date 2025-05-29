import AsyncStorage from '@react-native-async-storage/async-storage';
import firebase from '../config/firebase';
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
interface FirebaseAuthContextType {
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
const FirebaseAuthContext = createContext<FirebaseAuthContextType>({
  user: null,
  isLoading: true,
  login: async () => false,
  signup: async () => false,
  logout: async () => {},
  updateUserProfile: async () => {},
});

// Create provider component
export const FirebaseAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Handle Firebase auth state changes
  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(async (firebaseUser) => {
      try {
        if (firebaseUser) {
          // User is signed in, get additional user data from Firestore
          const userDoc = await firebase.firestore().collection('users').doc(firebaseUser.uid).get();
          
          if (userDoc.exists) {
            const userData = userDoc.data();
            const fullUser: User = {
              id: firebaseUser.uid,
              name: userData?.name || firebaseUser.displayName || '',
              username: userData?.username || '',
              email: firebaseUser.email || '',
              phone: userData?.phone || firebaseUser.phoneNumber || '',
              address: userData?.address || '',
              district: userData?.district || '',
              center: userData?.center || { id: '', name: '' },
              profileImage: userData?.profileImage || firebaseUser.photoURL || '',
            };
            
            // Save user to AsyncStorage for offline access
            await AsyncStorage.setItem('user', JSON.stringify(fullUser));
            setUser(fullUser);
          } else {
            // User exists in Firebase Auth but not in Firestore
            // This could happen if the user registration process was interrupted
            console.warn('User exists in Auth but not in Firestore');
            setUser(null);
          }
        } else {
          // User is signed out
          await AsyncStorage.removeItem('user');
          setUser(null);
        }
      } catch (error) {
        console.error('Error handling auth state change:', error);
      } finally {
        setIsLoading(false);
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      await firebase.auth().signInWithEmailAndPassword(email, password);
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
      
      // Create user in Firebase Auth
      const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
      const firebaseUser = userCredential.user;
      
      if (!firebaseUser) {
        throw new Error('Failed to create user');
      }
      
      // Update display name
      await firebaseUser.updateProfile({
        displayName: name
      });
      
      // Create user document in Firestore
      const userData: User = {
        id: firebaseUser?.uid || '',
        name,
        username: username || name.toLowerCase().replace(/\s+/g, '.'),
        email,
        phone,
        address,
        district,
        center: {
          id: centerId,
          name: centerName
        },
        profileImage: firebaseUser.photoURL || '',
      };
      
      if (firebaseUser.uid) {
        await firebase.firestore().collection('users').doc(firebaseUser.uid).set(userData);
      }
      
      // Save user to AsyncStorage
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      
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
      await firebase.auth().signOut();
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
      if (!user || !user.id) return;
      
      // Update Firestore document
      await firebase.firestore().collection('users').doc(user.id).update(userData);
      
      // Update Firebase Auth profile if name or profile image is changed
      if (userData.name || userData.profileImage) {
        await firebase.auth().currentUser?.updateProfile({
          displayName: userData.name || firebase.auth().currentUser?.displayName,
          photoURL: userData.profileImage || firebase.auth().currentUser?.photoURL,
        });
      }
      
      // Update local user state
      const updatedUser = { ...user, ...userData };
      await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  return (
    <FirebaseAuthContext.Provider value={{ user, isLoading, login, signup, logout, updateUserProfile }}>
      {children}
    </FirebaseAuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => useContext(FirebaseAuthContext);

// Default export for the FirebaseAuthContext
export default FirebaseAuthProvider;
