// src/contexts/AuthContext.jsx
import { createContext, useEffect, useState } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  onAuthStateChanged,
  signOut,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase/firebase';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sign up with email and password
  const signup = async (email, password, displayName) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Update profile with display name
      await updateProfile(user, { displayName });
      
      // Create user document in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email,
        displayName,
        photoURL: null,
        createdAt: serverTimestamp(),
        lastSeen: serverTimestamp(),
        online: true
      });
      
      return user;
    } catch (error) {
      throw error;
    }
  };

  // Sign in with email and password
  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Update user's online status
      const userRef = doc(db, 'users', userCredential.user.uid);
      await setDoc(userRef, {
        online: true,
        lastSeen: serverTimestamp()
      }, { merge: true });
      
      return userCredential.user;
    } catch (error) {
      throw error;
    }
  };

  // Sign out
  const logout = async () => {
    try {
      // Set user offline before signing out
      if (currentUser) {
        const userRef = doc(db, 'users', currentUser.uid);
        await setDoc(userRef, {
          online: false,
          lastSeen: serverTimestamp()
        }, { merge: true });
      }
      
      await signOut(auth);
    } catch (error) {
      throw error;
    }
  };

  // Get user data
  const getUserData = async (uid) => {
    try {
      const userRef = doc(db, 'users', uid);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        return userSnap.data();
      } else {
        return null;
      }
    } catch (error) {
      throw error;
    }
  };

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      setLoading(false);
      
      if (user) {
        // Update user's online status
        const userRef = doc(db, 'users', user.uid);
        await setDoc(userRef, {
          online: true,
          lastSeen: serverTimestamp()
        }, { merge: true });
      }
    });

    // Set up beforeunload event to mark user as offline
    const handleBeforeUnload = async () => {
      if (currentUser) {
        const userRef = doc(db, 'users', currentUser.uid);
        await setDoc(userRef, {
          online: false,
          lastSeen: serverTimestamp()
        }, { merge: true });
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      unsubscribe();
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [currentUser]);

  const value = {
    currentUser,
    signup,
    login,
    logout,
    getUserData,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};