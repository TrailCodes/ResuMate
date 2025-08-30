import React, { createContext, useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance.js";
import { API_PATHS } from "../utils/apiPaths.js";

export const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // if (user) return ;

    const accessToken = localStorage.getItem('token');
    if (!accessToken) {
      setLoading(false);
      return;
    }

   const fetchUser = async () => {
  try {
    const response = await axiosInstance.get(API_PATHS.AUTH.GET_PROFILE);
    if (response.data && response.data.user) {
      updateUser({
        ...response.data.user,  
        token: accessToken
      });
    }
  } catch (error) {
    console.error("User not Authenticated", error);
    clearUser();
  } finally {
    setLoading(false);
  }
};

    fetchUser();
  }, []);

 const updateUser = (userData) => {
  console.log('🔍 updateUser called from:', new Error().stack);
  
  if (!userData) {
    console.warn('updateUser called with undefined data');
    console.trace('Stack trace for undefined call:'); // This will show the call stack
    return;
  }
  
  console.log('✅ Valid userData received:', userData);
  setUser(userData);
  
  // Only set token if it exists in userData
  if (userData.token) {
    localStorage.setItem('token', userData.token);
  }
  
  setLoading(false);
};

  const clearUser = () => {
    setUser(null);
    localStorage.removeItem('token');
    setLoading(false);
  };

  return (
    <UserContext.Provider value={{ user, loading, updateUser, clearUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;