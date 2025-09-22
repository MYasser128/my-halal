import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  onAuthStateChanged,
  User
} from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

export const register = (email: string, pass: string) => createUserWithEmailAndPassword(auth, email, pass);
export const login = (email: string, pass: string) => signInWithEmailAndPassword(auth, email, pass);
export const logout = () => signOut(auth);

// Admin functionality - handle admin status in Firestore instead of custom claims
export const isAdmin = async (user: User | null): Promise<boolean> => {
  if (!user) return false;
  
  try {
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    const userData = userDoc.data();
    return userData?.isAdmin === true;
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
};

export const setAdminStatus = async (userId: string, isAdmin: boolean): Promise<boolean> => {
  try {
    await updateDoc(doc(db, 'users', userId), {
      isAdmin: isAdmin,
      lastUpdated: new Date()
    });
    return true;
  } catch (error) {
    console.error('Error setting admin status:', error);
    return false;
  }
};

export const createUserProfile = async (user: User, additionalData: any = {}) => {
  try {
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      await setDoc(userRef, {
        displayName: user.displayName || additionalData.displayName || '',
        email: user.email || '',
        createdAt: new Date(),
        isAdmin: false,
        lastLoginAt: new Date(),
        ...additionalData
      });
    } else {
      // Update last login time for existing users
      await updateDoc(userRef, {
        lastLoginAt: new Date()
      });
    }
  } catch (error) {
    console.error('Error creating user profile:', error);
  }
};

// Get user profile data from Firestore
export const getUserProfile = async (user: User) => {
  try {
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      const userData = userSnap.data();
      return {
        ...user,
        displayName: userData.displayName || user.displayName || user.email?.split('@')[0] || 'User',
        email: userData.email || user.email || '',
        isAdmin: userData.isAdmin || false,
      };
    }
    
    // If no profile exists, return user with fallback display name
    return {
      ...user,
      displayName: user.displayName || user.email?.split('@')[0] || 'User',
    };
  } catch (error) {
    console.error('Error getting user profile:', error);
    return {
      ...user,
      displayName: user.displayName || user.email?.split('@')[0] || 'User',
    };
  }
};

// Auth state listener
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};
