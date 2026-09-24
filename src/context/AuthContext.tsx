import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from 'firebase/auth';
import { auth } from '../firebase/config';
import { onAuthStateChanged, loginWithGoogle, loginWithEmail, logoutAdmin, resetPassword } from '../firebase/auth';

interface AuthContextType {
  currentUser: User | null;
  isAdmin: boolean;
  loading: boolean;
  loginGoogle: () => Promise<void>;
  loginEmail: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  isDemoAdminActive: boolean;
  enableDemoAdmin: () => void;
  disableDemoAdmin: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDemoAdminActive, setIsDemoAdminActive] = useState<boolean>(() => {
    return localStorage.getItem('tf_demo_admin') === 'true';
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const isAdmin = Boolean(
    currentUser || isDemoAdminActive
  );

  const loginGoogle = async () => {
    await loginWithGoogle();
  };

  const loginEmail = async (email: string, pass: string) => {
    await loginWithEmail(email, pass);
  };

  const logout = async () => {
    if (currentUser) {
      await logoutAdmin();
    }
    setIsDemoAdminActive(false);
    localStorage.removeItem('tf_demo_admin');
  };

  const sendPasswordReset = async (email: string) => {
    await resetPassword(email);
  };

  const enableDemoAdmin = () => {
    setIsDemoAdminActive(true);
    localStorage.setItem('tf_demo_admin', 'true');
  };

  const disableDemoAdmin = () => {
    setIsDemoAdminActive(false);
    localStorage.removeItem('tf_demo_admin');
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAdmin,
        loading,
        loginGoogle,
        loginEmail,
        logout,
        sendPasswordReset,
        isDemoAdminActive,
        enableDemoAdmin,
        disableDemoAdmin
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
