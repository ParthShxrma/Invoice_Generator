
import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, signInWithPopup, provider, signOut } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async () => {
    try{
      return await signInWithPopup(auth,provider);
    } catch (error) {
      console.error("Popup error:", error.code, error.message);
      throw error;
    }
  };
  const logout = () => signOut(auth);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};