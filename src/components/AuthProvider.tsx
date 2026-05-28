import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  User as FirebaseUser,
  getRedirectResult,
  signInWithRedirect
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

interface AuthContextType {
  user: FirebaseUser | null;
  loading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  isAdmin: boolean;
  isMember: boolean;
  subscriptionTier: 'none' | 'technologist' | 'architect';
  checkMemberStatus: () => Promise<void>;
  accessToken: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Cache the access token in memory outside the component
let cachedAccessToken: string | null = null;
export const getAccessToken = () => cachedAccessToken;

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMember, setIsMember] = useState(false);
  const [subscriptionTier, setSubscriptionTier] = useState<'none' | 'technologist' | 'architect'>('none');
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const checkMemberStatus = async () => {
    if (!auth.currentUser) return;
    const userRef = doc(db, 'users', auth.currentUser.uid);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      const data = userSnap.data();
      const admin = data.role === 'admin' || auth.currentUser.email === 'oceantidedrop@gmail.com';
      const member = data.subscriptionStatus === 'active' || admin;
      setIsMember(member);
      if (admin) {
        setSubscriptionTier('architect');
      } else if (member) {
        setSubscriptionTier(data.subscriptionTier === 'architect' ? 'architect' : 'technologist');
      } else {
        setSubscriptionTier('none');
      }
    }
  };

  useEffect(() => {
    const checkRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result) {
          const credential = GoogleAuthProvider.credentialFromResult(result);
          if (credential?.accessToken) {
            cachedAccessToken = credential.accessToken;
            setAccessToken(credential.accessToken);
          }
        }
      } catch (error) {
        console.error('Redirect login error:', error);
      }
    };
    checkRedirectResult();

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      
      if (firebaseUser) {
        try {
          // Sync user to Firestore
          const userRef = doc(db, 'users', firebaseUser.uid);
          const userSnap = await getDoc(userRef);
          
          if (!userSnap.exists()) {
            const userData = {
              uid: firebaseUser.uid,
              displayName: firebaseUser.displayName || 'Ocean Explorer',
              email: firebaseUser.email,
              photoURL: firebaseUser.photoURL || '',
              role: 'user',
              subscriptionStatus: 'none',
              subscriptionTier: 'none',
              createdAt: serverTimestamp()
            };
            await setDoc(userRef, userData);
            
            // Sync to public profile
            await setDoc(doc(db, 'users_public', firebaseUser.uid), {
              uid: firebaseUser.uid,
              displayName: firebaseUser.displayName || 'Ocean Explorer',
              photoURL: firebaseUser.photoURL || '',
            });
            
            if (firebaseUser.email === 'oceantidedrop@gmail.com') {
              setIsAdmin(true);
              setIsMember(true);
              setSubscriptionTier('architect');
            } else {
              setIsMember(false);
              setSubscriptionTier('none');
            }
          } else {
            const userData = userSnap.data();
            const admin = userData.role === 'admin' || firebaseUser.email === 'oceantidedrop@gmail.com';
            const member = userData.subscriptionStatus === 'active' || admin;
            setIsAdmin(admin);
            setIsMember(member);
            if (admin) {
              setSubscriptionTier('architect');
            } else if (member) {
              setSubscriptionTier(userData.subscriptionTier === 'architect' ? 'architect' : 'technologist');
            } else {
              setSubscriptionTier('none');
            }
          }
        } catch (err) {
          console.error("Firebase sync error in AuthProvider:", err);
          // If firestore fails, we should still allow admin access based on email
          if (firebaseUser.email === 'oceantidedrop@gmail.com') {
            setIsAdmin(true);
            setIsMember(true);
            setSubscriptionTier('architect');
          } else {
            setIsAdmin(false);
            setIsMember(false);
            setSubscriptionTier('none');
          }
        }
      } else {
        setIsAdmin(false);
        setIsMember(false);
        setSubscriptionTier('none');
        cachedAccessToken = null;
        setAccessToken(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async () => {
    const provider = new GoogleAuthProvider();
    provider.addScope('https://www.googleapis.com/auth/chat');
    try {
      const result = await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      if (credential?.accessToken) {
        cachedAccessToken = credential.accessToken;
        setAccessToken(credential.accessToken);
      }
    } catch (error: any) {
      if (error.code === 'auth/popup-blocked') {
        // Fallback to redirect if popup is blocked
        await signInWithRedirect(auth, provider);
      } else {
        console.error('Login failed:', error);
      }
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      cachedAccessToken = null;
      setAccessToken(null);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAdmin, isMember, subscriptionTier, checkMemberStatus, accessToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
