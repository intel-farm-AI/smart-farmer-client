import { createContext, useContext, useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { app } from '../lib/services/firebase';
import { Navigate, useLocation } from 'react-router-dom';

// Membuat AuthContext dan custom hook
const AuthContext = createContext();
export function useAuth() {
  return useContext(AuthContext);
}

// Provider untuk wrapping aplikasi
export function AuthProvider({ children }) {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    const auth = getAuth(app);
    const unsub = onAuthStateChanged(auth, setUser);
    return () => unsub();
  }, []);

  return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
}

// Komponen untuk membatasi akses jika belum login
export function RequireAuth({ children }) {
  const user = useAuth();
  const location = useLocation();

  if (user === undefined) return null; 
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  return children;
}

export function RedirectIfAuth({ children }) {
  const user = useAuth();

  if (user === undefined) return null;
  if (user) return <Navigate to="/dashboard" replace />;
  return children;
}
